"use client";

import type { ParticipantSession, Session } from "@/types/schema";
import { useEffect, useState } from "react";

export default function PastSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [participantsBySession, setParticipantsBySession] = useState<
    Record<string, ParticipantSession[]>
  >({});
  const [loading, setLoading] = useState(true);
  // const [DEBUG_SESSION_ID] = "0385b601-78cf-4997-9a2d-9fb137637203";

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await fetch(
          "/api/queries/user-groups/fetchUserGroupSessions",
        );
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching past sessions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

  useEffect(() => {
    async function fetchParticipants() {
      const entries = await Promise.all(
        sessions.map(async session => {
          const res = await fetch(
            `/api/sessions/${session.session_id}/participants`,
          );
          const data = await res.json();

          return [session.session_id, data] as const;
        }),
      );

      setParticipantsBySession(Object.fromEntries(entries));
    }

    if (sessions.length > 0) {
      fetchParticipants();
    }
  }, [sessions]);

  const activeSessions = sessions.filter(session => session.is_finished);
  const archivedSessions = sessions.filter(session => !session.is_finished);

  if (loading) {
    return <div>Loading past sessions...</div>;
  }

  return (
    <div>
      <h1>Active Sessions</h1>
      {activeSessions.filter(session => !session.is_finished).length === 0 ? (
        <p>No active sessions found.</p>
      ) : (
        <ul>
          {activeSessions.map(session => (
            <li key={session.session_id}>
              <div>{session.session_name}</div>
              <div>{session.session_id}</div>
              <div>{session.template_id}</div>

              <ul>
                {participantsBySession[session.session_id]?.map(p => (
                  <li key={p.session_id}>
                    <div>
                      : {p.profile.first_name} {p.profile.last_name}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      <h1> Archived Sessions</h1>
      {archivedSessions.filter(session => session.is_finished).length === 0 ? (
        <p>No archived sessions found.</p>
      ) : (
        <ul>
          {archivedSessions.map(session => (
            <li key={session.session_id}>
              <div>{session.session_name}</div>
              <div>{session.session_id}</div>
              <div>{session.template_id}</div>

              <ul>
                {participantsBySession[session.session_id]?.map(p => (
                  <li key={p.session_id}>
                    <div>
                      : {p.profile.first_name} {p.profile.last_name}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
