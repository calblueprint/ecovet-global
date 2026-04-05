import { useState } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import { DeleteButton } from "@/app/participants/styles";
import cross from "@/assets/images/DeleteTagCross.svg";
import { Participant } from "@/types/schema";
import { SortButton } from "../../styles";
import {
  StyledTable,
  StyledTableHead,
  StyledTableRow,
  StyledTd,
  StyledTh,
} from "../styles";

export default function ParticipantsList({
  participants,
  onDeleteRow,
}: {
  participants: Participant[];
  onDeleteRow: (participant: Participant) => void;
}) {
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = [...participants].sort((a, b) => {
    const nameA = a.name ?? "";
    const nameB = b.name ?? "";
    return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  return (
    <Box>
      {participants.length === 0 ? (
        <p>No participants found.</p>
      ) : (
        <StyledTable>
          <StyledTableHead>
            <tr>
              <StyledTh>
                Name{" "}
                <SortButton onClick={() => setSortAsc(!sortAsc)}>
                  {sortAsc ? "↓" : "↑"}
                </SortButton>
              </StyledTh>
              <StyledTh>Email</StyledTh>
              <StyledTh>Role</StyledTh>
              <StyledTh>Last active</StyledTh>
            </tr>
          </StyledTableHead>
          <tbody>
            {sorted.map((p, index) => (
              <StyledTableRow key={p.id || index}>
                <StyledTd>{p.name ?? "—"}</StyledTd>
                <StyledTd>{p.email}</StyledTd>
                <StyledTd>{p.role}</StyledTd>
                <StyledTd>{p.last_active}</StyledTd>
                <StyledTd>
                  <DeleteButton onClick={() => onDeleteRow(p)}>
                    <Image src={cross} alt="cross" />
                  </DeleteButton>
                </StyledTd>
              </StyledTableRow>
            ))}
          </tbody>
        </StyledTable>
      )}
    </Box>
  );
}
