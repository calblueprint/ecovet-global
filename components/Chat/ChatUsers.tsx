import { useEffect, useMemo, useState } from "react";
import {
  addUserToChatRoom,
  getChatParticipants,
  removeUserFromChatRoom,
} from "@/actions/supabase/queries/chat";
import { fetchParticipants } from "@/actions/supabase/queries/sessions";
import { H3 } from "@/styles/text";
import { useProfile } from "@/utils/ProfileProvider";
import InputDropdown from "../InputDropdown/InputDropdown";

type User = {
  id: string;
  name: string;
};

export default function ChatUsers({
  roomId,
  sessionId,
}: {
  roomId: string;
  sessionId: string;
}) {
  const { profile } = useProfile();

  const [currentParticipants, setCurrentParticipants] = useState<string[]>([]);
  const [participantOptions, setParticipantOptions] = useState<User[]>([]);
  const [addSelectedUserId, setAddSelectedUserId] = useState<string | null>(
    null,
  );
  const [removeSelectedUserId, setRemoveSelectedUserId] = useState<
    string | null
  >(null);

  const currentParticipantSelections = useMemo(
    () =>
      new Map(
        participantOptions
          .filter(
            user =>
              user.name != "null null" && currentParticipants.includes(user.id),
          )
          .map(p => [p.id, p.name]),
      ),
    [currentParticipants, participantOptions],
  );
  const avaliableParticipantSelections = useMemo(
    () =>
      new Map(
        participantOptions
          .filter(
            user =>
              user.name != "null null" &&
              !currentParticipants.includes(user.id),
          )
          .map(p => [p.id, p.name]),
      ),
    [currentParticipants, participantOptions],
  );

  useEffect(() => {
    async function loadParticipants() {
      if (!profile?.user_group_id) return;

      // TODO: change to Promise.all
      const participantsData = await fetchParticipants(profile?.user_group_id);
      setParticipantOptions(participantsData as User[]);

      const currentParticipantData = await getChatParticipants(roomId);
      setCurrentParticipants(currentParticipantData);
      console.log(participantsData, currentParticipantData);
    }

    loadParticipants();
  }, [profile?.user_group_id]);

  async function onAddUser() {
    if (!addSelectedUserId) return;

    try {
      setCurrentParticipants(curr => [...curr, addSelectedUserId]);
      await addUserToChatRoom(roomId, addSelectedUserId, sessionId);
    } catch {
      setCurrentParticipants(curr =>
        curr.filter(userId => userId != addSelectedUserId),
      );
    }

    setAddSelectedUserId(null);
  }

  async function onRemoveUser() {
    if (!removeSelectedUserId) return;

    try {
      setCurrentParticipants(curr =>
        curr.filter(userId => userId != removeSelectedUserId),
      );
      await removeUserFromChatRoom(roomId, removeSelectedUserId);
    } catch {
      setCurrentParticipants(curr => [...curr, removeSelectedUserId]);
    }

    setRemoveSelectedUserId(null);
  }

  return (
    <div>
      <H3>Manage users</H3>
      <div>
        <InputDropdown
          label={`Participant user`}
          options={currentParticipantSelections}
          placeholder="Select participant"
          onChange={userId => setRemoveSelectedUserId(userId)}
        />
        <button onClick={onRemoveUser} disabled={!removeSelectedUserId}>
          remove user from chat
        </button>

        <InputDropdown
          label={`Participant user`}
          options={avaliableParticipantSelections}
          placeholder="Select participant"
          onChange={userId => setAddSelectedUserId(userId)}
        />
        <button onClick={onAddUser} disabled={!addSelectedUserId}>
          add user to chat
        </button>
      </div>
    </div>
  );
}
