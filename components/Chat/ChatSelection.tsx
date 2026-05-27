import Person from "@/assets/images/person.svg";
import { ImageLogo } from "../styles";
import {
  ChatButtonContainer,
  ChatButtonLabel,
  ChatSelectedBorder,
  ChatSelectionButton,
  ChatSelectionContainer,
  CreateChatPlus,
} from "./styles";

export interface Selection {
  chatName: string;
  roomId: string;
}

export default function ChatSelection({
  chats,
  currentRoomId,
  chatNotifications,
  changeRoom,
  createRoom,
}: {
  chats: Selection[];
  currentRoomId: string | null;
  chatNotifications: Set<string>;
  changeRoom: (roomId: string) => void;
  createRoom: () => void;
}) {
  return (
    <ChatSelectionContainer>
      <ChatButtonContainer onClick={createRoom}>
        <ChatSelectedBorder $selected={false} $unread={false}>
          <ChatSelectionButton color="">
            <CreateChatPlus>+</CreateChatPlus>
          </ChatSelectionButton>
        </ChatSelectedBorder>
        <ChatButtonLabel>New Room</ChatButtonLabel>
      </ChatButtonContainer>

      {chats.map(chat => (
        <ChatButtonContainer
          key={chat.roomId}
          onClick={() => changeRoom(chat.roomId)}
        >
          <ChatSelectedBorder
            $unread={chatNotifications.has(chat.roomId)}
            $selected={chat.roomId === currentRoomId}
          >
            <ChatSelectionButton>
              <ImageLogo
                src={Person.src}
                alt="Play"
                width={12}
                height={12}
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "0.5rem",
                }}
              />
            </ChatSelectionButton>
          </ChatSelectedBorder>
          <ChatButtonLabel>{chat.chatName}</ChatButtonLabel>
        </ChatButtonContainer>
      ))}
    </ChatSelectionContainer>
  );
}
