"use client";

import { ChangeEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitNewInvite } from "@/api/supabase/queries/invites";
import { UserType } from "@/types/schema";
import {
  AddParticipantButton,
  AddParticipantFormDiv,
  AddParticipantsMain,
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
  };

  const onSubmitButtonClick = () => {
    participantEmails.map(email => {
      if (isEmailValid(email)) {
        submitNewInvite(email, String(userGroupId), "Participant");
      } else {
        console.error("invalid email format");
      }
    });
  };

  return (
    <AddParticipantsMain>
      <AddParticipantFormDiv>
        <ParticipantEmailDiv>
          {participantEmails.map((email, index) => (
            <ParticipantEmailInput
              key={index}
              value={email}
              onChange={e => handleInputChange(e, index)}
              placeholder="Enter facilitator email"
              required
            ></ParticipantEmailInput>
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
