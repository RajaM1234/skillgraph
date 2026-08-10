"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold">
          Skill<span className="text-blue-400">Graph</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-lg hover:bg-white/10 transition"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 pt-24 pb-20 text-center">
        <div className="inline-block px-4 py-2 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
          Graph-powered career discovery
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Turn your skills into
          <span className="text-blue-400"> your career path.</span>
        </h1>

        <p className="max-w-2xl mx-auto mt-6 text-lg text-slate-400">
          Discover career opportunities by exploring the relationships between
          your skills, technologies, and job roles.
        </p>

        <div className="flex justify-center gap-4 mt-10">
          <Link
            href="/register"
            className="px-7 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 font-semibold transition"
          >
            Get Started →
          </Link>

          <Link
            href="/login"
            className="px-7 py-3.5 rounded-xl border border-slate-700 hover:bg-white/5 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold text-center">How SkillGraph works</h2>

        <p className="text-center text-slate-400 mt-3">
          Explore the connections that shape your career.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Feature
            number="01"
            title="Add your skills"
            description="Tell us what technologies and skills you already know."
          />

          <Feature
            number="02"
            title="Explore connections"
            description="Discover related skills and technologies connected to your profile."
          />

          <Feature
            number="03"
            title="Find your path"
            description="Explore career roles and identify the skills you need to reach them."
          />
        </div>
      </section>

      {/* Graph concept */}
      <section className="max-w-5xl mx-auto px-8 py-20 text-center">
        <h2 className="text-3xl font-bold">Your skills are connected.</h2>

        <p className="text-slate-400 mt-4">
          SkillGraph uses relationships between skills and careers to help you
          discover paths that traditional lists can miss.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 mt-12 text-sm">
          <Node text="Java" />
          <span className="text-blue-400">→</span>
          <Node text="Spring Boot" />
          <span className="text-blue-400">→</span>
          <Node text="REST APIs" />
          <span className="text-blue-400">→</span>
          <Node text="Backend Developer" />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">
          <h2 className="text-3xl font-bold">Ready to discover your path?</h2>

          <p className="text-slate-400 mt-3">
            Start exploring your skills and career possibilities.
          </p>

          <Link
            href="/register"
            className="inline-block mt-7 px-7 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 font-semibold transition"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
      <div className="text-blue-400 font-semibold">{number}</div>

      <h3 className="text-xl font-semibold mt-4">{title}</h3>

      <p className="text-slate-400 mt-3 leading-relaxed">{description}</p>
    </div>
  );
}

function Node({ text }: { text: string }) {
  return (
    <div className="px-5 py-3 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300">
      {text}
    </div>
  );
}
