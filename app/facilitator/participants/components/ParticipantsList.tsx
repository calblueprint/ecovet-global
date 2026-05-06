import { useState } from "react";
import Image from "next/image";
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import { DeleteButton } from "@/app/participants/styles";
import cross from "@/assets/images/DeleteTagCross.svg";
import SendArrow from "@/assets/images/sendArrow.svg";
import { Participant } from "@/types/schema";
import { SortButton } from "../../styles";
import {
  ResendInviteButton,
  StyledTable,
  StyledTableHead,
  StyledTableRow,
  StyledTd,
  StyledTh,
} from "../styles";

export default function ParticipantsList({
  participants,
  onDeleteRow,
  onResendInvite,
  resendingEmail,
}: {
  participants: Participant[];
  onDeleteRow: (participant: Participant) => void;
  onResendInvite: (p: Participant) => void;
  resendingEmail: string | null;
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
          <colgroup>
            <col style={{ width: "35%" }} />
            <col style={{ width: "35%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "5%" }} />
          </colgroup>
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
            </tr>
          </StyledTableHead>
          <tbody>
            {sorted.map((p, index) => (
              <StyledTableRow key={p.id || index}>
                <StyledTd>{p.name ?? "—"}</StyledTd>
                <StyledTd>{p.email}</StyledTd>
                <StyledTd>{p.role}</StyledTd>
                <StyledTd>
                  {!p.invite_accepted && (
                    <Tooltip title="Resend email">
                      <ResendInviteButton
                        variant="text"
                        size="small"
                        startIcon={
                          <Image
                            src={SendArrow}
                            alt="Resend Email"
                            width={16}
                            height={16}
                          />
                        }
                        disabled={resendingEmail === p.email}
                        onClick={() => onResendInvite(p)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 500,
                          color: "primary.main",
                          "&:hover": { backgroundColor: "white" },
                        }}
                      >
                        {resendingEmail === p.email ? "Sending…" : ""}
                      </ResendInviteButton>
                    </Tooltip>
                  )}
                </StyledTd>
                <StyledTd>
                  <Tooltip title="Delete Participant">
                    <DeleteButton onClick={() => onDeleteRow(p)}>
                      <Image src={cross} alt="cross" />
                    </DeleteButton>
                  </Tooltip>
                </StyledTd>
              </StyledTableRow>
            ))}
          </tbody>
        </StyledTable>
      )}
    </Box>
  );
}
