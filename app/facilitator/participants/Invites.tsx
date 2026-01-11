"use state";

import { useCallback, useEffect, useState } from "react";
import { UUID } from "crypto";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { fetchInvites } from "@/api/supabase/queries/invites";
import InviteComponent from "@/components/InviteComponent/InviteComponent";
import { Invite } from "@/types/schema";
import {
  GeneralList,
  GeneralTitle,
  Heading3,
  MainDiv,
  SortButton,
} from "../styles";

export default function Invites({ user_group_id }: { user_group_id: string }) {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [sortKey, setSortKey] = useState<"name" | "email" | "role">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const toggleSort = (key: "email") => {
    let nextSortKey = sortKey;
    let nextSortOrder = sortOrder;

    if (sortKey === key) {
      nextSortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      nextSortKey = key;
      nextSortOrder = "asc";
    }

    setSortKey(nextSortKey);
    setSortOrder(nextSortOrder);
  };

  const loadData = useCallback(async () => {
    const [groupInvites] = await Promise.all([
      fetchInvites(user_group_id as UUID),
    ]);
    setInvites(groupInvites || []);
  }, [user_group_id]);

  const sortedInvites = [...invites].sort((a, b) => {
    let aVal = "";
    let bVal = "";

    if (sortKey === "email") {
      aVal = `${a.email}`.toLowerCase();
      bVal = `${b.email}`.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    if (user_group_id) {
      loadData();
    }
  }, [user_group_id, loadData]);

  return (
    <MainDiv>
      <Heading3>Your Invites</Heading3>
      <InviteComponent
        user_group_id={user_group_id}
        onInvitesChange={() => loadData()}
      />
      <GeneralTitle>
        <span>
          Email
          <SortButton onClick={() => toggleSort("email")}>
            {sortKey === "email" ? (
              sortOrder === "asc" ? (
                <ArrowUp size={16} />
              ) : (
                <ArrowDown size={16} />
              )
            ) : (
              <ArrowUpDown size={16} />
            )}
          </SortButton>{" "}
        </span>
      </GeneralTitle>
      {sortedInvites.map(invite => (
        <GeneralList key={invite.invite_id}>
          <span> {invite.email} </span>
        </GeneralList>
      ))}
    </MainDiv>
  );
}
