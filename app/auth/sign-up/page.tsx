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
  SubText,
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

  // On mount: verify the invite session. Supabase auto-handles the token
  // from the URL when the user lands here from the invite email.
  useEffect(() => {
    const verifyInvite = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        setErrorMessage(
          "This page is only accessible through an invite link. Please check your email or ask your facilitator to resend the invite.",
        );
        setVerifying(false);
        return;
      }

      const { status } = await checkInviteStatus(user.email);
      if (status !== "pending") {
        setErrorMessage(
          "No pending invitation found. If you already signed up, please sign in instead.",
        );
        setVerifying(false);
        return;
      }

      setEmail(user.email);
      setVerifying(false);
    };

    verifyInvite();
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

      // Server action: reads the authenticated user from the session,
      // sets their password, creates profile, marks invite accepted.
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
          {/* ...password fields unchanged... */}
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
