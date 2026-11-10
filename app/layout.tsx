import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PreLoader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Izha Blooms | Where Every Thread Blooms",
  description:
    "Handcrafted embroidered kurtas and festive wear from Izha Blooms.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden antialiased`}
      >
        <PreLoader />
        <Navbar cartCount={0} wishlistCount={0} />
        {children}
        <Footer />
      </body>
    </html>
  );
}