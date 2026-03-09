import { Checkbox, FormControlLabel } from "@mui/material";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";
import { PromptOption } from "@/types/schema";

const CheckboxParticipantStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const McqOptionParticipantStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 0px;
  width: 100%;
`;

const OptionTextStyled = styled.span`
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: ${COLORS.black20};
`;

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
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  }

  return (
    <CheckboxParticipantStyled>
      {options.map((o) => (
        <McqOptionParticipantStyled key={o.option_id}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={value.includes(o.option_id)}
                onChange={() => toggle(o.option_id)}
              />
            }
            label={<OptionTextStyled>{o.option_text}</OptionTextStyled>}
          />
        </McqOptionParticipantStyled>
      ))}
    </CheckboxParticipantStyled>
  );
}