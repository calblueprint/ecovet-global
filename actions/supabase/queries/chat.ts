"use server";

import { UUID } from "crypto";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ChatMessage } from "@/types/schema";

export async function getChatRooms(limit: number = 10) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("unique_chat_rooms")
    .select("*")
    .limit(limit);

  if (error) {
    console.error("Error getting chat rooms: ", error.message);
    throw new Error("Failed to get chat rooms.");
  }

  const roomIds = data
    .filter(({ room_id }) => room_id)
    .map(({ room_id }) => room_id);

  return roomIds as string[];
}

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

export async function addUserToChatRoom(
  roomId: UUID,
  userId: string,
  sessionId: string,
) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("chat_room")
    .select("*")
    .eq("room_id", roomId)
    .limit(1);

  if (error) {
    console.log("Error adding user to chat room.", error.message);
    throw new Error("Failed to add user to chat room.");
  }

  if (!data) {
    console.log(
      `Trying to add user to a chat room that doesn't exist. (room_id: ${roomId})`,
    );
    throw new Error(
      `Trying to add user to a chat room that doesn't exist. (room_id: ${roomId})`,
    );
  }

  addChatRoomEntry(roomId, userId, sessionId);
}

export async function createChatRoom(
  roomId: UUID,
  userId: string,
  sessionId: string,
) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("chat_room")
    .select("*")
    .eq("room_id", roomId)
    .limit(1);

  if (error) {
    console.log("Error creating chat room.", error.message);
    throw new Error("Failed to create new chat room.");
  }

  if (data.length > 0) {
    console.log(
      `Trying to create a chat room that already exists. (room_id: ${roomId})`,
    );
    throw new Error(
      `Trying to create a chat room that already exists. (room_id: ${roomId})`,
    );
  }

  addChatRoomEntry(roomId, userId, sessionId);
}

async function addChatRoomEntry(
  roomId: UUID,
  userId: string,
  sessionId: string,
) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from("chat_room").insert({
    room_id: roomId,
    user_id: userId,
    session_id: sessionId,
  });

  if (error) {
    console.log("Error creating chat room.", error.message);
    throw new Error("Failed to create new chat room.");
  }
}
