import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";
import { Sans } from "@/styles/fonts";

export const TemplateMainBox = styled(Flex).attrs({
  $direction: "column",
})`
  min-height: 100vh;
  padding-top: 48px;
  margin: 0rem 10rem;
  box-sizing: border-box;
  gap: 23px;
`;

export const LayoutWrapper = styled.div`
  display: flex;
  width: 100%;
`;
