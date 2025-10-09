import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: [
    {
      path: "./Inter/static/Inter_24pt-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Inter/static/Inter_24pt-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Inter/static/Inter_24pt-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Inter/static/Inter_24pt-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

const syne = localFont({
  src: [
    {
      path: "./Syne/static/Syne-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Syne/static/Syne-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Syne/static/Syne-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Syne/static/Syne-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Syne/static/Syne-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mean Crypto Fortune Cookie",
  description: "Get roasted by the crypto gods with your personalized fortune cookie",
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${syne.variable} font-sans`}>
        <div className="min-h-screen bg-black">
          {children}
        </div>
      </body>
    </html>
  );
}
