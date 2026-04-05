"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkProfileExists } from "@/actions/supabase/queries/profile";
import { useSession } from "@/utils/AuthProvider";
import {
  AdminLink,
  BrandingText,
  ErrorMsg,
  FieldsetInput,
  FloatingLabel,
  ForgotPassword,
  FormContainer,
  FormFields,
  Heading,
  LeftPanel,
  Legend,
  LogoText,
  PageWrapper,
  RightPanel,
  SignInButton,
  StyledInput,
  SubText,
  ToggleButton,
} from "./styles";

export default function SignIn() {
  const router = useRouter();
  const { signInWithEmail } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await signInWithEmail(email, password);

      if (error) {
        setErrorMessage("Incorrect email or password. Please try again.");
        return;
      }

      if (!data.user) {
        setErrorMessage("Sign in failed. Please try again.");
        return;
      }

      const hasProfile = await checkProfileExists(data.user.id);
      router.push(hasProfile ? "/test-page" : "/onboarding");
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <LeftPanel>
        <LogoText>ECOVET GLOBAL</LogoText>
        <BrandingText>
          I wanna write some text over here about Ecovet and StartX.
        </BrandingText>
      </LeftPanel>
      <RightPanel>
        <FormContainer>
          <Heading>Welcome Back!</Heading>
          <FormFields>
            <FieldsetInput>
              <StyledInput
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={e => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                value={email}
              />
            </FieldsetInput>
            <div>
              <FieldsetInput>
                <StyledInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                />
                <ToggleButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                </ToggleButton>
              </FieldsetInput>
              <ForgotPassword>
                <Link href="/auth/reset-password">Forgot password?</Link>
              </ForgotPassword>
            </div>
          </FormFields>
          <SignInButton
            type="button"
            onClick={handleSignIn}
            disabled={!isEmailValid || !password || loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </SignInButton>
          {errorMessage && <ErrorMsg>{errorMessage}</ErrorMsg>}
        </FormContainer>
      </RightPanel>
    </PageWrapper>
  );
}
