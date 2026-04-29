import { StylesConfig } from "react-select";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";
import { DropdownOption } from "@/types/schema";

export const LayoutWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const Main = styled.main`
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  padding: 2rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: ${COLORS.white};
`;

export const StartContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  margin-right: 10%;
  margin-left: 10%;

  overflow-y: auto;
`;

export const SearchInput = styled.input`
  border: 1px solid ${COLORS.oat_medium};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  width: 100%;
  height: 2.75rem;
  margin-bottom: 1rem;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  background-color: ${COLORS.oat_light};
`;

export const Heading4 = styled.h4`
  font-family: ${Sans.style.fontFamily};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-style: normal;
  line-height: normal;
`;

export const GeneralList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr auto; /* left | middle | right */
  column-gap: 1rem;

  border-radius: 0.5rem 0.5rem 0 0;
  border-bottom: 1px solid ${COLORS.oat_medium};
  padding: 1rem 2rem;
  list-style-type: none;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 500;
  color: ${COLORS.black70};
  min-height: 4rem;
  align-items: center;
`;

export const SortButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  font-size: 0.9rem;
  padding: 0;
  margin-left: 4px;
  line-height: 1;
  vertical-align: middle;
  transition: color 0.2s ease;

  &:hover {
    color: #555;
  }
`;

export const SideNavNewTemplateButton = styled.button`
  width: 9.25rem;
  padding: 0.75rem 1.5rem;
  text-align: center;
  gap: 0.5em;
  background-color: ${COLORS.darkElectricBlue};
  border-radius: 0.25rem;
  border: none;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 500;
  color: ${COLORS.white};
  cursor: pointer;
`;

export const ConfigRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 2rem;
`;

export const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 400px;
  min-height: 100%;
`;

export const ToggleGroup = styled.div`
  display: flex;
  background-color: ${COLORS.white};
  border: 1px solid ${COLORS.oat_medium};
  padding: 4px;
  border-radius: 8px;
  height: 40px;
  align-items: center;
`;

export const ToggleButton = styled.button<{ $active?: boolean }>`
  border: none;
  height: 100%;
  padding: 0 1.5rem;
  border-radius: 4px;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 1200;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  background-color: ${props =>
    props.$active ? COLORS.white : COLORS.oat_light};
  color: ${props => (props.$active ? COLORS.black40 : COLORS.black)};

  &:hover {
    color: ${COLORS.black};
  }
`;

export const ParticipantTable = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: visible;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 0 0.5rem;
  font-family: ${Sans.style.fontFamily};
  font-size: 0.875rem;
  font-weight: 500;
  color: ${COLORS.black40};
`;

export const TableRow = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

export const IconButton = styled.button`
  background-color: ${COLORS.darkElectricBlue};
  color: ${COLORS.white};
  font-family: ${Sans.style.fontFamily};
  font-weight: 500;
  border: none;
  width: 10rem;
  height: 2rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 2rem auto;
  font-size: 12px;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.9);
  }

  &:hover {
    filter: brightness(1.1);
  }
`;

export const PrimaryActionArea = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-bottom: 4rem;
`;

export const ExerciseSelectStyles: StylesConfig<DropdownOption, boolean> = {
  control: base => ({
    ...base,
    height: "40px",
    minHeight: "40px",
    borderRadius: "4px",
    border: `1px solid ${COLORS.oat_medium}`,
    boxShadow: "none",
    fontFamily: Sans.style.fontFamily,
    fontSize: "14px",
    backgroundColor: COLORS.white,
    "&:hover": {
      borderColor: COLORS.black40,
    },
  }),
  valueContainer: base => ({
    ...base,
    padding: "0 12px",
    height: "40px",
    display: "flex",
    alignItems: "center",
  }),
  indicatorsContainer: base => ({
    ...base,
    height: "40px",
  }),
  placeholder: (base, state) => ({
    ...base,
    color: COLORS.black40,
    display: state.isFocused ? "none" : base.display,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: base => ({
    ...base,
    color: COLORS.black40,
    padding: "8px",
  }),
};

export const DeleteButton = styled.button`
  position: absolute;
  right: -2rem;
  top: 25%;
  botton: 25%;
  opacity: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 12px;
  padding: 4px 6px;
  border-radius: 4px;
  transition:
    opacity 0.15s,
    color 0.15s;

  ${TableRow}:hover & {
    opacity: 1;
  }

  &:hover {
    color: #e53e3e;
  }
`;

export const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.8rem;
`;

export const CheckboxLabel = styled.label`
  font-size: 14px;
  font-family: ${Sans.style.fontFamily};
  color: ${COLORS.black40};
`;

export const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: ${COLORS.black70};
`;

export const ExerciseNameInput = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 25rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export const NameInputField = styled.input`
  border: 1px solid ${COLORS.oat_medium};
  border-radius: 4px;
  padding: 0 12px;
  width: 100%;
  height: 40px;
  font-family: ${Sans.style.fontFamily};
  font-size: 14px;
  background-color: ${COLORS.white};

  &::placeholder {
    color: ${COLORS.black40};
  }

  &:hover {
    border-color: ${COLORS.black40};
  }

  &:focus {
    outline: none;
    border-color: ${COLORS.black40};
  }
`;
