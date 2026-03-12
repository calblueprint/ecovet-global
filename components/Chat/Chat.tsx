import { useState } from "react";
import { useProfile } from "@/utils/ProfileProvider";
import { useRealtimeChat as useChat } from "@/utils/UseChat";

export default function Chat({ roomId }: { roomId: string }) {
  const { userId } = useProfile();

  const [userInput, setUserInput] = useState("");
  const { messages, sendMessage } = useChat({
    roomName: roomId,
    username: "test user",
  });

  return (
    <div>
      <h1>Chat Room: {roomId}</h1>
      <div>
        {messages.map(message => (
          <div key={message.id}>
            <strong>{message.user.name}:</strong> {message.content}
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
