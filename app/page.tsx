"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Carousel from "react-material-ui-carousel";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  checkProfileExists,
  fetchProfileByUserId,
  fetchSessionById,
} from "@/actions/supabase/queries/profile";
import ChildVaccination from "@/app/public/images/ChildVaccination.png";
import Seal from "@/app/public/images/Seal.png";
import WildfireResponse from "@/app/public/images/WildfireResponse.png";
import { useSession } from "@/utils/AuthProvider";
import { getHomePath } from "@/utils/HomePage";
import {
  BrandingText,
  CarouselImage,
  CarouselWrapper,
  ErrorMsg,
  FieldsetInput,
  ForgotPassword,
  FormContainer,
  FormFields,
  Heading,
  LeftPanel,
  LogoText,
  PageWrapper,
  RightPanel,
  SignInButton,
  SmallBrandingText,
  StyledInput,
  TextArea,
  ToggleButton,
} from "./styles";

const carouselImages = [
  { src: Seal.src, alt: "Ecovet team in the field" },
  { src: ChildVaccination.src, alt: "Veterinary care in action" },
  { src: WildfireResponse.src, alt: "Global impact" },
];

export default function SignIn() {
  const searchParams = useSearchParams();
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

      const userId = data.user.id;
      if (!userId) return;

      const profile = await fetchProfileByUserId(userId);

      const hasProfile = profile !== null;
      if (searchParams.get("fromNudge") == "true") {
        const session_id = searchParams.get("sessionId");
        router.push(
          "/participants/scenario-overview/" + session_id + "/" + data.user.id,
        );
      } else {
        router.push(hasProfile ? getHomePath(profile) : "/onboarding");
      }
      router.refresh();
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
        <TextArea>
          <BrandingText>
            STARTx prepares teams to respond effectively when coordination
            matters most.
          </BrandingText>
          <SmallBrandingText>
            Through immersive simulations of real-world emergencies, from
            outbreaks to environmental disasters, it strengthens cross-sector
            coordination, sharpens decision-making, and turns after-action
            insights into stronger, more resilient response systems.
          </SmallBrandingText>
        </TextArea>

        <CarouselWrapper>
          <Carousel
            autoPlay
            interval={5000}
            animation="slide"
            duration={500}
            indicators
            navButtonsAlwaysInvisible
            stopAutoPlayOnHover
          >
            {carouselImages.map((img, i) => (
              <CarouselImage key={i}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </CarouselImage>
            ))}
          </Carousel>
        </CarouselWrapper>
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
                <Link href="/auth/sign-up">Sign Up</Link>
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
