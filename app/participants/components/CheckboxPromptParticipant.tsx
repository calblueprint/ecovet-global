import { Checkbox, FormControlLabel } from "@mui/material";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";
import { PromptOption } from "@/types/schema";

const CheckboxParticipantStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .MuiFormGroup-root {
    gap: 8px;
  }
`;

const CheckboxOptionParticipantStyled = styled.div<{ $selected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-radius: 8px;
  background-color: ${({ $selected }) =>
    $selected ? COLORS.lightEletricBlue : COLORS.oat_light};
  border: 1px solid
    ${({ $selected }) => ($selected ? COLORS.darkElectricBlue : "transparent")};

  .MuiFormControlLabel-root {
    margin-left: 0;
    width: 100%;
  }

  .MuiCheckbox-root {
    padding-left: 8px;
  }

  .MuiCheckbox-root.Mui-checked {
    color: ${COLORS.darkElectricBlue};
  }
`;

const OptionTextStyled = styled.span<{ $selected: boolean }>`
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  padding: 8px 0;
  color: ${({ $selected }) => ($selected ? COLORS.black100 : COLORS.black70)};
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
                <OptionTextStyled $selected={selected}>
                  {o.option_text}
                </OptionTextStyled>
              }
            />
          </CheckboxOptionParticipantStyled>
        );
      })}
    </CheckboxParticipantStyled>
  );
}
