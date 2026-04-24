import { useState } from "react";
import { ChatInput, ChatInputContainer, ChatSendButton } from "./styles";

export default function ChatInputBar({
  disabled,
  sendMessage,
}: {
  disabled: boolean;
  sendMessage: (message: string) => void;
}) {
  const [userInput, setUserInput] = useState("");

  const onClick = () => {
    if (userInput.length === 0) return;

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

      <ChatSendButton disabled={disabled} onClick={onClick}>
        Send
      </ChatSendButton>
    </ChatInputContainer>
  );
}
