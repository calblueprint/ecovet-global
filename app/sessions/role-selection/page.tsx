"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  assignRole,
  assignSession,
  createSession,
  fetchParticipants,
  fetchRoles,
} from "@/api/supabase/queries/sessions";
import InputDropdown from "@/components/InputDropdown/InputDropdown";
import { useProfile } from "@/utils/ProfileProvider";

interface ParticipantRole {
  participant: string | null;
  role: string | null;
}

export default function RoleSelectionPage() {
  const { profile, loading } = useProfile();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [participants, setParticipants] = useState<
    { id: string; name: string }[]
  >([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [assignedRoles, setAssign] = useState(false);
  const [assignMessage, setAssignMessage] = useState("");
  const [roleSelection, setRoleSelection] = useState<ParticipantRole[]>([
    { participant: null, role: null },
  ]);

  useEffect(() => {
    if (loading || !profile?.user_group_id) return;
    const userGroupId = profile.user_group_id;

    async function loadData() {
      try {
        if (templateId) {
          const [rolesData, participantsData] = await Promise.all([
            fetchRoles(templateId),
            fetchParticipants(userGroupId),
          ]);

          console.log("rolesData:", rolesData);
          console.log("participantsData:", participantsData);

          setRoles(rolesData);
          setParticipants(participantsData);
        }
      } catch (error) {
        console.error("Error fetching roles or participants:", error);
      }
    }
    loadData();
  }, [loading, profile, templateId]);

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

  const deleteParticipant = (index: number) => {
    setRoleSelection(prev => prev.toSpliced(index, 1));
  };

  const handleStartGame = async () => {
    handleSave();
    handleAssignSession();
  };

  const handleAssignSession = async () => {
    if (!templateId) return;
    if (loading || !profile?.user_group_id) return;
    const userGroupId = profile.user_group_id;
    const sessionId = await createSession(templateId, userGroupId);

    setAssign(true);
    setAssignMessage("");
    try {
      const assignments = roleSelection.filter(
        p => p.participant && p.role,
      ) as { participant: string; role: string }[];

      await assignSession(profile.id, sessionId);
      await Promise.all(
        assignments.map(({ participant }) =>
          assignSession(participant, sessionId),
        ),
      );

      setAssignMessage("Sessions added to roles");
    } catch (err) {
      console.error(err);
      setAssignMessage("Error adding session to roles");
    } finally {
      setAssign(false);
    }
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
      <Link href={`/sessions/${templateId}`}>Back</Link>
      <h1>Role Selection</h1>
      {roleSelection.map((pair, index) => {
        const selectedParticipants = roleSelection
          .map(p => p.participant)
          .filter((p, i) => p && i !== index);

        const availableParticipants = participants.filter(
          p => !selectedParticipants.includes(p.id) && p.id !== profile?.id,
        );

        return (
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
              options={new Map(availableParticipants.map(p => [p.id, p.name]))}
              placeholder="Select a participant"
              onChange={val => handleChange(index, "participant", val)}
            />
            <InputDropdown
              label="Role"
              options={new Map(roles.map(r => [r.id, r.name]))}
              placeholder="Select a role"
              onChange={val => handleChange(index, "role", val)}
            />
            <button onClick={() => deleteParticipant(index)}> X Delete</button>
          </div>
        );
      })}

      <button onClick={addParticipant}>+ Add Participant</button>

      <button onClick={handleStartGame} disabled={saving}>
        {assignedRoles ? "Starting Game..." : "Start Game"}
      </button>

      {message && <p>{message}</p>}
      {assignMessage && <p>{assignMessage}</p>}
    </div>
  );
}
