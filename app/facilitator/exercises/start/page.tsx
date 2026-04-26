"use client";

import type { DropdownOption, Profile, Template, UUID } from "@/types/schema";
import type { SelectInstance } from "react-select";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@mui/material";
import {
  assignParticipantToSession,
  createSession,
  fetchRoles,
} from "@/actions/supabase/queries/sessions";
import { fetchTemplatesExercise } from "@/actions/supabase/queries/templates";
import { fetchUserGroupMembers } from "@/actions/supabase/queries/user-groups";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import InputDropdown from "@/components/InputDropdown/InputDropdown";
import InviteComponent from "@/components/InviteComponent/InviteComponent";
import { useProfile } from "@/utils/ProfileProvider";
import {
  CheckboxInput,
  CheckboxLabel,
  CheckboxRow,
  ConfigRow,
  DeleteButton,
  DropdownContainer,
  ExerciseSelectStyles,
  Heading4,
  IconButton,
  LayoutWrapper,
  ParticipantTable,
  PrimaryActionArea,
  SideNavNewTemplateButton,
  StartContentWrapper,
  TableHeader,
  TableRow,
  ToggleButton,
  ToggleGroup,
} from "./styles";

interface Role {
  id: string;
  name: string;
}

export default function Page() {
  const { profile } = useProfile();
  const [isAsync, setIsAsync] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<Profile[]>([]);
  const roleRef = useRef<SelectInstance<DropdownOption> | null>(null);
  const participantRefs = useRef<(SelectInstance<DropdownOption> | null)[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [isForceAdvance, setIsForceAdvance] = useState(false);
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const searchParams = useSearchParams();
  const preselectedTemplateId = searchParams.get("templateId");

  const rowCounter = useRef(0);
  const [participants, setParticipants] = useState([
    { key: rowCounter.current++, id: "", name: "", email: "", role: "" },
  ]);

  const userOptions = new Map(
    availableUsers
      .filter(u => u.id !== profile?.id)
      .map(u => [u.id, `${u.first_name} ${u.last_name}, ${u.email}`]),
  );

  const roleOptions = new Map(roles.map(r => [r.id, r.name]));

  const exerciseOptions = new Map(
    templates.map(t => [t.template_id, t.template_name || "Untitled Exercise"]),
  );

  const loadTemplates = useCallback(async () => {
    if (profile?.user_group_id) {
      const data = await fetchTemplatesExercise(profile.user_group_id as UUID);
      setTemplates(data || []);

      if (preselectedTemplateId) {
        setSelectedTemplateId(preselectedTemplateId);
        const rolesData = await fetchRoles(preselectedTemplateId);
        setRoles((rolesData as Role[]) || []);
      }
    }
  }, [profile?.user_group_id, preselectedTemplateId]);

  const loadGroupMembers = useCallback(async () => {
    if (profile?.user_group_id) {
      const members = await fetchUserGroupMembers(
        profile.user_group_id as UUID,
      );
      setAvailableUsers(members ?? []);
    }
  }, [profile?.user_group_id]);

  const handleExerciseChange = async (templateId: string | null) => {
    if (templateId !== selectedTemplateId) {
      const id = templateId ?? "";
      setSelectedTemplateId(id);
      setParticipants([
        { key: rowCounter.current++, id: "", name: "", email: "", role: "" },
      ]);

      if (id) {
        const rolesData = await fetchRoles(id);
        setRoles((rolesData as Role[]) || []);
      } else {
        setRoles([]);
      }
    }
  };

  const handleStartExercise = async () => {
    if (!profile?.id || !profile.user_group_id || !selectedTemplateId) {
      alert("Please select an exercise first.");
      return;
    }

    setIsStarting(true);

    try {
      const validAssignments = participants.filter(p => p.id && p.role);

      if (validAssignments.length === 0) {
        throw new Error("Please assign at least one participant with a role.");
      }
      console.log(isAsync);
      const sessionId = (await createSession(
        selectedTemplateId as UUID,
        profile.user_group_id as UUID,
        isForceAdvance,
        isAsync,
      )) as UUID;

      console.log(sessionId);

      await assignParticipantToSession(profile.id as UUID, sessionId, null);

      await Promise.all(
        validAssignments.map(p =>
          assignParticipantToSession(p.id as UUID, sessionId, p.role as UUID),
        ),
      );

      router.push(`/facilitator/session-view?sessionId=${sessionId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to start session");
    } finally {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    loadGroupMembers();
    loadTemplates();
  }, [loadGroupMembers, loadTemplates]);

  const addParticipantRow = () => {
    setParticipants(prev => {
      const next = [
        ...prev,
        { key: rowCounter.current++, id: "", name: "", email: "", role: "" },
      ];
      setTimeout(() => {
        participantRefs.current[next.length - 1]?.focus();
      }, 50);
      return next;
    });
  };

  const updateParticipant = (
    index: number,
    field: string,
    value: string | null,
  ) => {
    const updated = [...participants];

    if (field === "user_id") {
      const selectedUser = availableUsers.find(u => u.id === value);
      if (selectedUser) {
        updated[index] = {
          ...updated[index],
          id: selectedUser.id,
          name: `${selectedUser.first_name} ${selectedUser.last_name}`,
          email: selectedUser.email ?? "",
        };
      } else {
        updated[index] = { ...updated[index], id: "", name: "", email: "" };
      }
    } else {
      updated[index] = { ...updated[index], [field]: value ?? "" };
    }
    setParticipants(updated);
  };

  if (!profile?.user_group_id) {
    return <div>Loading session...</div>;
  }

  const removeParticipantRow = (index: number) => {
    setParticipants(prev => prev.filter((_, i) => i !== index));
  };

  const handleEnterToNext =
    (nextRef: React.RefObject<SelectInstance<DropdownOption> | null>) =>
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        setTimeout(() => {
          nextRef.current?.focus();
        }, 50);
      }
    };

  return (
    <>
      <TopNavBar />
      <LayoutWrapper>
        <StartContentWrapper>
          <Heading4>Start Exercise</Heading4>

          <ConfigRow>
            <DropdownContainer>
              {templates.length > 0 && (
                <InputDropdown
                  label="Select Exercise"
                  options={exerciseOptions}
                  placeholder="Select Exercise"
                  customStyles={ExerciseSelectStyles}
                  onChange={handleExerciseChange}
                  defaultValue={preselectedTemplateId ?? undefined}
                />
              )}
            </DropdownContainer>

            <ToggleGroup>
              <ToggleButton $active={isAsync} onClick={() => setIsAsync(false)}>
                Synchronous
              </ToggleButton>
              <ToggleButton $active={!isAsync} onClick={() => setIsAsync(true)}>
                Asynchronous
              </ToggleButton>
            </ToggleGroup>
            <CheckboxRow>
              <CheckboxInput
                type="checkbox"
                id="force-advance"
                onChange={e => setIsForceAdvance(e.target.checked)}
              />
              <CheckboxLabel htmlFor="force-advance">
                Force Advance?
              </CheckboxLabel>
            </CheckboxRow>
          </ConfigRow>

          <ParticipantTable>
            <TableHeader>
              <span>Selected Participants</span>
              <span>Role</span>
            </TableHeader>

            {participants.map((p, i) => (
              <TableRow key={p.key}>
                <div>
                  <InputDropdown
                    label="Participant"
                    options={userOptions}
                    placeholder="Select a member"
                    customStyles={ExerciseSelectStyles}
                    selectRef={(el: SelectInstance<DropdownOption> | null) => {
                      participantRefs.current[i] = el;
                    }}
                    onChange={val => updateParticipant(i, "user_id", val)}
                    onKeyDown={handleEnterToNext(roleRef)}
                  />
                </div>

                <div>
                  <InputDropdown
                    label="Role"
                    options={roleOptions}
                    placeholder="Select Role"
                    customStyles={ExerciseSelectStyles}
                    selectRef={roleRef}
                    onChange={val => updateParticipant(i, "role", val)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        setTimeout(() => addParticipantRow(), 50);
                      }
                    }}
                  />
                </div>
                <DeleteButton onClick={() => removeParticipantRow(i)}>
                  ✕
                </DeleteButton>
              </TableRow>
            ))}
          </ParticipantTable>

          <IconButton onClick={addParticipantRow}>
            + Add a Participant
          </IconButton>

          <PrimaryActionArea>
            <SideNavNewTemplateButton
              onClick={handleStartExercise}
              disabled={isStarting || !selectedTemplateId}
            >
              {isStarting ? "Starting Session..." : "Start Exercise"}
            </SideNavNewTemplateButton>
          </PrimaryActionArea>
        </StartContentWrapper>
      </LayoutWrapper>
    </>
  );
}
