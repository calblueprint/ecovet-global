import { styled } from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const Main = styled.main`
  display: flex;
  height: 100vh;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: ${COLORS.white};
  background: ${COLORS.white};
`;

export const ContentDiv = styled.div`
  display: flex;
  width: 55vw;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
`;

export const OverviewHeader = styled.h2`
  align-self: stretch;
  color: ${COLORS.black};
  font-family: ${Sans.style.fontFamily};
  font-size: 2rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const ContentBubble = styled.div`
  display: flex;
  padding: 0.56rem 0.75rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  align-self: stretch;
  border-radius: 8px;
  background: #f5f5f5;
`;

export const ContentHeader = styled.h2`
  color: ${COLORS.black40};

  font-family: ${Sans.style.fontFamily};
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const ContentBody = styled.p`
  color: ${COLORS.black70};

  font-family: ${Sans.style.fontFamily};
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.125rem;
`;

export const ContinueButtonDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 10.625rem;
  align-self: stretch;
`;

export const ButtonText = styled.p`
  color: ${COLORS.white};
  text-align: center;

  font-family: ${Sans.style.fontFamily};
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.125rem;
`;

export const ContinueButton = styled.button`
  display: flex;
  padding: 0.5rem 2rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  border-radius: 0.25rem;
  background: ${COLORS.darkElectricBlue};
  border: ${COLORS.darkElectricBlue};
`;
