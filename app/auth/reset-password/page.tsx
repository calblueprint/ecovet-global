"use client";

import { useState } from "react";
import { FiCheck, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import supabase from "@/actions/supabase/client";
import * as Styled from "./styledComponents";

export default function ResetPassword() {
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

  const handleUpdateUser = async () => {
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
          <Styled.IntroText>
            <Styled.WelcomeTag>
              {" "}
              <h2> Reset Password </h2>
            </Styled.WelcomeTag>
          </Styled.IntroText>
          <Styled.InputFields>
            <Styled.PasswordDiv>
              <div style={{ position: "relative", width: "100%" }}>
                <Styled.Input
                  name="password"
                  placeholder="New Password"
                  onChange={e => (
                    setPassword(e.target.value),
                    setPasswordTouched(true)
                  )}
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <Styled.VisibilityToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </Styled.VisibilityToggle>
              </div>
            </Styled.PasswordDiv>
            <Styled.PasswordConfirmDiv>
              <div style={{ position: "relative", width: "100%" }}>
                <Styled.Input
                  placeholder="Password Confirmation"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  type={showPassword ? "text" : "confirmPassword"}
                />
                <Styled.VisibilityToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </Styled.VisibilityToggle>
              </div>
            </Styled.PasswordConfirmDiv>
            <Styled.PasswordCheckBox>
              Your password must contain:
              <ul>
                <Styled.PasswordRule
                  $touched={passwordTouched}
                  $valid={rules.length}
                >
                  {passwordTouched ? rules.length ? <FiCheck /> : <FiX /> : "•"}
                  <span>12 or more characters</span>
                </Styled.PasswordRule>
                <Styled.PasswordRule
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
                </Styled.PasswordRule>
                <Styled.PasswordRule
                  $touched={passwordTouched}
                  $valid={rules.number}
                >
                  {passwordTouched ? rules.number ? <FiCheck /> : <FiX /> : "•"}
                  <span> A number</span>
                </Styled.PasswordRule>
                <Styled.PasswordRule
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
                </Styled.PasswordRule>
              </ul>
            </Styled.PasswordCheckBox>
          </Styled.InputFields>
          <Styled.SignUpButton
            onClick={handleUpdateUser}
            disabled={!isPasswordValid || password !== confirmPassword}
          >
            Continue
          </Styled.SignUpButton>
        </Styled.Container>
      </Styled.Main>
    </>
  );
}
