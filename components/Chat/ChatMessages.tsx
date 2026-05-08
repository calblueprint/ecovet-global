import { Fragment, useEffect, useRef } from "react";
import { ChatMessage } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import ChatMessageBubble from "./ChatMessageBubble";
import { ChatMessageContainer } from "./styles";
import { TimeSeparator } from "./TimeSeparator";

const ONE_HOUR_MS = 1000 * 60 * 60;
const DOUBLE_TEXT_MS = 1000 * 60 * 2;

export default function ChatMessages({
  chatMessages,
  userRoles = new Map(),
}: {
  chatMessages: ChatMessage[];
  userRoles?: Map<string, string>;
}) {
  const { userId } = useProfile();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <ChatMessageContainer>
      {chatMessages.map((chatMessage, i) => (
        <Fragment key={chatMessage.id}>
          {shouldShowTime(chatMessages, i) && (
            <TimeSeparator date={new Date(chatMessage.created_at)} />
          )}
          <ChatMessageBubble
            chatMessage={chatMessage}
            senderRole={userRoles.get(chatMessage.sender ?? "") ?? ""}
            showName={shouldShowSender(chatMessages, i)}
            isDoubleText={isDoubleText(chatMessages, i)}
            fromUser={chatMessage.sender === userId}
          />
        </Fragment>
      ))}

      <div ref={messagesEndRef} />
    </ChatMessageContainer>
  );
}

const isDoubleText = (chatMessages: ChatMessage[], index: number) => {
  if (index === 0) return false;
  if (shouldShowSender(chatMessages, index)) return false;

  const prevTime = new Date(chatMessages[index - 1].created_at);
  const thisTime = new Date(chatMessages[index].created_at);

  return thisTime.getTime() - prevTime.getTime() >= DOUBLE_TEXT_MS;
};

const shouldShowSender = (chatMessages: ChatMessage[], index: number) => {
  if (index === 0) return true;
  if (shouldShowTime(chatMessages, index)) return true;

  // need to check the name for a announcements edge case
  const prevSender = chatMessages[index - 1].sender;
  const prevName = chatMessages[index - 1].sender_name;

  const thisSender = chatMessages[index].sender;
  const thisName = chatMessages[index].sender_name;

  return prevSender !== thisSender || prevName !== thisName;
};

const shouldShowTime = (chatMessages: ChatMessage[], index: number) => {
  if (index === 0) return true;

  const prevTime = new Date(chatMessages[index - 1].created_at);
  const thisTime = new Date(chatMessages[index].created_at);

  return thisTime.getTime() - prevTime.getTime() >= ONE_HOUR_MS;
};
