"use client";

import type { ParticipantSessionWithProfile, Session } from "@/types/schema";
import { useEffect, useState } from "react";
import {
  fetchSessionsbyUserGroup,
  sessionParticipantsBulk,
} from "@/actions/supabase/queries/sessions";
import { useProfile } from "@/utils/ProfileProvider";

export default function PastSessionsPage() {
  const { profile } = useProfile();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [participantsBySession, setParticipantsBySession] = useState<
    Record<string, ParticipantSessionWithProfile[]>
  >({});

  useEffect(() => {
    if (!profile?.user_group_id) return;

    (async () => {
      const sessions = await fetchSessionsbyUserGroup(profile.user_group_id!);
      if (!sessions) {
        return;
      }
      setSessions(sessions);

      const participantsData = await sessionParticipantsBulk(
        sessions.map(s => s.session_id),
      );
      setParticipantsBySession(
        participantsData.reduce<
          Record<string, ParticipantSessionWithProfile[]>
        >((acc, p) => {
          if (!acc[p.session_id]) acc[p.session_id] = [];
          acc[p.session_id].push(p);
          return acc;
        }, {}),
      );
    })();
  }, [profile]);

  const activeSessions = sessions.filter(s => !s.is_finished);
  const archivedSessions = sessions.filter(s => s.is_finished);

  return (
    <div>
      <h1>Active Sessions</h1>
      {activeSessions.length === 0 ? (
        <p>No active sessions found.</p>
      ) : (
        <ul>
          {activeSessions.map(session => (
            <li key={session.session_id}>
              <div>{session.session_name}</div>
              <div>{session.session_id}</div>
              <div>{session.template_id}</div>

              <ul>
                {participantsBySession[session.session_id]?.map(
                  (p: ParticipantSessionWithProfile) => (
                    <li key={p.user_id}>
                      {p.profile.first_name} {p.profile.last_name}
                    </li>
                  ),
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}

      <h1>Archived Sessions</h1>
      {archivedSessions.length === 0 ? (
        <p>No archived sessions found.</p>
      ) : (
        <ul>
          {archivedSessions.map(session => (
            <li key={session.session_id}>
              <div>{session.session_name}</div>
              <div>{session.session_id}</div>
              <div>{session.template_id}</div>

              <ul>
                {participantsBySession[session.session_id]?.map(
                  (p: ParticipantSessionWithProfile) => (
                    <li key={p.user_id}>
                      {p.profile.first_name} {p.profile.last_name}
                    </li>
                  ),
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
