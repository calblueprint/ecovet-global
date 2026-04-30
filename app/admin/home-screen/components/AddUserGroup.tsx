"use client";

import { ChangeEvent, KeyboardEvent, SetStateAction, useState } from "react";
import { submitNewInvite } from "@/actions/supabase/queries/invites";
import { submitNewUserGroup } from "@/actions/supabase/queries/user-groups";
import { UserGroup } from "@/types/schema";
import { Heading3, SearchInput2 } from "../../styles";
import {
  Backdrop,
  BasicText,
  CancelButton,
  ErrorBanner,
  FacilitatorTextArea,
  GroupDiv,
  ModalBox,
  RequiredText,
  SubmitButton,
} from "./styles";

const isEmailValid = (email: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return emailRegex.test(email);
};

export default function AddUserGroups({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated?: (newGroup: UserGroup) => void;
}) {
  const [userGroupInput, setUserGroupInput] = useState("");
  const [facilitatorEmails, setFacilitatorEmails] = useState("");
  const [facilitatorError, setFacilitatorError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGroupChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setUserGroupInput(event.target.value);
  };

  const handleFacilitatorChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFacilitatorEmails(event.target.value);
    if (facilitatorError) setFacilitatorError("");
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const parseEmails = (text: string) =>
    text
      .split("\n")
      .map(e => e.trim())
      .filter(e => e !== "");

  const emails = parseEmails(facilitatorEmails);
  const allEmailsValid = emails.length > 0 && emails.every(isEmailValid);

  const isFormValid = userGroupInput.trim().length > 0 && allEmailsValid;

  const onSubmitButtonClick = async () => {
    if (!isFormValid || isSubmitting) return;

    const invalidEmails = emails.filter(e => !isEmailValid(e));
    if (invalidEmails.length > 0) {
      setFacilitatorError(
        "Please ensure all lines contain valid email addresses.",
      );
      return;
    }

    setIsSubmitting(true);
    setFacilitatorError("");

    try {
      const userGroupId = await submitNewUserGroup(userGroupInput);

      const results = await Promise.all(
        emails.map(email => submitNewInvite(email, userGroupId, "Facilitator")),
      );

      const firstError = results.find(res => res?.error);
      if (firstError) {
        setFacilitatorError(firstError.message);
        return;
      }

      onCreated?.({
        num_users: 0,
        user_group_id: userGroupId,
        user_group_name: userGroupInput,
        // any other fields your UserGroup type requires
      });

      onClose();
    } catch {
      setFacilitatorError("Something went wrong. Please try again.");
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

  return (
    <Backdrop onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <Heading3>Organization</Heading3>

        <BasicText>
          Organization Title <RequiredText>*</RequiredText>
        </BasicText>

        <SearchInput2
          value={userGroupInput}
          onChange={handleGroupChange}
          placeholder="Organization name..."
          required
        />

        <BasicText>
          Add Facilitator(s) <RequiredText>*</RequiredText>
        </BasicText>

        <FacilitatorTextArea
          value={facilitatorEmails}
          onChange={handleFacilitatorChange}
          onKeyDown={handleKeyDown}
          placeholder={
            "email1@startx.edu\nemail2@startx.edu\nShift+Enter for a new line"
          }
          required
        />

        {facilitatorError && (
          <ErrorBanner $isError={true}>{facilitatorError}</ErrorBanner>
        )}

        <GroupDiv>
          <SubmitButton
            onClick={onSubmitButtonClick}
            disabled={!isFormValid || isSubmitting}
          >
            Create
          </SubmitButton>

          <CancelButton onClick={onClose}>Cancel</CancelButton>
        </GroupDiv>
      </ModalBox>
    </Backdrop>
  );
}
