"use client";

import React, { useEffect, useState } from "react";
import {
  assignRole,
  fetchParticipants,
  fetchRoles,
} from "@/api/supabase/queries/sessions";
import InputDropdown from "@/components/InputDropdown";
import { useProfile } from "@/utils/ProfileProvider";

interface ParticipantRole {
  participant: string | null;
  role: string | null;
}

export default function RoleSelectionPage() {
  const { profile, loading } = useProfile();
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [participants, setParticipants] = useState<
    { id: string; name: string }[]
  >([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [roleSelection, setRoleSelection] = useState<ParticipantRole[]>([
    { participant: null, role: null },
  ]);

  useEffect(() => {
    if (loading || !profile?.user_group_id) return;
    const userGroupId = profile.user_group_id;

    async function loadData() {
      try {
        //idk where to get the ids from... so i just used from the supabase
        const templateId = "0c50c7cf-8e27-41de-9252-e17201ea6f70";

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
  }, [loading, profile?.user_group_id]);

  const handleChange = async (
    index: number,
    field: keyof ParticipantRole,
    value: string | null,
  ) => {
    const newSelection = [...roleSelection];
    newSelection[index][field] = value;
    setRoleSelection(newSelection);
  };

  const addParticipant = () => {
    setRoleSelection([...roleSelection, { participant: null, role: null }]);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const assignments = roleSelection.filter(
        p => p.participant && p.role,
      ) as { participant: string; role: string }[];

      if (assignments.length === 0) {
        setMessage("Please select at least one participant and role.");
        setSaving(false);
        return;
      }

      await Promise.all(
        assignments.map(({ participant, role }) =>
          assignRole(participant, role),
        ),
      );

      console.log(setRoles);
      console.log(setParticipants);
      setMessage("Roles assigned");
    } catch (err) {
      console.error(err);
      setMessage("Error saving roles");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>Role Selection</h1>

      {roleSelection.map((pair, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <InputDropdown
            label={`Name ${index + 1}`}
            options={new Map(participants.map(p => [p.id, p.name]))}
            placeholder="Select a participant"
            onChange={val => handleChange(index, "participant", val)}
          />
          <InputDropdown
            label="Role"
            options={new Map(roles.map(r => [r.id, r.name]))}
            placeholder="Select a role"
            onChange={val => handleChange(index, "role", val)}
          />
        </div>
      ))}

      <button onClick={addParticipant}>+ Add Participant</button>

      <button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
