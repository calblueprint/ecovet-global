import { UUID } from "node:crypto";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function saveChatMessage(
  roomId: UUID,
  message: string,
  senderId: UUID,
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
    console.error("Error saving chat message: ", error.message);
    throw new Error("Failed to save chat message");
  }
}
