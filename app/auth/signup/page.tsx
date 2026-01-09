"use client";

import { SetStateAction, useState } from "react";
import { FiCheck, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/actions/supabase/client";
import { checkIfUserExists, checkInvites } from "@/api/supabase/queries/auth";
import {
  addInviteInfoToProfile,
  markInviteAccepted,
} from "@/api/supabase/queries/profile";
import {
  Button,
  Container,
  EmailAddressDiv,
  ErrorMessage,
  Heading2,
  Input,
  InputFields,
  IntroText,
  Main,
  PasswordCheckBox,
  PasswordConfirmDiv,
  PasswordDiv,
  PasswordRule,
  SignInTag,
  VisibilityToggle,
  WelcomeTag,
} from "../styles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const rules = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid =
    rules.length && rules.uppercase && rules.number && rules.specialChar;

  const handleSignUp = async () => {
    try {
      if (await checkIfUserExists(email)) {
        throw new Error("You already have an account, please sign in.");
      }
      const inviteStatus = await checkInvites(email);
      switch (inviteStatus) {
        case "no_invite":
        case "cancelled":
          throw new Error("You do not have an invitation.");
        case "accepted":
          throw new Error("You already have an account, please sign in.");
        case "pending":
          break;
        case "error":
          throw new Error(
            "There was an error checking your invitation. Please try again.",
          );
        default:
          throw new Error("Unknown invitation status.");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });
      if (error) {
        throw new Error(
          "An error occurred during sign up: " +
            error.message +
            "with email" +
            data,
        );
      }
      const userId = data.user?.id;
      if (!userId) {
        throw new Error("Signup succeeded but user ID was missing.");
      }
      await markInviteAccepted(email);
      await addInviteInfoToProfile(userId, email);
      router.push("/onboarding");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <Main>
      <Container>
        <IntroText>
          <WelcomeTag>
            <Heading2> Welcome! </Heading2>
          </WelcomeTag>
          <SignInTag>
            {" "}
            Already have an account?{" "}
            <Link href="/auth/sign-in"> Sign in. </Link>
          </SignInTag>
        </IntroText>
        <InputFields>
          <EmailAddressDiv>
            <Input
              name="email"
              placeholder="Email Address"
              onChange={(e: { target: { value: SetStateAction<string> } }) => {
                setEmail(e.target.value);
                setErrorMessage(null);
              }}
              value={email}
            />{" "}
          </EmailAddressDiv>
          <PasswordDiv>
            <div style={{ position: "relative", width: "100%" }}>
              <Input
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                onChange={(e: {
                  target: { value: SetStateAction<string> };
                }) => (setPassword(e.target.value), setPasswordTouched(true))}
                value={password}
              />{" "}
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
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Password Confirmation"
                value={confirmPassword}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setConfirmPassword(e.target.value)
                }
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
              <PasswordRule $touched={passwordTouched} $valid={rules.uppercase}>
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
          onClick={handleSignUp}
          disabled={!isPasswordValid || password !== confirmPassword}
        >
          Continue
        </Button>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </Container>
    </Main>
  );
}
