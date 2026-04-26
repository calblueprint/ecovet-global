"use client";

import { v5 as uuidv5 } from "uuid";
import { persistChatMessage } from "@/actions/supabase/queries/chat";
import { sessionParticipants } from "@/actions/supabase/queries/sessions";
import { supabase } from "@/lib/supabase/client";
import { ChatMessage } from "@/types/schema";
import { EVENT_MESSAGE_TYPE, useRealtimeChat } from "./UseChat";

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
  roleName,
}: {
  sessionId: string;
  roleId: string;
  userId: string;
  username: string;
  roleName: string;
}): { announcements: ChatMessage[] } {
  const atEveryoneRoomId = announcementToRoomId({ to: "everyone", sessionId });
  const atRoleRoomId = announcementToRoomId({ to: "role", sessionId, roleId });
  const atUserRoomId = announcementToRoomId({ to: "user", sessionId, userId });

  let { chatMessages: everyoneAnnouncements } = useRealtimeChat({
    roomId: atEveryoneRoomId,
    userId,
    username,
  });
  let { chatMessages: roleAnnouncements } = useRealtimeChat({
    roomId: atRoleRoomId,
    userId,
    username,
  });
  let { chatMessages: userAnnouncements } = useRealtimeChat({
    roomId: atUserRoomId,
    userId,
    username,
  });

  userAnnouncements = userAnnouncements.map(message => ({
    ...message,
    sender_name: "To You",
    sender: "user",
  }));

  roleAnnouncements = roleAnnouncements.map(message => ({
    ...message,
    sender_name: `To Role: ${roleName}`,
    sender: "role",
  }));

  everyoneAnnouncements = everyoneAnnouncements.map(message => ({
    ...message,
    sender_name: `To Everyone`,
    sender: "everyone",
  }));

  const announcements = [
    ...userAnnouncements,
    ...roleAnnouncements,
    ...everyoneAnnouncements,
  ].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  return { announcements };
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

  const chatMessage: ChatMessage = {
    id: crypto.randomUUID(),
    room_id: roomId,
    message: message,
    sender: userId,
    sender_name: username,
    phase_sent_at: null,
    created_at: new Date().toISOString(),
    is_announcement: true,
  };

  channel
    .send({
      type: "broadcast",
      event: EVENT_MESSAGE_TYPE,
      payload: chatMessage,
    })
    .then(() => {
      channel.unsubscribe();
    });
  persistChatMessage(chatMessage);
}
