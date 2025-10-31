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

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw new Error(
        "An error occurred during sign up: " +
          error.message +
          "with email" +
          data,
      );
    }
  };

  const signInWithEmail = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new Error(
        "An error occurred during sign in: " +
          error.message +
          "with email" +
          data,
      );
    }

    await supabase.auth.getSession();
    await supabase.auth.getUser();

    router.push("/onboarding");
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error("An error occurred during sign out: " + error.message);
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
