"use client";

import React, { useEffect, useState } from "react";
import {
  fetchParticipants,
  fetchRoles,
} from "@/actions/supabase/queries/sessions";
import InputDropdown from "@/components/InputDropdown";

export default function RoleSelectionPage() {
  const [roles, setRoles] = useState<string[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function loadData() {
      try {
        //idk where to get the ids from... so i just used from the supabase
        const templateId = "0c50c7cf-8e27-41de-9252-e17201ea6f70";
        const userGroupId = "0b73ed2d-61c3-472e-b361-edaa88f27622";

        const [rolesData, participantsData] = await Promise.all([
          fetchRoles(templateId),
          fetchParticipants(userGroupId),
        ]);

        setRoles(rolesData);
        setParticipants(participantsData);
      } catch (error) {
        console.error("Error fetching roles or participants:", error);
      }
    }

    loadData();
  }, []);

  return (
    <div>
      <h1>Role Selection</h1>
      <>
        <InputDropdown
          label="Select Role"
          options={new Set(roles)}
          placeholder="Choose a role"
          onChange={setSelectedRole}
        />

        <InputDropdown
          label="Select Participant"
          options={new Set(participants)}
          placeholder="Choose a participant"
          onChange={setSelectedParticipant}
        />
      </>
    </div>
  );
}
