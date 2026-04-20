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
}: {
  chats: Selection[];
  changeRoom: (roomId: string) => void;
}) {
  return (
    <ChatSelectionContainer>
      <ChatButtonContainer>
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
