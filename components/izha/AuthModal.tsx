"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X } from "lucide-react";
import { KEYS, type AppUser } from "@/lib/izha-store";
import AlertBox from "@/components/izha/AlertBox";
import { Flower, focusRing, inputCls, serif } from "@/components/izha/ui";

const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const AUTH_IMAGE: string = "/images/inst4.jpg";

const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);
const isPhone = (v: string) => /^[6-9]\d{9}$/.test(v);

export type AuthModalProps = {
  initialMode?: "signin" | "register";
  onDone: (u: AppUser) => void;
  onClose: () => void;
};

function AuthField({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  const actualType = isPw ? (show ? "text" : "password") : type;

  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">
        {label}
      </span>
      <span className="relative block">
        <input
          type={actualType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className={`${inputCls} ${isPw ? "pr-10" : ""}`}
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className={`absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#6f6565] ${focusRing}`}
          >
            {show ? (
              <EyeOff size={18} strokeWidth={1.6} />
            ) : (
              <Eye size={18} strokeWidth={1.6} />
            )}
          </button>
        )}
      </span>
    </label>
  );
}

export default function AuthModal({
  initialMode = "signin",
  onDone,
  onClose,
}: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register">(initialMode);
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (v: string) =>
    setF((s) => ({ ...s, [k]: v }));
  const register = mode === "register";

  /* Modal behaviour: Esc to close + lock page scroll while open */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const finishAuth = (u: AppUser) => {
    onDone(u);
    if (u.role === "admin") {
      router.push("/admin");
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) router.push(next);
  };

  const validatePasswordForm = () => {
    if (register) {
      if (f.name.trim().length < 2)
        return "Enter your full name so we can address you properly.";
      if (!isEmail(f.email.trim()))
        return "Enter a valid email address, for example name@example.com.";
      if (!isPhone(f.phone))
        return "Enter a 10 digit mobile number that starts with 6, 7, 8 or 9.";
    } else if (!isEmail(f.identifier.trim()) && !isPhone(f.identifier.trim())) {
      return "Enter the email address or 10 digit mobile number you registered with.";
    }
    if (f.password.length < 6)
      return "Use a password with at least 6 characters.";
    return "";
  };

  const submitPasswordForm = async () => {
    const problem = validatePasswordForm();
    if (problem) return setError(problem);
    setError("");
    setBusy(true);
    try {
      let u: AppUser;
      if (API) {
        const res = await fetch(`${API}/auth/${register ? "register" : "login"}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            register
              ? {
                  name: f.name.trim(),
                  email: f.email.trim(),
                  phone: f.phone,
                  password: f.password,
                }
              : { identifier: f.identifier.trim(), password: f.password }
          ),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok)
          throw new Error(
            data?.message ||
              (register
                ? "This email or mobile number is already registered. Sign in instead."
                : "Email, mobile number or password is incorrect. Check them and try again.")
          );
        if (data?.token) {
          try {
            localStorage.setItem(KEYS.token, data.token);
          } catch {
            /* ignore */
          }
        }
        const du = data?.user ?? {};
        u = {
          name: du.name || f.name.trim() || "Customer",
          email: du.email || f.email.trim(),
          phone: du.phone || f.phone,
          role: du.role === "admin" ? "admin" : "customer",
        };
      } else {
        await new Promise((r) => setTimeout(r, 350));
        const id = f.identifier.trim();
        u = {
          name: register
            ? f.name.trim()
            : isEmail(id)
            ? id.split("@")[0]
            : "Customer",
          email: register ? f.email.trim() : isEmail(id) ? id : "",
          phone: register ? f.phone : isPhone(id) ? id : "",
          role: "customer",
        };
      }
      finishAuth(u);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not reach the server. Check your internet connection and try again."
      );
    } finally {
      setBusy(false);
    }
  };

  const onPhoto = AUTH_IMAGE !== "";
  const perks = [
    "Be the first to discover new collections.",
    "Enjoy exclusive member offers.",
    "Save your favourite styles.",
    "Experience a smoother checkout.",
  ];

  return (
    /* Backdrop: click outside the box to close */
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain bg-[#382B2B]/60 p-3 backdrop-blur-sm sm:p-4 md:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={register ? "Create your account" : "Sign in"}
        className="relative my-3 grid w-full max-w-[960px] overflow-hidden rounded-[24px] border-2 border-[#E8B8C5] bg-white shadow-2xl ring-2 ring-inset ring-white sm:my-4 md:rounded-[28px] md:grid-cols-2"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 text-[#332B2B] shadow-sm transition-colors hover:text-[#B20947] ${focusRing}`}
        >
          <X size={20} strokeWidth={1.8} />
        </button>

        {/* Left panel: IZHA Circle */}
        <div className="relative isolate flex min-h-[270px] flex-col justify-between gap-6 overflow-hidden bg-gradient-to-b from-[#F9DDE2] via-[#F2BFC7] to-[#E99A9F]/80 p-6 sm:min-h-[300px] sm:p-8 md:min-h-[580px] md:p-10">
          {onPhoto && (
            <>
              <Image
                src={AUTH_IMAGE}
                alt="IZHA BLOOMS collection"
                fill
                sizes="(min-width: 768px) 480px, 100vw"
                quality={85}
                priority
                className="-z-10 object-cover"
              />
              <span className="absolute inset-0 -z-10 bg-[#382B2B]/40" />
            </>
          )}
          {!onPhoto && (
            <>
              <span className="pointer-events-none absolute -left-10 top-24 h-56 w-56 rounded-full bg-white/50 blur-3xl" />
              <Flower
                size={220}
                stroke={0.7}
                className="pointer-events-none absolute -bottom-12 -right-10 text-white/60"
              />
            </>
          )}
          <div className="relative pr-10 md:pr-0">
            <h2
              className={`${serif} text-[32px] font-medium leading-[1.08] sm:text-[38px] md:text-[44px] ${
                onPhoto ? "text-white" : "text-[#332B2B]"
              }`}
            >
              Be part of the
              <br />
              IZHA Circle!
            </h2>
            <p
              className={`${serif} mt-2 text-[17px] italic sm:text-[19px] ${
                onPhoto ? "text-white/90" : "text-[#6f6565]"
              }`}
            >
              A little more love, a little more privilege.
            </p>
          </div>
          <ul className="relative space-y-2 md:space-y-2.5">
            {perks.map((t) => (
              <li
                key={t}
                className={`rounded-2xl border border-white/40 bg-white/25 px-4 py-2.5 text-[13px] backdrop-blur-md md:py-3 md:text-[14px] ${
                  onPhoto ? "text-white" : "text-[#332B2B]"
                }`}
              >
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Right panel: form */}
        <div className="flex flex-col justify-center px-6 py-8 sm:px-10 md:py-10">
          <div className="text-center">
            <p
              className={`${serif} text-[28px] font-semibold tracking-[0.12em] text-[#332B2B]`}
            >
              IZHA BLOOMS
            </p>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.28em] text-[#B20947]">
              Where Every Thread Blooms
            </p>
            <h1
              className={`${serif} mt-5 text-[32px] font-medium leading-tight text-[#332B2B]`}
            >
              {register ? "Create your account" : "Sign in"}
            </h1>
            <span className="mx-auto mt-2 block h-[2px] w-14 bg-[#E8B8C5]" />
            <p className="mt-3 text-[14px] text-[#6f6565]">
              {register
                ? "Join the IZHA Circle for early access & member rewards."
                : "Enter your email or mobile number & password to continue."}
            </p>
          </div>

          {error && (
            <div className="mt-4">
              <AlertBox variant="error" message={error} />
            </div>
          )}

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              submitPasswordForm();
            }}
            className="mt-5 space-y-4"
          >
            {register ? (
              <>
                <AuthField
                  label="Full name"
                  value={f.name}
                  onChange={set("name")}
                  autoComplete="name"
                />
                <AuthField
                  label="Email"
                  type="email"
                  value={f.email}
                  onChange={set("email")}
                  autoComplete="email"
                />
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">
                    Mobile number
                  </span>
                  <span className="flex">
                    <span className="flex items-center rounded-l-[10px] border border-r-0 border-[#E8B8C5] bg-[#FFF5F7] px-3 text-[14px] text-[#6f6565]">
                      +91
                    </span>
                    <input
                      className={`${inputCls} !rounded-l-none`}
                      value={f.phone}
                      inputMode="tel"
                      maxLength={10}
                      autoComplete="tel-national"
                      placeholder="10 digit number"
                      onChange={(e) =>
                        set("phone")(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </span>
                </label>
              </>
            ) : (
              <AuthField
                label="Email or mobile number"
                value={f.identifier}
                onChange={set("identifier")}
                autoComplete="username"
              />
            )}
            <AuthField
              label="Password"
              type="password"
              value={f.password}
              onChange={set("password")}
              autoComplete={register ? "new-password" : "current-password"}
            />
            <button
              type="submit"
              disabled={busy}
              className={`w-full rounded-[10px] border-[1.5px] border-[#E99A9F] bg-white px-3 py-3 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#B20947] transition-colors hover:bg-[#FFF5F7] disabled:cursor-not-allowed disabled:border-[#d9cfd2] disabled:text-[#b3a9ab] sm:py-3.5 sm:text-sm ${focusRing}`}
            >
              {busy ? "Please wait" : register ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="mt-5 text-center text-[14px] text-[#6f6565]">
            {register ? "Already have an account?" : "New to IZHA BLOOMS?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(register ? "signin" : "register");
                setError("");
              }}
              className={`rounded font-medium text-[#B20947] underline underline-offset-4 ${focusRing}`}
            >
              {register ? "Sign in" : "Create an account"}
            </button>
          </p>

          <div className="mt-3 text-center">
            <Link
              href="/checkout"
              onClick={onClose}
              className="text-[13px] font-medium text-[#332B2B] underline underline-offset-4 hover:text-[#B20947]"
            >
              Continue to Checkout as Guest
            </Link>
          </div>

          <p className="mt-4 text-center text-[12px] text-[#6f6565]">
            By continuing, you agree to our{" "}
            <Link
              href="/privacy-policy"
              className="underline underline-offset-2"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline underline-offset-2">
              Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

