"use client";

import { useRouter } from "next/navigation";
import { Button, Container, Heading2, Main } from "../styles";

export default function Redirect() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/auth/sign-in");
  };

  return (
    <Main>
      <Container>
        <Heading2> Your password has been reset.</Heading2>
        <Button onClick={handleRedirect} style={{ margin: "2.25rem 0rem" }}>
          Return to Sign in
        </Button>
      </Container>
    </Main>
  );
}
