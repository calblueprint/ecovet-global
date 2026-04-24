import { Dispatch, SetStateAction, useMemo } from "react";
import { StylesConfig } from "react-select";
import COLORS from "@/styles/colors";
import { DropdownOption } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import InputDropdown from "../InputDropdown/InputDropdown";
import {
  ChatUserList,
  ClickableUser,
  ClickableUserText,
  CreateChatCancelButton,
  ProfileColor,
  SelectUsersContainer,
} from "./styles";

export type ChatParticipant = {
  id: string;
  name: string;
  role: string;
};

export default function CreateChat({
  participantOptions,
  newUserIds,
  setNewUserIds,
  onCancel,
}: {
  participantOptions: ChatParticipant[];
  newUserIds: string[];
  setNewUserIds: Dispatch<SetStateAction<string[]>>;
  onCancel: () => void;
}) {
  const { profile } = useProfile();

  const currentParticipantSelections = participantOptions
    .filter(
      user =>
        user.id !== profile?.id &&
        user.name !== "null null" &&
        newUserIds.includes(user.id),
    )
    .map(p => ({ id: p.id, name: p.name }));

  const avaliableParticipantSelections = useMemo(
    () =>
      new Map(
        participantOptions
          .filter(
            user =>
              user.id !== profile?.id &&
              user.name !== "null null" &&
              !newUserIds.includes(user.id),
          )
          .map(p => [p.id, p.name]),
      ),
    [newUserIds, participantOptions],
  );

  async function addUser(addUserId: string) {
    if (!addUserId) return;
    setNewUserIds(curr => [...curr, addUserId]);
  }

  async function removeUser(removeUserId: string) {
    if (!removeUserId) return;
    setNewUserIds(curr => curr.filter(userId => userId != removeUserId));
  }

  return (
    <SelectUsersContainer>
      <ChatUserList>
        <ProfileColor $color="#8E44AD" $size={2} />
        {currentParticipantSelections.map(({ id, name }) => {
          return (
            <ClickableUser key={id} onClick={() => removeUser(id)}>
              <ClickableUserText>{name}</ClickableUserText>
              <ClickableUserText>X</ClickableUserText>
            </ClickableUser>
          );
        })}
      </ChatUserList>

      <InputDropdown
        label={`Participant user`}
        options={avaliableParticipantSelections}
        placeholder="Add person"
        onChange={userId => addUser(userId ?? "")}
        customStyles={dropdownStyles}
      />

      <CreateChatCancelButton onClick={onCancel}>Cancel</CreateChatCancelButton>
    </SelectUsersContainer>
  );
}

const captionStyles = {
  color: COLORS.black40,
  fontFamily: '"Public Sans", sans-serif',
  fontSize: "0.75rem",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "normal",
  letterSpacing: "0.015rem",
};

const dropdownStyles: StylesConfig<DropdownOption, boolean> = {
  container: base => ({
    ...base,
    width: "100%",
  }),
  control: base => ({
    ...base,
    ...captionStyles,
    width: "100%",
  }),
  placeholder: base => ({
    ...base,
    ...captionStyles,
    width: "100%",
  }),
  singleValue: base => ({
    ...base,
    ...captionStyles,
    width: "100%",
  }),
  option: base => ({
    ...base,
    ...captionStyles,
    width: "100%",
  }),
  multiValueLabel: base => ({
    ...base,
    ...captionStyles,
    width: "100%",
  }),
};
