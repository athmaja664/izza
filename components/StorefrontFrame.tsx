"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import PreLoader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function StorefrontFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <PreLoader />
      <Navbar />
      {children}
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

