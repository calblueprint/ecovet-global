"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UUID } from "node:crypto";
import {
  createChatRoom,
  getUserChatRooms,
} from "@/actions/supabase/queries/chat";
import { H2 } from "@/styles/text";
import { useProfile } from "@/utils/ProfileProvider";

export default function ChatPage() {
  const HARDCODED_SESSION_ID = "000a28c2-80b1-4531-a8f7-3f24949a4738";

  const { userId } = useProfile();
  const [chatRooms, setChatRooms] = useState<string[]>([]);

  async function loadRooms() {
    if (!userId) return;

    try {
      const rooms = await getUserChatRooms(userId);
      setChatRooms(rooms);
    } catch {
      console.log("Error loading chat rooms.");
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  async function onCreateRoom() {
    if (!userId) return;

    const roomId = crypto.randomUUID() as UUID;
    await createChatRoom(roomId, userId, HARDCODED_SESSION_ID);
    await loadRooms();
  }

  return (
    <div>
      <H2>Chat rooms</H2>
      <button onClick={onCreateRoom}>create new chat room</button>

      {chatRooms.map(roomId => (
        <div key={roomId}>
          <Link href={`/test-page/chat/${roomId}`}> room {roomId} </Link>
        </div>
      ))}
    </div>
  );
}
