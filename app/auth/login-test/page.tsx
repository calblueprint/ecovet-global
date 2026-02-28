"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkIfUserExists } from "@/api/supabase/queries/auth";
import { makeAdmin } from "@/api/supabase/queries/profile";
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
  const sessionHandler = useSession();

  const handleSignUp = async () => {
    if (await checkIfUserExists(email)) {
      console.log("User already exists with email:", email);
      throw new Error("You already have an account, please sign in.");
    }

    const { data, error } = await sessionHandler.signUp(email, password);
    if (error) {
      throw new Error(
        "An error occurred during sign up: " +
          error.message +
          "with email" +
          email,
      );
    }
    const userId = data.user?.id;
    if (!userId) {
      throw new Error("Signup succeeded but user ID was missing.");
    }
    await makeAdmin(userId, email);
  };

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
    router.push("/test-page");
  };

  const signOut = async () => {
    try {
      await sessionHandler.signOut();
    } catch (error) {
      throw new Error("An error occurred during sign out: " + error);
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
      <div>
        Click <Link href="/auth/reset-password"> here </Link> if you forgot your
        password.
      </div>
    </Main>
  );
}
