"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkProfileExists } from "@/api/supabase/queries/profile";
import { useSession } from "@/utils/AuthProvider";
import {
  Button,
  Container,
  EmailAddressDiv,
  ForgetPasswordTag,
  Heading2,
  Input,
  InputFields,
  IntroText,
  Main,
  SignInTag,
  WelcomeTag,
} from "../styles";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const sessionHandler = useSession();

  const signInWithEmail = async () => {
    const { data, error } = await sessionHandler.signInWithEmail(
      email,
      password,
    );
    if (error) {
      throw new Error(
        "An error occurred during sign in: " +
          error.message +
          "with email" +
          email,
      );
    }

    if (!data.user) {
      throw new Error("User not found after sign in");
    }

    if (await checkProfileExists(data.user.id)) {
      router.push("/onboarding");
    } else {
      router.push("/edit-profile");
    }
  };

  return (
    <>
      <Main>
        <Container>
          <IntroText>
            <WelcomeTag>
              <Heading2>Welcome back!</Heading2>
            </WelcomeTag>
            <SignInTag> Sign in to admin portal.</SignInTag>
          </IntroText>
          <InputFields>
            <EmailAddressDiv>
              <Input
                name="email"
                placeholder="Email Address"
                onChange={e => setEmail(e.target.value)}
                value={email}
              />
            </EmailAddressDiv>
            <Input
              type="password"
              name="password"
              onChange={e => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
            />
            <ForgetPasswordTag>
              <Link href="/auth/reset-password"> Forget password? </Link>
            </ForgetPasswordTag>
          </InputFields>
          <Button type="button" onClick={signInWithEmail}>
            {" "}
            Sign in{" "}
          </Button>
        </Container>
      </Main>
    </>
  );
}
