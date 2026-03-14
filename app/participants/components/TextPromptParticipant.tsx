import { TextFieldParticpantsStyled } from "./styles";

type TextPromptParticipantProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

export default function TextPromptParticipant({
  value,
  onChange,
  onBlur,
}: TextPromptParticipantProps) {
  return (
    <TextFieldParticpantsStyled
      value={value}
      placeholder="Type your answer..."
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
}
