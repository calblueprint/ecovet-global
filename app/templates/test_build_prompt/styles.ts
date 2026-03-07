import styled from "styled-components";

export const FacilitatorPromptBuilderStyled = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    padding: 48px 160px;
    flex-direction: column;
    gap: 40px;

    color: var(--Black-100, #0F0F0F);
    font-family: "Public Sans";
    font-style: normal;
    line-height: normal;
`;

export const TitleStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    font-family: "Public Sans";
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

export const PhaseDescriptionFieldStyled = styled.div`
    width: 100%;
    font-family: "Public Sans";
    font-size: 12px;
    font-style: italic;
    font-weight: 500;
    line-height: 150%; /* 18px */

    .MuiFormControl-root {
        width: 100%;
    }
`;
