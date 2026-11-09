import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const ImageDropArea = styled.label<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  align-self: stretch;
  min-height: 9rem;
  padding: 1.5rem;
  border: 1px dashed ${COLORS.black20};
  border-radius: 0.5rem;
  background: ${COLORS.white};
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  font-family: ${Sans.style.fontFamily};
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${({ $disabled }) =>
      $disabled ? COLORS.black20 : COLORS.mediumElectricBlue};
  }

  &:focus-within {
    outline: 2px solid ${COLORS.mediumElectricBlue};
    outline-offset: 2px;
  }
`;

export const DropAreaTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${COLORS.darkElectricBlue};
`;

export const DropAreaHint = styled.span`
  font-size: 12px;
  color: ${COLORS.black40};
`;

export const HiddenFileInput = styled.input.attrs({ type: "file" })`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`;

export const PreviewFrame = styled.div`
  display: flex;
  justify-content: center;
  align-self: stretch;
  border-radius: 0.5rem;
  background: ${COLORS.white};
  border: 1px solid ${COLORS.oat_medium};
  overflow: hidden;
`;

export const PreviewImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: 20rem;
  object-fit: contain;
`;

export const PreviewPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 9rem;
  font-family: ${Sans.style.fontFamily};
  font-size: 13px;
  color: ${COLORS.black40};
`;

export const ImageActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ImageActionButton = styled.label<{ $danger?: boolean }>`
  background: ${COLORS.oat_medium};
  color: ${({ $danger }) => ($danger ? "#c53030" : COLORS.darkElectricBlue)};
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(0.95);
  }

  &:focus-within {
    outline: 2px solid ${COLORS.mediumElectricBlue};
    outline-offset: 2px;
  }
`;

export const ImageError = styled.p`
  margin: 0;
  font-family: ${Sans.style.fontFamily};
  font-size: 12px;
  color: #c53030;
`;
