import Link from "next/link";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";
import { B2, Caption, H3 } from "@/styles/text";

export const PhaseCaption = styled(Caption)`
  color: ${COLORS.black70};
  font-weight: 400;
`;

export const SidebarCaption = styled(Caption)`
  color: ${COLORS.black40};
`;

export const SidebarLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export const SidebarTemplateName = styled(B2)`
  font-weight: 700;
  color: ${COLORS.black70};
`;

export const SidebarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const SideBarEntry = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SideBarSection = styled.div<{ $isFirst?: boolean }>`
  width: 100%;
  display: flex;
  gap: 16px;
  flex-direction: column;
  padding-top: ${({ $isFirst }) => ($isFirst ? "0" : "12px")};
  padding-bottom: 12px;
  padding-right: 12px;
  border-bottom: 1px solid ${COLORS.oat_medium};
`;

export const SideBarHeader = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-direction: column;
`;

export const HeaderWithPlus = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PhaseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

export const TabbedList = styled(PhaseList)`
  padding-top: 0.35rem;
  padding-left: 12px;
  font-weight: 400;
`;

export const RoleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

export const Selectable = styled.div`
  cursor: pointer;
`;
