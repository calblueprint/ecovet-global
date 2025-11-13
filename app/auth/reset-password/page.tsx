"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "@/api/supabase/queries/auth";
import {
  Button,
  Container,
  EmailAddressDiv,
  Heading2,
  Input,
  IntroText,
  Main,
  SignInTag,
} from "../styles";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!isEmailValid(email)) {
      throw new Error("Please enter a valid email address");
    }
    const { error } = await sendPasswordResetEmail(email);
    if (error) {
      throw new Error("An error occurred: " + error);
      return;
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
              onChange={e => setEmail(e.target.value)}
              value={email}
              name="email"
            />
          </EmailAddressDiv>
          <Button onClick={handleResetPassword} disabled={!isEmailValid(email)}>
            Send
          </Button>
        </Container>
      </Main>
    </>
  );
}
