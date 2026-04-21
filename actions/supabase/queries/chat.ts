"use server";

import { UUID } from "crypto";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ChatMessage, Profile } from "@/types/schema";

export async function getChatParticipants(roomId: string) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("chat_room")
    .select("user_id")
    .eq("room_id", roomId);

  if (error) {
    console.error("Error getting chat rooms users: ", error.message);
    throw new Error("Failed to get chat rooms users.");
  }

  const userIds = data
    .filter(({ user_id }) => user_id)
    .map(({ user_id }) => user_id);

  return userIds as string[];
}

export async function getChatRoomSessionId(roomId: string) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from("chat_room")
    .select("session_id")
    .eq("room_id", roomId)
    .limit(1);

  if (error) {
    console.error("Error getting chat room session id: ", error.message);
    throw new Error("Failed to get chat room session id.");
  }

  if (data?.length == 0) {
    console.error("Tried getting session for chat room that doesn't exist");
    throw new Error("Tried getting session for chat room that doesn't exist");
  }

  return data[0].session_id;
}

export async function getUserChatRooms(userId: string, sessionId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: userRooms, error: roomsError } = await supabase
    .from("chat_room")
    .select("room_id")
    .eq("user_id", userId)
    .eq("session_id", sessionId);

  if (roomsError) throw roomsError;

  const roomIds = userRooms.map((room) => room.room_id);

  const { data: roomParticipants, error: participantsError } = await supabase
    .from("chat_room")
    .select(`
      room_id,
      user_id,
      profile (*)
    `)
    .in("room_id", roomIds);

  if (participantsError) throw participantsError;
  const roomsMap = new Map<string, Profile[]>();

  (roomParticipants || []).forEach((current) => {
    const existingProfiles = roomsMap.get(current.room_id) || [];
    existingProfiles.push(current.profile);
    roomsMap.set(current.room_id, existingProfiles);
  });

  return roomsMap;
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

export async function removeUserFromChatRoom(roomId: string, userId: string) {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase
    .from("chat_room")
    .delete()
    .eq("room_id", roomId)
    .eq("user_id", userId)
    .limit(1);

  if (error) {
    console.log("Error removing user from chat room.", error.message);
    throw new Error("Failed to remove user from chat room.");
  }
}

export async function addUserToChatRoom(
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
    console.log("Error creating chat room.", error.message);
    throw new Error("Failed to create new chat room.");
  }
}
