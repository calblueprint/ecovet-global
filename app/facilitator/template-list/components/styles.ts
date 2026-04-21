import { StylesConfig } from "react-select";
import { Accordion } from "@mui/material";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";
import { Caption } from "@/styles/text";

export const TagsCaption = styled(Caption)`
  color: ${COLORS.black70};
`;

export const StyledAccordion = styled(Accordion)`
  width: 100%;
  box-shadow: none !important;
  background-color: transparent !important;
  border: none;
  border-radius: 0 !important;

  &:before {
    display: none;
  }

  &.Mui-expanded {
    margin: 0;
  }

  .MuiAccordionSummary-root {
    padding: 0 1.5rem;
    min-height: unset;
    background-color: transparent;
  }

  .MuiAccordionSummary-root.Mui-expanded {
    min-height: unset;
  }

  .MuiAccordionSummary-content {
    margin: 0.75rem 0;
  }

  .MuiAccordionSummary-content.Mui-expanded {
    margin: 0.75rem 0;
  }

  .MuiAccordionDetails-root {
    padding: 0;
  }
`;

export const SideNavContainer = styled.div`
  display: flex;
  padding: 0.75rem 1rem;
  padding-right: 0;
  align-items: flex-start;
  flex-direction: column;
  background-color: ${COLORS.oat_light};
  min-height: 100vh;
  width: 18rem;
`;

export const SideNavTemplatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1.25rem 0;
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
