"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/utils/AuthProvider";
import {
  Button,
  EmailAddressDiv,
  Input,
  InputFields,
  Main,
  SignInTag,
  WelcomeTag,
} from "./styles";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sessionHandler = useSession();

  const handleSignUp = async () => {
    setErrorMessage(null);
    try {
      const res = await fetch("/api/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const { data, error } = await res.json();
      console.log("API response:", { data, error });

      if (error) {
        if (error?.message?.includes("already been registered")) {
          setErrorMessage("You already have an account, please sign in.");
        } else {
          setErrorMessage(error?.message ?? "Sign up failed.");
        }
        return;
      }

      router.push("/test-page");
    } catch {
      setErrorMessage("An unexpected error occurred during sign up.");
    }
  };

  const signInWithEmail = async () => {
    setErrorMessage(null);
    try {
      const { data, error } = await sessionHandler.signInWithEmail(
        email,
        password,
      );
      if (error) {
        setErrorMessage("An error occurred during sign in: " + error.message);
        return;
      }
      if (!data.user) {
        setErrorMessage("User not found after sign in.");
        return;
      }
      router.push("/test-page");
    } catch {
      setErrorMessage("An unexpected error occurred during sign in.");
    }
  };

  const signOut = async () => {
    try {
      await sessionHandler.signOut();
    } catch {
      setErrorMessage("An error occurred during sign out.");
    }
  };

  return (
    <Main>
      <WelcomeTag>Test Admin Portal</WelcomeTag>
      <SignInTag>Sign up to be admin, no password requirements</SignInTag>
      Email address
      <EmailAddressDiv>
        <InputFields>
          <Input
            name="email"
            placeholder="Email Address"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </InputFields>
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
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <Button type="button" onClick={handleSignUp}>
        Sign up
      </Button>
      <Button type="button" onClick={signInWithEmail}>
        Sign in
      </Button>
      <Button type="button" onClick={signOut}>
        Sign out
      </Button>
      <div>
        Click <Link href="/auth/reset-password"> here </Link> if you forgot your
        password.
      </div>
    </Main>
  );
}
