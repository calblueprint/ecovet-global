"use client";

import { useCallback, useEffect, useState } from "react";
import { UUID } from "node:crypto";
import { supabase } from "@/lib/supabase/client";

export interface ChatMessage {
  id: string;
  content: string;
  sender: UUID;
  senderName: string;
  createdAt: string;
}

const EVENT_MESSAGE_TYPE = "message";

export function useRealtimeChat({
  roomName,
  userId,
  username,
}: {
  roomName: string;
  userId: UUID;
  username: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channel, setChannel] = useState<ReturnType<
    typeof supabase.channel
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newChannel = supabase.channel(roomName);

    newChannel
      .on("broadcast", { event: EVENT_MESSAGE_TYPE }, payload => {
        setMessages(current => [...current, payload.payload as ChatMessage]);
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
  }, [roomName, username, supabase]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!channel || !isConnected) return;

      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        sender: userId,
        senderName: username,
        createdAt: new Date().toISOString(),
      };

      setMessages(current => [...current, message]);

      await channel.send({
        type: "broadcast",
        event: EVENT_MESSAGE_TYPE,
        payload: message,
      });
    },
    [channel, isConnected, username],
  );

  return { messages, sendMessage, isConnected };
}
