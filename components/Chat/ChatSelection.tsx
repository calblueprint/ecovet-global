import {
  ChatButtonContainer,
  ChatButtonLabel,
  ChatSelectionButton,
  ChatSelectionContainer,
} from "./styles";

export interface Selection {
  chatName: string;
  roomId: string;
}

export default function ChatSelection({
  chats,
  changeRoom,
  createRoom,
}: {
  chats: Selection[];
  changeRoom: (roomId: string) => void;
  createRoom: () => void;
}) {
  return (
    <ChatSelectionContainer>
      <ChatButtonContainer onClick={createRoom}>
        <ChatSelectionButton color="">+</ChatSelectionButton>
        <ChatButtonLabel>New Room</ChatButtonLabel>
      </ChatButtonContainer>

      {chats.map(chat => (
        <ChatButtonContainer
          key={chat.roomId}
          onClick={() => changeRoom(chat.roomId)}
        >
          <ChatSelectionButton />
          <ChatButtonLabel>{chat.chatName}</ChatButtonLabel>
        </ChatButtonContainer>
      ))}
    </ChatSelectionContainer>
  );
}
