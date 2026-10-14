"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Container,
  ErrorMessage,
  Heading2,
  IntroText,
  Main,
  PasswordText,
  WelcomeTag,
} from "../styles";

export default function AuthError() {
  const router = useRouter();
  const error = useSearchParams().get("error");

  return (
    <Main>
      <Container>
        <IntroText>
          <WelcomeTag>
            <Heading2>This link didn&apos;t work</Heading2>
          </WelcomeTag>
        </IntroText>
        <PasswordText>
          The link may have expired or already been used. If this was an invite
          link, ask your facilitator to resend your invite. If you were
          resetting your password, request a new reset email.
        </PasswordText>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button
          onClick={() => router.push("/")}
          style={{ margin: "2.25rem 0" }}
        >
          Return to Sign in
        </Button>
      </Container>
    </Main>
  );
}
