import styled from "styled-components";
import COLORS from "@/styles/colors";

export const StyledTagCreator = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 6px;
    gap: 4px;
`;

export const StyledTag = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 6px;
    gap: 4px;
`;

export const StyledTagName = styled.div`
    display: flex;
    align-content: flex-start;
`;

export const ColorDot = styled.div<{ $color: keyof typeof COLORS }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => COLORS[$color]};
`;

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 10px;
  padding: 0 4px;

  color: ${COLORS.black20};
  
  &:hover {
    color: ${COLORS.black100};
  }
`;