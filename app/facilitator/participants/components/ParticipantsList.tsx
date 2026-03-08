import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import {
  SortButton,
  StyledTable,
  StyledTableHead,
  StyledTableRow,
  StyledTd,
  StyledTh,
} from "../../styles";

export interface Participant {
  id?: number;
  name: string;
  email: string;
  role: string;
  last_active: string;
  invite_accepted: boolean;
}

export default function ParticipantsList({
  participants,
}: {
  participants: Participant[];
}) {
  return (
    <Box>
      {participants.length === 0 ? (
        <p>No participants found.</p>
      ) : (
        <StyledTable>
          <StyledTableHead>
            <tr>
              <StyledTh>
                Name <SortButton>&darr;</SortButton>
              </StyledTh>
              <StyledTh>Email</StyledTh>
              <StyledTh>Role</StyledTh>
              <StyledTh>Last active</StyledTh>
            </tr>
          </StyledTableHead>
          <tbody>
            {participants.map((p, index) => (
              <StyledTableRow key={p.id || index}>
                <StyledTd>{p.name}</StyledTd>
                <StyledTd>{p.email}</StyledTd>
                <StyledTd>{p.role}</StyledTd>
                <StyledTd>{p.last_active}</StyledTd>
              </StyledTableRow>
            ))}
          </tbody>
        </StyledTable>
      )}
    </Box>
  );
}
