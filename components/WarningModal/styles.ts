import styled from "styled-components";
import COLORS from "@/styles/colors";

export const WarningDialog = styled.div`
  width: 25rem;
  padding: 0.9375rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  border-radius: 0.5rem;
  background: ${COLORS.white};
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
`;

export const WarningTitle = styled.h2`
  color: ${COLORS.black};
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
};`;

export const WarningCaption = styled.p`
  color: ${COLORS.black};
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
};`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  width: 100%;
`;

export const CancelButton = styled.button`
  display: flex;
  padding: 0.5rem 2rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 0.25rem;
  border: 1px solid ${COLORS.oat_medium};
  background: ${COLORS.white};
  color: ${COLORS.black70};
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
};`;

export const DeleteButton = styled.button`
  display: flex;
  padding: 0.5rem 2rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 0.25rem;
  border: 1px solid ${COLORS.teal};
  background: ${COLORS.teal};
  color: ${COLORS.white};
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
};`;
