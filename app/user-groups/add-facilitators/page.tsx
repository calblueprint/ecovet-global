"use client";

import { SetStateAction, useState } from "react";
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

export default function AddFacilitators() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const userGroupId = searchParams.get("userGroupId");
  const [addFacilitator, setAddFacilitator] = useState(false);
  const [facilitatorEmail, setFacilitatorEmail] = useState("");

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setFacilitatorEmail(event.target.value);
  };

  const onAddFacilitatorButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAddFacilitator(true);
  };

  const onSubmitButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isEmailValid(facilitatorEmail)) {
      submitNewFacilitator(
        facilitatorEmail,
        String(userId),
        String(userGroupId),
      );
      setAddFacilitator(false);
    } else {
      console.error("invalid email format");
    }
  };

  return (
    <AddFacilitatorsMain>
      <AddFacilitatorFormDiv>
        <AddFacilitatorButton onClick={onAddFacilitatorButtonClick}>
          Add Facilitator
        </AddFacilitatorButton>
        <FacilitatorEmailDiv $addButtonPressed={addFacilitator}>
          <p>Enter Facilitator Email:</p>
          <FacilitatorEmailInput
            value={facilitatorEmail}
            onChange={handleInputChange}
          ></FacilitatorEmailInput>
        </FacilitatorEmailDiv>
        <SubmitButton onClick={onSubmitButtonClick}>Submit</SubmitButton>
      </AddFacilitatorFormDiv>
    </AddFacilitatorsMain>
  );
}

const isEmailValid = (email: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return emailRegex.test(email);
};
