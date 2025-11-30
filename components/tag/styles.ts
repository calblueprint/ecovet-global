import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const StyledTagCreator = styled.div`
  display: flex;
  flex-direction: column;
  padding: 6px;
  gap: 4px;
`;

export const NewTag = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 150px;
  padding: 12px 24px;
  gap: 10px;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  border: none;
  background-color: transparent;
  cursor: pointer;
  &:hover {
    background-color: ${COLORS["oat_medium"]};
  }
`;

export const AddNewTagPlus = styled.div`
  display: flex;
  align-items: center;
  width: 11px;
  height: 11px;
  flex-shrink: 0;
`;

export const SidebarTag = styled.div<{ $isSelected?: boolean }>`
  width: 150px;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  background: ${({ $isSelected }) =>
    $isSelected ? COLORS["oat_medium"] : COLORS["oat_light"]};
  &:hover {
    background: ${COLORS["oat_medium"]};
  }
`;

export const StyledTag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
`;

export const StyledTagName = styled.div`
  display: flex;
  align-content: flex-start;
  flex-flow: row nowrap;
  flex-grow: 1;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: var(--Black-70, #4b4a49);
`;

export const ColorDot = styled.div<{ $color: keyof typeof COLORS }>`
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ $color }) => COLORS[$color]};
`;

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  width: 11px;
  height: 11px;
  flex-shrink: 0;
  color: ${COLORS.black20};

  &:hover img {
    filter: brightness(0);
  }
`;
