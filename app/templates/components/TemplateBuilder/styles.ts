import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";

export const PanelCard = styled(Flex).attrs({ $direction: "column" })`
  // padding: 40px 100px 0 0;
  gap: 32px;
`;

export const SubmitButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  width: auto;

  padding: 13px 18px;
  border-radius: 4px;
  background: ${COLORS.darkElectricBlue};
  color: ${COLORS.white};
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  border: none;
  cursor: pointer;
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  border-bottom: 1px solid ${COLORS.oat_dark};
  margin-top: 2rem;
  margin-bottom: 1.5rem;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => (props.$active ? COLORS.black : COLORS.black40)};
  border-bottom: 3px solid
    ${props => (props.$active ? "#6B8E8F" : "transparent")}; /* Adjust color to match your specific teal/green */
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${COLORS.black};
  }
`;

export const ListCard = styled.div`
  background: ${COLORS.oat_light};
  border: 1px solid ${COLORS.oat_dark};
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
`;

export const CardTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${COLORS.black};
  margin: 0 0 1rem 0;
`;

export const DummyInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${COLORS.oat_dark};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: ${COLORS.white};
  margin-bottom: 0.5rem;

  &::placeholder {
    color: ${COLORS.black20};
  }
`;

export const SmallButton = styled.button`
  height: 45px;
  width: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.lightEletricBlue};
  font-size: 14px;
  color: black;
  border: 1px solid black;
  border-radius: 4px;
  cursor: pointer;
  margin: 1rem auto;
`;
