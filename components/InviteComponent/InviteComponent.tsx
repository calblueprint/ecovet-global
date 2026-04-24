"use client";

import { ChangeEvent, KeyboardEvent, useState } from "react";
import { submitNewInvite } from "@/actions/supabase/queries/invites";
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

function InviteComponent({
  user_group_id,
  onInvitesChange,
}: {
  user_group_id: string;
  onInvitesChange?: () => void;
}) {
  const [emailsText, setEmailsText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [participantSelected, setParticipantSelected] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setEmailsText(event.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const onSubmitButtonClick = async () => {
    if (isSubmitting) return;

    const lines = emailsText.split("\n").filter(line => line.trim() !== "");

    if (lines.length === 0) return;

    const invalidEmails = lines.filter(email => !isEmailValid(email.trim()));
    if (invalidEmails.length > 0) {
      setErrorMessage("Please ensure all lines contain valid email addresses.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const results = await Promise.all(
        lines.map(email =>
          submitNewInvite(
            email.trim(),
            user_group_id,
            participantSelected ? "Participant" : "Facilitator",
          ),
        ),
      );

      const firstError = results.find(res => res?.error);

      if (firstError) {
        setErrorMessage(firstError.message);
        if (onInvitesChange) onInvitesChange();
      } else {
        setEmailsText("");
        setErrorMessage("");
        if (onInvitesChange) onInvitesChange();
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmitButtonClick();
    }
  };

  const hasErrorsOrEmpty = errorMessage.length > 0 || emailsText.trim() === "";

  return (
    <AddInviteMain>
      <AddInviteFormDiv>
        <FormHeader>Invite a Participant</FormHeader>
        <ErrorMessageDiv $hasError={errorMessage}>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </ErrorMessageDiv>
        <EmailDiv>
          <EmailInput
            value={emailsText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="email1@berkeley.edu&#10;email2@berkeley.edu"
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
              disabled={hasErrorsOrEmpty || isSubmitting}
            >
              Send Invite
            </SubmitButton>
          </ButtonPaddingDiv>
        </EmailDiv>
      </AddInviteFormDiv>
    </AddInviteMain>
  );
}

export default InviteComponent;
