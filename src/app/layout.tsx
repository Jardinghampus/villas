import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DubaiVille | AI-Powered Dubai Real Estate Matchmaking",
  description:
    "Find your perfect villa in Dubai with AI-driven matchmaking. Personalized property recommendations based on your affordability and preferences.",
  keywords: [
    "Dubai real estate",
    "Dubai villas",
    "property matchmaking",
    "AI real estate",
    "Dubai luxury homes",
    "Arabian Ranches",
    "Dubai Hills",
    "Palm Jumeirah",
  ],
  authors: [{ name: "DubaiVille" }],
  openGraph: {
    title: "DubaiVille | Find Your Perfect Dubai Villa",
    description:
      "AI-powered real estate matchmaking for Dubai's luxury villa market",
    type: "website",
    locale: "en_AE",
    siteName: "DubaiVille",
  },
  twitter: {
    card: "summary_large_image",
    title: "DubaiVille | AI Real Estate Matchmaking",
    description:
      "Find your perfect villa in Dubai with AI-driven matchmaking",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
