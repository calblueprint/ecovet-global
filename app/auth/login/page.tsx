"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/actions/supabase/client";
import {
  Button,
  EmailAddressDiv,
  Input,
  InputFields,
  Main,
  SignInTag,
  WelcomeTag,
} from "../styles";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const sessionHandler = useSession();

  const handleSignUp = async () => {
    const { error } = await sessionHandler.signUp(email, password);
    if (error) {
      throw new Error(
        "An error occurred during sign up: " +
          error.message +
          "with email" +
          email,
      );
    }
  };

  const signInWithEmail = async () => {
    const { error } = await sessionHandler.signInWithEmail(email, password);
    if (error) {
      throw new Error(
        "An error occurred during sign in: " +
          error.message +
          "with email" +
          email,
      );
    }

    router.push("/onboarding");
  };

  const signOut = async () => {
    try {
      await sessionHandler.signOut();
    } catch (error) {
      throw new Error("An error occurred during sign out: " + error);
    }
  };

  return (
    <>
      <Main>
        <WelcomeTag>Welcome!</WelcomeTag>
        <SignInTag> Already have an account? Sign in.</SignInTag>
        Email address
        <EmailAddressDiv>
          <Input
            name="email"
            placeholder="Email Address"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </EmailAddressDiv>
        Type your password here:
        <InputFields>
          <Input
            type="password"
            name="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            placeholder="password"
          />
        </InputFields>
        <Button type="button" onClick={handleSignUp}>
          {" "}
          Sign up{" "}
        </Button>
        <Button type="button" onClick={signInWithEmail}>
          {" "}
          Sign in{" "}
        </Button>
        <Button type="button" onClick={signOut}>
          {" "}
          Sign out{" "}
        </Button>
        I apologize for this styling. But please click{" "}
        <Link href="/auth/reset-password"> here </Link> if you forgot your
        password.
      </Main>
    </>
  );
}
