"use state";

import { useCallback, useEffect, useState } from "react";
import { UUID } from "crypto";
import { fetchInvites } from "@/api/supabase/queries/invites";
import { Invite } from "@/types/schema";
import { Heading3, MainDiv, TemplateList, TemplateTitle } from "./styles";

export default function Invites({ user_group_id }: { user_group_id: string }) {
  const [invites, setInvites] = useState<Invite[]>([]);

  const loadData = useCallback(async () => {
    const [groupInvites] = await Promise.all([
      fetchInvites(user_group_id as UUID),
    ]);
    setInvites(groupInvites || []);
  }, [user_group_id]);

  useEffect(() => {
    if (user_group_id) {
      loadData();
    }
  }, [user_group_id, loadData]);

  return (
    <MainDiv>
      <Heading3>Your Invites</Heading3>
      <TemplateTitle>
        <span>Email </span>
      </TemplateTitle>
      {invites.map(invite => (
        <TemplateList key={invite.invite_id}>
          <span> {invite.email} </span>
        </TemplateList>
      ))}
    </MainDiv>
  );
}
