"use client"

import supabase from "@/actions/supabase/client"
import { UserGroup } from "@/types/schema";
import { useState, useEffect } from "react";

const UserGroupsPage = () => {

  const [userGroups, setUserGroups] = useState<UserGroup[]>([])
  
  useEffect(() => {
    async function fetchUserGroups() {
      try {
        // Pull data
        const { data, error } = await supabase
        .from('user_group')
        .select('*')

        if (error) throw error

        // Process data
        if (data) {
          const mapped = data.map((usergrp) => ({
            id: usergrp.user_group_id,
            user_group_name: usergrp.user_group_name
          }))

          setUserGroups(mapped)
        }      
      } catch (error) {
        console.log("Error fetching orgs data from supabase API: ", error)
      }
    }
    
    fetchUserGroups()
  }, [])

  return (
    <div>
      <h1>User Groups</h1>      
      {
        userGroups.map((usergrp, index) => (
          <div key={index}>
            {usergrp.user_group_name}
          </div>
        ))
      }
    </div>
  );
};


export default UserGroupsPage