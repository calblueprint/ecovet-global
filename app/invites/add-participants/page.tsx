"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { submitNewInvite } from "@/api/supabase/queries/invites";
import { useProfile } from "@/utils/ProfileProvider";
import {
  AddParticipantButton,
  AddParticipantFormDiv,
  AddParticipantsMain,
  ErrorMessage,
  ErrorMessageDiv,
  ParticipantEmailDiv,
  ParticipantEmailInput,
  RemoveInput,
  SubmitButton,
} from "./styles";

const isEmailValid = (email: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return emailRegex.test(email);
};

export default function AddParticipants() {
  const { profile } = useProfile();
  const [participantEmails, setParticipantEmails] = useState<string[]>([""]);
  const [errorMessages, setErrorMessage] = useState<string[]>([""]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const updatedEmails = [...participantEmails];
    updatedEmails[index] = event.target.value;
    setParticipantEmails(updatedEmails);

    const updatedErrors = [...errorMessages];
    updatedErrors[index] = isEmailValid(event.target.value)
      ? ""
      : "Invalid email format";
    setErrorMessage(updatedErrors);
  };

  const onAddParticipantButtonClick = () => {
    setParticipantEmails([...participantEmails, ""]);
    setErrorMessage([...errorMessages, ""]);
  };

  const onRemoveParticipantClick = (index: number) => {
    const updatedEmails = [...participantEmails];
    const updatedErrors = [...errorMessages];
    updatedEmails.splice(index, 1);
    updatedErrors.splice(index, 1);
    setParticipantEmails(updatedEmails);
    setErrorMessage(updatedErrors);
  };

  const onSubmitButtonClick = async () => {
    const updatedErrors = [...errorMessages];

    for (let index = 0; index < participantEmails.length; index++) {
      const email = participantEmails[index];

      if (!isEmailValid(email)) {
        updatedErrors[index] = "Invalid email format";
        continue;
      }

      const result = await submitNewInvite(
        email,
        String(profile?.user_group_id),
        "Participant",
      );

      if (result?.error) {
        updatedErrors[index] = result.message;
      } else {
        updatedErrors[index] = "";
        console.log("Invite success for:", email);
      }
    }

    setErrorMessage(updatedErrors);
  };

  // Disable submit if any errors exist or any email is empty
  const hasErrorsOrEmpty =
    errorMessages.some(msg => msg.length > 0) ||
    participantEmails.some(email => email.trim() === "");

  return (
    <AddParticipantsMain>
      <Link href="/facilitator">
        <button>Back</button>
      </Link>
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
                placeholder="Enter participant email"
                required
              />
              <RemoveInput
                type="button"
                onClick={() => onRemoveParticipantClick(index)}
              >
                Remove
              </RemoveInput>
            </ParticipantEmailDiv>
          ))}
        </ParticipantEmailDiv>
        <AddParticipantButton onClick={onAddParticipantButtonClick}>
          Add Participant
        </AddParticipantButton>
        <SubmitButton onClick={onSubmitButtonClick} disabled={hasErrorsOrEmpty}>
          Submit
        </SubmitButton>
      </AddParticipantFormDiv>
    </AddParticipantsMain>
  );
}
