import type { Metadata } from "next";
import { Inter, Public_Sans } from "next/font/google";
import StyledComponentsRegistry from "@/lib/registry";
import "@/styles/global.css";
import { Suspense } from "react";
import { ProfileProvider } from "@/utils/ProfileProvider";
import { AuthContextProvider } from "../utils/AuthProvider";

// font definitions
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// site metadata - what shows up on embeds
export const metadata: Metadata = {
  title: "Project Name",
  description: "Description of project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sans.className}>
        <AuthContextProvider>
          <ProfileProvider>
            <StyledComponentsRegistry>
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </StyledComponentsRegistry>
          </ProfileProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
