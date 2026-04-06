import { Checkbox, FormControlLabel } from "@mui/material";
import { PromptOption } from "@/types/schema";
import {
  CheckboxOptionParticipantStyled,
  CheckboxOptionTextStyled,
  CheckboxParticipantStyled,
} from "./styles";

type Props = {
  options: PromptOption[];
  values: string[];
  onChange: (value: string[]) => void;
};

export default function CheckboxPromptParticipant({
  options,
  values,
  onChange,
}: Props) {
  function toggle(id: string) {
    const set = new Set(values);

    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }

    onChange(Array.from(set));
  }

  return (
    <CheckboxParticipantStyled>
      {options.map(o => {
        const selected = values.includes(o.option_id);
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
