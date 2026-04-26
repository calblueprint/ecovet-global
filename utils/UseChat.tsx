"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
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
  roomId: string | null;
  userId: string;
  username: string;
}) {
  const [initializingMessages, startFetching] = useTransition();

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [channel, setChannel] = useState<ReturnType<
    typeof supabase.channel
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messageQueue = useRef<ChatMessage[]>([]);

  useEffect(() => {
    if (!isConnected || !channel || !roomId || initializingMessages) return;

    const sendQueuedMessages = async () => {
      for (const message of messageQueue.current) {
        await sendMessageObject(message);
      }
      messageQueue.current = [];
    };

    sendQueuedMessages();
  }, [isConnected, channel, roomId, initializingMessages]);

  useEffect(() => {
    if (channel) {
      channel.unsubscribe();
      setChannel(null);
    }
    if (!roomId) {
      setChatMessages([]);
      setIsConnected(false);
      return;
    }

    startFetching(async () => {
      try {
        const messageHistory = await getMessageHistory(roomId, null, 50);
        setChatMessages(messageHistory);
      } catch (error) {
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

  const sendMessageObject = useCallback(
    async (chatMessage: ChatMessage) => {
      if (!channel || !isConnected || !roomId) {
        return;
      }

      setChatMessages(current => [...current, chatMessage]);
      await Promise.all([
        persistChatMessage(chatMessage),
        channel.send({
          type: "broadcast",
          event: EVENT_MESSAGE_TYPE,
          payload: chatMessage,
        }),
      ]);
    },
    [channel, username, roomId, userId, isConnected],
  );

  const sendMessage = useCallback(
    async (
      message: string,
      current_phase: number,
      newRoomId?: string | null,
    ) => {
      const messageRoomId = newRoomId ?? roomId;
      if (!messageRoomId) return;

      const chatMessage: ChatMessage = {
        id: crypto.randomUUID(),
        room_id: messageRoomId,
        message: message,
        sender: userId,
        sender_name: username,
        phase_sent_at: current_phase,
        created_at: new Date().toISOString(),
        is_announcement: false,
      };

      if (!channel || !isConnected) {
        messageQueue.current.push(chatMessage);
      } else {
        sendMessageObject(chatMessage);
      }
    },
    [channel, username, roomId, userId, isConnected],
  );

  return {
    loading: initializingMessages,
    chatMessages,
    sendMessage,
    isConnected,
  };
}
