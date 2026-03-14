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
  Label,
  LayoutWrapper,
  ParticipantTable,
  PrimaryActionArea,
  SideNavNewTemplateButton, // Reusing your existing styled button for "Start Exercise"
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

  // Mock data to match your design doc screenshot
  const [participants] = useState([
    {
      name: "Esha Bansiya",
      email: "esha.bansiya@berkeley.edu",
      role: "Project Lead",
    },
    { name: "Kevin Yamashita", email: "kyama@berkeley.edu", role: "Designer" },
    { name: "Aditya Pawar", email: "apawar@berkeley.edu", role: "Developer" },
  ]);

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

          {/* Configuration Header */}
          <ConfigRow>
            <DropdownContainer>
              <StyledSelect>
                <option value="">Select Exercise</option>
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

          {/* Existing Invite Component */}
          <InviteComponent
            user_group_id={profile.user_group_id}
            onInvitesChange={() => loadData()}
          />

          {/* Participants Table */}
          <ParticipantTable>
            <TableHeader>
              <span>Selected Participants</span>
              <span>Role</span>
            </TableHeader>

            {participants.map((p, i) => (
              <TableRow key={i}>
                <StaticDataBox>
                  {p.name}, {p.email}
                </StaticDataBox>
                <StyledSelect defaultValue={p.role}>
                  <option value="Project Lead">Project Lead</option>
                  <option value="Designer">Designer</option>
                  <option value="Developer">Developer</option>
                  <option value="External">External</option>
                </StyledSelect>
              </TableRow>
            ))}
          </ParticipantTable>

          {/* Action Footer */}
          <IconButton>+</IconButton>

          <PrimaryActionArea>
            <SideNavNewTemplateButton>Start Exercise</SideNavNewTemplateButton>
          </PrimaryActionArea>
        </ContentWrapper>
      </LayoutWrapper>
    </>
  );
}
