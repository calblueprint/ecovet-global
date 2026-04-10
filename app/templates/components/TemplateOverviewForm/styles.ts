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
  padding-bottom: 1rem;
  border-bottom: 1px solid ${COLORS.oat_medium};
`;
