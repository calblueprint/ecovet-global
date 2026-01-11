"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
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
  RemoveInput,
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
    const updatedEmails = [...facilitatorEmails];
    updatedEmails[index] = event.target.value;
    setFacilitatorEmails(updatedEmails);

    const updatedErrors = [...errorMessages];
    updatedErrors[index] = isEmailValid(event.target.value)
      ? ""
      : "Invalid email format";
    setErrorMessage(updatedErrors);
  };

  const onAddFacilitatorButtonClick = () => {
    setFacilitatorEmails([...facilitatorEmails, ""]);
    setErrorMessage([...errorMessages, ""]);
  };

  const onRemoveFacilitatorClick = (index: number) => {
    const updatedEmails = [...facilitatorEmails];
    const updatedErrors = [...errorMessages];
    updatedEmails.splice(index, 1);
    updatedErrors.splice(index, 1);
    setFacilitatorEmails(updatedEmails);
    setErrorMessage(updatedErrors);
  };

  const onSubmitButtonClick = async () => {
    const updatedErrors = [...errorMessages];

    for (let index = 0; index < facilitatorEmails.length; index++) {
      const email = facilitatorEmails[index];

      if (!isEmailValid(email)) {
        updatedErrors[index] = "Invalid email format";
        continue;
      }

      if (userGroupId) {
        const result = await submitNewInvite(email, userGroupId, "Facilitator");

        if (result?.error) {
          updatedErrors[index] = result.message;
        } else {
          updatedErrors[index] = "";
          console.log("Invite success for:", email);
        }
      }
    }

    setErrorMessage(updatedErrors);
  };

  const hasErrorsOrEmpty =
    errorMessages.some(msg => msg.length > 0) ||
    facilitatorEmails.some(email => email.trim() === "");

  return (
    <AddFacilitatorsMain>
      <Link href="/admin/home-screen">
        <button>← Back</button>
      </Link>
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
              />
              <RemoveInput
                type="button"
                onClick={() => onRemoveFacilitatorClick(index)}
              >
                Remove
              </RemoveInput>
            </FacilitatorEmailDiv>
          ))}
        </FacilitatorEmailDiv>
        <AddFacilitatorButton onClick={onAddFacilitatorButtonClick}>
          Add Facilitator
        </AddFacilitatorButton>
        <SubmitButton onClick={onSubmitButtonClick} disabled={hasErrorsOrEmpty}>
          Submit
        </SubmitButton>
      </AddFacilitatorFormDiv>
    </AddFacilitatorsMain>
  );
}
