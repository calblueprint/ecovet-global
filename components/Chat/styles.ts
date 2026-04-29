import styled from "styled-components";
import COLORS from "@/styles/colors";
import { B1, B2, Caption, TextProps, TextStyles } from "@/styles/text";

export const MessageContent = styled(B2)`
  color: ${COLORS.black70};
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

export const MessageContentBubble = styled.div<{ $fromUser: boolean }>`
  display: flex;
  padding: 0.4375rem 0.75rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.625rem;
  border-radius: 0.25rem;
  background: ${({ $fromUser }) =>
    $fromUser ? COLORS.lightEletricBlue : COLORS.oat_medium};
`;

export const TimeMessageContainer = styled.div<{ $fromUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $fromUser }) => ($fromUser ? "flex-end" : "flex-start")};
  gap: 0.25rem;
`;

export const PfpMessageContentContainer = styled.div<{ $fromUser: boolean }>`
  display: flex;
  flex-direction: row;
  margin-left: ${({ $fromUser }) => ($fromUser ? "auto" : "0px")};
  margin-right: ${({ $fromUser }) => (!$fromUser ? "auto" : "0px")};
  gap: 0.5rem;
  align-self: stretch;
`;

export const TimeLabelContainer = styled.div`
  display: flex;
  padding: 0 0.5rem;
  align-items: center;
  gap: 0.3rem;
  color: ${COLORS.black20};
`;

export const TimeLabel = styled(Caption)`
  color: ${COLORS.black20};
`;

export const NameContainer = styled.div<{ $fromUser: boolean }>`
  display: flex;
  padding-left: ${({ $fromUser }) => (!$fromUser ? "1.5" : "0")}rem;
  padding-right: ${({ $fromUser }) => ($fromUser ? "1.5" : "0")}rem;
  justify-content: center;
  align-items: center;
  align-self: ${({ $fromUser }) => ($fromUser ? "end" : "start")};
  gap: 0.25rem;
  color: ${COLORS.black70};
`;

export const NameText = styled(Caption)`
  color: ${COLORS.black70};
`;

export const NameRoleSeparator = styled.div`
  width: 2px;
  height: 2px;
  background-color: ${COLORS.black70};
  aspect-ratio: 1/1;
  border-radius: 50%;
  flex-shrink: 0;
  align-self: center;
`;

export const FullMessageContainer = styled.div<{
  $doubleText: boolean;
  $fromUser: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 75%;
  align-self: ${({ $fromUser }) => ($fromUser ? "end" : "start")};
  padding-top: ${({ $doubleText }) => ($doubleText ? "0.4rem" : "0rem")};
`;

export const ProfileColor = styled.div<{ $color: string; $size?: number }>`
  width: ${({ $size }) => $size ?? 1}rem;
  height: ${({ $size }) => $size ?? 1}rem;
  aspect-ratio: 1/1;
  border-radius: 0.25rem;
  align-self: start;
  background: ${({ $color }) => $color};
`;

export const ChatMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6rem;
  align-self: stretch;
  padding: 0 1rem;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: clip;
  scrollbar-width: thin;
  margin: 0 0.1rem;
`;

export const TimeSeparatorBold = styled(Caption)`
  color: ${COLORS.black70};
`;

export const TimeSeparatorNormal = styled(Caption)`
  color: ${COLORS.black20};
`;

export const TimeSeparatorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 0.25rem;
  align-self: stretch;
`;

export const ChatInputContainer = styled.div`
  display: flex;
  padding: 0.75rem 1.25rem 1.25rem 1.25rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
  border: none;
  border-top: 1px solid ${COLORS.oat_medium};
`;

export const ChatInput = styled.textarea<TextProps>`
  width: 100%;
  border: none;
  align-self: flex-start;
  justify-content: flex-start;
  resize: none;
  background: ${COLORS.oat_light};

  // B2 styles
  ${TextStyles}
  color: ${COLORS.black20}
  font-weight: 500;
  font-size: 0.875rem;

  &:focus {
    outline: none;
  }
`;

export const ChatSendButton = styled.button`
  border-radius: 1rem;
  width: 3rem;
  border: 1px solid ${COLORS.oat_dark};
  background: ${COLORS.oat_medium};
  align-self: flex-end;
  justify-content: flex-end;
  font-size: 13px;
  font-weight: 500;
  font-color: ${COLORS.black40};
`;

export const ChatContainer = styled.div`
  display: flex;
  width: 19.375rem;
  height: 100%;
  gap: 1rem;
  padding-top: 1.5rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1 0 0;
  background: ${COLORS.oat_light};
  min-height: 0;
`;

export const ChatHeader = styled(B1)`
  color: ${COLORS.black70};
  align-self: center;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 1.2rem;
  overflow: hidden;
  min-height: 0;
  flex: 1;
`;

export const ChatSelectedBorder = styled.div<{
  $selected: boolean;
  $unread: boolean;
}>`
  padding: ${({ $selected, $unread }) => ($unread || $selected ? "1" : "2")}px;
  border: ${({ $selected, $unread }) => ($unread || $selected ? "1" : "0")}px
    solid ${({ $selected }) => ($selected ? COLORS.teal : COLORS.tagRed)};
  border-radius: 8px;
`;

export const ChatSelectionButton = styled.div<{ color?: string }>`
  display: flex;
  width: 2rem;
  height: 2rem;
  padding: 0.375rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  border-radius: 8px;
  border: 1px solid ${COLORS.darkElectricBlue};
  background: ${({ color }) => color ?? COLORS.teal};
`;

export const CreateChatPlus = styled(B1)`
  color: ${COLORS.darkElectricBlue};
`;

export const ChatButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  overflow: hide;
`;

export const ChatButtonLabel = styled(Caption)`
  color: ${COLORS.darkElectricBlue};
  white-space: nowrap;
`;
export const ChatSelectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow: scroll;
  align-items: flex-start;
  gap: 1rem;
  margin-left: 1.25rem;
  padding-right: 0.75;
  scrollbar-width: thin;
  padding-bottom: 0.75rem;
`;

export const SelectUsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  align-self: stretch;
  margin: 0 1.25rem;
`;

export const ChatUserList = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
  overflow: auto;
`;

export const ClickableUser = styled.div`
  display: flex;
  padding: 0.25rem 0.75rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 0.5rem;
  background: ${COLORS.lightEletricBlue};
`;

export const ClickableUserText = styled(Caption)`
  color: ${COLORS.darkElectricBlue};
  white-space: nowrap;
`;

export const CreateChatCancelButton = styled(Caption)`
  color: ${COLORS.black40};
  align-self: flex-end;
  cursor: pointer;
`;
