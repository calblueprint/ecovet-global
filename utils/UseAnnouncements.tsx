"use client";

import { useMemo } from "react";
import { v5 as uuidv5 } from "uuid";
import { persistChatMessage } from "@/actions/supabase/queries/chat";
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
}): { announcements: ChatMessage[]; loading: boolean } {
  const atEveryoneRoomId = announcementToRoomId({ to: "everyone", sessionId });
  const atRoleRoomId = announcementToRoomId({ to: "role", sessionId, roleId });
  const atUserRoomId = announcementToRoomId({ to: "user", sessionId, userId });

  let { chatMessages: everyoneAnnouncements, loading: everyoneLoading } =
    useRealtimeChat({
      sessionId,
      roomId: atEveryoneRoomId,
      userId,
      username,
    });
  let { chatMessages: roleAnnouncements, loading: roleLoading } =
    useRealtimeChat({
      sessionId,
      roomId: atRoleRoomId,
      userId,
      username,
    });
  let { chatMessages: userAnnouncements, loading: userLoading } =
    useRealtimeChat({
      sessionId,
      roomId: atUserRoomId,
      userId,
      username,
    });

  const announcements = useMemo(() => {
    userAnnouncements = userAnnouncements.map(message => ({
      ...message,
      sender_name: "To You",
    }));

    roleAnnouncements = roleAnnouncements.map(message => ({
      ...message,
      sender_name: `To Role: ${roleName}`,
    }));

    everyoneAnnouncements = everyoneAnnouncements.map(message => ({
      ...message,
      sender_name: `To Everyone`,
    }));

    return [
      ...userAnnouncements,
      ...roleAnnouncements,
      ...everyoneAnnouncements,
    ].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  }, [userAnnouncements, roleAnnouncements, everyoneAnnouncements]);

  return {
    announcements,
    loading: everyoneLoading || roleLoading || userLoading,
  };
}

export function sendAnnouncement({
  room,
  userId,
  label,
  message,
}: {
  room: AnnouncementRoom;
  userId: string;
  label: string;
  message: string;
}): ChatMessage {
  const roomId = announcementToRoomId(room);
  const channel = supabase.channel(roomId);

  const chatMessage: ChatMessage = {
    id: crypto.randomUUID(),
    room_id: roomId,
    session_id: room.sessionId,
    message: message,
    sender: userId,
    sender_name: label,
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

  return chatMessage;
}
