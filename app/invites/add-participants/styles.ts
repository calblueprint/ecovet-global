import styled from "styled-components";

export const AddParticipantsMain = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
`;

export const AddParticipantFormDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

export const AddParticipantButton = styled.button`
  width: 10rem;
  height: 1.5rem;
`;

export const ParticipantEmailDiv = styled.div`
  flex-direction: column;
  display: flex;
  gap: 0.3rem;
`;

export const ParticipantEmailInput = styled.input`
  border: line;
  width: 10rem;
  height: 1.5rem;
`;

export const SubmitButton = styled.button`
  width: 5rem;
  height: 1.5rem;
`;

export const ErrorMessageDiv = styled.div<{ $hasError: string }>`
  display: ${({ $hasError }) => ($hasError == "" ? "flex" : "none")};
  flex-direction: column;
`;

export const ErrorMessage = styled.p`
  color: red;
`;
