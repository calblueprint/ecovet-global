"use client";

import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { submitNewUserGroup } from "@/api/supabase/queries/usergroup";
import {
  AddUserGroupsMain,
  SubmitButton,
  UserGroupInputDiv,
  UserGroupNameInput,
} from "./styles";

export default function AddUserGroups() {
  const [userGroupInput, setUserGroupInput] = useState("");
  const router = useRouter();
  const userId = "";
  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setUserGroupInput(event.target.value);
  };
  const onSubmitButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const userGroupId = await submitNewUserGroup(userGroupInput);
    router.push(
      `/user-groups/add-facilitators?userId=${userId}&userGroupId=${userGroupId}`,
    );
  };

  return (
    <AddUserGroupsMain>
      <UserGroupInputDiv>
        <p>Enter User Group:</p>
        <UserGroupNameInput
          value={userGroupInput}
          onChange={handleInputChange}
        ></UserGroupNameInput>
      </UserGroupInputDiv>
      <SubmitButton onClick={onSubmitButtonClick}>Submit</SubmitButton>
    </AddUserGroupsMain>
  );
}
