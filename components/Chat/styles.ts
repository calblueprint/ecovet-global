import { FaCircle } from "react-icons/fa6";
import Image from "next/image";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";
import { B2, Caption } from "@/styles/text";

export const MessageContent = styled(B2)`
  color: ${COLORS.black70};
`;

export const MessageContentBubble = styled.div<{ fromUser: boolean }>`
  display: flex;
  padding: 0.4375rem 0.75rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.625rem;
  border-radius: 0.5rem;
  background: ${({ fromUser }) =>
    fromUser ? COLORS.lightEletricBlue : COLORS.oat_medium};
`;

export const NameMessageContentContainer = styled.div<{ fromUser: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: ${({ fromUser }) => (fromUser ? "flex-end" : "flex-start")};
  gap: 0.5rem;
  align-self: stretch;
`;

export const NameContent = styled(Caption)`
  display: flex;
  padding: 0 0.5rem;
  justify-content: center;
  align-items: center;
  align-self: end;
  gap: 0.25rem;
  margin: 0 1rem;
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

export const FullMessageContainer = styled.div<{ doubleText: boolean, fromUser: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: ${({ fromUser }) => fromUser ? 'end' : 'start'};
  padding-top: ${({ doubleText }) => doubleText ? '0.1rem' : '0rem'}
`;

export const ProfileColor = styled.div<{ color: string }>`
  width: 1rem;
  height: 1rem;
  aspect-ratio: 1/1;
  border-radius: 0.25rem;
  align-self: start;
  background: ${({ color }) => color};
`;

export const ChatMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  align-self: stretch;
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
