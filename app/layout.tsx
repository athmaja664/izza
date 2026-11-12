import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import StorefrontFrame from "@/components/StorefrontFrame";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Izha Blooms | Where Every Thread Blooms",
  description:
    "Handcrafted embroidered kurtas, dresses and contemporary ethnic wear from Izha Blooms.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} overflow-x-clip antialiased`}
      >
        <StorefrontFrame>{children}</StorefrontFrame>
      </body>
    </html>
  );
}