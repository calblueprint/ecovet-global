import Link from "next/link";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const LayoutWrapper = styled.div`
  display: flex;
  height: 100dvh;
  width: 100%;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  min-height: 0;
  min-width: 53rem;
`;

export const InviteWrapper = styled.div`
  flex: 1;
  min-height: 0;
  padding-right: 1rem;
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
  padding-block: 0.75rem;
  padding-left: 2rem;
  padding-right: 1.25rem;
  background-color: ${COLORS.white};
  background: ${COLORS.white};
  border-radius: 0.5rem;
  border-color: ${COLORS.oat_medium};
  border-width: 1px;
  border-style: solid;
  height: 100%;
  min-height: 0;
`;

export const SearchBarStyled = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

export const Heading3 = styled.h3`
  font-family: ${Sans.style.fontFamily};
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-style: normal;
  line-height: normal;
`;

export const Heading4 = styled.h3`
  font-family: ${Sans.style.fontFamily};
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 0.5rem;
  margin-top: 2rem;
  font-style: normal;
  line-height: normal;
`;

export const GeneralList = styled.ul`
  display: grid;
  padding: 1rem 0;
  list-style-type: none;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 500;
  color: ${COLORS.black70};
  align-items: left;
`;

export const GeneralListUser = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;

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

  cursor: pointer;

  &:hover {
    background-color: #f9fafb;
  }

  &:focus-visible {
    outline: none;
    background-color: #f3f4f6;
  }
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
  width: 14rem;
  height: 100%;
  align-items: flex-start;
  flex-direction: column;
  background-color: ${COLORS.oat_light};
  padding-inline: 1.5rem;
`;

export const SideNavTemplatesContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  margin: 1rem 0;
  height: 90%;
`;

export const SideNavButton = styled.button<{ $selected: boolean }>`
  background: transparent;
  border: none;
  width: 100%;
  padding: 0.5rem 1.25rem;
  text-align: left;
  border: none;
  gap: 0.5em;
  color: ${({ $selected }) => ($selected ? COLORS.black70 : COLORS.black40)};
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 500;

  &:hover {
    cursor: pointer;
    color: ${COLORS.black70};
  }
`;

export const SideNavNewTemplateButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  text-align: center;
  background-color: ${COLORS.darkElectricBlue};
  border-radius: 0.3rem;
  border: none;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 500;
  color: ${COLORS.white};
  margin-top: auto;

  &:hover {
    cursor: pointer;
  }
`;

export const StyledLink = styled(Link)`
  color: #111827; /* or your theme color */
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #3a394777; /* hover state */
    text-decoration: none;
  }
`;

export const NumUsers = styled.span`
  text-align: right;
`;

export const SearchInput2 = styled.input`
  display: block;
  width: 100%;
  height: 2.2rem;

  margin-bottom: 0.5rem;
  padding: 0 0.75rem;
  box-sizing: border-box;

  border-radius: 4px;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.white};

  color: ${COLORS.black100};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.7rem;
  font-weight: 500;

  outline: none;
  appearance: none;

  &::placeholder {
    color: ${COLORS.black20};
  }
`;

export const TopButton = styled.button<{ $active?: boolean }>`
  width: auto;
  padding: 0.75rem 1.5rem;
  text-align: center;
  gap: 0.5em;
  background-color: ${COLORS.white};
  border: none;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 500;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 100%;
    background: ${COLORS.lightEletricBlue};
    opacity: ${props => (props.$active ? 1 : 0)};
    transition: opacity 0.2s ease;
  }

  color: ${COLORS.black70};

  gap: 0.75rem;
  ${({ $active }) =>
    $active &&
    `
      border-bottom: 0.175rem solid ${COLORS.teal};
      color: ${COLORS.black70};
    `}
  &:hover {
    cursor: pointer;
  }
`;

export const ScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 30rem;
`;
