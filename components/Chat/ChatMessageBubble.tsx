import { useState } from "react";
import Person from "@/assets/images/person.svg";
import { ChatMessage as ChatMessageType } from "@/types/schema";
import { ImageLogo } from "../styles";
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

export default function ChatMessageBubble({
  chatMessage,
  senderRole,
  showName,
  isDoubleText,
  fromUser,
}: {
  chatMessage: ChatMessageType;
  senderRole: string;
  showName: boolean;
  isDoubleText: boolean;
  fromUser: boolean;
}) {
  const [showTime, setShowTime] = useState(false);
  const senderName =
    fromUser && !chatMessage.is_announcement ? "You" : chatMessage.sender_name;
  const { day, time } = getMessageDateLabel(new Date(chatMessage.created_at));

  return (
    <FullMessageContainer $doubleText={isDoubleText} $fromUser={fromUser}>
      {showName && (
        <NameContainer $fromUser={fromUser}>
          <NameText>{senderName}</NameText>
          {!fromUser && senderRole && (
            <>
              <NameRoleSeparator />
              <NameText>{senderRole}</NameText>
            </>
          )}
        </NameContainer>
      )}

      <PfpMessageContentContainer
        $fromUser={fromUser}
        onClick={() => setShowTime(show => !show)}
      >
        {!fromUser && (
          <ImageLogo
            src={Person.src}
            alt="Play"
            width={12}
            height={12}
            style={{ width: "1rem", height: "1rem", borderRadius: "0.25rem" }}
          />
        )}

        <TimeMessageContainer $fromUser={fromUser}>
          <MessageContentBubble $fromUser={fromUser}>
            <MessageContent>{chatMessage.message}</MessageContent>
          </MessageContentBubble>

          {showTime && (
            <TimeLabelContainer>
              <TimeLabel>{day}</TimeLabel>
              <TimeLabel>{time}</TimeLabel>
            </TimeLabelContainer>
          )}
        </TimeMessageContainer>

        {fromUser && (
          <ImageLogo
            src={Person.src}
            alt="Play"
            width={12}
            height={12}
            style={{ width: "1rem", height: "1rem", borderRadius: "0.25rem" }}
          />
        )}
      </PfpMessageContentContainer>
    </FullMessageContainer>
  );
}
