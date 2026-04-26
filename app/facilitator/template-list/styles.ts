import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";
import { GeneralList as SharedGeneralList } from "../styles";

export const AssociatedTags = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-width: 0;
  overflow: visible;
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

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
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

export const TemplateRow = styled(SharedGeneralList)`
  position: relative;
  overflow: hidden;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: ${COLORS.oat_light};
  }

  &:hover ${RowActions} {
    opacity: 1;
    pointer-events: auto;
  }
`;
