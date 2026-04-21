import { Fragment, useEffect, useState } from "react";
import {
  createChatRoom,
  getUserChatRooms,
} from "@/actions/supabase/queries/chat";
import { Profile, UUID } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import { useRealtimeChat as useChat } from "@/utils/UseChat";
import ChatInputBar from "./ChatInputBar";
import ChatMessage from "./ChatMessageBubble";
import ChatSelection, { Selection } from "./ChatSelection";
import ChatUsers from "./ChatUsers";
import {
  ChatContainer,
  ChatHeader,
  ChatMessageContainer,
  ContentContainer,
} from "./styles";
import { TimeSeparator } from "./TimeSeparator";
import { Caption } from "@/styles/text";

const ONE_HOUR_MS = 1000 * 60 * 60;
const DOUBLE_TEXT_MS = 1000 * 60 * 2;
export default function Chat({ sessionId }: { sessionId: UUID }) {
  const { userId, profile } = useProfile();
  const [chatRooms, setChatRooms] = useState<Selection[]>([]);
  const [roomId, setRoomId] = useState<string>("");
  const [isSelectingUsers, setIsSelectingUsers] = useState<boolean>(false);

  const { loading, chatMessages, sendMessage } = useChat({
    roomId: roomId,
    userId: userId ?? "unknown-user",
    username: profile?.first_name ?? "Unknown User",
  });

  async function loadRooms() {
    console.log(userId);
    if (!userId) return;

    try {
      const rooms = await getUserChatRooms(userId, sessionId);
      const entries = [...rooms.entries()]
      setChatRooms(
        entries.map(([roomId, users]) => {
          const otherUsers = users.filter((user) => user.id !== userId)
          const firstUser = otherUsers.length > 0 ? `${otherUsers[0].first_name} ${otherUsers[0].last_name}` : 'Unknown';
          let chatName = firstUser;
          if (otherUsers.length > 1) chatName += ` + ${otherUsers.length - 1}`

          return { roomId, chatName }
      }));

      console.log(chatRooms)
      if (entries.length > 0) setRoomId(entries[0][0]);
    } catch {
      console.log("Error loading chat rooms.");
    }
  }

  useEffect(() => {
    loadRooms();
  }, [userId]);

  const isDoubleText = (index: number) => {
    if (index === 0) return false;
    if (shouldShowSender(index)) return false;

    const prevTime = new Date(chatMessages[index - 1].created_at);
    const thisTime = new Date(chatMessages[index].created_at);

    return thisTime.getTime() - prevTime.getTime() >= DOUBLE_TEXT_MS;
  };

  const shouldShowSender = (index: number) => {
    if (index === 0) return true;
    if (shouldShowTime(index)) return true;

    const prevSender = chatMessages[index - 1].sender;
    const thisSender = chatMessages[index].sender;

    return prevSender !== thisSender;
  };

  const shouldShowTime = (index: number) => {
    if (index === 0) return true;

    const prevTime = new Date(chatMessages[index - 1].created_at);
    const thisTime = new Date(chatMessages[index].created_at);

    return thisTime.getTime() - prevTime.getTime() >= ONE_HOUR_MS;
  };

  async function onCreateRoom() {
    if (!userId) return;

    const roomId = crypto.randomUUID() as UUID;
    await createChatRoom(roomId, userId, sessionId);
    await loadRooms();
    setIsSelectingUsers(true);
    setRoomId(roomId)
  }


  return (
    <ChatContainer>
      <ContentContainer>
        <ChatHeader>Communication</ChatHeader>

        {isSelectingUsers ? (
          <ChatUsers sessionId={sessionId} roomId={roomId} onDone={() => setIsSelectingUsers(false)}/>
        ) : (
          <ChatSelection
            chats={chatRooms}
            changeRoom={roomId => {
              setRoomId(roomId)
              setIsSelectingUsers(true);
            }}
            createRoom={onCreateRoom}
          />
        )}

        {loading ?
          <Caption>Loading...</Caption> :
          <ChatMessageContainer>
            {chatMessages.map((chatMessage, i) => (
              <Fragment key={i}>
                {shouldShowTime(i) && (
                  <TimeSeparator date={new Date(chatMessage.created_at)} />
                )}
                <ChatMessage
                  chatMessage={chatMessage}
                  showName={shouldShowSender(i)}
                  isDoubleText={isDoubleText(i)}
                  fromUser={chatMessage.sender === userId}
                />
              </Fragment>
            ))}
          </ChatMessageContainer>
        }
      </ContentContainer>

      <ChatInputBar sendMessage={sendMessage} />
    </ChatContainer>
  );
}
