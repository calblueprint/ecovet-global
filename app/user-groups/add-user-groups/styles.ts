import styled from "styled-components";

export const AddUserGroupsMain = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
`;

export const UserGroupNameInput = styled.input`
  border: line;
  width: 10rem;
  height: 1.5rem;
`;

export const UserGroupInputDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
`;

export const SubmitButton = styled.button`
  width: 5rem;
  height: 1.5rem;
`;

export const ErrorBanner = styled.h2<{ $isError: boolean }>`
  color: red;
  display: ${props => (props.$isError ? "flex" : "none")};
`;
