import { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import BPLogo from "@/assets/images/bp-logo.png";

export default function Home() {
  return (
    <main style={mainStyles}>
      <Image style={imageStyles} src={BPLogo} alt="Blueprint Logo" />
      <p>Open up app/page.tsx to get started!</p>
      <Link href="/auth/login">
        <button>Log In</button>
      </Link>
      <Link href="/onboarding">
        <button>Onboarding</button>
      </Link>
    </main>
  );
}

// CSS styles

const mainStyles: CSSProperties = {
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const imageStyles: CSSProperties = {
  width: "80px",
  height: "80px",
  marginBottom: "0.5rem",
};
