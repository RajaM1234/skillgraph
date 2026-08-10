"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          window.location.href = "/login";
          return;
        }

        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error("Failed to load profile:", error);

        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      {/* NAVBAR */}

      <nav className="border-b border-white/10 bg-[#070b14]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold">
            Skill
            <span className="text-blue-400">Graph</span>
          </Link>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/[0.05] transition text-sm"
          >
            ← Dashboard
          </Link>
        </div>
      </nav>

      {/* CONTENT */}

      <section className="max-w-5xl mx-auto px-5 md:px-8 py-10 md:py-16">
        <div className="max-w-2xl">
          <p className="text-blue-400 text-sm font-medium">Account</p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Personal Details
          </h1>

          <p className="text-slate-400 mt-3">
            Manage your SkillGraph account information.
          </p>
        </div>

        {loading ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/60 p-10 text-center">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="text-slate-400 mt-4">Loading profile...</p>
          </div>
        ) : user ? (
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {/* PROFILE CARD */}

            <div className="md:col-span-2 rounded-3xl border border-white/10 bg-slate-900/60 p-7">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl font-bold text-blue-400">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold">{user.name}</h2>

                  <p className="text-slate-500 mt-1">SkillGraph User</p>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Full Name
                  </p>

                  <p className="mt-2 text-slate-200">{user.name}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Email
                  </p>

                  <p className="mt-2 text-slate-200">{user.email}</p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
              <h3 className="font-semibold">Account</h3>

              <p className="text-sm text-slate-500 mt-2">
                Manage your SkillGraph activity.
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href="/history"
                  className="block w-full px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition text-center text-sm font-semibold"
                >
                  Previous Searches
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="w-full px-4 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
