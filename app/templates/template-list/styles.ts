import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const PageDiv = styled.main`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

export const SidebarDiv = styled.main`
  display: flex;
  flex-direction: column;
  width: 180px;
  height: 976px;
  padding: 15px;
  justify-content: center;
  align-items: flex-start;
  flex-shrink: 0;
  background: ${COLORS["oat_light"]};
`;

export const MainDiv = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
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
  margin-bottom: 1rem;
  font-family: ${Sans.style.fontFamily};
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: ${COLORS.oat_medium};
    box-shadow: 0 0 0 2px ${COLORS.oat_light};
  }
`;

export const Heading3 = styled.h3`
  font-family: ${Sans.style.fontFamily};
  font-size: 20px;
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
  justify-content: center;

  border-radius: 0.5rem 0.5rem 0 0;
  border-bottom: 1px solid ${COLORS.oat_medium};
  padding: 1rem 2rem;
  list-style-type: none;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 500;
  color: ${COLORS.black70};
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
`;
