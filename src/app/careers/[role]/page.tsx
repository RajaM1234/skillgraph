"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type CareerData = {
  role: string;
  skills: string[];
};

export default function CareerPage() {
  const params = useParams();

  const role = decodeURIComponent(params.role as string);

  const [career, setCareer] = useState<CareerData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCareer() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/jobs/${encodeURIComponent(role)}/skills`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load career");
        }

        setCareer({
          role,
          skills: data.skills || [],
        });
      } catch (error) {
        console.error("Failed to load career:", error);

        setError("Unable to load this career.");
      } finally {
        setLoading(false);
      }
    }

    if (role) {
      loadCareer();
    }
  }, [role]);

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#070b14]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold">
            Skill
            <span className="text-blue-400">Graph</span>
          </Link>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition text-sm"
          >
            ← Dashboard
          </Link>
        </div>
      </nav>

      {/* CONTENT */}

      <section className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-16">
        {/* BACK */}

        <Link
          href="/dashboard"
          className="text-sm text-slate-500 hover:text-blue-400 transition"
        >
          ← Back to career recommendations
        </Link>

        {loading && (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.02] p-12 text-center">
            <div className="w-9 h-9 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="text-slate-400 mt-5">Loading career information...</p>
          </div>
        )}

        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-6 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && career && (
          <>
            {/* HERO */}

            <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/[0.12] via-white/[0.03] to-transparent p-7 md:p-10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    Career Path
                  </div>

                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-5">
                    {career.role}
                  </h1>

                  <p className="text-slate-400 mt-5 text-base md:text-lg leading-relaxed">
                    Explore the skills connected to this career and understand
                    what you need to build your path toward this role.
                  </p>
                </div>

                <div className="shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-3xl text-blue-400">
                    ◆
                  </div>
                </div>
              </div>
            </div>

            {/* STATS */}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <p className="text-sm text-slate-500">Required skills</p>

                <p className="text-3xl font-bold mt-2">
                  {career.skills.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <p className="text-sm text-slate-500">Skill connections</p>

                <p className="text-3xl font-bold mt-2 text-blue-400">
                  {career.skills.length}
                </p>
              </div>

              <div className="hidden md:block rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <p className="text-sm text-slate-500">Career graph</p>

                <p className="text-lg font-semibold mt-3 text-emerald-400">
                  Active
                </p>
              </div>
            </div>

            {/* SKILLS */}

            <div className="mt-10">
              <div>
                <p className="text-blue-400 text-sm font-medium">
                  Skill requirements
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  Skills for {career.role}
                </h2>

                <p className="text-slate-400 mt-2">
                  These skills are connected to this career in the SkillGraph.
                </p>
              </div>

              {career.skills.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-slate-400">
                  No skills have been connected to this career yet.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {career.skills.map((skill, index) => (
                    <div
                      key={skill}
                      className="group rounded-2xl border border-white/10 bg-slate-900/60 p-5 hover:border-blue-500/40 hover:bg-slate-900 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>

                        <div>
                          <h3 className="font-semibold">{skill}</h3>

                          <p className="text-xs text-slate-500 mt-1">
                            Required skill
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* GRAPH EXPLANATION */}

            <div className="mt-12 rounded-3xl border border-blue-500/20 bg-blue-500/[0.04] p-7 md:p-9">
              <div className="max-w-3xl">
                <p className="text-blue-400 text-sm font-medium">
                  How SkillGraph works
                </p>

                <h2 className="text-2xl md:text-3xl font-bold mt-2">
                  Your career is a network of skills.
                </h2>

                <p className="text-slate-400 mt-4 leading-relaxed">
                  SkillGraph doesn't treat careers as isolated lists. Skills are
                  connected to one another through relationships in the graph.
                  This allows the recommendation engine to identify direct
                  matches as well as related skills that can help you move
                  toward a career.
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-7">
                  <div className="px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm">
                    Your Skills
                  </div>

                  <span className="text-blue-400">→</span>

                  <div className="px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                    Skill Relationships
                  </div>

                  <span className="text-blue-400">→</span>

                  <div className="px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm">
                    {career.role}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-semibold text-center"
              >
                Find careers for my skills →
              </Link>

              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition text-center"
              >
                Explore other careers
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
