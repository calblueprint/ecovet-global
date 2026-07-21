"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ChatMessage, Profile, UUID } from "@/types/schema";

export async function getUserChatRooms(userId: UUID, sessionId: UUID) {
  const supabase = await getSupabaseServerClient();
  const { data: userRooms, error: roomsError } = await supabase
    .from("chat_room")
    .select("room_id")
    .eq("user_id", userId)
    .eq("session_id", sessionId);

  if (roomsError) throw roomsError;

  const roomIds = userRooms.map(room => room.room_id);

  const { data: roomParticipants, error: participantsError } = await supabase
    .from("chat_room")
    .select(
      `
      room_id,
      user_id,
      profile (*)
    `,
    )
    .in("room_id", roomIds);

  if (participantsError) throw participantsError;
  const roomsMap = new Map<string, Profile[]>();

  (roomParticipants || []).forEach(current => {
    const existingProfiles = roomsMap.get(current.room_id) || [];
    existingProfiles.push(current.profile);
    roomsMap.set(current.room_id, existingProfiles);
  });

  return roomsMap;
}

export async function persistChatMessage(chatMessage: ChatMessage) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from("chat_message").insert(chatMessage);

  if (error) {
    throw new Error("Failed to save chat message");
  }
}

export async function getSessionAnnouncements(
  sessionId: string,
  limit: number = 50,
) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("chat_message")
    .select("*")
    .eq("session_id", sessionId)
    .eq("is_announcement", true)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error getting session announcements: ", error.message);
    throw new Error("Failed to get session announcements");
  }

  return data as ChatMessage[];
}

export async function getMessageHistory(
  roomId: UUID,
  before: Date | null,
  limit: number = 50,
) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("chat_message")
    .select("*")
    .eq("room_id", roomId)
    .lt("created_at", before ? before.toISOString() : new Date().toISOString())
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
  userId: UUID,
  sessionId: UUID,
) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("chat_room")
    .select("*")
    .eq("room_id", roomId)
    .limit(1);

  if (error) {
    throw new Error("Failed to add user to chat room.");
  }

  if (!data) {
    throw new Error(
      `Trying to add user to a chat room that doesn't exist. (room_id: ${roomId})`,
    );
  }

  addChatRoomEntry(roomId, userId, sessionId);
}

export async function checkRoomExists(userIds: string[], sessionId: string) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.rpc("check_chat_room_exists", {
    p_user_ids: userIds,
    p_session_id: sessionId,
  });

  if (error) {
    console.error(
      "Error checking if an exact chat room exists:",
      error.message,
    );
    throw new Error("Failed to check exact room existence.");
  }

  return data || null;
}

export async function createChatRoom(
  roomId: string,
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
    throw new Error("Failed to create new chat room.");
  }

  if (data.length > 0) {
    throw new Error(
      `Trying to create a chat room that already exists. (room_id: ${roomId})`,
    );
  }

  addChatRoomEntry(roomId, userId, sessionId);
}

async function addChatRoomEntry(
  roomId: string,
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
    throw new Error("Failed to create new chat room.");
  }
}
