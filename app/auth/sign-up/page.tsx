"use client";

import { SetStateAction, useEffect, useState } from "react";
import { FiCheck, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import supabase from "@/actions/supabase/client";
import {
  addInviteInfoToProfile,
  checkInviteStatus,
  markInviteAccepted,
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
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const rules = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid =
    rules.length && rules.uppercase && rules.number && rules.specialChar;
  const passwordsMatch = password === confirmPassword;

  // pre-fill email if coming from email
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email) {
        const { status } = await checkInviteStatus(session.user.email);
        if (status === "pending") {
          setEmail(session.user.email);
          setEmailVerified(true);
        }
      }
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        checkInviteStatus(user.email).then(({ status }) => {
          if (status === "pending") {
            setEmail(user.email!);
            setEmailVerified(true);
          }
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCheckEmail = async () => {
    if (checkingEmail || !email) return;
    setCheckingEmail(true);
    setErrorMessage(null);

    try {
      const { status } = await checkInviteStatus(email);

      if (status === "pending") {
        setEmailVerified(true);
      } else if (status === "no_pending_invite") {
        setErrorMessage(
          "No pending invitation found for this email. Please check the address or contact your admin.",
        );
      } else {
        setErrorMessage(
          "There was an error verifying your invitation. Please try again.",
        );
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSignUp = async () => {
    if (loading || !email || !emailVerified) return;
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

      const {
        data: { user: existingUser },
      } = await supabase.auth.getUser();

      if (existingUser) {
        setErrorMessage(
          "An account already exists for this email. Please sign in instead.",
        );
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMessage("Error creating account: " + error.message);
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        setErrorMessage("Something went wrong. Please try again.");
        return;
      }

      await addInviteInfoToProfile(userId, email);
      await markInviteAccepted(email);
      router.push("/onboarding");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!emailVerified) {
    return (
      <Main>
        <Container>
          <IntroText>
            <WelcomeTag>
              <Heading2>Welcome!</Heading2>
            </WelcomeTag>
            <PasswordText>
              Please enter the email that your facilitator used to invite you.
            </PasswordText>
          </IntroText>
          <InputFields>
            <EmailAddressDiv>
              <InputWrapper>
                <InputLabel htmlFor="email">Email address</InputLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e: {
                    target: { value: SetStateAction<string> };
                  }) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  onKeyDown={(e: { key: string }) => {
                    if (e.key === "Enter") handleCheckEmail();
                  }}
                />
              </InputWrapper>
            </EmailAddressDiv>
          </InputFields>
          <Button onClick={handleCheckEmail} disabled={!email || checkingEmail}>
            {checkingEmail ? "Checking..." : "Continue"}
          </Button>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </Container>
      </Main>
    );
  }

  // only shows if the email is in the invite list
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
