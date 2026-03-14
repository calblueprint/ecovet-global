import { Checkbox, FormControlLabel } from "@mui/material";
import { PromptOption } from "@/types/schema";
import {
  CheckboxOptionParticipantStyled,
  CheckboxOptionTextStyled,
  CheckboxParticipantStyled,
} from "./styles";

type Props = {
  options: PromptOption[];
  value: string[];
  onChange: (value: string[]) => void;
};

export default function CheckboxPromptParticipant({
  options,
  value,
  onChange,
}: Props) {
  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  }

  return (
    <CheckboxParticipantStyled>
      {options.map(o => {
        const selected = value.includes(o.option_id);
        return (
          <CheckboxOptionParticipantStyled
            key={o.option_id}
            $selected={selected}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={selected}
                  onChange={() => toggle(o.option_id)}
                />
              }
              label={
                <CheckboxOptionTextStyled $selected={selected}>
                  {o.option_text}
                </CheckboxOptionTextStyled>
              }
            />
          </CheckboxOptionParticipantStyled>
        );
      })}
    </CheckboxParticipantStyled>
  );
}
