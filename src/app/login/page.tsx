"use client";

import Link from "next/link";
import { FormEvent } from "react";

export default function LoginPage() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Authentication will be connected later.
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center text-2xl font-bold mb-10">
          Skill<span className="text-blue-400">Graph</span>
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h1 className="text-3xl font-bold">Welcome back</h1>

          <p className="text-slate-400 mt-2">
            Sign in to continue exploring your career path.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm mb-2">Email</label>

              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Password</label>

              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 font-semibold transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
