"use client";

import { ChangeEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitNewFacilitator } from "@/api/supabase/queries/invites";
import {
  AddFacilitatorButton,
  AddFacilitatorFormDiv,
  AddFacilitatorsMain,
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
  };

  const onSubmitButtonClick = () => {
    facilitatorEmails.map(email => {
      if (isEmailValid(email)) {
        submitNewFacilitator(email, String(userGroupId), true);
      } else {
        console.error("invalid email format");
      }
    });
  };

  return (
    <AddFacilitatorsMain>
      <AddFacilitatorFormDiv>
        <FacilitatorEmailDiv>
          {facilitatorEmails.map((email, index) => (
            <FacilitatorEmailInput
              key={index}
              value={email}
              onChange={e => handleInputChange(e, index)}
              placeholder="Enter facilitator email"
              required
            ></FacilitatorEmailInput>
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
