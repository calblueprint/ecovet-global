"use client";

import { ChangeEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitNewInvite } from "@/api/supabase/queries/invites";
import {
  AddParticipantButton,
  AddParticipantFormDiv,
  AddParticipantsMain,
  ErrorMessage,
  ErrorMessageDiv,
  ParticipantEmailDiv,
  ParticipantEmailInput,
  SubmitButton,
} from "./styles";

const isEmailValid = (email: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return emailRegex.test(email);
};

export default function AddParticipants() {
  const searchParams = useSearchParams();
  const userGroupId = searchParams.get("userGroupId");
  const [participantEmails, setParticipantEmails] = useState<string[]>([""]);
  const [errorMessages, setErrorMessage] = useState<string[]>([""]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const updated = [...participantEmails];
    updated[index] = event.target.value;
    setParticipantEmails(updated);
  };

  const onAddParticipantButtonClick = () => {
    setParticipantEmails([...participantEmails, ""]);
    setErrorMessage([...errorMessages, ""]);
  };

  const onSubmitButtonClick = () => {
    participantEmails.map(async (email, index) => {
      if (isEmailValid(email)) {
        const error = await submitNewInvite(
          email,
          String(userGroupId),
          "Participant",
        );
        if (error?.error) {
          const updated_errors = [...errorMessages];
          updated_errors[index] = error.message;
          setErrorMessage(updated_errors);
        }
      } else {
        const updated_errors = [...errorMessages];
        updated_errors[index] = "Invalid email format";
        setErrorMessage(updated_errors);
      }
    });
  };

  return (
    <AddParticipantsMain>
      <AddParticipantFormDiv>
        <ParticipantEmailDiv>
          {participantEmails.map((email, index) => (
            <ParticipantEmailDiv key={index}>
              <ErrorMessageDiv $hasError={errorMessages[index]}>
                <ErrorMessage>{errorMessages[index]}</ErrorMessage>
              </ErrorMessageDiv>
              <ParticipantEmailInput
                value={email}
                onChange={e => handleInputChange(e, index)}
                placeholder="Enter facilitator email"
                required
              ></ParticipantEmailInput>
            </ParticipantEmailDiv>
          ))}
        </ParticipantEmailDiv>
        <AddParticipantButton onClick={onAddParticipantButtonClick}>
          Add Participant
        </AddParticipantButton>
        <SubmitButton onClick={onSubmitButtonClick}>Submit</SubmitButton>
      </AddParticipantFormDiv>
    </AddParticipantsMain>
  );
}
