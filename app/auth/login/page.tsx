"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/actions/supabase/client";
import styles from "./styles.module.css";

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
      <div className={styles.main}>
        <div className={styles.welcomeTag}>Welcome!</div>
        <div className={styles.instructionTag}>
          {" "}
          Already have an account? Sign in.
        </div>
        Email address
        <div>
          <input
            name="email"
            className={styles.emailField}
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
            className={styles.passwordField}
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
