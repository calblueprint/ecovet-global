import Tab from "@mui/material/Tab";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";
import { SearchBarStyled, SearchInput } from "../styles";

export const LayoutWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 2rem;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  min-height: 0;
`;

export const StyledTable = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: collapse;
  font-family: ${Sans.style.fontFamily};
`;

export const StyledTableHead = styled.thead`
  border-bottom: 1px solid ${COLORS.oat_medium};
  color: ${COLORS.black40};
  font-size: 14px;
`;

export const StyledTh = styled.th`
  padding: 1rem 1rem 1rem 0;
  font-weight: 500;
  font-size: 0.75rem;
`;

export const StyledTableRow = styled.tr`
  border-bottom: 1px solid ${COLORS.oat_light};
  font-size: 0.75rem;
  &:hover button {
    visibility: visible;
    opacity: 1;
  }
`;

export const StyledTd = styled.td`
  padding: 1.25rem 1rem 1.25rem 0;
  color: ${COLORS.black70};
  font-weight: 500;
  font-size: 0.75rem;
`;

export const ListControlsWrapper = styled.div`
  border-bottom: 1px solid ${COLORS.oat_medium};
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ParticipantsSearchWrapper = styled(SearchBarStyled)`
  width: 300px;
  margin-bottom: 0;
`;

export const ParticipantsSearchInput = styled(SearchInput)`
  margin-bottom: 0;
  height: 2.25rem;
`;

export const StyledTab = styled(Tab)`
  && {
    text-transform: none;
    font-weight: 600;
    font-size: 0.75rem;
  }
`;
