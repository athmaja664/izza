"use client";

import { useState } from "react";
import { Check, UserCog } from "lucide-react";
import { KEYS, useStored } from "@/lib/izha-store";
import { DEFAULT_ADMIN_PROFILE, type AdminProfile } from "@/lib/demo-store";
import AdminShell, { card, cardCream, inputCls, outlineBtn } from "@/components/admin/AdminShell";
import { serif, solidBtn } from "@/components/izha/ui";

export default function AdminProfilePage() {
  const [profile, setProfile] = useStored<AdminProfile>(
    KEYS.adminProfile,
    DEFAULT_ADMIN_PROFILE
  );
  const [saved, setSaved] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...profile });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next.length < 6) return setPwMsg("New password must be at least 6 characters.");
    if (pw.next !== pw.confirm) return setPwMsg("Passwords do not match.");
    setPw({ current: "", next: "", confirm: "" });
    setPwMsg("Admin password updated in studio preview.");
  };

  return (
    <AdminShell
      title="Admin Profile"
      subtitle="Update store owner profile, contact details, and studio credentials"
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={saveProfile} className={`${card} p-5 sm:p-7`}>
          <div className="flex items-center gap-3 border-b border-[#E8CFD2] pb-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E8B8C5] bg-[#FFF5F7] text-[#B20947]">
              <UserCog size={22} />
            </span>
            <div>
              <h2 className={`${serif} text-[24px] font-medium text-[#332B2B]`}>
                {profile.name}
              </h2>
              <p className="text-[12px] text-[#6f6565]">{profile.role}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                Admin / Studio Name
              </span>
              <input
                className={inputCls}
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                Role Title
              </span>
              <input
                className={inputCls}
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                Official Email
              </span>
              <input
                type="email"
                className={inputCls}
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                Mobile Number
              </span>
              <input
                className={inputCls}
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                WhatsApp Number (with 91)
              </span>
              <input
                className={inputCls}
                value={profile.whatsapp}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                Store Location
              </span>
              <input
                className={inputCls}
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                Instagram Handle
              </span>
              <input
                className={inputCls}
                value={profile.instagram}
                onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                Facebook Page
              </span>
              <input
                className={inputCls}
                value={profile.facebook}
                onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                Studio Bio
              </span>
              <textarea
                rows={3}
                className={inputCls}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </label>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button type="submit" className={`${solidBtn} gap-2`}>
              {saved && <Check size={16} />}
              {saved ? "Profile Saved" : "Update Profile"}
            </button>
          </div>
        </form>

        <form onSubmit={updatePassword} className={`${cardCream} h-fit p-5 sm:p-6`}>
          <h2 className={`${serif} text-[24px] font-medium text-[#332B2B]`}>
            Security &amp; Password
          </h2>
          <p className="mt-1 text-[13px] text-[#6f6565]">
            Update your admin console password.
          </p>

          <div className="mt-4 space-y-3.5">
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                Current Password
              </span>
              <input
                type="password"
                className={inputCls}
                value={pw.current}
                onChange={(e) => setPw({ ...pw, current: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                New Password
              </span>
              <input
                type="password"
                className={inputCls}
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                Confirm New Password
              </span>
              <input
                type="password"
                className={inputCls}
                value={pw.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              />
            </label>
          </div>

          {pwMsg && <p className="mt-3 text-[13px] font-medium text-[#B20947]">{pwMsg}</p>}

          <button type="submit" className={`${outlineBtn} mt-5 w-full`}>
            Change Password
          </button>
        </form>
      </div>
    </AdminShell>
  );
}

