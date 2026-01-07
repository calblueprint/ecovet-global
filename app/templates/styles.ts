import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";
import { Sans } from "@/styles/fonts";

export const TemplateMainBox = styled(Flex).attrs({
  $direction: "column",
})`
  width: calc(100vw - 300px);
  min-height: 100vh;
  margin: 80px 150px 40px 150px;
  box-sizing: border-box;
  gap: 23px;
`;

export const NewTemplateHeader = styled.h1`
  font-family: ${Sans.style.fontFamily};
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const NewTemplateDiv = styled(Flex).attrs({
  $direction: "column",
})``;

export const NewTemplateButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  padding: 10px 20px;
  border-radius: 4px;
  background: ${COLORS.darkElectricBlue};
  color: ${COLORS.white};
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.1s ease;

  width: auto;
  align-self: flex-start;

  &:hover {
    background: ${COLORS.teal};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
