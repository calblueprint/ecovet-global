import { useEffect, useMemo, useState } from "react";
import { getSessionAnnouncements } from "@/actions/supabase/queries/chat";
import { ChatMessage, ParticipantSessionWithProfile } from "@/types/schema";
import { useProfile } from "@/utils/ProfileProvider";
import { AnnouncementRoom, sendAnnouncement } from "@/utils/UseAnnouncements";
import AnnouncementSelector from "./AnnouncementSelector";
import ChatInputBar from "./ChatInputBar";
import ChatMessages from "./ChatMessages";
import { ChatContainer, ChatHeader, ContentContainer } from "./styles";

export default function Announcements({
  sessionId,
  participants,
  defaultRoom,
}: {
  sessionId: string;
  participants: ParticipantSessionWithProfile[];
  defaultRoom?: AnnouncementRoom;
}) {
  const { userId } = useProfile();
  const [announcements, setAnnouncements] = useState<ChatMessage[]>([]);
  const [announcementRoom, setAnnouncementRoom] = useState<AnnouncementRoom>(
    defaultRoom ?? {
      to: "everyone",
      sessionId,
    },
  );
  // const [sessionRoles, setSessionRoles] = useState
  const userMap: Map<string, string> = useMemo(
    () =>
      new Map(
        participants.map(p => [
          p.user_id,
          `${p.profile.first_name} ${p.profile.last_name}`,
        ]),
      ),
    [participants],
  );

  useEffect(() => {
    const loadAnnouncements = async () => {
      const announcementData = await getSessionAnnouncements(sessionId);
      setAnnouncements(
        announcementData.map(announcement => {
          let senderName = "To Everyone";
          if (announcement.announcement_room?.to === "role") {
            const announcementRoleId = announcement.announcement_room.roleId;
            senderName = `To Role`;
          } else if (announcement.announcement_room?.to === "user") {
            const announcementUserId = announcement.announcement_room.userId;
            senderName = `To ${userMap.get(announcementUserId)}`;
          }

          return {
            ...announcement,
            sender_name: senderName,
          };
        }),
      );
    };

    loadAnnouncements();
  }, [sessionId]);

  const everyoneOption: [AnnouncementRoom, string] = [
    {
      to: "everyone",
      sessionId,
    },
    "To Everyone",
  ];
  const roleOptions = participants.map((p): [AnnouncementRoom, string] => [
    { to: "role", roleId: p.role_id ?? "", sessionId },
    `To ${p.role?.role_name ?? "Unknown Role"}`,
  ]);
  const userOptions = participants.map((p): [AnnouncementRoom, string] => [
    { to: "user", userId: p.user_id, sessionId },
    `To ${p.profile.first_name} ${p.profile.last_name}`,
  ]);

  async function onSendMessage(message: string) {
    if (!userId) return;

    sendAnnouncement({
      room: announcementRoom,
      userId,
      message,
      username: "Facilitator",
    });
  }

  return (
    <ChatContainer>
      <ContentContainer>
        <ChatHeader>Announcments</ChatHeader>

        <AnnouncementSelector
          options={[everyoneOption, ...roleOptions, ...userOptions]}
          selectedRoom={announcementRoom}
          setSelectedRoom={setAnnouncementRoom}
        />

        <ChatMessages chatMessages={announcements} />
      </ContentContainer>

      <ChatInputBar sendMessage={onSendMessage} disabled={false} />
    </ChatContainer>
  );
}
