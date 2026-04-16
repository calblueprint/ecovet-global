"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  getMessageHistory,
  persistChatMessage,
} from "@/actions/supabase/queries/chat";
import { supabase } from "@/lib/supabase/client";
import { ChatMessage } from "@/types/schema";

export const EVENT_MESSAGE_TYPE = "message";

export function useRealtimeChat({
  roomId,
  userId,
  username,
}: {
  roomId: string;
  userId: string;
  username: string;
}) {
  const [loading, startFetching] = useTransition();

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [channel, setChannel] = useState<ReturnType<
    typeof supabase.channel
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    startFetching(async () => {
      try {
        const messageHistory = await getMessageHistory(roomId, null, 100);
        setChatMessages(messageHistory);
      } catch (error) {
        console.error("Error loading message history:", error);
        setChatMessages([]);
      }
    });

    const newChannel = supabase.channel(roomId);

    newChannel
      .on("broadcast", { event: EVENT_MESSAGE_TYPE }, payload => {
        setChatMessages(current => [
          ...current,
          payload.payload as ChatMessage,
        ]);
      })
      .subscribe(async status => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      });

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [roomId, username, supabase]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!channel || !isConnected) return;

      const chatMessage: ChatMessage = {
        id: crypto.randomUUID(),
        room_id: roomId,
        message: message,
        sender: userId,
        sender_name: username,
        created_at: new Date().toISOString()
      };

      setChatMessages(current => [...current, chatMessage]);

      await Promise.all([
        persistChatMessage(roomId, chatMessage.message, userId, username),
        channel.send({
          type: "broadcast",
          event: EVENT_MESSAGE_TYPE,
          payload: chatMessage,
        }),
      ]);
    },
    [channel, isConnected, username],
  );

  return { loading, chatMessages, sendMessage, isConnected };
}
