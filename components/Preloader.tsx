"use client";

import { useEffect, useState } from "react";

type PreLoaderProps = {
  duration?: number;
};

export default function PreLoader({ duration = 3500 }: PreLoaderProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), duration);
    const removeTimer = setTimeout(() => setRemoved(true), duration + 600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [duration]);

  if (removed) return null;

  return (
    <div
      style={{ backgroundColor: "#f0e8dc" }}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/loogo1.png"
        alt="Izha Blooms"
        className="logo-anim h-60 w-60 max-w-[85vw] object-contain sm:h-80 sm:w-80 md:h-96 md:w-96"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle, black 55%, transparent 72%)",
          maskImage: "radial-gradient(circle, black 55%, transparent 72%)",
        }}
      />

      <style>{`
        .logo-anim {
          animation: logoIn 1s ease-out forwards, logoPulse 2s ease-in-out 1s infinite;
        }
        @keyframes logoIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}</style>
    </div>
  );
}