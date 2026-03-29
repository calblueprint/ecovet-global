"use client";

import { useParams } from "next/navigation";
import Chat from "@/components/Chat/Chat";

export default function ChatPage() {
  // same as in /chat-rooms
  const HARDCODED_SESSION_ID = "000a28c2-80b1-4531-a8f7-3f24949a4738";

  const { roomId } = useParams<{ roomId: string }>();

  return (
    <div>
      <Chat roomId={roomId} sessionId={HARDCODED_SESSION_ID} />
    </div>
  );
}
