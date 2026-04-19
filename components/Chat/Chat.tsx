import { Fragment, useState } from "react";
import { H2 } from "@/styles/text";
import { UUID } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import { useRealtimeChat as useChat } from "@/utils/UseChat";
import ChatInputBar from "./ChatInputBar";
import ChatMessage from "./ChatMessageBubble";
import ChatUsers from "./ChatUsers";
import { ChatMessageContainer } from "./styles";
import { TimeSeparator } from "./TimeSeparator";

const ONE_HOUR_MS = 1000 * 60 * 60;
const DOUBLE_TEXT_MS = 1000 * 60 * 2;
export default function Chat({ roomId }: { roomId: UUID }) {
  const { userId, profile } = useProfile();

  const [userInput, setUserInput] = useState("");
  const { loading, chatMessages, sendMessage } = useChat({
    roomId: roomId,
    userId: userId ?? "unknown-user",
    username: profile?.first_name ?? "Unknown User",
  });

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

  return (
    <div>
      <H2>Chat Room: {roomId}</H2>
      {loading && <p>Loading chat...</p>}
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

      <ChatInputBar sendMessage={sendMessage} />
      <ChatUsers roomId={roomId} />
    </div>
  );
}
