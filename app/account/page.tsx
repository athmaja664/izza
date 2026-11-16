"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import {
  KEYS,
  inr,
  useStored,
  type Address,
  type AppUser,
  type CartItem,
  type WishItem,
} from "@/lib/izha-store";
import { DEFAULT_ORDERS, type DemoOrder } from "@/lib/demo-store";
import { WhatsAppSvg } from "@/components/WhatsAppFloat";
import AlertBox from "@/components/izha/AlertBox";
import AuthModal from "@/components/izha/AuthModal";
import {
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
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">
        {label}
      </span>
      <input
        className={inputCls}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function ErrorBox({ text }: { text: string }) {
  return <AlertBox variant="error" message={text} />;
}


/* =====================================================================
   Page
   ===================================================================== */
export default function AccountPage() {
  const [user, setUser, ready] = useStored<AppUser | null>(KEYS.user, null);
  const [authModal, setAuthModal] = useState<"signin" | "register" | null>(null);

  const signOut = () => {
    try {
      localStorage.removeItem(KEYS.token);
    } catch {
      /* ignore */
    }
    setUser(null);
  };

  return (
    <PageShell>
      {ready && user ? (
        <SignedIn user={user} setUser={setUser} onSignOut={signOut} />
      ) : (
        <UnauthenticatedAccountView
          onOpenSignIn={() => setAuthModal("signin")}
          onOpenRegister={() => setAuthModal("register")}
        />
      )}

      {authModal && (
        <AuthModal
          initialMode={authModal}
          onDone={(u) => {
            setUser(u);
            setAuthModal(null);
          }}
          onClose={() => setAuthModal(null)}
        />
      )}
    </PageShell>
  );
}

function UnauthenticatedAccountView({
  onOpenSignIn,
  onOpenRegister,
}: {
  onOpenSignIn: () => void;
  onOpenRegister: () => void;
}) {
  const circlePerks = [
    "Be the first to discover new collections.",
    "Enjoy exclusive member offers.",
    "Save your favourite styles.",
    "Experience a smoother checkout.",
  ];

  return (
    <div className="mx-auto max-w-4xl py-6 sm:py-10">
      {/* Header */}
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B20947]">
          Welcome to IZHA BLOOMS
        </p>
        <h1
          className={`${serif} mt-2 text-[38px] font-medium leading-tight text-[#332B2B] sm:text-[48px]`}
        >
          My Account
        </h1>
        <span className="mx-auto mt-3 block h-[2px] w-14 bg-[#E8B8C5]" />
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#6f6565]">
          Your style journey starts here. Sign in or create an account to enjoy your IZHA Circle privileges.
        </p>
      </div>

      {/* Main Container */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Left Card: Customer Access (Sign In / Register / Guest) */}
        <div className={`${card} flex flex-col justify-between p-6 sm:p-8`}>
          <div>
            <div className="border-b border-[#E8CFD2] pb-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B20947]">
                Member Access
              </span>
              <h2 className={`${serif} mt-1 text-[26px] font-medium text-[#332B2B]`}>
                Sign In or Join
              </h2>
              <p className="mt-1 text-[13px] text-[#6f6565]">
                Access your profile, saved addresses and orders in one place.
              </p>
            </div>

            {/* Two Clear Choices: Sign In & Create Account */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Sign In Tile */}
              <div className="flex flex-col justify-between rounded-xl border border-[#E8CFD2] bg-[#FCF8F3] p-4 text-left transition-colors hover:border-[#E99A9F]">
                <div>
                  <h3 className={`${serif} text-[20px] font-medium text-[#332B2B]`}>
                    Sign In
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#6f6565]">
                    Welcome back! Sign in to access your profile, saved addresses and orders.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenSignIn}
                  className={`${solidBtn} mt-4 w-full justify-center py-2.5 text-[12px]`}
                >
                  Sign In
                </button>
              </div>

              {/* Create an Account Tile */}
              <div className="flex flex-col justify-between rounded-xl border border-[#E8CFD2] bg-[#FFF5F7] p-4 text-left transition-colors hover:border-[#E99A9F]">
                <div>
                  <h3 className={`${serif} text-[20px] font-medium text-[#B20947]`}>
                    Create an Account
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#6f6565]">
                    Join the IZHA Circle and enjoy exclusive member privileges.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className={`${outlineBtn} mt-4 w-full justify-center py-2.5 text-[12px]`}
                >
                  Create an Account
                </button>
              </div>
            </div>

            {/* Guest Shopping Option */}
            <div className="mt-6 rounded-xl border border-[#E8CFD2] bg-[#FFF9F4] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold text-[#332B2B]">
                    Continue Shopping as Guest
                  </h3>
                  <p className="mt-0.5 text-[12px] text-[#6f6565]">
                    Explore our collections and shop without creating an account. (Guest checkout is available anytime).
                  </p>
                </div>
                <Link
                  href="/collections"
                  className={`${outlineBtn} shrink-0 justify-center py-2 text-[12px]`}
                >
                  Explore Collections
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Help Footer */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8CFD2] pt-4 text-[12px] text-[#6f6565]">
            <Link
              href="/track-order"
              className="inline-flex items-center gap-1 font-medium text-[#B20947] hover:underline"
            >
              Track an Order →
            </Link>
            <a
              href={`https://wa.me/919995757612?text=${encodeURIComponent(
                "Hi IZHA BLOOMS! I'm interested in your collection. Could you please assist me?"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-[#B20947] hover:underline"
            >
              <WhatsAppSvg size={13} />
              WhatsApp Help
            </a>
          </div>
        </div>

        {/* Right Card: IZHA Circle Promotional Section */}
        <div className={`${card} flex flex-col justify-between overflow-hidden p-6 sm:p-7`}>
          <div>
            {/* Visual Header */}
            <div className="relative mb-5 h-44 w-full overflow-hidden rounded-xl border border-[#E8CFD2]">
              <Image
                src="/images/inst4.jpg"
                alt="IZHA BLOOMS Handcrafted Collection"
                fill
                sizes="(max-width: 1024px) 100vw, 380px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A1426]/70 via-[#3A1426]/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F6DADD]">
                  IZHA Circle
                </p>
                <p className={`${serif} text-[20px] font-medium leading-tight`}>
                  Where Every Thread Blooms
                </p>
              </div>
            </div>

            <div>
              <span className="inline-block rounded-full border border-[#E8B8C5] bg-[#FFF5F7] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B20947]">
                Exclusive Privileges
              </span>
              <h3 className={`${serif} mt-2 text-[26px] font-medium leading-tight text-[#332B2B]`}>
                Be part of the IZHA Circle!
              </h3>
              <p className={`${serif} mt-1 text-[15px] italic text-[#B20947]`}>
                A little more love, a little more privilege.
              </p>
            </div>

            <ul className="mt-5 space-y-3">
              {circlePerks.map((perk) => (
                <li key={perk} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#E8B8C5] bg-[#FFF5F7] text-[10px] font-semibold text-[#B20947]">
                    ✓
                  </span>
                  <span className="text-[13px] leading-snug text-[#4a3f3f]">
                    {perk}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-lg bg-[#FCF8F3] p-3 text-center text-[12px] text-[#6f6565]">
            Enjoy early festive previews, private member discounts and special offers.
          </div>
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
  const [orders] = useStored<DemoOrder[]>(KEYS.orders, DEFAULT_ORDERS);
  const first = user.name.split(" ")[0];
  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const myOrders = useMemo(() => {
    const matched = orders.filter(
      (o) =>
        (user.email && o.customerEmail.toLowerCase() === user.email.toLowerCase()) ||
        (user.phone && o.customerPhone === user.phone)
    );
    return matched.length > 0 ? matched : orders.slice(0, 4);
  }, [orders, user]);

  const stats = [
    { href: "/wishlist", icon: Heart, title: "Wishlist", text: `${wish.length} ${wish.length === 1 ? "piece" : "pieces"} saved` },
    { href: "/addtocart", icon: ShoppingBag, title: "Shopping Bag", text: `${cartCount} ${cartCount === 1 ? "item" : "items"} waiting` },
    { href: "#order-history", icon: Package, title: "My Orders", text: `${myOrders.length} recent orders` },
  ];

  return (
    <>
      <PageHero
        label="Welcome back"
        title={`Hello, ${first}`}
        sub={user.email || (user.phone ? `+91 ${user.phone}` : "IZHA Circle Member")}
        top={
          <div className="mx-auto mb-5 flex h-24 w-20 items-center justify-center rounded-t-full border-2 border-white/80 bg-white/40 backdrop-blur-md">
            <span className={`${serif} text-[38px] font-medium text-[#B20947]`}>
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        }
      >
        <Link href="/admin" className={glassBtn}>Admin Panel</Link>
        <Link href="/addtocart" className={glassBtn}>Shopping Bag</Link>
        <Link href="/wishlist" className={glassBtn}>Wishlist</Link>
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
          return (
            <Link key={title} href={href} className={`${card} p-5 text-center transition-colors hover:bg-[#FFF5F7] ${focusRing}`}>
              {inner}
            </Link>
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
          <Link href="/checkout" className={outlineBtn}>Checkout</Link>
        </div>
      )}

      {/* Order History */}
      <section id="order-history" className={`${card} mt-8 p-5 sm:p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className={`${serif} text-[26px] font-medium text-[#332B2B]`}>My Orders</h2>
            <span className="mt-1 block h-[2px] w-14 bg-[#E8B8C5]" />
          </div>
          <Link href="/track-order" className="text-[13px] font-medium text-[#B20947] underline underline-offset-4">
            Track an order
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {myOrders.map((ord) => (
            <div key={ord.id} className="rounded-xl border border-[#E8CFD2] bg-[#FCF8F3] p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[#332B2B]">{ord.id}</span>
                <span className="rounded-full bg-[#F9E3E9] px-2.5 py-0.5 text-[11px] font-semibold text-[#B20947]">
                  {ord.status}
                </span>
              </div>
              <p className="mt-1 text-[12px] text-[#6f6565]">
                {ord.createdAt} · {ord.items.length} {ord.items.length === 1 ? "item" : "items"} · {ord.paymentMethod}
              </p>
              <p className="mt-2 text-[14px] font-medium text-[#332B2B]">
                Total: {inr(ord.total)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <AddressBook />
        <div className="space-y-6">
          <ProfileCard user={user} setUser={setUser} />
          <div className="rounded-2xl border-2 border-[#E8B8C5] bg-[#FBF1EE] p-6 text-center ring-2 ring-inset ring-white">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#25D366] shadow-sm">
              <WhatsAppSvg size={20} />
            </span>
            <h2 className={`${serif} mt-2 text-[24px] font-medium text-[#332B2B]`}>Need a hand?</h2>
            <p className="mt-1 text-[14px] text-[#6f6565]">
              Ask about sizes, delivery or an order. We reply on WhatsApp and phone.
            </p>
            <a
              href="https://wa.me/919995757612"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 inline-flex items-center gap-2 rounded-full bg-[#E99A9F] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#382B2B] transition-colors hover:text-white ${focusRing}`}
            >
              <WhatsAppSvg size={16} />
              WhatsApp Us
            </a>
            <p className="mt-3 text-[13px] text-[#6f6565]">+91 99957 57612</p>
          </div>
          <div className={`${card} p-5 text-center`}>
            <ShieldCheck size={22} className="mx-auto text-[#B20947]" />
            <p className={`${serif} mt-1 text-[20px] font-medium text-[#332B2B]`}>Store Management</p>
            <p className="mt-1 text-[13px] text-[#6f6565]">Preview the client admin dashboard, inventory, coupons &amp; banners.</p>
            <Link href="/admin" className={`${outlineBtn} mt-3 w-full`}>
              Open Admin Panel
            </Link>
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
        {saved && <AlertBox variant="success" message="Your profile name has been updated." />}
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