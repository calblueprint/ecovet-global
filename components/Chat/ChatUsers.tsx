import { useEffect, useMemo, useState } from "react";
import {
  addUserToChatRoom,
  getChatParticipants,
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
  const [participants, setParticipants] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const avaliableParticipants = useMemo(
    () =>
      new Map(
        participants
          .filter(
            user =>
              user.name != "null null" &&
              !currentParticipants.includes(user.id),
          )
          .map(p => [p.id, p.name]),
      ),
    [currentParticipants, participants],
  );

  // TODO: add delete users from chat
  useEffect(() => {
    async function loadParticipants() {
      if (!profile?.user_group_id) return;

      // TODO: change to Promise.all
      const participantsData = await fetchParticipants(profile?.user_group_id);
      setParticipants(participantsData as User[]);

      const currentParticipantData = await getChatParticipants(roomId);
      setCurrentParticipants(currentParticipantData);
    }

    loadParticipants();
  }, []);

  async function onAddUser() {
    if (!selectedUserId) return;
    await addUserToChatRoom(roomId, selectedUserId, sessionId);
    setSelectedUserId(null);
  }

  return (
    <div>
      <H3>Manage users</H3>
      {/* TODO: show current users in the chat */}
      <div>
        <InputDropdown
          label={`Participant user`}
          options={avaliableParticipants}
          placeholder="Select participant"
          onChange={userId => setSelectedUserId(userId)}
        />
        <button onClick={onAddUser} disabled={!selectedUserId}>
          add user to chat
        </button>
      </div>
    </div>
  );
}
