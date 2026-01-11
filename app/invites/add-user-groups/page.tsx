"use client";

import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { submitNewUserGroup } from "@/api/supabase/queries/user-groups";
import {
  AddUserGroupsMain,
  ErrorBanner,
  SubmitButton,
  UserGroupInputDiv,
  UserGroupNameInput,
} from "./styles";

export default function AddUserGroups() {
  const [userGroupInput, setUserGroupInput] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setUserGroupInput(event.target.value);
  };
  const onSubmitButtonClick = async () => {
    if (userGroupInput.length == 0) {
      setIsError(true);
    } else {
      const userGroupId = await submitNewUserGroup(userGroupInput);
      router.push(`/invites/add-facilitators/${userGroupId}`);
    }
  };

  return (
    <AddUserGroupsMain>
      <ErrorBanner $isError={isError}>
        Error: Please enter a user group name
      </ErrorBanner>
      <UserGroupInputDiv>
        <p>Enter User Group:</p>
        <UserGroupNameInput
          value={userGroupInput}
          onChange={handleInputChange}
          required
        ></UserGroupNameInput>
      </UserGroupInputDiv>
      <SubmitButton onClick={onSubmitButtonClick}>Submit</SubmitButton>
    </AddUserGroupsMain>
  );
}
