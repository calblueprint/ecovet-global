import { LocalChatMessage } from "@/utils/UseChat";
import { FullMessageContainer, MessageContent, MessageContentBubble, NameContent, NameMessageContentContainer, NameRoleSeparator, ProfileColor } from "./styles";
import { B2, Caption } from "@/styles/text";
import { FaCircle } from "react-icons/fa6";

export default function ChatMessage({ chatMessage, fromUser }: { chatMessage: LocalChatMessage, fromUser: boolean }) {
  const senderName = fromUser ? 'You' : chatMessage.sender_name

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
  )
}
