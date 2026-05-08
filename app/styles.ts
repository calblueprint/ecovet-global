import Link from "next/link";
import styled from "styled-components";
import COLORS from "@/styles/colors";
import { Sans } from "@/styles/fonts";

export const PageWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
`;

export const LeftPanel = styled.div`
  position: relative; /* anchor for absolutely-positioned children */
  flex: 1;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const TextArea = styled.div`
  position: absolute;
  bottom: 4rem;
  left: 3rem;
  right: 2rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space between the two text blocks */
  max-width: 540px;
`;
export const LogoText = styled.h1`
  position: absolute;
  top: 48px;
  left: 48px;
  z-index: 10;
  margin: 0;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
`;

export const BrandingText = styled.p`
  margin: 0;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
`;

export const SmallBrandingText = styled.p`
  margin: 0;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
  opacity: 0.9;
`;

export const RightPanel = styled.div`
  width: 50%;
  background-color: ${COLORS.white};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const Heading = styled.h2`
  font-family: ${Sans.style.fontFamily};
  font-size: 2rem;
  font-weight: 700;
  color: ${COLORS.black100};
  margin: 0;
`;

export const SubText = styled.p`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.75rem;
  font-weight: 400;
  color: ${COLORS.black70};
  margin: 0 0 1.5rem 0;
`;

export const AdminLink = styled(Link)`
  color: ${COLORS.orange};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const FieldsetInput = styled.fieldset`
  position: relative;
  border: 1px solid ${COLORS.black20};
  border-radius: 4px;
  padding: 0;
  margin: 0;
  width: 100%;

  &:focus-within {
    border-color: ${COLORS.darkElectricBlue};
  }
`;

export const Legend = styled.legend<{ $hasValue: boolean }>`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.625rem;
  font-weight: 400;
  color: ${COLORS.black40};
  padding: 0 0.25rem;
  margin-left: 0.75rem;
  visibility: ${({ $hasValue }) => ($hasValue ? "visible" : "hidden")};
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 1rem;
  padding-right: 2.5rem;
  border: none;
  background: transparent;
  font-family: ${Sans.style.fontFamily};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${COLORS.black100};
  outline: none;

  &::placeholder {
    color: ${COLORS.black40};
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${COLORS.black40};
  display: flex;
  align-items: center;
  padding: 0;
`;

export const ForgotPassword = styled.div`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.6875rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;

  margin-top: 0.5rem;

  a {
    color: ${COLORS.black70};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const FloatingLabel = styled.label`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-family: ${Sans.style.fontFamily};
  font-size: 0.75rem;
  font-weight: 400;
  color: ${COLORS.black40};
  pointer-events: none;
  transition: all 0.15s ease;
  background: ${COLORS.white};
  padding: 0 0.25rem;
`;

export const SignInButton = styled.button`
  width: 100%;
  height: 44px;
  background-color: ${COLORS.darkElectricBlue};
  color: white;
  border: none;
  border-radius: 4px;
  font-family: ${Sans.style.fontFamily};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

export const ErrorMsg = styled.div`
  font-family: ${Sans.style.fontFamily};
  font-size: 0.75rem;
  font-weight: 500;
  color: red;
  text-align: center;
  margin-top: 0.75rem;
`;

export const CarouselWrapper = styled.div`
  position: absolute;
  inset: 0; /* top:0, right:0, bottom:0, left:0 */
  width: 100%;
  height: 100%;
  z-index: 1;

  /* Force the carousel library's internal containers to fill */
  & > div,
  & > div > div,
  & .Carousel-root,
  & [class*="CarouselItem"] {
    height: 100% !important;
  }

  /* Dark overlay so white text is readable on any image */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.55) 0%,
      rgba(0, 0, 0, 0.35) 100%
    );
    z-index: 2;
    pointer-events: none;
  }
`;

export const CarouselImage = styled.img`
  width: 100%;
  height: 100vh;
  object-fit: cover;
  display: block;
`;
