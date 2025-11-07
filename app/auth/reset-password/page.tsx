"use client";

import { useState } from "react";
import { FiCheck, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import supabase from "@/actions/supabase/client";
import {
  Button,
  Container,
  Heading2,
  Input,
  InputFields,
  IntroText,
  Main,
  PasswordCheckBox,
  PasswordConfirmDiv,
  PasswordDiv,
  PasswordRule,
  VisibilityToggle,
  WelcomeTag,
} from "../styles";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const rules = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid =
    rules.length && rules.uppercase && rules.number && rules.specialChar;

  const handleUpdateUser = async () => {
    if (!isPasswordValid) {
      throw new Error("Password does not meet the required criteria");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const { error } = await supabase.auth.updateUser({
      password: password,
    });
    if (error) {
      alert("An error occurred: " + error.message);
      return;
    }
    alert("Password successfully updated!");
  };

  return (
    <>
      <Main>
        <Container>
          <IntroText>
            <WelcomeTag>
              {" "}
              <Heading2> Reset Password </Heading2>
            </WelcomeTag>
          </IntroText>
          <InputFields>
            <PasswordDiv>
              <div style={{ position: "relative", width: "100%" }}>
                <Input
                  name="password"
                  placeholder="New Password"
                  onChange={e => (
                    setPassword(e.target.value),
                    setPasswordTouched(true)
                  )}
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <VisibilityToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                </VisibilityToggle>
              </div>
            </PasswordDiv>
            <PasswordConfirmDiv>
              <div style={{ position: "relative", width: "100%" }}>
                <Input
                  name="confirmPassword"
                  placeholder="Password Confirmation"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                />
                <VisibilityToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEye size={18} />
                  ) : (
                    <FiEyeOff size={18} />
                  )}
                </VisibilityToggle>
              </div>
            </PasswordConfirmDiv>
            <PasswordCheckBox>
              Your password must contain:
              <ul>
                <PasswordRule $touched={passwordTouched} $valid={rules.length}>
                  {passwordTouched ? rules.length ? <FiCheck /> : <FiX /> : "•"}
                  <span>12 or more characters</span>
                </PasswordRule>
                <PasswordRule
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
                </PasswordRule>
                <PasswordRule $touched={passwordTouched} $valid={rules.number}>
                  {passwordTouched ? rules.number ? <FiCheck /> : <FiX /> : "•"}
                  <span> A number</span>
                </PasswordRule>
                <PasswordRule
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
                </PasswordRule>
              </ul>
            </PasswordCheckBox>
          </InputFields>
          <Button
            onClick={handleUpdateUser}
            disabled={!isPasswordValid || password !== confirmPassword}
          >
            Continue
          </Button>
        </Container>
      </Main>
    </>
  );
}
