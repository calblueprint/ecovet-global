import styled from "styled-components";
import COLORS from "@/styles/colors";

export const LoadingMessages = styled.div`
  padding: 1.25rem;
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${COLORS.oat_light};
  width: 18rem;
  padding: 1.5rem 1.25rem;
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
  margin: 0 0 0.75rem 0;
  color: ${COLORS.black100};
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const ActionText = styled.span`
  font-size: 0.75rem;
  color: ${COLORS.black40};
  cursor: pointer;
`;

export const SettingsBlock = styled.button<{ $active: boolean }>`
  width: 100%;
  text-align: left;
  background-color: ${COLORS.oat_medium};
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${COLORS.black70};
  margin-bottom: 1rem;
  border: ${props =>
    props.$active ? `1px solid ${COLORS.oat_dark}` : "1px solid transparent"};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${COLORS.oat_medium};
  }
`;

export const RolesListContainer = styled.div`
  border: 1px solid ${COLORS.oat_dark};
  border-radius: 0.375rem;
  padding: 1rem;
  background: ${COLORS.white};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;

export const RolesTitle = styled.h3`
  font-size: 0.75rem;
  text-transform: uppercase;
  color: ${COLORS.black40};
  margin: 0 0 0.5rem 0;
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
  font-size: 0.875rem;
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
