"use client";

import { useRouter } from "next/navigation";
import { Button, Container, Heading2, Main } from "../styles";

export default function Redirect() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/auth/signup");
  };

  return (
    <Main>
      <Container>
        <Heading2> Your password has been reset.</Heading2>
        <Button onClick={handleRedirect}>Return to Sign in</Button>
      </Container>
    </Main>
  );
}
