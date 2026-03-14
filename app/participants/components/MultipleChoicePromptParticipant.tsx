import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { PromptOption } from "@/types/schema";
import {
  McqOptionParticipantStyled,
  McqOptionTextStyled,
  MultipleChoiceParticipantStyled,
} from "./styles";

type Props = {
  options: PromptOption[];
  value: string;
  onChange: (value: string) => void;
};

export default function MultipleChoicePromptParticipant({
  options,
  value,
  onChange,
}: Props) {
  return (
    <MultipleChoiceParticipantStyled>
      <RadioGroup
        value={value}
        onChange={e => onChange(e.target.value)}
        name="mcq-participant"
      >
        {options.map(o => (
          <McqOptionParticipantStyled
            key={o.option_id}
            $selected={value === o.option_id}
          >
            <FormControlLabel
              value={o.option_id}
              control={<Radio size="small" />}
              label={
                <McqOptionTextStyled $selected={value === o.option_id}>
                  {" "}
                  {o.option_text}
                </McqOptionTextStyled>
              }
            />
          </McqOptionParticipantStyled>
        ))}
      </RadioGroup>
    </MultipleChoiceParticipantStyled>
  );
}
