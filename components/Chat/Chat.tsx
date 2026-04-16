import { useState } from "react";
import { H2 } from "@/styles/text";
import { UUID } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import { useRealtimeChat as useChat } from "@/utils/UseChat";
import ChatUsers from "./ChatUsers";
import ChatMessage from "./ChatMessageBubble";
import { ChatMessageContainer } from "./styles";

export default function Chat({ roomId }: { roomId: UUID }) {
  const { userId, profile } = useProfile();

  const [userInput, setUserInput] = useState("");
  const { loading, chatMessages, sendMessage } = useChat({
    roomId: roomId,
    userId: userId ?? "unknown-user",
    username: profile?.first_name ?? "Unknown User",
  });

  return (
    <div>
      <H2>Chat Room: {roomId}</H2>
      {loading && <p>Loading chat...</p>}
      <ChatMessageContainer>
        {chatMessages.map(chatMessage => (
          <ChatMessage chatMessage={chatMessage} fromUser={chatMessage.sender === userId} />
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
