import { TextFieldStyled } from "@/components/prompts/styles";

type TextPromptParticipantProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function TextPromptParticipant({
  value,
  onChange,
}: TextPromptParticipantProps) {
  return (
    <TextFieldStyled
      value={value}
      placeholder="Type your answer..."
      onChange={(e) => onChange(e.target.value)}
    />
  );
}