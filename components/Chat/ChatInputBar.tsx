import { KeyboardEvent, useState } from "react";
import { ChatInput, ChatInputContainer, ChatSendButton } from "./styles";

export default function ChatInputBar({
  disabled,
  sendMessage,
}: {
  disabled: boolean;
  sendMessage: (message: string) => void;
}) {
  const [userInput, setUserInput] = useState("");

  const handleSend = () => {
    if (userInput.trim().length === 0) return;

    sendMessage(userInput);
    setUserInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatInputContainer>
      <ChatInput
        placeholder="Type a message..."
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />

      <ChatSendButton
        disabled={disabled || userInput.trim().length === 0}
        onClick={handleSend}
      >
        Send
      </ChatSendButton>
    </ChatInputContainer>
  );
}
