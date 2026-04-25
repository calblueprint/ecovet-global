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
  changeRoom,
  createRoom,
}: {
  chats: Selection[];
  currentRoomId: string | null;
  changeRoom: (roomId: string) => void;
  createRoom: () => void;
}) {
  return (
    <ChatSelectionContainer>
      <ChatButtonContainer onClick={createRoom}>
        <ChatSelectedBorder selected={false}>
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
          <ChatSelectedBorder selected={chat.roomId === currentRoomId}>
            <ChatSelectionButton />
          </ChatSelectedBorder>
          <ChatButtonLabel>{chat.chatName}</ChatButtonLabel>
        </ChatButtonContainer>
      ))}
    </ChatSelectionContainer>
  );
}
