"use client";

import { useRouter } from "next/navigation";
import { Container, Heading2, Main, RedirectButton } from "./styledComponents";

export default function redirect() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/auth/signup");
  };

  return (
    <Main>
      <Container>
        <Heading2> Your password has been reset.</Heading2>
        <RedirectButton onClick={handleRedirect}>
          Return to Sign in
        </RedirectButton>
      </Container>
    </Main>
  );
}
