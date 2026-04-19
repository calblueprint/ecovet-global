import { useState } from "react";
import { ChatInput, ChatInputContainer, ChatSendButton } from "./styles";

export default function ChatInputBar({
  sendMessage,
}: {
  sendMessage: (message: string) => void;
}) {
  const [userInput, setUserInput] = useState("");

  const onClick = () => {
    sendMessage(userInput);
    setUserInput("");
  };

  return (
    <ChatInputContainer>
      <ChatInput
        placeholder="Type a message..."
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
      />

      <ChatSendButton onClick={onClick}>Send</ChatSendButton>
    </ChatInputContainer>
  );
}
