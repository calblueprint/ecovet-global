import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

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
  padding: 1rem;
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
