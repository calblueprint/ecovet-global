"use client";

import { v5 as uuidv5 } from "uuid";
import { sessionParticipants } from "@/actions/supabase/queries/sessions";
import { supabase } from "@/lib/supabase/client";
import {
  EVENT_MESSAGE_TYPE,
  LocalChatMessage,
  useRealtimeChat,
} from "./UseChat";

export type AnnouncementRoom =
  | { to: "everyone"; sessionId: string }
  | { to: "role"; sessionId: string; roleId: string }
  | { to: "user"; sessionId: string; userId: string };

export function announcementToRoomId(room: AnnouncementRoom): string {
  if (room.to == "everyone") {
    return uuidv5(room.sessionId, room.sessionId);
  } else if (room.to == "role") {
    return uuidv5(room.roleId, room.sessionId);
  } else if (room.to == "user") {
    return uuidv5(room.userId, room.sessionId);
  }

  throw new Error(`Announcement Room is invalid: ${JSON.stringify(room)}`);
}

export function useAnnouncements({
  sessionId,
  roleId,
  userId,
  username,
}: {
  sessionId: string;
  roleId: string;
  userId: string;
  username: string;
}) {
  const atEveryoneRoomId = announcementToRoomId({ to: "everyone", sessionId });
  const atRoleRoomId = announcementToRoomId({ to: "role", sessionId, roleId });
  const atUserRoomId = announcementToRoomId({ to: "user", sessionId, userId });

  return {
    everyoneAnnouncements: useRealtimeChat({
      roomId: atEveryoneRoomId,
      userId,
      username,
    }),
    roleAnnouncements: useRealtimeChat({
      roomId: atRoleRoomId,
      userId,
      username,
    }),
    userAnnouncements: useRealtimeChat({
      roomId: atUserRoomId,
      userId,
      username,
    }),
  };
}
export function sendAnnouncement({
  room,
  userId,
  username,
  message,
}: {
  room: AnnouncementRoom;
  userId: string;
  username: string;
  message: string;
}): void {
  const roomId = announcementToRoomId(room);
  const channel = supabase.channel(roomId);

  const chatMessage: LocalChatMessage = {
    id: crypto.randomUUID(),
    room_id: roomId,
    message: message,
    sender: userId,
    sender_name: username,
  };

  channel.send({
    type: "broadcast",
    event: EVENT_MESSAGE_TYPE,
    payload: chatMessage,
  });
}
