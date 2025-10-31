"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchUserGroupMembers, fetchUserGroupById } from "@/api/supabase/queries/user-groups";
import { fetchInvites } from "@/api/supabase/queries/invites";
import { UUID } from "crypto";
import { Invite, Profile, UserGroup } from "@/types/schema";
import Link from "next/link";

export default function UserGroupDetailPage() {
  const { user_group_id } = useParams();
  const [userGroup, setUserGroup] = useState<UserGroup | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [allMembers, setAllMembers] = useState<Profile[]>([]);
  const [allAdmins, setAllAdmins] = useState<Profile[]>([]);
  const [allFacilitators, setAllFacilitators] = useState<Profile[]>([]);
  const [allParticipants, setAllParticipants] = useState<Profile[]>([]);

  async function loadData() {
    const [userGroupDetails, groupMembers, groupInvites] = await Promise.all([
      fetchUserGroupById(user_group_id as UUID),
      fetchUserGroupMembers(user_group_id as UUID),
      fetchInvites(user_group_id as UUID),
    ]);
    setUserGroup(userGroupDetails || null)
    setAllMembers(groupMembers || []);
    setInvites(groupInvites || []);

    categorizeMembers(groupMembers || []);

    console.log(groupMembers)
    console.log(groupInvites)
  }

  function categorizeMembers(members: Profile[]) {
    const admins = members.filter((m) => m.user_type === "Admin");
    const facilitators = members.filter((m) => m.user_type === "Facilitator");
    const participants = members.filter((m) => m.user_type === "Participant");

    setAllAdmins(admins);
    setAllFacilitators(facilitators);
    setAllParticipants(participants);
  }

  useEffect(() => {
    if (!user_group_id) {
      console.log("No user_group_id!")
      return;
    }

    console.log(user_group_id)

    loadData();
  }, [user_group_id]);

  return (
    <div>
      <h1>Group Details: {userGroup?.user_group_name}</h1>

      <section>
        <h2>Facilitators</h2>
        <ul>
          {allFacilitators.map((mem: Profile) => (
            <li key={mem.id}>{mem.first_name}, {mem.last_name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Participants</h2>
        <ul>
          {allParticipants.map((mem: Profile) => (
            <li key={mem.id}>{mem.first_name}, {mem.last_name}</li>
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

      <Link href={'/user-groups/home-screen'}>Invite</Link>
    </div>
  );
}
