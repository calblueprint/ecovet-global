import { useState, useTransition } from "react";
import { UUID } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import { useRealtimeChat as useChat } from "@/utils/UseChat";

export default function Chat({ roomId }: { roomId: UUID }) {
  const { userId, profile } = useProfile();

  const [userInput, setUserInput] = useState("");
  const { loading, chatMessages, sendMessage } = useChat({
    roomId: roomId,
    userId: userId ?? "unknown-user",
    username: profile?.first_name ?? profile?.email ?? "Unknown User",
  });

  return (
    <div>
      <h1>Chat Room: {roomId}</h1>
      {loading && <p>Loading chat...</p>}
      <div>
        {chatMessages.map(chatMessage => (
          <div key={chatMessage.id}>
            <strong>{chatMessage.sender_name}:</strong> {chatMessage.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
      />
      <button onClick={() => sendMessage(userInput)}>Send Message</button>
    </div>
  );
}
