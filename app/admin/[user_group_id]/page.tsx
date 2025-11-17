"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { UUID } from "crypto";
import { fetchInvites } from "@/api/supabase/queries/invites";
import {
  fetchUserGroupById,
  fetchUserGroupMembers,
} from "@/api/supabase/queries/user-groups";
import { Invite, Profile, UserGroup } from "@/types/schema";

export default function UserGroupDetailPage() {
  const { user_group_id } = useParams();
  const [userGroup, setUserGroup] = useState<UserGroup | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [allFacilitators, setAllFacilitators] = useState<Profile[]>([]);
  const [allParticipants, setAllParticipants] = useState<Profile[]>([]);

  const loadData = useCallback(async () => {
    const [userGroupDetails, groupMembers, groupInvites] = await Promise.all([
      fetchUserGroupById(user_group_id as UUID),
      fetchUserGroupMembers(user_group_id as UUID),
      fetchInvites(user_group_id as UUID),
    ]);
    setUserGroup(userGroupDetails || null);
    setInvites(groupInvites || []);

    categorizeMembers(groupMembers || []);

    console.log(groupMembers);
    console.log(groupInvites);
  }, [user_group_id]);

  function categorizeMembers(members: Profile[]) {
    const facilitators = members.filter(m => m.user_type === "Facilitator");
    const participants = members.filter(m => m.user_type === "Participant");

    setAllFacilitators(facilitators);
    setAllParticipants(participants);
  }

  useEffect(() => {
    if (user_group_id) {
      loadData();
    }
  }, [user_group_id, loadData]);

  return (
    <div>
      <h1>Group Details: {userGroup?.user_group_name}</h1>

      <section>
        <h2>Facilitators</h2>
        <ul>
          {allFacilitators.map(mem => (
            <li key={mem.id}>
              {mem.first_name}, {mem.last_name}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Participants</h2>
        <ul>
          {allParticipants.map(mem => (
            <li key={mem.id}>
              {mem.first_name}, {mem.last_name}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Invites</h2>
        <ul>
          {invites.map((inv: Invite) => (
            <li key={inv.invite_id}>{inv.email}</li>
          ))}
        </ul>
      </section>

      <Link href={"/admin/home-screen"}>Back to Organizations</Link>
    </div>
  );
}
