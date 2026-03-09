import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";
import { PromptOption } from "@/types/schema";

const MultipleChoiceParticipantStyled = styled.div`
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
        onChange={(e) => onChange(e.target.value)}
        name="mcq-participant"
      >
        {options.map((o) => (
          <McqOptionParticipantStyled key={o.option_id}>
            <FormControlLabel
              value={o.option_id}
              control={<Radio size="small" />}
              label={<OptionTextStyled>{o.option_text}</OptionTextStyled>}
            />
          </McqOptionParticipantStyled>
        ))}
      </RadioGroup>
    </MultipleChoiceParticipantStyled>
  );
}