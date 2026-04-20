import { useState } from "react";
import { ChatMessage as ChatMessageType } from "@/types/schema";
import {
  FullMessageContainer,
  MessageContent,
  MessageContentBubble,
  NameContainer,
  NameRoleSeparator,
  NameText,
  PfpMessageContentContainer,
  ProfileColor,
  TimeLabel,
  TimeLabelContainer,
  TimeMessageContainer,
} from "./styles";
import { getMessageDateLabel } from "./TimeSeparator";

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
  const [showTime, setShowTime] = useState(false);
  const senderName = fromUser ? "You" : chatMessage.sender_name;
  const senderRole = "ROLE PLACEHOLDER";
  const { day, time } = getMessageDateLabel(new Date(chatMessage.created_at));

  return (
    <FullMessageContainer doubleText={isDoubleText} fromUser={fromUser}>
      {showName && (
        <NameContainer>
          <NameText>{senderName}</NameText>
          {!fromUser && (
            <>
              <NameRoleSeparator />
              <NameText>{senderRole}</NameText>
            </>
          )}
        </NameContainer>
      )}

      <PfpMessageContentContainer
        fromUser={fromUser}
        onClick={() => setShowTime(show => !show)}
      >
        {!fromUser && <ProfileColor color="#8E44AD" />}

        <TimeMessageContainer fromUser={fromUser}>
          <MessageContentBubble fromUser={fromUser}>
            <MessageContent>{chatMessage.message}</MessageContent>
          </MessageContentBubble>

          {showTime && (
            <TimeLabelContainer>
              <TimeLabel>{day}</TimeLabel>
              <TimeLabel>{time}</TimeLabel>
            </TimeLabelContainer>
          )}
        </TimeMessageContainer>

        {fromUser && <ProfileColor color="#8E44AD" />}
      </PfpMessageContentContainer>
    </FullMessageContainer>
  );
}
