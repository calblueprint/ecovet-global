import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

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
