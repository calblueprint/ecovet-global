import { useEffect, useMemo, useState } from "react";
import {
  addUserToChatRoom,
  getChatParticipants,
  getChatRoomSessionId,
  removeUserFromChatRoom,
} from "@/actions/supabase/queries/chat";
import { fetchChatUserOptions } from "@/actions/supabase/queries/sessions";
import { H3 } from "@/styles/text";
import { useProfile } from "@/utils/ProfileProvider";
import InputDropdown from "../InputDropdown/InputDropdown";

type User = {
  id: string;
  name: string;
};

export default function ChatUsers({ roomId }: { roomId: string }) {
  const { profile } = useProfile();

  const [sessionId, setSessionId] = useState<string>("");
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

      let sessionIdData = sessionId;
      if (sessionIdData.length == 0) {
        sessionIdData = (await getChatRoomSessionId(roomId)) ?? "";
        setSessionId(sessionIdData);
      }

      const [participantsOptionData, currentParticipantData] =
        await Promise.all([
          fetchChatUserOptions(profile?.user_group_id, sessionIdData),
          getChatParticipants(roomId),
        ]);

      setParticipantOptions(participantsOptionData);
      setCurrentParticipants(currentParticipantData);
    }

    loadParticipants();
  }, [profile?.user_group_id, roomId]);

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
      <H3>Manage users (session: {sessionId})</H3>
      <div>
        <InputDropdown
          label={`Participant user`}
          options={currentParticipantSelections}
          placeholder="Select participant to remove"
          onChange={userId => setRemoveSelectedUserId(userId)}
        />
        <button onClick={onRemoveUser} disabled={!removeSelectedUserId}>
          remove user from chat
        </button>

        <InputDropdown
          label={`Participant user`}
          options={avaliableParticipantSelections}
          placeholder="Select participant to add"
          onChange={userId => setAddSelectedUserId(userId)}
        />
        <button onClick={onAddUser} disabled={!addSelectedUserId}>
          add user to chat
        </button>
      </div>
    </div>
  );
}
