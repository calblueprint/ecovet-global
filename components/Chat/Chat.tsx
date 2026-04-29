import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  addUserToChatRoom,
  checkRoomExists,
  createChatRoom,
  getUserChatRooms,
} from "@/actions/supabase/queries/chat";
import {
  fetchChatUserOptions,
  fetchMostRecentPhase,
} from "@/actions/supabase/queries/sessions";
import { supabase } from "@/lib/supabase/client";
import { ChatMessage, ChatParticipant, UUID } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import { useAnnouncements } from "@/utils/UseAnnouncements";
import { useRealtimeChat as useChat } from "@/utils/UseChat";
import ChatInputBar from "./ChatInputBar";
import ChatMessages from "./ChatMessages";
import ChatSelection, { Selection } from "./ChatSelection";
import CreateChat from "./CreateChat";
import { ChatContainer, ChatHeader, ContentContainer } from "./styles";

const announcementRoom = {
  roomId: "announcements",
  chatName: "Announcements",
};

export default function Chat({
  sessionId,
  roleId,
}: {
  sessionId: UUID;
  roleId: string | null;
}) {
  const { userId, profile } = useProfile();
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  // needed for skipping notifs for the selected room
  const currentRoomIdRef = useRef<string | null>(currentRoomId);

  const [chatRooms, setChatRooms] = useState<Selection[]>([]);
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);
  const [newChatUserIds, setNewChatUserIds] = useState<string[]>([]);
  const [chatNotifications, setChatNotifications] = useState<Set<string>>(
    new Set(),
  );
  const [participantsOptions, setParticipantOptions] = useState<
    ChatParticipant[]
  >([]);

  const userRoles = useMemo(
    () =>
      new Map(
        participantsOptions.map(participant => [
          participant.id,
          participant.role,
        ]),
      ),
    [participantsOptions],
  );

  const { announcements } = useAnnouncements({
    sessionId: sessionId ?? "unknown session id",
    userId: userId ?? "unknown user id",
    username: profile?.first_name ?? "Unknown Users",
    roleId: roleId ?? "unknown role id",
    roleName: userRoles.get(userId ?? "") ?? "Role",
  });

  const { chatMessages, sendMessage } = useChat({
    sessionId,
    roomId: currentRoomId,
    userId: userId ?? "unknown-user",
    username: profile?.first_name ?? "Unknown User",
  });

  const isAnnoucementSelected = currentRoomId === announcementRoom.roomId;
  const activeMessageList: ChatMessage[] = isAnnoucementSelected
    ? announcements
    : chatMessages;

  useEffect(() => {
    currentRoomIdRef.current = currentRoomId;
  }, [currentRoomId]);

  useEffect(() => {
    async function loadParticipants() {
      if (!profile?.user_group_id) return;

      const participantsOptionData = await fetchChatUserOptions(
        profile?.user_group_id,
        sessionId,
      );
      setParticipantOptions(participantsOptionData);
    }

    loadParticipants();
  }, [profile?.user_group_id, sessionId]);

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
          loadRooms();
        },
      )
      .subscribe();

    const notificationsChannel = supabase
      .channel(`chat_message_notifications_${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_message",
        },
        payload => {
          const notificationRoomId = payload.new.room_id;
          if (
            notificationRoomId &&
            notificationRoomId !== currentRoomIdRef.current
          ) {
            setChatNotifications(notifs =>
              new Set(notifs).add(notificationRoomId),
            );
          }
        },
      )
      .subscribe();

    return () => {
      chatRoomChannel.unsubscribe();
      notificationsChannel.unsubscribe();
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

  async function loadRooms() {
    if (!userId) return;

    try {
      const rooms = await getUserChatRooms(userId, sessionId);
      const entries = [...rooms.entries()];
      const newRooms = entries.map(([roomId, users]) => {
        const otherUsers = users.filter(user => user.id !== userId);
        const firstUser =
          otherUsers.length > 0
            ? truncateText(
                `${otherUsers[0].first_name} ${otherUsers[0].last_name}`,
              )
            : "Unknown";
        let chatName = firstUser;
        if (otherUsers.length > 1) chatName += ` + ${otherUsers.length - 1}`;

        return { roomId, chatName };
      });

      setChatRooms([announcementRoom, ...newRooms]);
      return entries;
    } catch {
      console.log("Error loading chat rooms.");
    }
  }

  async function onSendMessage(message: string) {
    let newRoomId: string | null = currentRoomId;
    if (currentRoomId === null) {
      newRoomId = await createRoom();
    }
    if (!userId) return;
    const currentPhase = (await fetchMostRecentPhase(userId, sessionId)) + 1;

    await sendMessage(message, currentPhase, newRoomId);
  }

  async function createRoom() {
    if (!userId) return null;

    let newRoomId = await checkRoomExists(
      [userId, ...newChatUserIds],
      sessionId,
    );

    if (!newRoomId) {
      newRoomId = crypto.randomUUID();

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
            participantOptions={participantsOptions}
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
            chatNotifications={chatNotifications}
            changeRoom={roomId => {
              setCurrentRoomId(roomId);
              setChatNotifications(notifs => {
                notifs = new Set(notifs);
                notifs.delete(roomId);
                return notifs;
              });
            }}
            createRoom={() => {
              setCurrentRoomId(null);
              setIsCreatingRoom(true);
            }}
          />
        )}

        <ChatMessages chatMessages={activeMessageList} userRoles={userRoles} />
      </ContentContainer>

      {!isAnnoucementSelected && (
        <ChatInputBar
          sendMessage={onSendMessage}
          disabled={currentRoomId === null && newChatUserIds.length === 0}
        />
      )}
    </ChatContainer>
  );
}

export function truncateText(text: string, maxLength: number = 15): string {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength).trim() + "...";
}
