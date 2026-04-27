import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";

export const TemplateMainBox = styled(Flex).attrs({
  $direction: "column",
})`
  min-height: 100vh;
  padding: 4rem 7.5rem 2rem;
  flex: 1;
  min-width: 0;
`;

export const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const LoadingMessages = styled.div`
  padding: 1.25rem;
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1.5rem 1.25rem;
  box-sizing: border-box;
`;

export const SideNavContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 18rem;
  height: 100vh;
  background-color: ${COLORS.oat_light};

  position: sticky;
  top: 0;
  align-self: flex-start;
  overflow-y: auto;
  z-index: 10;
`;

export const BackLink = styled.button`
  background: none;
  border: none;
  color: ${COLORS.black40};
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 0.75rem;
  text-align: left;

  &:hover {
    text-decoration: underline;
  }
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  max-width: 16rem;
  margin: 0 0 0.75rem 0;
  color: ${COLORS.black100};
`;

export const TitleInput = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  max-width: 16rem;
  margin: 0 0 0.75rem 0;
  color: ${COLORS.black100};
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const ActionText = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-bottom: 0.5rem;
`;

export const SettingsBlock = styled.button<{ $active: boolean }>`
  width: 100%;
  text-align: left;
  background-color: ${props =>
    props.$active ? `${COLORS.oat_medium}` : `${COLORS.oat_light}`};
  padding: 0.6rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${COLORS.black70};
  margin-bottom: 1rem;
  border: 1px solid ${COLORS.oat_dark};
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: ${COLORS.oat_medium};
  }
`;

export const RolesListContainer = styled.div`
  border: 1px solid ${COLORS.oat_dark};
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  background: ${COLORS.white};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const RolesTitle = styled.h3`
  font-size: 0.8rem;
  color: ${COLORS.black40};
  margin: 0 0 0.1rem 0;
  font-weight: 600;
`;

export const RoleItem = styled.button<{
  $isDisabled: boolean;
  $active: boolean;
}>`
  background: none;
  border: none;
  text-align: left;
  padding: 0;
  font-size: 0.8rem;
  font-weight: ${props => (props.$active ? "700" : "500")};
  cursor: ${props => (props.$isDisabled ? "not-allowed" : "pointer")};
  color: ${props =>
    props.$isDisabled
      ? COLORS.black20
      : props.$active
        ? COLORS.black
        : COLORS.black70};
  transition: color 0.2s ease;

  &:hover {
    color: ${props => (props.$isDisabled ? COLORS.black20 : COLORS.black)};
  }
`;

export const HeaderButtonDark = styled.button`
  background: #476c77;
  color: #ffffff;
  border: none;
  padding: 0.4rem 0.8rem;
  gap: 0.5rem;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: filter 0.15s ease;
  &:hover {
    filter: brightness(1.1);
  }
`;

export const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.8rem;
`;
