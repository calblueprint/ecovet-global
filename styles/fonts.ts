import localFont from "next/font/local";

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
fonts: "use client";

const Sans = localFont({
  src: [
    {
      path: "../public/fonts/Public_Sans/PublicSans-Black.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Public_Sans/PublicSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Public_Sans/PublicSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Public_Sans/PublicSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Public_Sans/PublicSans-ExtraBold.ttf",
      weight: "400",
      style: "italic",
    },
  ],
});

export { Sans };
