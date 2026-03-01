"use client";

import { useState } from "react";
import {
  checkIfUserExists,
  sendPasswordResetEmail,
} from "@/api/supabase/queries/auth";
import {
  Button,
  Container,
  EmailAddressDiv,
  ErrorMessage,
  Heading2,
  Input,
  IntroText,
  Main,
  SignInTag,
  SuccessMessage,
} from "../styles";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    try {
      if (!isEmailValid(email)) {
        throw new Error("Please enter a valid email address");
      }

      if (!(await checkIfUserExists(email))) {
        throw new Error(
          "No account exists with that email. Please sign up first.",
        );
      }

      const { error } = await sendPasswordResetEmail(email);
      if (error) {
        throw new Error("An error occurred: " + error);
      }

      setSuccessMessage(
        "If an account with that email exists, a password reset link has been sent.",
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <Main>
        <Container>
          <IntroText>
            <Heading2> What&apos;s your email?</Heading2>
            <SignInTag>
              {" "}
              We&apos;ll send you an email to reset your password.
            </SignInTag>
          </IntroText>
          <EmailAddressDiv style={{ margin: "2.25rem 0rem" }}>
            <Input
              placeholder="Email Address"
              type="email"
              onChange={e => {
                setEmail(e.target.value);
                setErrorMessage(null);
              }}
              value={email}
              name="email"
            />
          </EmailAddressDiv>
          <Button onClick={handleResetPassword} disabled={!isEmailValid(email)}>
            Send
          </Button>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        </Container>
      </Main>
    </>
  );
}
