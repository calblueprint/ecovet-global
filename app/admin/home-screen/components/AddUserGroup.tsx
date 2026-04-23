"use client";

import { SetStateAction, useState } from "react";
import Image from "next/image";
import { submitNewInvite } from "@/actions/supabase/queries/invites";
import { submitNewUserGroup } from "@/actions/supabase/queries/user-groups";
import Plus from "@/assets/images/plus.svg";
import { Heading3, SearchInput2 } from "../../styles";
import {
  Backdrop,
  BasicText,
  CancelButton,
  ErrorBanner,
  GroupDiv,
  ModalBox,
  RequiredText,
  SubmitButton,
} from "./styles";

const isEmailValid = (email: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return emailRegex.test(email);
};

export default function AddUserGroups({ onClose }: { onClose: () => void }) {
  const [userGroupInput, setUserGroupInput] = useState("");
  const [facilitatorEmail, setFacilitatorEmail] = useState("");
  const [facilitatorError, setFacilitatorError] = useState("");

  const handleGroupChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setUserGroupInput(event.target.value);
  };

  const handleFacilitatorChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setFacilitatorEmail(value);

    if (!value.trim()) {
      setFacilitatorError("");
      return;
    }

    setFacilitatorError(isEmailValid(value) ? "" : "Invalid email format");
  };

  const isFormValid =
    userGroupInput.trim().length > 0 &&
    facilitatorEmail.trim().length > 0 &&
    isEmailValid(facilitatorEmail);

  const onSubmitButtonClick = async () => {
    if (!isFormValid) return;

    const userGroupId = await submitNewUserGroup(userGroupInput);

    if (facilitatorEmail.trim()) {
      if (!isEmailValid(facilitatorEmail)) {
        setFacilitatorError("Invalid email format");
        return;
      }

      const result = await submitNewInvite(
        facilitatorEmail,
        userGroupId,
        "Facilitator",
      );

      if (result?.error) {
        setFacilitatorError(result.message);
        return;
      }
    }

    onClose();
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

        <BasicText>Add Facilitator</BasicText>

        <GroupDiv>
          <SearchInput2
            value={facilitatorEmail}
            onChange={handleFacilitatorChange}
            placeholder="Email address..."
            required
          />

          {/* hmm i'm not sure how you want this to look... */}
          <SubmitButton onClick={onSubmitButtonClick}>
            <Image src={Plus} alt="+" width={10} height={10} />
            Add Facilitator
          </SubmitButton>
        </GroupDiv>

        {facilitatorError && (
          <ErrorBanner $isError={true}>{facilitatorError}</ErrorBanner>
        )}

        <GroupDiv>
          <SubmitButton onClick={onSubmitButtonClick} disabled={!isFormValid}>
            Create
          </SubmitButton>

          <CancelButton onClick={onClose}>Cancel</CancelButton>
        </GroupDiv>
      </ModalBox>
    </Backdrop>
  );
}
