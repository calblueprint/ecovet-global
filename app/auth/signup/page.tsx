"use client";

import { useState } from "react";
import { FiCheck, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import Link from "next/link";
import supabase from "@/actions/supabase/client";
import * as S from "./styledComponents";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const rules = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid =
    rules.length && rules.uppercase && rules.number && rules.specialChar;

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (!isPasswordValid) {
      throw new Error("Password does not meet the required criteria");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    if (error) {
      throw new Error(
        "An error occurred during sign up: " +
          error.message +
          "with email" +
          data,
      );
    }
  };

  return (
    <>
      <S.Main>
        <S.Container>
          <S.introText>
            <S.WelcomeTag>
              <h2> Welcome! </h2>
            </S.WelcomeTag>
            <S.signInTag>
              {" "}
              Already have an account?{" "}
              <Link href="/auth/login"> Sign in. </Link>
            </S.signInTag>
          </S.introText>
          <S.inputFields>
            <S.emailAddressButton>
              <S.input
                name="email"
                placeholder="Email Address"
                onChange={e => setEmail(e.target.value)}
                value={email}
              />{" "}
            </S.emailAddressButton>
            <S.passwordButton>
              <div style={{ position: "relative", width: "100%" }}>
                <S.input
                  name="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  onChange={e => (
                    setPassword(e.target.value),
                    setPasswordTouched(true)
                  )}
                  value={password}
                />{" "}
                <S.VisibilityToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </S.VisibilityToggle>
              </div>
            </S.passwordButton>
            <S.passwordConfirmButton>
              <div style={{ position: "relative", width: "100%" }}>
                <S.input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password Confirmation"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <S.VisibilityToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </S.VisibilityToggle>
              </div>
            </S.passwordConfirmButton>
            <S.passwordCheckBox>
              Your password must contain:
              <ul>
                <S.PasswordRule
                  $touched={passwordTouched}
                  $valid={rules.length}
                >
                  {passwordTouched ? rules.length ? <FiCheck /> : <FiX /> : "•"}
                  <span>12 or more characters</span>
                </S.PasswordRule>
                <S.PasswordRule
                  $touched={passwordTouched}
                  $valid={rules.uppercase}
                >
                  {passwordTouched ? (
                    rules.uppercase ? (
                      <FiCheck />
                    ) : (
                      <FiX />
                    )
                  ) : (
                    "•"
                  )}
                  <span> A capital letter (A-Z)</span>
                </S.PasswordRule>
                <S.PasswordRule
                  $touched={passwordTouched}
                  $valid={rules.number}
                >
                  {passwordTouched ? rules.number ? <FiCheck /> : <FiX /> : "•"}
                  <span> A number</span>
                </S.PasswordRule>
                <S.PasswordRule
                  $touched={passwordTouched}
                  $valid={rules.specialChar}
                >
                  {passwordTouched ? (
                    rules.specialChar ? (
                      <FiCheck />
                    ) : (
                      <FiX />
                    )
                  ) : (
                    "•"
                  )}
                  <span>A special symbol</span>
                </S.PasswordRule>
              </ul>
            </S.passwordCheckBox>
          </S.inputFields>
          <S.signUpButton
            onClick={handleSignUp}
            disabled={!isPasswordValid || password !== confirmPassword}
          >
            Continue
          </S.signUpButton>
        </S.Container>
      </S.Main>
    </>
  );
}
