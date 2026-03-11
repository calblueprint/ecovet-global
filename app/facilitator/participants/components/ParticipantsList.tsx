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
  id: string;
  name?: string | null; // optional because database doesn't have it
  email: string | null;
  role: string | null;
  last_active?: string | null; // optional because database doesn't have it
  invite_accepted: boolean | null; // consider making boolean? leaving as string for now since that's how it's coming from the database
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
              <StyledTh>Status (for testing)</StyledTh>
              <StyledTh>Last active</StyledTh>
            </tr>
          </StyledTableHead>
          <tbody>
            {participants.map((p, index) => (
              <StyledTableRow key={p.id || index}>
                <StyledTd>{p.name}</StyledTd>
                <StyledTd>{p.email}</StyledTd>
                <StyledTd>{p.role}</StyledTd>
                <StyledTd>{String(p.invite_accepted)}</StyledTd>{" "}
                {/* purely to see accepted vs pending in the site itself*/}
                <StyledTd>{p.last_active}</StyledTd>
              </StyledTableRow>
            ))}
          </tbody>
        </StyledTable>
      )}
    </Box>
  );
}
