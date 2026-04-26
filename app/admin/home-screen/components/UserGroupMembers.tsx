"use client";

import type { Profile, UUID } from "@/types/schema";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchUserGroupMembers } from "@/actions/supabase/queries/user-groups";
import { GeneralList, MainDiv, ScrollContainer, TopButton } from "../../styles";

export default function Participants({
  user_group_id,
}: {
  user_group_id: string;
}) {
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [view, setView] = useState<"participants" | "facilitators">(
    "participants",
  );

  const loadData = useCallback(async () => {
    const groupMembers = await fetchUserGroupMembers(user_group_id as UUID);
    setAllUsers(groupMembers ?? []);
  }, [user_group_id]);

  useEffect(() => {
    if (user_group_id) {
      loadData();
    }
  }, [user_group_id, loadData]);

  const { facilitators, participants } = useMemo(() => {
    return {
      facilitators: allUsers.filter(user => user.user_type === "Facilitator"),
      participants: allUsers.filter(user => user.user_type === "Participant"),
    };
  }, [allUsers]);

  const displayedUsers = view === "participants" ? participants : facilitators;

  return (
    <MainDiv>
      <div>
        <TopButton
          $active={view === "participants"}
          onClick={() => setView("participants")}
        >
          Participants ({participants.length})
        </TopButton>

        <TopButton
          $active={view === "facilitators"}
          onClick={() => setView("facilitators")}
        >
          Facilitators ({facilitators.length})
        </TopButton>
      </div>

      <ScrollContainer>
        {displayedUsers.map(user => (
          <GeneralList key={user.id}>
            <span>
              {user.first_name} {user.last_name}
            </span>
          </GeneralList>
        ))}
      </ScrollContainer>
    </MainDiv>
  );
}
