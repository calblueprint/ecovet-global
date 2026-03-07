import Image from "next/image";
import styled from "styled-components";
import COLORS from "@/styles/colors";

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

export const ImageLogo = styled(Image)`
  height: auto;
  max-height: 40px;
`;
