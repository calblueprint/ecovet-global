"use client";

import { useEffect, useState } from "react";
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
    }

    loadUserGroups();
  }, []);

  return (
    <div>
      <h1>User Groups</h1>
      {userGroups.map((usergrp, index) => (
        <div key={index}>{usergrp.user_group_name}</div>
      ))}
    </div>
  );
};

export default UserGroupsPage;
