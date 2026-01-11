import styled from "styled-components";
import COLORS from "@/styles/colors";

export const Main = styled.main`
  display: flex;
  height: 100vh;
  min-height: 100vh;
  padding: 2rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: ${COLORS.white};
  background: ${COLORS.white};
`;

export const Container = styled.div`
  align-items: center;
  background-color: ${COLORS.white};
  width: stretch;
  width: 30rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Button = styled.button`
  height: 45px;
  width: 20rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.darkElectricBlue};
  font-size: 14px;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const SmallButton = styled.button`
  height: 45px;
  width: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.white};
  font-size: 14px;
  color: black;
  border: 1px solid black;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 0.5rem;
`;
