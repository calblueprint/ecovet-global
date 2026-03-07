"use client";

import type { Profile, UUID } from "@/types/schema";
import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { fetchUserGroupMembers } from "@/actions/supabase/queries/user-groups";
import {
  GeneralList,
  GeneralTitle,
  Heading3,
  MainDiv,
  SortButton,
} from "../../styles";

export default function Participants({
  user_group_id,
}: {
  user_group_id: string;
}) {
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [sortKey, setSortKey] = useState<"name" | "email" | "role">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const toggleSort = (key: "name" | "email" | "role") => {
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

  const sortedUsers = [...allUsers].sort((a, b) => {
    let aVal = "";
    let bVal = "";

    if (sortKey === "name") {
      aVal = `${a.first_name} ${a.last_name}`.toLowerCase();
      bVal = `${b.first_name} ${b.last_name}`.toLowerCase();
    } else if (sortKey === "email") {
      aVal = a.email?.toLowerCase() ?? "";
      bVal = b.email?.toLowerCase() ?? "";
    } else if (sortKey === "role") {
      aVal = a.user_type?.toLowerCase() ?? "";
      bVal = b.user_type?.toLowerCase() ?? "";
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const loadData = useCallback(async () => {
    const [groupMembers] = await Promise.all([
      fetchUserGroupMembers(user_group_id as UUID),
    ]);
    setAllUsers(groupMembers ?? []);

    console.log(groupMembers);
  }, [user_group_id]);

  useEffect(() => {
    if (user_group_id) {
      loadData();
    }
  }, [user_group_id, loadData]);

  return (
    <MainDiv>
      <Heading3>Participants</Heading3>
      <GeneralTitle>
        <span>
          Name
          <SortButton onClick={() => toggleSort("name")}>
            {sortKey === "name" ? (
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
        <span>
          Role
          <SortButton onClick={() => toggleSort("role")}>
            {sortKey === "role" ? (
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
      {sortedUsers.map(groupMember => (
        <GeneralList key={groupMember.id}>
          <span>
            {" "}
            {groupMember.first_name} {groupMember.last_name}{" "}
          </span>
          <span> {groupMember.email} </span>
          <span> {groupMember.user_type}</span>
        </GeneralList>
      ))}
    </MainDiv>
  );
}
