import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const Main = styled.main`
  display: flex;
  height: 100vh;
  width: 100%;
  padding: 2rem;
  justify-content: center;
  align-items: flex-start;
  background-color: ${COLORS.white};
`;

export const Container = styled.div`
  background-color: ${COLORS.white};
  width: 28rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

export const Heading = styled.h1`
  font-family: ${Sans.style.fontFamily};
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${COLORS.black100};
`;

export const Subheading = styled.h3`
  font-family: ${Sans.style.fontFamily};
  color: ${COLORS.black70};
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

export const SelectionRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Row = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  width: 100%;
`;

export const DeleteButton = styled.button`
  border: none;
  background: transparent;
  color: ${COLORS.darkElectricBlue};
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.25rem;
  font-family: ${Sans.style.fontFamily};

  &:hover {
    text-decoration: underline;
  }
`;

export const AddButton = styled.button`
  width: 100%;
  height: 45px;
  border-radius: 0.25rem;
  background-color: ${COLORS.white};
  color: ${COLORS.black20};
  font-family: ${Sans.style.fontFamily};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: ${COLORS.black};
  }
`;

export const StartButton = styled.button`
  width: 100%;
  height: 45px;
  border-radius: 0.25rem;
  border: none;
  background-color: ${COLORS.darkElectricBlue};
  color: white;
  font-family: ${Sans.style.fontFamily};
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover {
    background-color: ${COLORS.darkElectricBlue};
  }
`;

export const Message = styled.p`
  font-family: ${Sans.style.fontFamily};
  color: ${COLORS.black70};
  font-size: 0.8rem;
  margin-top: -0.5rem;
`;

export const ErrorMessage = styled.p`
  font-family: ${Sans.style.fontFamily};
  color: ${COLORS.darkElectricBlue};
  font-size: 0.8rem;
  margin-top: -0.5rem;
`;
