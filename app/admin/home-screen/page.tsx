"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchUserGroups } from "@/api/supabase/queries/user-groups";
import { UserGroup } from "@/types/schema";

const UserGroupsPage = () => {
  const router = useRouter();
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);

  useEffect(() => {
    async function loadUserGroups() {
      const fetchedUserGrps = await fetchUserGroups();
      if (fetchedUserGrps) {
        setUserGroups(fetchedUserGrps);
      }
      console.log(fetchedUserGrps);
    }

    loadUserGroups();
  }, []);

  return (
    <div>
      <Link href="/test-page">← Back</Link>

      <h1>User Groups</h1>
      <ul>
        {userGroups.map(group => (
          <li key={group.user_group_id}>
            <Link href={`/admin/${group.user_group_id}`}>
              {group.user_group_name}
            </Link>

            <span>{group.num_users}</span>
          </li>
        ))}
      </ul>

      <button onClick={() => router.replace("/invites/add-user-groups")}>
        Invite
      </button>
    </div>
  );
};

export default UserGroupsPage;
