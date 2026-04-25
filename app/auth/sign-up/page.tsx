"use client";

import { SetStateAction, useEffect, useState } from "react";
import { FiCheck, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import supabase from "@/actions/supabase/client";
import {
  checkInviteStatus,
  completeInvitedSignUp,
} from "@/actions/supabase/queries/auth";
import {
  Button,
  Container,
  EmailAddressDiv,
  ErrorMessage,
  Heading2,
  Input,
  InputFields,
  InputLabel,
  InputWrapper,
  IntroText,
  Main,
  PasswordCheckBox,
  PasswordConfirmDiv,
  PasswordDiv,
  PasswordRule,
  PasswordText,
  VisibilityToggle,
  WelcomeTag,
} from "../styles";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const rules = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const isPasswordValid =
    rules.length && rules.uppercase && rules.number && rules.specialChar;
  const passwordsMatch = password === confirmPassword;

  useEffect(() => {
    console.log("[signup] mount");
    let mounted = true;
    let hasVerified = false;

    const verifyInvite = async (userEmail: string) => {
      if (hasVerified) return;
      hasVerified = true;

      console.log("[signup] verifyInvite called with", userEmail);
      const { status } = await checkInviteStatus(userEmail);
      console.log("[signup] invite status:", status);
      if (!mounted) return;

      if (status !== "pending") {
        setErrorMessage(
          "No pending invitation found. If you already signed up, please sign in instead.",
        );
        setVerifying(false);
        return;
      }

      setEmail(userEmail);
      setVerifying(false);
    };

    const processHashTokens = async () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash;

      if (!hash || !hash.includes("access_token")) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user?.email && mounted) {
          verifyInvite(session.user.email);
        }
        return;
      }

      await supabase.auth.signOut({ scope: "local" });

      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) return;

      console.log("[signup] found hash tokens, setting session");
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error("[signup] setSession error:", error);
        return;
      }

      console.log("[signup] session set, email:", data.session?.user?.email);
      window.history.replaceState(null, "", window.location.pathname);

      if (data.session?.user?.email && mounted) {
        verifyInvite(data.session.user.email);
      }
    };

    processHashTokens();

    const timeoutId = setTimeout(() => {
      console.log("[signup] timeout fired");
      if (mounted && !hasVerified) {
        setErrorMessage(
          "This page is only accessible through an invite link. Please check your email or ask your facilitator to resend the invite.",
        );
        setVerifying(false);
      }
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const handleSignUp = async () => {
    if (loading || !email) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      if (!passwordsMatch) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      if (!isPasswordValid) {
        setErrorMessage("Password does not meet the required criteria.");
        return;
      }

      const result = await completeInvitedSignUp(password);

      if (!result.success) {
        setErrorMessage(result.error || "Failed to complete sign-up");
        return;
      }

      router.push("/onboarding");
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <Main>
        <Container>
          <PasswordText>Verifying your invite...</PasswordText>
        </Container>
      </Main>
    );
  }

  if (!email) {
    return (
      <Main>
        <Container>
          <IntroText>
            <WelcomeTag>
              <Heading2>Invite required</Heading2>
            </WelcomeTag>
          </IntroText>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </Container>
      </Main>
    );
  }

  return (
    <Main>
      <Container>
        <IntroText>
          <WelcomeTag>
            <Heading2>Welcome!</Heading2>
          </WelcomeTag>
        </IntroText>
        <InputFields>
          <EmailAddressDiv>
            <InputWrapper>
              <InputLabel as="span">Email address</InputLabel>
              <Input as="div" style={{ paddingTop: "1.25rem", color: "#666" }}>
                {email}
              </Input>
            </InputWrapper>
          </EmailAddressDiv>
          <PasswordDiv>
            <InputWrapper>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={(e: {
                  target: { value: SetStateAction<string> };
                }) => {
                  setPassword(e.target.value);
                  setPasswordTouched(true);
                  setErrorMessage(null);
                }}
                value={password}
              />
              <VisibilityToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </VisibilityToggle>
            </InputWrapper>
          </PasswordDiv>
          <PasswordConfirmDiv>
            <InputWrapper>
              <InputLabel htmlFor="confirmPassword">
                Confirm password
              </InputLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e: {
                  target: { value: SetStateAction<string> };
                }) => {
                  setConfirmPassword(e.target.value);
                  setErrorMessage(null);
                }}
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
            </InputWrapper>
          </PasswordConfirmDiv>
          <PasswordCheckBox>
            <PasswordText>Your password must contain:</PasswordText>
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
                <span>A capital letter (A-Z)</span>
              </PasswordRule>
              <PasswordRule $touched={passwordTouched} $valid={rules.number}>
                {passwordTouched ? rules.number ? <FiCheck /> : <FiX /> : "•"}
                <span>A number</span>
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
          disabled={!isPasswordValid || !passwordsMatch || loading}
        >
          {loading ? "Setting up..." : "Continue"}
        </Button>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </Container>
    </Main>
  );
}
