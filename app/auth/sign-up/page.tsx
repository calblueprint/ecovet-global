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
  VisibilityToggle,
  WelcomeTag,
} from "../styles";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const rules = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid =
    rules.length && rules.uppercase && rules.number && rules.specialChar;
  const passwordsMatch = password === confirmPassword;

  // Get the current user's email from the active session (set by magic link)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email) {
        const { status } = await checkInviteStatus(session.user.email);

        if (status === "pending") {
          setEmail(session.user.email);
        } else if (status === "no_pending_invite") {
          setErrorMessage(
            "No pending invitation found. You may have already set up your account.",
          );
        } else {
          setErrorMessage(
            "There was an error verifying your invitation. Please try again.",
          );
        }
        setPageLoading(false);
      }
    });

    //if they reload
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        checkInviteStatus(user.email).then(({ status }) => {
          if (status === "pending") {
            setEmail(user.email!);
          } else if (status === "no_pending_invite") {
            setErrorMessage(
              "No pending invitation found. You may have already set up your account.",
            );
          } else {
            setErrorMessage(
              "There was an error verifying your invitation. Please try again.",
            );
          }
          setPageLoading(false);
        });
      }
    });

    return () => subscription.unsubscribe();
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

      // Set the password on the existing user (session is active from magic link)
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMessage("Error setting password: " + error.message);
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        setErrorMessage("Something went wrong. Please try again.");
        return;
      }

      // Mark invite as accepted and create profile
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

  if (pageLoading) {
    return (
      <Main>
        <Container>
          <IntroText>
            <WelcomeTag>
              <Heading2>Loading...</Heading2>
            </WelcomeTag>
          </IntroText>
        </Container>
      </Main>
    );
  }

  // If no valid session/invite, show error state
  if (!email) {
    return (
      <Main>
        <Container>
          <IntroText>
            <WelcomeTag>
              <Heading2>Welcome!</Heading2>
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
