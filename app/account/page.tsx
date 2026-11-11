"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Heart,
  MessageCircle,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import {
  KEYS,
  useStored,
  type Address,
  type AppUser,
  type CartItem,
  type WishItem,
} from "@/lib/izha-store";
import {
  Flower,
  FlowerBadge,
  PageHero,
  PageShell,
  card,
  focusRing,
  glassBtn,
  inputCls,
  outlineBtn,
  serif,
  solidBtn,
} from "@/components/izha/ui";

const API = process.env.NEXT_PUBLIC_API_URL;

/* ---------- Labelled field (with eye toggle for passwords) ---------- */
function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "numeric" | "tel" | "email" | "text";
  maxLength?: number;
}) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">
        {label}
      </span>
      <span className="relative block">
        <input
          className={`${inputCls} ${isPw ? "pr-12" : ""}`}
          type={isPw && show ? "text" : type}
          value={value}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className={`absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#6f6565] ${focusRing}`}
          >
            {show ? <EyeOff size={18} strokeWidth={1.6} /> : <Eye size={18} strokeWidth={1.6} />}
          </button>
        )}
      </span>
    </label>
  );
}

function ErrorBox({ text }: { text: string }) {
  return (
    <div
      role="alert"
      className="rounded-[10px] bg-[#F9E3E9] px-4 py-3 text-[14px] text-[#B20947]"
    >
      {text}
    </div>
  );
}

/* =====================================================================
   Page
   ===================================================================== */
export default function AccountPage() {
  const router = useRouter();
  const [user, setUser, ready] = useStored<AppUser | null>(KEYS.user, null);

  const signOut = () => {
    try {
      localStorage.removeItem(KEYS.token);
    } catch {
      /* ignore */
    }
    setUser(null);
  };

  // Closing the modal returns the visitor to where they came from
  const closeModal = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push("/");
  };

  if (!ready) return <PageShell>{null}</PageShell>;

  return (
    <PageShell>
      {user ? (
        <SignedIn user={user} setUser={setUser} onSignOut={signOut} />
      ) : (
        <SignedOut onDone={setUser} onClose={closeModal} />
      )}
    </PageShell>
  );
}

/* =====================================================================
   Signed out: sign in / register MODAL
   ===================================================================== */

/** Optional portrait photo for the left panel, e.g. "/images/account-banner.jpg" */
const AUTH_IMAGE = "/images/inst4.jpg";

const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);
const isPhone = (v: string) => /^[6-9]\d{9}$/.test(v);

