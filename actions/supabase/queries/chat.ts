"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ChatMessage } from "@/types/schema";

export async function persistChatMessage(
  roomId: string,
  message: string,
  senderId: string,
  senderName: string,
) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from("chat_message").insert({
    room_id: roomId,
    message: message,
    sender: senderId,
    sender_name: senderName,
  });

  if (error) {
    console.log("Error saving chat message: ", error.message);
    throw new Error("Failed to save chat message");
  }
}

// TODO: add sucurity so only users in the room can access the message history, maybe just do RLS?
export async function getMessageHistory(
  roomId: string,
  before: Date | null,
  limit: number = 50,
) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("chat_message")
    .select("*")
    .eq("room_id", roomId)
    .lt(
      before ? "created_at" : "created_at",
      before ? before.toISOString() : new Date().toISOString(),
    )
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error saving chat message: ", error.message);
    throw new Error("Failed to save chat message");
  }

  return data as ChatMessage[];
}
