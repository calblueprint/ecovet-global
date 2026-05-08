import { MenuItem, MenuList, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import styled from "styled-components";
import COLORS from "@/styles/colors";

export const MainDiv = styled.main`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
`;

export const ProfileContainer = styled.div<{ $open: boolean }>`
  display: flex;
  padding: 0.4rem 0.5rem;
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
  border-radius: 0.4375rem;
  background: ${({ $open }) =>
    $open ? COLORS.lightEletricBlue : COLORS.oat_medium};
  border: none;
`;

export const DropdownButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0.5rem !important;
  height: 1rem !important;

  background-color: transparent;

  cursor: pointer;
  user-select: none;
`;

export const DropDownContainer = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? "flex" : "none")};
  padding: 0 0.675rem;
  height: 3rem;
  align-items: center;
  flex-direction: column;
  height: 3rem;
`;

export const MenuOptionsDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  border: none;
  gap: 0.5rem;
`;

export const StyledMenuPaper = styled(Paper)`
  display: flex !important;
  width: 10.5rem !important;
  padding: 0.5rem !important;
  flex-direction: column !important;
  align-items: flex-start !important;

  border-radius: 0.625rem !important;
  border: 1px solid ${COLORS.oat_medium} !important;
  background: ${COLORS.white} !important;
  box-shadow: none !important;
`;

export const StyledMenuList = styled(MenuList)`
  display: flex !important;
  flex-direction: column !important;
  gap: 0.3rem !important;
`;

export const StyledMenuItem = styled(MenuItem)`
  display: flex !important;
  padding: 0.25rem 0.5rem 0.375rem 0.5rem !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  align-self: stretch !important;
  user-select: none !important;

  &:hover {
    background-color: transparent !important;
  }
`;
