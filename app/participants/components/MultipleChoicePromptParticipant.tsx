import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";
import { PromptOption } from "@/types/schema";

const MultipleChoiceParticipantStyled = styled.div`
  display: flex;
  flex-direction: column;

  .MuiFormGroup-root {
    gap: 8px;
  }
`;

const McqOptionParticipantStyled = styled.div<{ $selected: boolean }>`
  display: fit-content;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-radius: 8px;
  background-color: ${COLORS.oat_light};

  background-color: ${({ $selected }) =>
    $selected ? COLORS.lightEletricBlue : COLORS.oat_light};
  border: 1px solid
    ${({ $selected }) => ($selected ? COLORS.darkElectricBlue : "transparent")};

  .MuiFormControlLabel-root {
    margin-left: 0;
  }

  .MuiRadio-root.Mui-checked {
    padding-left: 8px;
    color: ${({ $selected }) =>
      $selected ? COLORS.darkElectricBlue : COLORS.oat_medium};
  }
`;

const OptionTextStyled = styled.span<{ $selected: boolean }>`
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: ${({ $selected }) => ($selected ? COLORS.black100 : COLORS.black70)};
  line-height: 150%; /* 18px */
  padding: 8px 0;
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
                <OptionTextStyled $selected={value === o.option_id}>
                  {" "}
                  {o.option_text}
                </OptionTextStyled>
              }
            />
          </McqOptionParticipantStyled>
        ))}
      </RadioGroup>
    </MultipleChoiceParticipantStyled>
  );
}
