import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

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
  background-color: ${COLORS.white};
  width: stretch;
  width: 20rem;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
`;

export const Button = styled.button`
  width: 100%;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  color: ${COLORS.white};
  height: 45px;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  background-color: ${COLORS.darkElectricBlue};
  font-family: ${Sans.style.fontFamily};
  &:hover {
    background-color: ${COLORS.darkElectricBlue};
  }
  border: 0px ${COLORS.darkElectricBlue};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

export const Title = styled.h1`
  font-family: ${Sans.style.fontFamily};
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.64px;
  color: ${COLORS.black100};
  margin-bottom: 0.5rem;
  text-align: center;
  width: 100%;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 0.75rem;
  width: 100%;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  border: 1px solid ${COLORS.black20};
  border-radius: 0.25rem;
  padding: 0.75rem;
  font-family: ${Sans.style.fontFamily};
  font-size: 0.875rem;
  resize: vertical;
  outline: none;
  &:focus {
    border-color: ${COLORS.darkElectricBlue};
  }
`;

export const DownloadBox = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border: 1px solid ${COLORS.black20};
  border-radius: 0.25rem;
  background: ${COLORS.oat_light};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  width: 100%;
  &:hover:not(:disabled) {
    background: ${COLORS.oat_medium};
  }
`;

export const FileName = styled.span`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${COLORS.black100};
`;

export const FileSize = styled.span`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.75rem;
  color: ${COLORS.black40};
`;

export const DownloadButton = styled.button`
  width: 100%;
  padding: 8px 24px;
  border-radius: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.darkElectricBlue};
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  color: ${COLORS.white};
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const HomeLink = styled.button`
  background: transparent;
  border: none;
  font-family: ${Sans.style.fontFamily};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${COLORS.darkElectricBlue};
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  width: 100%;
  text-align: center;
`;
