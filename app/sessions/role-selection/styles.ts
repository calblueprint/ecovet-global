import styled from "styled-components";
import COLORS from "@/styles/colors";

export const Main = styled.main`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
  margin-top: 2rem;
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
`;
