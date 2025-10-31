"use client";

import { useEffect, useState } from "react";
import { fetchUserGroups } from "@/api/supabase/queries/user-groups";
import { UserGroup } from "@/types/schema";
import Link from "next/link";

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
        {userGroups.map((group) => (
          <li key={group.user_group_id}>
            <Link href={`/user-groups/${group.user_group_id}`}>
              {group.user_group_name}
            </Link>

            <span>100</span>

            {/* To be added when num_users is added as a column */}
            {/* <span>{group.num_users}</span> */}
          </li>
        ))}
      </ul>

      <Link href={'/'}><button>Invite</button></Link>
    </div>
  );
};

export default UserGroupsPage;
