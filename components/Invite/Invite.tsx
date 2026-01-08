"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { submitNewInvite } from "@/api/supabase/queries/invites";
import { useProfile } from "@/utils/ProfileProvider";
import {
  AddInviteFormDiv,
  AddInviteMain,
  ButtonPaddingDiv,
  EmailDiv,
  EmailInput,
  ErrorMessage,
  ErrorMessageDiv,
  FacilitatorButton,
  FormHeader,
  InviteTypeButton,
  ParticipantButton,
  SubmitButton,
} from "./styles";

const isEmailValid = (email: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return emailRegex.test(email);
};

function Invite({ user_group_id }: { user_group_id: string }) {
  const { profile } = useProfile();
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [participantSelected, setParticipantSelected] = useState<boolean>(true);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);

    setErrorMessage(
      isEmailValid(event.target.value) ? "" : "Invalid email format",
    );
  };

  const onSubmitButtonClick = async () => {
    if (!isEmailValid(email)) {
      setErrorMessage("Invalid email format");
    }

    const result = await submitNewInvite(
      email,
      user_group_id,
      participantSelected ? "Participant" : "Facilitator",
    );

    if (result?.error) {
      setErrorMessage(result.message);
    } else {
      setErrorMessage("");
      console.log("Invite success for:", email);
    }
  };

  // Disable submit if any errors exist or any email is empty
  const hasErrorsOrEmpty = errorMessage.length > 0 || email.trim() === "";

  return (
    <AddInviteMain>
      <AddInviteFormDiv>
        <FormHeader>Invite a Participant</FormHeader>
        <ErrorMessageDiv $hasError={errorMessage}>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </ErrorMessageDiv>
        <EmailDiv>
          <EmailInput
            value={email}
            onChange={e => handleInputChange(e)}
            placeholder="Email Address"
            required
          />
          <ButtonPaddingDiv>
            <InviteTypeButton>
              <ParticipantButton
                $isOn={participantSelected}
                onClick={() => setParticipantSelected(true)}
              >
                Participant
              </ParticipantButton>
              <FacilitatorButton
                $isOn={!participantSelected}
                onClick={() => setParticipantSelected(false)}
              >
                Facilitator
              </FacilitatorButton>
            </InviteTypeButton>
            <SubmitButton
              onClick={onSubmitButtonClick}
              disabled={hasErrorsOrEmpty}
            >
              Send Invite
            </SubmitButton>
          </ButtonPaddingDiv>
        </EmailDiv>
      </AddInviteFormDiv>
    </AddInviteMain>
  );
}
export default Invite;
