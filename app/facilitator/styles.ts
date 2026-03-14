import { StylesConfig } from "react-select";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";
import { DropdownOption } from "@/types/dropdown";

export const LayoutWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const Main = styled.main`
  display: flex;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  padding: 2rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: ${COLORS.white};
  background: ${COLORS.white};
`;

export const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  margin-right: 10%;

  overflow-y: auto;
  min-height: 0;
`;

export const PageDiv = styled.main`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

export const MainDiv = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2rem;
  padding-top: 1rem;
  background-color: ${COLORS.white};
  background: ${COLORS.white};
`;

export const SearchBarStyled = styled.div`
  width: 100%;
  margin-bottom: 1rem;
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

export const Heading3 = styled.h3`
  font-family: ${Sans.style.fontFamily};
  font-size: 24px;
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

export const GeneralTitle = styled.h1`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${COLORS.oat_medium};
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 1.25rem 2rem 1.25rem 2rem;
  background: ${COLORS.white};
  font-family: ${Sans.style.fontFamily};
  color: ${COLORS.black40};
  font-size: 12px;
  font-weight: 500;
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

export const SideNavContainer = styled.div`
  display: flex;
  padding: 0.75rem 1rem;
  padding-right: 0;
  width: 12rem;
  min-width: 180px;
  align-items: flex-start;
  flex-direction: column;
  background-color: ${COLORS.oat_light};
`;

export const SideNavTemplatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1.25rem 0;
  width: 100%;
`;

export const SideNavButton = styled.button<{ selected: boolean }>`
  width: 100%;
  padding: 0.75rem 1.5rem;
  text-align: left;
  gap: 0.5em;
  background-color: ${({ selected }) =>
    selected ? COLORS.oat_dark : COLORS.oat_light};

  color: ${({ selected }) => (selected ? COLORS.black : COLORS.black70)};
  border-radius: 0.25rem;
  border: none;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 500;
  &:hover {
    background-color: ${COLORS.oat_medium};
    cursor: pointer;
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
`;

export const Label = styled.label`
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 500;
  color: ${COLORS.black70};
  margin-bottom: 0.5rem;
`;

export const StyledSelect = styled.select`
  border: 1px solid ${COLORS.oat_medium};
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-family: ${Sans.style.fontFamily};
  font-size: 14px;
  background-color: ${COLORS.white};
  height: 48px;
  outline: none;
  color: ${COLORS.black};

  /* This ensures the arrow shows up across all browsers */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d1d1d1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.2em;

  cursor: pointer;

  &:focus {
    border-color: ${COLORS.darkElectricBlue};
  }
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

export const ToggleButton = styled.button<{ active?: boolean }>`
  border: none;
  height: 100%;
  padding: 0 1.5rem;
  border-radius: 4px;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  /* The logic swap: Gray if active, White if inactive */
  background-color: ${props =>
    props.active ? COLORS.oat_light : COLORS.white};
  color: ${props => (props.active ? COLORS.black : COLORS.black40)};

  &:hover {
    color: ${COLORS.black};
  }
`;

export const ParticipantTable = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 0 0.5rem;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 600;
  color: ${COLORS.black40};
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

export const StaticDataBox = styled.div`
  border: 1px solid ${COLORS.oat_medium};
  border-radius: 4px;
  padding: 0.75rem;
  font-family: ${Sans.style.fontFamily};
  font-size: 13px;
  color: ${COLORS.black70};
  background-color: ${COLORS.white};
`;

export const IconButton = styled.button`
  background-color: ${COLORS.darkElectricBlue};
  color: ${COLORS.white};
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 2rem auto;
  font-size: 20px;
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
    height: "48px",
    minHeight: "48px",
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
    height: "48px",
    display: "flex",
    alignItems: "center",
  }),
  indicatorsContainer: base => ({
    ...base,
    height: "48px",
  }),
  placeholder: base => ({
    ...base,
    color: COLORS.black40,
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
