import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const TopNavContainer = styled.div`
  display: flex;
  padding: 0 0.675rem;
  height: 3rem;
  align-items: center;
  flex-direction: row;
  background-color: ${COLORS.oat_light};
  height: 3rem;
  gap: 2rem;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: left;
  flex-direction: row;
  background-color: ${COLORS.oat_light};
  height: 3rem;
  flex-shrink: 0;
  gap: 2rem;
  padding: 0.5rem 0rem 1rem 1rem;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  background-color: ${COLORS.oat_light};
  height: 3rem;
`;

export const TopNavButton = styled.button<{ $active?: boolean }>`
  width: auto;
  padding: 0.75rem 1.5rem;
  text-align: center;
  gap: 0.5em;
  background-color: ${COLORS.oat_light};
  border: none;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 500;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    width: 100%;
    background: ${COLORS.lightEletricBlue};
    opacity: ${props => (props.$active ? 1 : 0)};
    transition: opacity 0.2s ease;
  }

  color: ${COLORS.black70};

  gap: 0.75rem;
  ${({ $active }) =>
    $active &&
    `
      border-bottom: 0.175rem solid ${COLORS.teal};
      color: ${COLORS.black70};
    `}
`;

export const ImageLogo = styled.img`
  height: auto;
  max-height: 40px;
`;
