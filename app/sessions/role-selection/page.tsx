"use client";

import type { UUID } from "@/types/schema";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  assignParticipantToSession,
  createSession,
  fetchParticipants,
  fetchRoles,
} from "@/actions/supabase/queries/sessions";
import InputDropdown from "@/components/InputDropdown/InputDropdown";
import { useProfile } from "@/utils/ProfileProvider";
import {
  BackLink,
  Button,
  Container,
  Heading1,
  Key,
  Main,
  SmallButton,
} from "./styles";

interface ParticipantRole {
  participant: UUID | null;
  role: UUID | null;
}

interface RoleName {
  id: UUID;
  name: string;
}

interface ParticipantName {
  id: UUID;
  name: string;
}

export default function RoleSelectionPage() {
  const { profile, loading } = useProfile();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");

  const [roles, setRoles] = useState<RoleName[]>([]);
  const [participants, setParticipants] = useState<ParticipantName[]>([]);

  const [roleSelection, setRoleSelection] = useState<ParticipantRole[]>([
    { participant: null, role: null },
  ]);

  const [starting, setStarting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (loading || !profile?.user_group_id) return;

    async function loadData() {
      try {
        if (!profile?.user_group_id || !templateId) {
          return;
        }

        const [rolesData, participantsData] = await Promise.all([
          fetchRoles(templateId),
          fetchParticipants(profile?.user_group_id),
        ]);

        setRoles(rolesData as RoleName[]);
        setParticipants(participantsData as ParticipantName[]);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load roles or participants");
      }
    }

    loadData();
  }, [loading, profile, templateId]);

  const handleChange = (
    index: number,
    field: keyof ParticipantRole,
    value: UUID | null,
  ) => {
    setRoleSelection(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addParticipant = () => {
    setRoleSelection(prev => [...prev, { participant: null, role: null }]);
  };

  const deleteParticipant = (index: number) => {
    setRoleSelection(prev => prev.toSpliced(index, 1));
  };

  const handleStartGame = async () => {
    if (!profile?.id || !profile.user_group_id || !templateId) return;

    setStarting(true);
    setMessage(null);

    try {
      const assignments = roleSelection.filter(
        p => p.participant && p.role,
      ) as { participant: UUID; role: UUID }[];

      if (assignments.length === 0) {
        throw new Error("No participants assigned");
      }

      const sessionId = (await createSession(
        templateId,
        profile.user_group_id,
      )) as UUID;

      //assign the facilitator to session
      await assignParticipantToSession(profile.id as UUID, sessionId, null);
      await Promise.all(
        assignments.map(({ participant, role }) =>
          assignParticipantToSession(participant, sessionId, role),
        ),
      );
      router.push(`/facilitator/session-view?sessionId=${sessionId}`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to start game");
    } finally {
      setStarting(false);
    }
  };

  return (
    <Main>
      <Container>
        <BackLink
          style={{ alignSelf: "flex-start", marginLeft: "3rem" }}
          href={`/sessions/${templateId}`}
        >
          ← Back
        </BackLink>

        <Heading1>Role Selection</Heading1>

        {roleSelection.map((pair, index) => {
          const selectedParticipants = roleSelection
            .map(p => p.participant)
            .filter((p, i) => p && i !== index);

          const availableParticipants = participants.filter(
            p => !selectedParticipants.includes(p.id) && p.id !== profile?.id,
          );

          return (
            <Key key={index}>
              <InputDropdown
                label={`Participant ${index + 1}`}
                options={
                  new Map(availableParticipants.map(p => [p.id, p.name]))
                }
                placeholder="Select participant"
                onChange={val =>
                  handleChange(index, "participant", val as UUID)
                }
              />

              <InputDropdown
                label="Role"
                options={new Map(roles.map(r => [r.id, r.name]))}
                placeholder="Select role"
                onChange={val => handleChange(index, "role", val as UUID)}
              />

              <div
                onClick={() => deleteParticipant(index)}
                style={{ cursor: "pointer", paddingTop: "7px" }}
              >
                ✕
              </div>
            </Key>
          );
        })}

        <SmallButton onClick={addParticipant}>+ Add Participant</SmallButton>

        <Button onClick={handleStartGame} disabled={starting}>
          {starting ? "Starting Game…" : "Start Game"}
        </Button>

        {message && <p>{message}</p>}
      </Container>
    </Main>
  );
}
