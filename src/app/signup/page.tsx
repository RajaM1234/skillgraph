"use client";

import Link from "next/link";
import { FormEvent } from "react";

export default function SignupPage() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Signup submitted");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="block text-center text-2xl font-bold mb-10">
          Skill<span className="text-blue-400">Graph</span>
        </Link>

        {/* Signup Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h1 className="text-3xl font-bold">Create your account</h1>

          <p className="text-slate-400 mt-2">
            Start discovering your skills and career paths.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm mb-2">Full Name</label>

              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2">Email</label>

              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2">Password</label>

              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="Create a password"
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none focus:border-blue-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 font-semibold transition"
            >
              Create Account
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-slate-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
