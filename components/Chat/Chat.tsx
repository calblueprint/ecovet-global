import { Fragment, useEffect, useState } from "react";
import { setRef } from "@mui/material";
import {
  addUserToChatRoom,
  checkRoomExists,
  createChatRoom,
  getUserChatRooms,
} from "@/actions/supabase/queries/chat";
import { supabase } from "@/lib/supabase/client";
import { ChatMessage as ChatMessageType, UUID } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import { useRealtimeChat as useChat } from "@/utils/UseChat";
import ChatInputBar from "./ChatInputBar";
import ChatMessage from "./ChatMessageBubble";
import ChatSelection, { Selection } from "./ChatSelection";
import CreateChat from "./CreateChat";
import {
  ChatContainer,
  ChatHeader,
  ChatMessageContainer,
  ContentContainer,
} from "./styles";
import { TimeSeparator } from "./TimeSeparator";

const ONE_HOUR_MS = 1000 * 60 * 60;
const DOUBLE_TEXT_MS = 1000 * 60 * 2;

export default function Chat({ sessionId }: { sessionId: UUID }) {
  const { userId, profile } = useProfile();
  const [chatRooms, setChatRooms] = useState<Selection[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);
  const [newChatUserIds, setNewChatUserIds] = useState<string[]>([]);

  const { chatMessages, sendMessage } = useChat({
    roomId: currentRoomId,
    userId: userId ?? "unknown-user",
    username: profile?.first_name ?? "Unknown User",
  });

  useEffect(() => {
    if (!userId) return;
    const initializeRooms = async () => {
      const rooms = await loadRooms();
      if (rooms && rooms.length > 0) setCurrentRoomId(rooms[0][0]);
    };
    initializeRooms();

    const chatRoomChannel = supabase
      .channel(`chat_room_updates_${sessionId}_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_room",
          filter: `user_id=eq.${userId}`,
        },
        payload => {
          if (payload.new.session_id !== sessionId) return;
          console.log(
            `new rooms found, reloading rooms: ${JSON.stringify(payload.new)}`,
          );
          loadRooms();
        },
      )
      .subscribe();

    return () => {
      chatRoomChannel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const checkRoom = async () => {
      if (!userId || newChatUserIds.length === 0) return;
      setCurrentRoomId(
        await checkRoomExists([userId, ...newChatUserIds], sessionId),
      );
    };

    checkRoom();
  }, [newChatUserIds]);

  useEffect(() => {
    console.log(`current room id changed: ${currentRoomId}`);
  }, [currentRoomId]);

  async function loadRooms() {
    if (!userId) return;

    try {
      const rooms = await getUserChatRooms(userId, sessionId);
      const entries = [...rooms.entries()];
      setChatRooms(
        entries.map(([roomId, users]) => {
          const otherUsers = users.filter(user => user.id !== userId);
          const firstUser =
            otherUsers.length > 0
              ? `${otherUsers[0].first_name} ${otherUsers[0].last_name}`
              : "Unknown";
          let chatName = firstUser;
          if (otherUsers.length > 1) chatName += ` + ${otherUsers.length - 1}`;

          return { roomId, chatName };
        }),
      );

      return entries;
    } catch {
      console.log("Error loading chat rooms.");
    }
  }

  async function onSendMessage(message: string) {
    let newRoomId: string | null = currentRoomId;
    console.log(
      `trying to send message: roomId: ${currentRoomId}, message: ${message}`,
    );
    if (currentRoomId === null) {
      newRoomId = await createRoom();
    }

    await sendMessage(message, newRoomId);
    console.log(`sent message: roomId: ${newRoomId}, message: ${message}`);
  }

  async function createRoom() {
    if (!userId) return null;

    let newRoomId = await checkRoomExists(
      [userId, ...newChatUserIds],
      sessionId,
    );

    console.log(
      `check room exists: userIds: ${newChatUserIds}, newRoomId: ${newRoomId}`,
    );
    if (!newRoomId) {
      newRoomId = crypto.randomUUID();

      console.log(
        `room did not exist, creating new room: newRoomId: ${newRoomId}`,
      );
      await createChatRoom(newRoomId, userId, sessionId);
      await Promise.all(
        newChatUserIds.map(chatUserId =>
          addUserToChatRoom(newRoomId as string, chatUserId, sessionId),
        ),
      );
      await loadRooms();
    }

    setCurrentRoomId(newRoomId);
    setIsCreatingRoom(false);
    setNewChatUserIds([]);
    return newRoomId;
  }

  return (
    <ChatContainer>
      <ContentContainer>
        <ChatHeader>Communication</ChatHeader>

        {isCreatingRoom ? (
          <CreateChat
            sessionId={sessionId}
            newUserIds={newChatUserIds}
            setNewUserIds={setNewChatUserIds}
            onCancel={() => {
              setIsCreatingRoom(false);
              if (chatRooms.length > 0) setCurrentRoomId(chatRooms[0].roomId);
            }}
          />
        ) : (
          <ChatSelection
            chats={chatRooms}
            currentRoomId={currentRoomId}
            changeRoom={roomId => {
              setCurrentRoomId(roomId);
            }}
            createRoom={() => {
              setCurrentRoomId(null);
              setIsCreatingRoom(true);
            }}
          />
        )}

        <ChatMessageContainer>
          {chatMessages.map((chatMessage, i) => (
            <Fragment key={chatMessage.id}>
              {shouldShowTime(chatMessages, i) && (
                <TimeSeparator date={new Date(chatMessage.created_at)} />
              )}
              <ChatMessage
                chatMessage={chatMessage}
                showName={shouldShowSender(chatMessages, i)}
                isDoubleText={isDoubleText(chatMessages, i)}
                fromUser={chatMessage.sender === userId}
              />
            </Fragment>
          ))}
        </ChatMessageContainer>
      </ContentContainer>

      <ChatInputBar
        sendMessage={onSendMessage}
        disabled={currentRoomId === null && newChatUserIds.length === 0}
      />
    </ChatContainer>
  );
}

const isDoubleText = (chatMessages: ChatMessageType[], index: number) => {
  if (index === 0) return false;
  if (shouldShowSender(chatMessages, index)) return false;

  const prevTime = new Date(chatMessages[index - 1].created_at);
  const thisTime = new Date(chatMessages[index].created_at);

  return thisTime.getTime() - prevTime.getTime() >= DOUBLE_TEXT_MS;
};

const shouldShowSender = (chatMessages: ChatMessageType[], index: number) => {
  if (index === 0) return true;
  if (shouldShowTime(chatMessages, index)) return true;

  const prevSender = chatMessages[index - 1].sender;
  const thisSender = chatMessages[index].sender;

  return prevSender !== thisSender;
};

const shouldShowTime = (chatMessages: ChatMessageType[], index: number) => {
  if (index === 0) return true;

  const prevTime = new Date(chatMessages[index - 1].created_at);
  const thisTime = new Date(chatMessages[index].created_at);

  return thisTime.getTime() - prevTime.getTime() >= ONE_HOUR_MS;
};
