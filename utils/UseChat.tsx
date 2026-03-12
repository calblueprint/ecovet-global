"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getMessageHistory,
  persistChatMessage,
} from "@/actions/supabase/queries/chat";
import { supabase } from "@/lib/supabase/client";
import { ChatMessage } from "@/types/schema";

const EVENT_MESSAGE_TYPE = "message";

type LocalChatMessage = Omit<ChatMessage, "created_at">;

export function useRealtimeChat({
  roomId,
  userId,
  username,
}: {
  roomId: string;
  userId: string;
  username: string;
}) {
  const [chatMessages, setChatMessages] = useState<LocalChatMessage[]>([]);
  const [channel, setChannel] = useState<ReturnType<
    typeof supabase.channel
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function loadMessageHistory() {
      try {
        const messageHistory = await getMessageHistory(roomId, null, 100);
        console.log("Loaded message history:", messageHistory);
        setChatMessages(messageHistory);
      } catch (error) {
        console.error("Error loading message history:", error);
        setChatMessages([]);
      }
    }

    loadMessageHistory();
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

      const chatMessage: LocalChatMessage = {
        id: crypto.randomUUID(),
        room_id: roomId,
        message: message,
        sender: userId,
        sender_name: username,
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

  return { chatMessages, sendMessage, isConnected };
}
