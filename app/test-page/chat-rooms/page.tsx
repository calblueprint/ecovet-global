"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UUID } from "node:crypto";
import {
  createChatRoom,
  getUserChatRooms,
} from "@/actions/supabase/queries/chat";
import { Caption, H2 } from "@/styles/text";
import { useProfile } from "@/utils/ProfileProvider";

export default function ChatPage() {
  // same as in /chat/[roomId]
  const HARDCODED_SESSION_ID = "000a28c2-80b1-4531-a8f7-3f24949a4738";

  const { userId } = useProfile();
  const [chatRooms, setChatRooms] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string>(HARDCODED_SESSION_ID);

  async function loadRooms() {
    console.log(userId);
    if (!userId) return;

    try {
      const rooms = await getUserChatRooms(userId);
      setChatRooms(rooms);
      console.log("found rooms: ", rooms);
    } catch {
      console.log("Error loading chat rooms.");
    }
  }

  useEffect(() => {
    loadRooms();
  }, [userId]);

  async function onCreateRoom() {
    if (!userId) return;

    const roomId = crypto.randomUUID() as UUID;
    await createChatRoom(roomId, userId, HARDCODED_SESSION_ID);
    await loadRooms();
  }

  return (
    <div>
      <H2>Chat rooms</H2>
      <Caption>User id: {userId}</Caption>
      <label>session id</label>
      <input onChange={e => setSessionId(e.target.value)} value={sessionId} />
      <button onClick={onCreateRoom}>create new chat room</button>

      {chatRooms.map(roomId => (
        <div key={roomId}>
          <Link href={`/test-page/chat/${roomId}`}> room {roomId} </Link>
        </div>
      ))}
    </div>
  );
}
