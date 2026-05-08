import { Accordion } from "@mui/material";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";
import { Caption } from "@/styles/text";

export const ContentWrapper = styled.div<{ $admin?: boolean }>`
  flex: 1;
  padding: ${p => (p.$admin ? "2rem 10rem 0 10rem" : "2rem")};

  overflow-y: auto;
  min-height: 0;
`;

export const AssociatedTags = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  overflow: visible;
  height: 100%;
`;

export const TemplateTag = styled.span`
  display: inline-flex;
  border-radius: 4px;
  background: ${COLORS["tagYellow"]};
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  height: 30px;
`;

export const NewTag = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 12px 24px;
  gap: 7px;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: var(--Black-40, #959492);
  height: 30px;
  cursor: pointer;
  &:hover {
    background-color: ${COLORS["oat_light"]};
  }
`;

export const AddNewTagPlus = styled.div`
  display: flex;
  align-items: center;
  width: 11px;
  height: 11px;
  flex-shrink: 0;
  &:hover {
    background-color: ${COLORS["oat_medium"]};
  }
  color: ${COLORS.white};
`;

export const TagEditContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 12rem;
`;

export const ClearAllButton = styled.button`
  position: absolute;
  right: 50px; // just need to offset it to right by a bit for now
  background: none;
  border: none;
  font-family: ${Sans.style.fontFamily};
  font-size: 11px;
  font-weight: 500;
  color: ${COLORS.black40};
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    color: ${COLORS.black};
    background-color: ${COLORS.oat_light};
  }
`;

export const EditIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  color: ${COLORS.black40};

  &:hover {
    background-color: ${COLORS.oat_light};
    color: ${COLORS.black};
  }
`;

export const FilterPlusSearch = styled.main`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-direction: row;
  width: 100%;
  height: 3rem;
`;

export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 50%;
`;

export const NameColumn = styled.div`
  display: flex;
  align-items: center;
  padding-right: 12px;
  cursor: pointer;
  height: 100%; /* fill the full row height */

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const DateColumn = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 100%;
`;

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 0 16px 0 32px;

  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
`;

export const GeneralList = styled.ul`
  display: grid;
  grid-template-columns: 1.5fr 1fr 2fr;
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
  align-items: start;
`;

export const TemplateRow = styled(GeneralList)<{ $disabled?: boolean }>`
  position: relative;
  overflow: hidden;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: ${p => (p.$disabled ? "transparent" : COLORS.oat_light)};
  }

  &:hover ${RowActions} {
    opacity: 1;
    pointer-events: auto;
  }
`;
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
  flex-direction: column;
  width: fit-content;
  min-width: 200px;
  height: 100vh;
  padding: 1.5rem 1rem;
  background-color: ${COLORS.oat_light};

  position: sticky;
  top: 0;
  z-index: 10;
  overflow-y: auto;
  flex-shrink: 0;
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
