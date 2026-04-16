import { useState } from "react";
import { H2 } from "@/styles/text";
import { UUID } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import { useRealtimeChat as useChat } from "@/utils/UseChat";
import ChatMessage from "./ChatMessageBubble";
import ChatUsers from "./ChatUsers";
import { ChatMessageContainer } from "./styles";
import { TimeSeparator } from "./TimeSeparator";

const ONE_HOUR_MS = 1000 * 60 * 60;
export default function Chat({ roomId }: { roomId: UUID }) {
  const { userId, profile } = useProfile();

  const [userInput, setUserInput] = useState("");
  const { loading, chatMessages, sendMessage } = useChat({
    roomId: roomId,
    userId: userId ?? "unknown-user",
    username: profile?.first_name ?? "Unknown User",
  });

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
          <>
            {shouldShowTime(i) && (
              <TimeSeparator date={new Date(chatMessage.created_at)} />
            )}
            <ChatMessage
              chatMessage={chatMessage}
              fromUser={chatMessage.sender === userId}
            />
          </>
        ))}
      </ChatMessageContainer>
      <input
        type="text"
        placeholder="Type a message..."
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
      />
      <button onClick={() => sendMessage(userInput)}>Send Message</button>

      <ChatUsers roomId={roomId} />
    </div>
  );
}
