"use client";

import React, { useState } from "react";
import TopNavBar from "@/components/FacilitatorNavBar/FacilitatorNavBar";
import InviteComponent from "@/components/InviteComponent/InviteComponent";
import { useProfile } from "@/utils/ProfileProvider";
import {
  ConfigRow,
  ContentWrapper,
  DropdownContainer,
  Heading3,
  IconButton,
  LayoutWrapper,
  ParticipantTable,
  PrimaryActionArea,
  SideNavNewTemplateButton, // Reusing existing styled button for "Start Exercise"
  StaticDataBox,
  StyledSelect,
  TableHeader,
  TableRow,
  ToggleButton,
  ToggleGroup,
} from "../../styles";

export default function Page() {
  const { profile } = useProfile();
  const [isSync, setIsSync] = useState(true);

  // mock data NEED TO REPLACE WITH SUPABASE LATER
  const [participants, setParticipants] = useState([
    { name: "Dude 1", email: "aow@a.com", role: "Project Lead" },
    { name: "Dude 2", email: "bow@b.com", role: "Designer" },
    { name: "Dude 3", email: "cow@c.com", role: "Developer" },
  ]);

  const addParticipantRow = () => {
    setParticipants([
      ...participants,
      { name: "", email: "", role: "Select Role" },
    ]);
  };

  // 3. Logic to update a specific row's data
  const updateParticipant = (index: number, field: string, value: string) => {
    const updated = [...participants];
    if (field === "combined") {
      const [name, email] = value.split(", ");
      updated[index] = {
        ...updated[index],
        name: name || value,
        email: email || "",
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setParticipants(updated);
  };

  const loadData = () => {
    console.log("Invites changed! Refreshing data...");
  };

  if (!profile?.user_group_id) {
    return <div>Loading session...</div>;
  }

  return (
    <>
      <TopNavBar />
      <LayoutWrapper>
        <ContentWrapper>
          <Heading3>Start Exercise</Heading3>

          <ConfigRow>
            <DropdownContainer>
              <StyledSelect>
                <option value="">Select Exercise</option>
                <option value="scenario_1">Scenario A: test</option>
                <option value="scenario_2">Scenario B: testy</option>
              </StyledSelect>
            </DropdownContainer>

            <ToggleGroup>
              <ToggleButton active={isSync} onClick={() => setIsSync(true)}>
                Synchronous
              </ToggleButton>
              <ToggleButton active={!isSync} onClick={() => setIsSync(false)}>
                Asynchronous
              </ToggleButton>
            </ToggleGroup>
          </ConfigRow>

          <InviteComponent
            user_group_id={profile.user_group_id}
            onInvitesChange={() => loadData()}
          />

          <ParticipantTable>
            <TableHeader>
              <span>Selected Participants</span>
              <span>Role</span>
            </TableHeader>

            {participants.map((p, i) => (
              <TableRow key={i}>
                <StyledSelect
                  value={p.email ? `${p.name}, ${p.email}` : p.name}
                  onChange={e =>
                    updateParticipant(i, "combined", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select a member
                  </option>
                  <option value="Esha Bansiya, esha.bansiya@berkeley.edu">
                    Esha Bansiya, esha.bansiya@berkeley.edu
                  </option>
                  <option value="Kevin Yamashita, kyama@berkeley.edu">
                    Kevin Yamashita, kyama@berkeley.edu
                  </option>
                  <option value="Aditya Pawar, apawar@berkeley.edu">
                    Aditya Pawar, apawar@berkeley.edu
                  </option>
                  <option value="Joshua Chou">Joshua Chou</option>
                </StyledSelect>

                <StyledSelect
                  value={p.role}
                  onChange={e => updateParticipant(i, "role", e.target.value)}
                >
                  <option value="Select Role" disabled>
                    Select Role
                  </option>
                  <option value="Project Lead">Project Lead</option>
                  <option value="Designer">Designer</option>
                  <option value="Developer">Developer</option>
                  <option value="External">External</option>
                </StyledSelect>
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
