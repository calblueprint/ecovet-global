"use client";

import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { submitNewInvite } from "@/actions/supabase/queries/invites";
import {
  AddInviteFormDiv,
  AddInviteMain,
  ButtonPaddingDiv,
  EmailDiv,
  EmailInput,
  EmailTextArea,
  ErrorMessage,
  ErrorMessageDiv,
  FacilitatorButton,
  FailedEmail,
  FailedInviteItem,
  FailedInvitesDiv,
  FailedInvitesHeader,
  FailedInvitesList,
  FailedReason,
  FormHeader,
  InviteTypeButton,
  ParticipantButton,
  SubmitButton,
} from "./styles";

type InviteFailure = {
  email: string;
  message: string;
};

const isEmailValid = (email: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return emailRegex.test(email);
};

function InviteComponent({
  user_group_id,
  onInvitesChange,
  isAdminDashboard,
}: {
  user_group_id: string;
  onInvitesChange?: () => void;
  isAdminDashboard?: boolean;
}) {
  const [emailsText, setEmailsText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [failedInvites, setFailedInvites] = useState<InviteFailure[]>([]);
  const [participantSelected, setParticipantSelected] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEmailsText(event.target.value);
    if (errorMessage) setErrorMessage("");
    if (failedInvites.length > 0) setFailedInvites([]);

    if (event.target instanceof HTMLTextAreaElement) {
      event.target.style.height = "auto";
      event.target.style.height = `${event.target.scrollHeight}px`;
    }
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
    setFailedInvites([]);

    const failures: InviteFailure[] = [];
    const succeededEmails: string[] = [];

    try {
      for (const email of lines) {
        const trimmed = email.trim();
        const result = await submitNewInvite(
          trimmed,
          user_group_id,
          participantSelected ? "Participant" : "Facilitator",
        );

        if (result?.error) {
          failures.push({ email: trimmed, message: result.message });
        } else {
          succeededEmails.push(trimmed);
        }
      }

      if (failures.length > 0) {
        setFailedInvites(failures);
        // Keep only the failed emails in the textarea so the user can retry
        setEmailsText(failures.map(f => f.email).join("\n"));
      } else {
        setEmailsText("");
        if (textAreaRef.current) {
          textAreaRef.current.style.height = "auto";
        }
      }

      if (onInvitesChange) onInvitesChange();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmitButtonClick();
    }
  };

  const hasErrorsOrEmpty = errorMessage.length > 0 || emailsText.trim() === "";

  return (
    <AddInviteMain>
      <AddInviteFormDiv>
        <FormHeader>Invite a Participant or Facilitator</FormHeader>
        {errorMessage && (
          <ErrorMessageDiv $hasError={errorMessage}>
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </ErrorMessageDiv>
        )}

        {failedInvites.length > 0 && (
          <FailedInvitesDiv>
            <FailedInvitesHeader>
              {failedInvites.length} invite{failedInvites.length > 1 ? "s" : ""}{" "}
              failed to send:
            </FailedInvitesHeader>
            <FailedInvitesList>
              {failedInvites.map(failure => (
                <FailedInviteItem key={failure.email}>
                  <FailedReason>{failure.message}: </FailedReason>
                  <FailedEmail>{failure.email}</FailedEmail>
                </FailedInviteItem>
              ))}
            </FailedInvitesList>
          </FailedInvitesDiv>
        )}

        <EmailDiv $isAdmin={isAdminDashboard}>
          <EmailTextArea
            value={emailsText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            ref={textAreaRef}
            placeholder={
              "email1@startx.org\nemail2@startx.org\nShift+Enter to invite multiple emails..."
            }
            required
          />

          <ButtonPaddingDiv $isAdmin={isAdminDashboard}>
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
              $isAdmin={isAdminDashboard}
              onClick={onSubmitButtonClick}
              disabled={hasErrorsOrEmpty || isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Invite"}
            </SubmitButton>
          </ButtonPaddingDiv>
        </EmailDiv>
      </AddInviteFormDiv>
    </AddInviteMain>
  );
}

export default InviteComponent;
