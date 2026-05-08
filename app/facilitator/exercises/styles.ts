import Tab from "@mui/material/Tab";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const LayoutWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 2rem;
`;

export const ContentWrapper = styled.div`
  max-width: 68.5rem;
  width: 100%;
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  font-family: ${Sans.style.fontFamily};
`;

export const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${COLORS.black100};
  margin: 0;
`;

export const TabSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TabControlsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${COLORS.oat_medium};

  .MuiTabs-indicator {
    background-color: ${COLORS.darkElectricBlue};
  }
`;

export const StyledTab = styled(Tab)`
  && {
    text-transform: none;
    font-weight: 500;
    font-size: 0.8rem;
    font-family: ${Sans.style.fontFamily};

    &.Mui-selected {
      color: ${COLORS.darkElectricBlue};
    }
  }
`;

export const StartExerciseButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background-color: ${COLORS.darkElectricBlue};
  color: ${COLORS.white};
  border: none;
  border-radius: 6px;
  padding: 0.45rem 0.7rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    opacity: 0.85;
  }
`;

export const SearchBarStyled = styled.div`
  position: relative;
  width: 20rem;
  margin-left: auto;
`;

export const SearchIconWrapper = styled.span`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  display: flex;
  color: ${COLORS.black40};
  pointer-events: none;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 2.5em;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  border: 1px solid ${COLORS.oat_medium};
  border-radius: 8px;
  font-size: 0.8125rem;
  background-color: transparent;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th:not(:first-child),
  td:not(:first-child) {
    text-align: center;
  }
`;

export const StyledTableHead = styled.thead`
  color: ${COLORS.black40};
  font-size: 0.8125rem;
  font-weight: 500;

  th {
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid ${COLORS.oat_medium};
    font-weight: 500;
  }
`;

export const StyledTh = styled.th``;

export const StyledTableRow = styled.tr`
  border-bottom: 1px solid ${COLORS.oat_light};
  cursor: pointer;

  &:hover {
    background-color: ${COLORS.oat_light};
  }
`;

export const StyledTd = styled.td`
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  color: ${COLORS.black100};
`;

export const EmptyMessage = styled.td`
  padding: 2rem 0;
  color: ${COLORS.black40};
  font-size: 0.9375rem;
  text-align: center;
`;

export const SyncBadge = styled.span`
  font-size: 0.9375rem;
  color: ${COLORS.black70};
`;

export const PdfButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 0.9375rem;
  color: ${COLORS.black70};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PdfLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
`;

export const PdfArrow = styled.svg`
  transform: rotate(-45deg);
  flex-shrink: 0;
`;
