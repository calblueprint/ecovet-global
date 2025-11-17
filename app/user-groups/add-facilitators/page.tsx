"use client";

import { ChangeEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitNewInvite } from "@/api/supabase/queries/invites";
import {
  AddFacilitatorButton,
  AddFacilitatorFormDiv,
  AddFacilitatorsMain,
  ErrorMessage,
  ErrorMessageDiv,
  FacilitatorEmailDiv,
  FacilitatorEmailInput,
  SubmitButton,
} from "./styles";

const isEmailValid = (email: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return emailRegex.test(email);
};

export default function AddFacilitators() {
  const searchParams = useSearchParams();
  const userGroupId = searchParams.get("userGroupId");
  const [facilitatorEmails, setFacilitatorEmails] = useState<string[]>([""]);
  const [errorMessages, setErrorMessage] = useState<string[]>([""]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const updated = [...facilitatorEmails];
    updated[index] = event.target.value;
    setFacilitatorEmails(updated);
  };

  const onAddFacilitatorButtonClick = () => {
    setFacilitatorEmails([...facilitatorEmails, ""]);
    setErrorMessage([...errorMessages, ""]);
  };

  const onSubmitButtonClick = () => {
    facilitatorEmails.map(async (email, index) => {
      if (isEmailValid(email)) {
        const error = await submitNewInvite(
          email,
          String(userGroupId),
          "Facilitator",
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
    <AddFacilitatorsMain>
      <AddFacilitatorFormDiv>
        <FacilitatorEmailDiv>
          {facilitatorEmails.map((email, index) => (
            <FacilitatorEmailDiv key={index}>
              <ErrorMessageDiv $hasError={errorMessages[index]}>
                <ErrorMessage>{errorMessages[index]}</ErrorMessage>
              </ErrorMessageDiv>
              <FacilitatorEmailInput
                value={email}
                onChange={e => handleInputChange(e, index)}
                placeholder="Enter facilitator email"
                required
              ></FacilitatorEmailInput>
            </FacilitatorEmailDiv>
          ))}
        </FacilitatorEmailDiv>
        <AddFacilitatorButton onClick={onAddFacilitatorButtonClick}>
          Add Facilitator
        </AddFacilitatorButton>
        <SubmitButton onClick={onSubmitButtonClick}>Submit</SubmitButton>
      </AddFacilitatorFormDiv>
    </AddFacilitatorsMain>
  );
}
