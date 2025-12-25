"use client";

import { useEffect, useState } from "react";
import { UUID } from "crypto";
import supabase from "@/actions/supabase/client";
import { participant_session_update } from "@/api/supabase/queries/sessions";

// Wirting this here so that there will be no merge conflict in schema,
// this is implemented in my previous sprint which has not been merged
// need to upadate import in sessions query script

export interface ParticipantSession {
  user_id: UUID;
  role_id: UUID;
  phase_id: UUID;
  is_finished: boolean;
  session_id: UUID;
}

export default function Test() {
  const [participants, setParticipants] = useState<ParticipantSession[]>([]);
  const [allDone, setAllDone] = useState(false);

  const someSeshID = "0c50c7cf-8e27-41de-9252-e17201ea6f70";

  // onload pull all participants in session and add to state
  useEffect(() => {
    async function load() {
      const data = await participant_session_update(someSeshID);
      setParticipants(data);
    }

    load();
  }, [someSeshID]);

  // update some vars
  useEffect(() => {
    // channel to listen to updates
    const channel = supabase
      .channel(`participant-is-finished-updates-sesh_${someSeshID}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "participant_session",
          filter: `session_id=eq.${someSeshID}`,
        },
        payload => {
          console.log(payload);

          const updated_row = payload.new as ParticipantSession;

          setParticipants(prev =>
            prev.map(p =>
              p.user_id === updated_row.user_id ? updated_row : p,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [someSeshID]);

  useEffect(() => {
    if (participants.length === 0) return;

    const everyoneDone = participants.every(p => p.is_finished);
    setAllDone(everyoneDone);
  }, [participants]);

  // Function to adv phase
  useEffect(() => {
    if (allDone) {
      console.log("Advance phase!");
    }
  }, [allDone]);

  return (
    <>
      <div>
        Not Done
        {participants
          .filter(p => !p.is_finished)
          .map(p => (
            <div key={p.user_id}>{p.user_id}</div>
          ))}
      </div>

      <div>
        Done
        {participants
          .filter(p => p.is_finished)
          .map(p => (
            <div key={p.user_id}>{p.user_id}</div>
          ))}
      </div>
    </>
  );
}
