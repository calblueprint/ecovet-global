import { FaCircle } from "react-icons/fa6";
import { B2, Caption } from "@/styles/text";
import { ChatMessage as ChatMessageType } from "@/types/schema";
import {
  FullMessageContainer,
  MessageContent,
  MessageContentBubble,
  NameContent,
  NameMessageContentContainer,
  NameRoleSeparator,
  ProfileColor,
} from "./styles";

export default function ChatMessage({
  chatMessage,
  fromUser,
}: {
  chatMessage: ChatMessageType;
  fromUser: boolean;
}) {
  const senderName = fromUser ? "You" : chatMessage.sender_name;

  return (
    <FullMessageContainer>
      {!fromUser && <ProfileColor color="#8E44AD" />}

      <NameMessageContentContainer fromUser={fromUser}>
        <NameContent>
          {senderName}
          <NameRoleSeparator />
          {"ROLE PLACEHOLDER"}
        </NameContent>

        <MessageContentBubble fromUser={fromUser}>
          <MessageContent>{chatMessage.message}</MessageContent>
        </MessageContentBubble>
      </NameMessageContentContainer>

      {fromUser && <ProfileColor color="#8E44AD" />}
    </FullMessageContainer>
  );
}
