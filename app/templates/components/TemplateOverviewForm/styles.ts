import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Flex } from "@/styles/containers";
import { B2, Caption, H3 } from "@/styles/text";

export const FieldCard = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;

  border-radius: 8px;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.oat_light};
`;

export const BigInput = styled.input.attrs({
  type: "text",
})`
  display: flex;
  padding: 10px 12px;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
  align-self: stretch;
  font-size: 0.75rem;

  border-radius: 4px;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.white};

  ::placeholder {
    color: ${COLORS.black20};
  }
`;

export const FieldLegend = styled(B2)`
  color: ${COLORS.black70};
  font-weight: 700;
  line-height: 150%;
`;

export const QuestionCard = styled.fieldset`
  display: flex;
  position: relative;
  border: 1px solid ${COLORS.black20};
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
`;

export const FormStack = styled(Flex).attrs({
  $direction: "column",
  $gap: "20px",
})``;

export const PhaseTemplateHeader = styled(H3)`
  color: ${COLORS.black100};
  font-weight: 700;
`;

export const RoleHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
`;

export const RoleHeaderContainer = styled(Flex).attrs({
  $direction: "column",
  $gap: "1rem",
})`
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${COLORS.oat_medium};

  position: sticky;
  top: 0;
  z-index: 10;
  background-color: ${COLORS.white};
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
  border: 1px solid ${COLORS.oat_medium};
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
`;

export const CardTitle = styled.h4`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${COLORS.black};
  margin: 0 0 1rem 0;
`;

export const DummyInput = styled.input.attrs({
  type: "text",
})`
  display: flex;
  width: 100%;
  padding: 0.5rem 0.7rem;
  margin-bottom: 0.75rem;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
  align-self: stretch;
  font-size: 0.75rem;

  border-radius: 4px;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.white};

  ::placeholder {
    color: ${COLORS.black20};
  }
`;

export const SmallButton = styled.button`
  height: 2rem;
  width: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.darkElectricBlue};
  font-size: 14px;
  color: ${COLORS.lightEletricBlue};
  border: 1px solid ${COLORS.black20};
  border-radius: 4px;
  cursor: pointer;
  margin: 1rem auto;
`;

export const DeleteIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  color: #888;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    color: #c00;
  }
`;

export const HeaderButtonDark = styled.button`
  background: #476c77;
  color: #ffffff;
  border: none;
  padding: 0.4rem 0.8rem;
  gap: 0.25rem;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: filter 0.15s ease;
  &:hover {
    filter: brightness(1.1);
  }
`;
