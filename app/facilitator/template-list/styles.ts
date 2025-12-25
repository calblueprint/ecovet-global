import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

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
  min-height: 100vh;
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

export const TemplateTitle = styled.h1`
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

export const TemplateList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr auto; /* left | middle | right */
  column-gap: 1rem;
  align-items: start;

  border-radius: 0.5rem 0.5rem 0 0;
  border-bottom: 1px solid ${COLORS.oat_medium};
  padding: 1rem 2rem;
  list-style-type: none;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 500;
  color: ${COLORS.black70};
`;

export const SideNavContainer = styled.div`
  display: flex;
  padding: 1rem;
  height: 100vh;
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

export const AssociatedTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const TemplateTag = styled.span`
  display: inline-flex;
  border-radius: 4px;
  background: var(--Oat-Medium, #eee);
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

export const LayoutWrapper = styled.div`
  display: flex;
  height: calc(100vh - 64px);
  width: 100%;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  margin-right: 10%;
`;

export const SideNavNewTemplateButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  text-align: left;
  gap: 0.5em;
  background-color: ${COLORS.darkElectricBlue};
  border-radius: 0.25rem;
  border: none;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 500;
  color: ${COLORS.white};
`;
