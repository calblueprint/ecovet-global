"use client";

import type { DropdownOption } from "@/types/dropdown";
import type { Profile, UUID } from "@/types/schema";
import type { SelectInstance } from "react-select";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { fetchUserGroupMembers } from "@/actions/supabase/queries/user-groups";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import InputDropdown from "@/components/InputDropdown/InputDropdown";
import InviteComponent from "@/components/InviteComponent/InviteComponent";
import { useProfile } from "@/utils/ProfileProvider";
import {
  ConfigRow,
  ContentWrapper,
  DropdownContainer,
  ExerciseSelectStyles,
  Heading3,
  IconButton,
  LayoutWrapper,
  ParticipantTable,
  PrimaryActionArea,
  SideNavNewTemplateButton, // Reusing existing styled button for "Start Exercise"
  TableHeader,
  TableRow,
  ToggleButton,
  ToggleGroup,
} from "../../styles";

export default function Page() {
  const { profile } = useProfile();
  const [isSync, setIsSync] = useState(true);
  const [availableUsers, setAvailableUsers] = useState<Profile[]>([]);
  const roleRef = useRef<SelectInstance<DropdownOption> | null>(null);
  const participantRefs = useRef<(SelectInstance<DropdownOption> | null)[]>([]);

  const [participants, setParticipants] = useState([
    { id: "", name: "", email: "", role: "" },
  ]);

  // 1. Prepare options for InputDropdown (Map<value, label>)
  const userOptions = useMemo(() => {
    const map = new Map<string, string>();
    availableUsers.forEach(u => {
      const fullName = `${u.first_name} ${u.last_name}`;
      // Key: user ID (better for DB), Value: Display string
      map.set(u.id, `${fullName}, ${u.email}`);
    });
    return map;
  }, [availableUsers]);

  const roleOptions = useMemo(() => {
    return new Set(["Project Lead", "Designer", "Developer", "External"]);
  }, []);

  const exerciseOptions = useMemo(() => {
    const map = new Map<string, string>();
    map.set("scenario_1", "Scenario A: Crisis Management");
    map.set("scenario_2", "Scenario B: Tech Debt");
    return map;
  }, []);

  const loadGroupMembers = useCallback(async () => {
    if (profile?.user_group_id) {
      const members = await fetchUserGroupMembers(
        profile.user_group_id as UUID,
      );
      setAvailableUsers(members ?? []);
    }
  }, [profile?.user_group_id]);

  useEffect(() => {
    loadGroupMembers();
  }, [loadGroupMembers]);

  const addParticipantRow = () => {
    setParticipants(prev => {
      const next = [...prev, { id: "", name: "", email: "", role: "" }];
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

  const handleEnterToNext =
    (nextRef: React.RefObject<SelectInstance<DropdownOption> | null>) =>
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        const isMenuOpen = nextRef.current?.focus();
        setTimeout(() => {
          nextRef.current?.focus();
        }, 50);
      }
    };

  return (
    <>
      <TopNavBar />
      <LayoutWrapper>
        <ContentWrapper>
          <Heading3>Start Exercise</Heading3>

          <ConfigRow>
            <DropdownContainer>
              {/* Exercise Dropdown */}
              <InputDropdown
                label="Select Exercise"
                options={exerciseOptions}
                placeholder="Select Exercise"
                customStyles={ExerciseSelectStyles}
                onChange={val => console.log("Exercise selected:", val)}
              />
            </DropdownContainer>

            <ToggleGroup>
              <ToggleButton $active={isSync} onClick={() => setIsSync(true)}>
                Synchronous
              </ToggleButton>
              <ToggleButton $active={!isSync} onClick={() => setIsSync(false)}>
                Asynchronous
              </ToggleButton>
            </ToggleGroup>
          </ConfigRow>

          <InviteComponent
            user_group_id={profile.user_group_id}
            onInvitesChange={() => loadGroupMembers()}
          />

          <ParticipantTable>
            <TableHeader>
              <span>Selected Participants</span>
              <span>Role</span>
            </TableHeader>

            {participants.map((p, i) => (
              <TableRow key={i}>
                <div style={{ flex: 1 }}>
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

                <div style={{ flex: 1 }}>
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
              </TableRow>
            ))}
          </ParticipantTable>

          <IconButton onClick={addParticipantRow}>+</IconButton>

          <PrimaryActionArea>
            <SideNavNewTemplateButton>Start Exercise</SideNavNewTemplateButton>
          </PrimaryActionArea>
        </ContentWrapper>
      </LayoutWrapper>
    </>
  );
}
