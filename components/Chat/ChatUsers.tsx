import { useEffect, useMemo, useState } from "react";
import { StylesConfig } from "react-select";
import {
  addUserToChatRoom,
  getChatParticipants,
  getChatRoomSessionId,
  removeUserFromChatRoom,
} from "@/actions/supabase/queries/chat";
import { fetchChatUserOptions } from "@/actions/supabase/queries/sessions";
import COLORS from "@/styles/colors";
import { H3 } from "@/styles/text";
import { DropdownOption } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import InputDropdown from "../InputDropdown/InputDropdown";
import {
  ChatUserList,
  ClickableUser,
  ClickableUserText,
  ProfileColor,
  SelectUsersContainer,
} from "./styles";

type User = {
  id: string;
  name: string;
};

export default function ChatUsers({
  sessionId,
  roomId,
  onDone,
}: {
  sessionId: string;
  roomId: string;
  onDone: () => void;
}) {
  const { profile } = useProfile();

  const [currentParticipants, setCurrentParticipants] = useState<string[]>([]);
  const [participantOptions, setParticipantOptions] = useState<User[]>([]);

  const currentParticipantSelections = participantOptions
    .filter(
      user =>
        user.id !== profile?.id &&
        user.name !== "null null" &&
        currentParticipants.includes(user.id),
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
              !currentParticipants.includes(user.id),
          )
          .map(p => [p.id, p.name]),
      ),
    [currentParticipants, participantOptions],
  );

  useEffect(() => {
    async function loadParticipants() {
      if (!profile?.user_group_id) return;

      const [participantsOptionData, currentParticipantData] =
        await Promise.all([
          fetchChatUserOptions(profile?.user_group_id, sessionId),
          getChatParticipants(roomId),
        ]);

      setParticipantOptions(participantsOptionData);
      setCurrentParticipants(currentParticipantData);
    }

    loadParticipants();
  }, [profile?.user_group_id, roomId]);

  async function addUser(addUserId: string) {
    if (!addUserId) return;

    try {
      setCurrentParticipants(curr => [...curr, addUserId]);
      await addUserToChatRoom(roomId, addUserId, sessionId);
    } catch {
      setCurrentParticipants(curr =>
        curr.filter(userId => userId != addUserId),
      );
    }
  }

  async function removeUser(removeUserId: string) {
    if (!removeUserId) return;

    try {
      setCurrentParticipants(curr =>
        curr.filter(userId => userId != removeUserId),
      );
      await removeUserFromChatRoom(roomId, removeUserId);
    } catch {
      setCurrentParticipants(curr => [...curr, removeUserId]);
    }
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

  return (
    <SelectUsersContainer>
      <ChatUserList>
        <ProfileColor $color="#8E44AD" $size={2} onClick={onDone} />
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
    </SelectUsersContainer>
  );
}
