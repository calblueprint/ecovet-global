"use client";

import { useState } from "react";
import supabase from "@/actions/supabase/client";
import * as Styled from "./styledComponents";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const rules = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid =
    rules.length && rules.uppercase && rules.number && rules.specialChar;

  const handleResetPassword = async () => {
    const { data, error } = await supabase.auth.updateUser({
      password: "new_password",
    });
    if (!isPasswordValid) {
      throw new Error("Password does not meet the required criteria");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (error) {
      throw new Error(
        "An error occurred during password reset: " + error.message + data,
      );
    }
  };

  return (
    <>
      <Styled.Main>
        <Styled.Container>
            <Styled.introText>
                <Styled.WelcomeTag>
                    Reset Password
                </Styled.WelcomeTag>
            </Styled.introText>
        </Styled.Container>
      </Styled.Main>
    </>
  );
}
