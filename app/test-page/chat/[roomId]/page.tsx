"use client";

import { useParams } from "next/navigation";
import Chat from "@/components/Chat/Chat";

export default function ChatPage() {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <div>
      <Chat roomId={roomId} />
    </div>
  );
}
