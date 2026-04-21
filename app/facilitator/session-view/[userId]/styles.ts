import { styled } from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
  margin-top: 8px;
`;

export const OptionRow = styled.div<{ $selected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  background-color: ${({ $selected }) =>
    $selected ? COLORS.lightEletricBlue : COLORS.oat_light};
  border: 1px solid
    ${({ $selected }) => ($selected ? COLORS.darkElectricBlue : "transparent")};

  span {
    font-family: ${Sans.style.fontFamily};
    font-size: 12px;
    font-weight: 500;
    line-height: 150%;
    color: ${({ $selected }) => ($selected ? COLORS.black100 : COLORS.black70)};
  }
`;

export const RadioCircle = styled.span<{ $selected: boolean }>`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid
    ${({ $selected }) =>
      $selected ? COLORS.darkElectricBlue : COLORS.oat_medium};
  background-color: ${COLORS.white};
  position: relative;

  ${({ $selected }) =>
    $selected &&
    `
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${COLORS.darkElectricBlue};
      }
    `}
`;