function SignedOut({
  onDone,
  onClose,
}: {
  onDone: (u: AppUser) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [f, setF] = useState({ name: "", email: "", phone: "", identifier: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));
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

  const validate = () => {
    if (register) {
      if (f.name.trim().length < 2) return "Enter your full name so we can address you properly.";
      if (!isEmail(f.email.trim())) return "Enter a valid email address, for example name@example.com.";
      if (!isPhone(f.phone)) return "Enter a 10 digit mobile number that starts with 6, 7, 8 or 9.";
    } else if (!isEmail(f.identifier.trim()) && !isPhone(f.identifier.trim())) {
      return "Enter the email address or 10 digit mobile number you registered with.";
    }
    if (f.password.length < 6) return "Use a password with at least 6 characters.";
    return "";
  };

  const submit = async () => {
    const problem = validate();
    if (problem) return setError(problem);
    setError("");
    setBusy(true);
    try {
      let u: AppUser;
      if (API) {
        // Same login for admin and customers. Register is for customers only.
        const res = await fetch(`${API}/auth/${register ? "register" : "login"}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            register
              ? { name: f.name.trim(), email: f.email.trim(), phone: f.phone, password: f.password }
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
        /* Demo mode: no backend. Everyone is a customer and no password is stored. */
        await new Promise((r) => setTimeout(r, 400));
        const id = f.identifier.trim();
        u = {
          name: register ? f.name.trim() : isEmail(id) ? id.split("@")[0] : "Customer",
          email: register ? f.email.trim() : isEmail(id) ? id : "",
          phone: register ? f.phone : isPhone(id) ? id : "",
          role: "customer",
        };
      }
      onDone(u);
      if (u.role === "admin") {
        router.push("/admin");
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      if (next && next.startsWith("/") && !next.startsWith("//")) router.push(next);
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
  const perks = ["Save your favourites", "Quick checkout with saved addresses"];

  return (
    /* Backdrop: click outside the box to close */
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#382B2B]/60 p-3 backdrop-blur-sm sm:p-4 md:items-center"
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

        {/* Left panel: banner on top for mobile, left column on laptop */}
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
              <span className="absolute inset-0 -z-10 bg-[#382B2B]/35" />
            </>
          )}
          {!onPhoto && (
            <>
              <span className="pointer-events-none absolute -left-10 top-24 h-56 w-56 rounded-full bg-white/50 blur-3xl" />
              <Flower size={220} stroke={0.7} className="pointer-events-none absolute -bottom-12 -right-10 text-white/60" />
            </>
          )}
          <h2 className={`${serif} relative pr-10 text-[32px] font-medium leading-[1.05] sm:text-[38px] md:pr-0 md:text-[46px] ${onPhoto ? "text-white" : "text-[#332B2B]"}`}>
            Be part of the
            <br />
            IZHA Circle!
          </h2>
          <ul className="relative space-y-2 md:space-y-2.5">
            {perks.map((t) => (
              <li
                key={t}
                className={`rounded-2xl border border-white/40 bg-white/25 px-4 py-2.5 text-[13px] backdrop-blur-md md:py-3 md:text-[14px] ${onPhoto ? "text-white" : "text-[#332B2B]"}`}
              >
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Right panel: form */}
        <div className="flex flex-col justify-center px-6 py-8 sm:px-10 md:py-10">
          <div className="text-center">
            <p className={`${serif} text-[28px] font-semibold tracking-[0.12em] text-[#332B2B]`}>IZHA BLOOMS</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.28em] text-[#B20947]">Where Every Thread Blooms</p>
            <h1 className={`${serif} mt-6 text-[34px] font-medium leading-tight text-[#332B2B]`}>
              {register ? "Create your account" : "Sign in"}
            </h1>
            <span className="mx-auto mt-2 block h-[2px] w-14 bg-[#E8B8C5]" />
            <p className="mt-3 text-[14px] text-[#6f6565]">
              {register ? "Enter your details to join us." : "Enter your details to continue."}
            </p>
          </div>

          {error && <div className="mt-5"><ErrorBox text={error} /></div>}

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="mt-5 space-y-4"
          >
            {register ? (
              <>
                <Field label="Full name" value={f.name} onChange={set("name")} autoComplete="name" />
                <Field label="Email" type="email" value={f.email} onChange={set("email")} autoComplete="email" />
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">Mobile number</span>
                  <span className="flex">
                    <span className="flex items-center rounded-l-[10px] border border-r-0 border-[#E8B8C5] bg-[#FFF5F7] px-3 text-[14px] text-[#6f6565]">+91</span>
                    <input
                      className={`${inputCls} !rounded-l-none`}
                      value={f.phone}
                      inputMode="tel"
                      maxLength={10}
                      autoComplete="tel-national"
                      placeholder="10 digit number"
                      onChange={(e) => set("phone")(e.target.value.replace(/\D/g, ""))}
                    />
                  </span>
                </label>
              </>
            ) : (
              <Field label="Email or mobile number" value={f.identifier} onChange={set("identifier")} autoComplete="username" />
            )}
            <Field
              label="Password"
              type="password"
              value={f.password}
              onChange={set("password")}
              autoComplete={register ? "new-password" : "current-password"}
            />
            {/* Same colours as the Add to Cart button: white, pink outline, deep rose text */}
            <button
              type="submit"
              disabled={busy}
              className={`w-full rounded-[10px] border-[1.5px] border-[color:var(--bs-btn-border,#E99A9F)] bg-[color:var(--bs-btn,#FFFFFF)] px-3 py-3 text-[12px] font-semibold uppercase tracking-[0.05em] text-[color:var(--bs-btn-text,#B20947)] disabled:cursor-not-allowed disabled:border-[#d9cfd2] disabled:text-[#b3a9ab] sm:py-3.5 sm:text-sm ${focusRing}`}
            >
              {busy ? "Please wait" : register ? "Create Account" : "Continue"}
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

          <p className="mt-4 text-center text-[12px] text-[#6f6565]">
            By continuing, you agree to our{" "}
            <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link> and{" "}
            <Link href="/terms" className="underline underline-offset-2">Terms &amp; Conditions</Link>
          </p>
          {!API && (
            <p className="mt-2 text-center text-[11px] text-[#9b9090]">
              Demo mode: sign-in works in this browser only until the store backend is connected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   Signed in
   ===================================================================== */
function SignedIn({
  user,
  setUser,
  onSignOut,
}: {
  user: AppUser;
  setUser: (u: AppUser) => void;
  onSignOut: () => void;
}) {
  const [cart] = useStored<CartItem[]>(KEYS.cart, []);
  const [wish] = useStored<WishItem[]>(KEYS.wish, []);
  const first = user.name.split(" ")[0];
  const cartCount = cart.reduce((n, i) => n + i.qty, 0);

  const stats = [
    { href: "/wishlist", icon: Heart, title: "Wishlist", text: `${wish.length} ${wish.length === 1 ? "piece" : "pieces"} saved` },
    { href: "/addtocart", icon: ShoppingBag, title: "Cart", text: `${cartCount} ${cartCount === 1 ? "item" : "items"} waiting` },
    { href: "", icon: Package, title: "Orders", text: "Coming soon" },
  ];

  return (
    <>
      <PageHero
        label="Welcome back"
        title={`Hello, ${first}`}
        sub={user.email || user.phone}
        top={
          <div className="mx-auto mb-5 flex h-24 w-20 items-center justify-center rounded-t-full border-2 border-white/80 bg-white/40 backdrop-blur-md">
            <span className={`${serif} text-[38px] font-medium text-[#B20947]`}>
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        }
      >
        {user.role === "admin" && <Link href="/admin" className={glassBtn}>Admin Panel</Link>}
        <Link href="/addtocart" className={glassBtn}>View Cart</Link>
        <Link href="/wishlist" className={glassBtn}>View Wishlist</Link>
      </PageHero>

      {/* stat tiles */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {stats.map(({ href, icon: Icon, title, text }) => {
          const inner = (
            <>
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#E8B8C5] text-[#E99A9F]">
                <Icon size={22} strokeWidth={1.5} />
              </span>
              <p className={`${serif} mt-3 text-[22px] font-medium text-[#332B2B]`}>{title}</p>
              <p className="text-[13px] text-[#6f6565]">{text}</p>
            </>
          );
          return href ? (
            <Link key={title} href={href} className={`${card} p-5 text-center transition-colors hover:bg-[#FFF5F7] ${focusRing}`}>
              {inner}
            </Link>
          ) : (
            <div key={title} className={`${card} p-5 text-center`}>{inner}</div>
          );
        })}
      </div>

      {/* bag preview */}
      {cart.length > 0 && (
        <div className={`${card} mt-4 flex items-center gap-4 p-4`}>
          <div className="flex -space-x-3">
            {cart.slice(0, 4).map((i) => (
              <div key={`${i.id}-${i.size}`} className="relative h-14 w-12 overflow-hidden rounded-t-full rounded-b-md border-2 border-white bg-[#FFF5F7] shadow-sm">
                <Image src={i.image} alt={i.name} fill sizes="48px" quality={75} className="object-cover" />
              </div>
            ))}
          </div>
          <p className="min-w-0 flex-1 text-[14px] text-[#6f6565]">
            Your bag has {cartCount} {cartCount === 1 ? "piece" : "pieces"} ready to check out.
          </p>
          <Link href="/addtocart" className={outlineBtn}>Open Cart</Link>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <AddressBook />
        <div className="space-y-6">
          <ProfileCard user={user} setUser={setUser} />
          <div className="rounded-2xl border-2 border-[#E8B8C5] bg-[#FBF1EE] p-6 text-center ring-2 ring-inset ring-white">
            <MessageCircle size={24} strokeWidth={1.5} className="mx-auto text-[#E99A9F]" />
            <h2 className={`${serif} mt-2 text-[24px] font-medium text-[#332B2B]`}>Need a hand?</h2>
            <p className="mt-1 text-[14px] text-[#6f6565]">
              Ask about sizes, delivery or an order. We reply on WhatsApp and phone.
            </p>
            <a
              href="https://wa.me/918281003090"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 inline-block rounded-full bg-[#E99A9F] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#382B2B] transition-colors hover:text-white ${focusRing}`}
            >
              WhatsApp Us
            </a>
            <p className="mt-3 text-[13px] text-[#6f6565]">+91 82810 03090</p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <button onClick={onSignOut} className={`${outlineBtn} px-10`}>Sign Out</button>
      </div>
    </>
  );
}

/* ---------- Profile details ---------- */
function ProfileCard({ user, setUser }: { user: AppUser; setUser: (u: AppUser) => void }) {
  const [name, setName] = useState(user.name);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (name.trim().length < 2) return setError("Enter your full name, at least 2 letters.");
    setError("");
    setUser({ ...user, name: name.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className={`${card} relative px-5 pb-6 pt-9`}>
      <FlowerBadge />
      <h2 className={`${serif} text-center text-[24px] font-medium text-[#332B2B]`}>Profile details</h2>
      <div className="mt-4 space-y-4">
        {error && <ErrorBox text={error} />}
        <Field label="Full name" value={name} onChange={setName} autoComplete="name" />
        <div>
          <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">Email</span>
          <p className="rounded-[10px] bg-[#FFF5F7] px-4 py-3 text-[15px] text-[#6f6565]">{user.email || "Not added"}</p>
        </div>
        {user.phone && (
          <div>
            <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">Mobile number</span>
            <p className="rounded-[10px] bg-[#FFF5F7] px-4 py-3 text-[15px] text-[#6f6565]">+91 {user.phone}</p>
          </div>
        )}
        <button onClick={save} className={`${outlineBtn} w-full`}>
          {saved ? "Saved" : "Save Name"}
        </button>
      </div>
    </div>
  );
}

/* ---------- Saved addresses ---------- */
function AddressBook() {
  const [list, setList] = useStored<Address[]>(KEYS.addresses, []);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({ label: "Home", name: "", phone: "", line: "", city: "", pincode: "" });
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const add = () => {
    if (f.name.trim().length < 2) return setError("Enter the name of the person receiving the order.");
    if (!/^[6-9]\d{9}$/.test(f.phone)) return setError("Enter a 10 digit mobile number that starts with 6, 7, 8 or 9.");
    if (f.line.trim().length < 6) return setError("Enter the house name or number and the street.");
    if (f.city.trim().length < 2) return setError("Enter your town or city.");
    if (!/^\d{6}$/.test(f.pincode)) return setError("Enter a 6 digit pincode.");
    setError("");
    setList((l) => [
      ...l,
      { id: `a${Date.now()}`, ...f, name: f.name.trim(), line: f.line.trim(), city: f.city.trim(), isDefault: l.length === 0 },
    ]);
    setF({ label: "Home", name: "", phone: "", line: "", city: "", pincode: "" });
    setOpen(false);
  };

  const makeDefault = (id: string) => setList((l) => l.map((a) => ({ ...a, isDefault: a.id === id })));
  const remove = (id: string) =>
    setList((l) => {
      const next = l.filter((a) => a.id !== id);
      if (next.length && !next.some((a) => a.isDefault)) next[0] = { ...next[0], isDefault: true };
      return next;
    });

  return (
    <section className={`${card} p-5 sm:p-6`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className={`${serif} text-[26px] font-medium text-[#332B2B]`}>Saved addresses</h2>
          <span className="mt-1 block h-[2px] w-14 bg-[#E8B8C5]" />
        </div>
        {!open && (
          <button onClick={() => setOpen(true)} className={`${outlineBtn} gap-1.5`}>
            <Plus size={14} strokeWidth={2} /> Add Address
          </button>
        )}
      </div>

      {list.length === 0 && !open && (
        <p className="mt-6 text-[14px] text-[#6f6565]">
          No address saved yet. Add one and checkout will be quicker.
        </p>
      )}

      <ul className="mt-5 space-y-3">
        {list.map((a) => (
          <li key={a.id} className="rounded-xl border border-[#E8CFD2] bg-[#FCF8F3] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2">
                  <span className={`${serif} text-[19px] font-medium text-[#332B2B]`}>{a.label}</span>
                  {a.isDefault && (
                    <span className="rounded bg-[#F9E3E9] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#B5607A]">Default</span>
                  )}
                </p>
                <p className="mt-1 text-[14px] text-[#332B2B]">{a.name} · {a.phone}</p>
                <p className="text-[14px] text-[#6f6565]">{a.line}, {a.city} {a.pincode}</p>
              </div>
              <button
                onClick={() => remove(a.id)}
                aria-label={`Remove ${a.label} address`}
                className={`rounded-full p-2 text-[#6f6565] hover:bg-[#FFF5F7] hover:text-[#B20947] ${focusRing}`}
              >
                <Trash2 size={17} strokeWidth={1.6} />
              </button>
            </div>
            {!a.isDefault && (
              <button
                onClick={() => makeDefault(a.id)}
                className={`mt-2 rounded text-[13px] text-[#B20947] underline underline-offset-4 ${focusRing}`}
              >
                Make default
              </button>
            )}
          </li>
        ))}
      </ul>

      {open && (
        <div className="mt-5 space-y-4 rounded-xl border border-[#E8CFD2] bg-[#FFF5F7] p-4">
          {error && <ErrorBox text={error} />}
          <div className="flex gap-2" role="group" aria-label="Address type">
            {["Home", "Work", "Other"].map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={f.label === l}
                onClick={() => set("label")(l)}
                className={`rounded-full border px-4 py-1.5 text-[12px] ${focusRing} ${
                  f.label === l ? "border-[#E99A9F] bg-[#E99A9F] text-white" : "border-[#E8B8C5] bg-white text-[#332B2B]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <Field label="Full name" value={f.name} onChange={set("name")} autoComplete="name" />
          <Field label="Mobile number" value={f.phone} onChange={(v) => set("phone")(v.replace(/\D/g, ""))} inputMode="tel" maxLength={10} autoComplete="tel" />
          <Field label="House and street" value={f.line} onChange={set("line")} autoComplete="street-address" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Town or city" value={f.city} onChange={set("city")} autoComplete="address-level2" />
            <Field label="Pincode" value={f.pincode} onChange={(v) => set("pincode")(v.replace(/\D/g, ""))} inputMode="numeric" maxLength={6} autoComplete="postal-code" />
          </div>
          <div className="flex gap-3">
            <button onClick={add} className={`${solidBtn} flex-1`}>Save Address</button>
            <button
              onClick={() => {
                setOpen(false);
                setError("");
              }}
              className={`${outlineBtn} flex-1`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}