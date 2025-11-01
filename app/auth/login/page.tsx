"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkProfileExists } from "@/actions/supabase/queries/profiles";
import { useSession } from "@/utils/AuthProvider";
import styles from "./styles.module.css";

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

  const signOut = async () => {
    try {
      await sessionHandler.signOut();
    } catch (error) {
      throw new Error("An error occurred during sign out: " + error);
    }
  };

  return (
    <>
      <div className={styles.main}>
        <h1>Login Page</h1>
        Type your email here:
        <div className={styles.inputFields}>
          <input
            name="email"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </div>
        Type your password here:
        <div className={styles.inputFields}>
          <input
            type="password"
            name="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className={styles.buttonStyles}>
          <button type="button" onClick={handleSignUp}>
            {" "}
            Sign up{" "}
          </button>
          <button type="button" onClick={signInWithEmail}>
            {" "}
            Sign in{" "}
          </button>
          <button type="button" onClick={signOut}>
            {" "}
            Sign out{" "}
          </button>
        </div>
      </div>
    </>
  );
}
