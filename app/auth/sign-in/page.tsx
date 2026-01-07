"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkProfileExists } from "@/api/supabase/queries/profile";
import { useSession } from "@/utils/AuthProvider";
import {
  Button,
  Container,
  EmailAddressDiv,
  ErrorMessage,
  ForgetPasswordTag,
  Heading2,
  Input,
  InputFields,
  IntroText,
  Main,
  PasswordDiv,
  VisibilityToggle,
  WelcomeTag,
} from "../styles";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const sessionHandler = useSession();
  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signInWithEmail = async () => {
    try {
      const { data, error } = await sessionHandler.signInWithEmail(
        email,
        password,
      );
      if (error) {
        throw new Error("Incorrect email or password. Please try again.");
      }

      if (!data.user) {
        throw new Error("User not found after sign in");
      }

      if (await checkProfileExists(data.user.id)) {
        router.push("/onboarding");
      } else {
        router.push("/test-page");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <Main>
        <Container>
          <IntroText>
            <WelcomeTag>
              <Heading2>Welcome back!</Heading2>
            </WelcomeTag>
          </IntroText>
          <InputFields>
            <EmailAddressDiv>
              <Input
                name="email"
                placeholder="Email Address"
                onChange={e => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                value={email}
              />
            </EmailAddressDiv>
            <PasswordDiv>
              <div style={{ position: "relative", width: "100%" }}>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                  placeholder="Password"
                />{" "}
                <VisibilityToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                </VisibilityToggle>
              </div>
            </PasswordDiv>
            <ForgetPasswordTag>
              <Link href="/auth/reset-password"> Forget password? </Link>
            </ForgetPasswordTag>
          </InputFields>
          <Button
            type="button"
            onClick={signInWithEmail}
            disabled={!isEmailValid(email)}
          >
            {" "}
            Sign in{" "}
          </Button>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </Container>
      </Main>
    </>
  );
}
