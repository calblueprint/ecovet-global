"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchUserGroups } from "@/api/supabase/queries/user-groups";
import { UserGroup } from "@/types/schema";

const UserGroupsPage = () => {
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
      <h1>User Groups</h1>
      <ul>
        {userGroups.map(group => (
          <li key={group.user_group_id}>
            <Link href={`/user-groups/${group.user_group_id}`}>
              {group.user_group_name}
            </Link>

            <span>{group.num_users}</span>
          </li>
        ))}
      </ul>

      <Link href={"/"}>
        <button>Invite</button>
      </Link>
    </div>
  );
};

export default UserGroupsPage;
