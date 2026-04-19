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
  showName,
  isDoubleText,
  fromUser,
}: {
  chatMessage: ChatMessageType;
  showName: boolean;
  isDoubleText: boolean;
  fromUser: boolean;
}) {
  const senderName = fromUser ? "You" : chatMessage.sender_name;

  return (
    <FullMessageContainer doubleText={isDoubleText} fromUser={fromUser}>
      {showName && (
        <NameContent>
          {senderName}
          {!fromUser && (
            <>
              <NameRoleSeparator />
              {"ROLE PLACEHOLDER"}
            </>
          )}
        </NameContent>
      )}

      <NameMessageContentContainer fromUser={fromUser}>
        {!fromUser && <ProfileColor color="#8E44AD" />}

        <MessageContentBubble fromUser={fromUser}>
          <MessageContent>{chatMessage.message}</MessageContent>
        </MessageContentBubble>

        {fromUser && <ProfileColor color="#8E44AD" />}
      </NameMessageContentContainer>

    </FullMessageContainer>
  );
}
