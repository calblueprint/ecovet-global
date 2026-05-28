import { useState } from "react";
import Image from "next/image";
import { CircularProgress, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { DeleteButton } from "@/app/participants/styles";
import cross from "@/assets/images/DeleteTagCross.svg";
import SendArrow from "@/assets/images/sendArrow.svg";
import { Participant } from "@/types/schema";
import { SortButton } from "../../styles";
import {
  LoadingScreen,
  ResendInviteButton,
  StyledTable,
  StyledTableHead,
  StyledTableRow,
  StyledTd,
  StyledTh,
} from "../styles";

type SortKey = "name" | "email" | "role";
type SortOrder = "asc" | "desc";

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
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sorted = [...participants].sort((a, b) => {
    let aVal = "";
    let bVal = "";

    if (sortKey === "name") {
      aVal = a.name?.toLowerCase() ?? "";
      bVal = b.name?.toLowerCase() ?? "";
    } else if (sortKey === "email") {
      aVal = a.email?.toLowerCase() ?? "";
      bVal = b.email?.toLowerCase() ?? "";
    } else if (sortKey === "role") {
      aVal = a.role?.toLowerCase() ?? "";
      bVal = b.role?.toLowerCase() ?? "";
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (key: SortKey) =>
    sortKey === key ? (
      sortOrder === "asc" ? (
        <ArrowUp size={16} />
      ) : (
        <ArrowDown size={16} />
      )
    ) : (
      <ArrowUpDown size={16} />
    );

  return (
    <Box>
      {participants.length === 0 ? (
        <LoadingScreen>
          <CircularProgress size="2rem" color="inherit" aria-label="Loading…" />
        </LoadingScreen>
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
                <SortButton onClick={() => toggleSort("name")}>
                  {renderSortIcon("name")}
                </SortButton>
              </StyledTh>
              <StyledTh>
                Email{" "}
                <SortButton onClick={() => toggleSort("email")}>
                  {renderSortIcon("email")}
                </SortButton>
              </StyledTh>
              <StyledTh>
                Role{" "}
                <SortButton onClick={() => toggleSort("role")}>
                  {renderSortIcon("role")}
                </SortButton>
              </StyledTh>
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
