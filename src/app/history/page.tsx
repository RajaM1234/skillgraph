"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Recommendation = {
  role: string;
  matchPercentage: number;
};

type HistoryItem = {
  id: string;
  skills: string[];
  createdAt: string;
  recommendations: Recommendation[];
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch("/api/history");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load history");
        }

        setHistory(data.history || []);
      } catch (error) {
        console.error("History loading failed:", error);

        setError("Unable to load your search history.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

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
            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/[0.05] transition text-sm"
          >
            ← Dashboard
          </Link>
        </div>
      </nav>

      {/* CONTENT */}

      <section className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-16">
        <div className="max-w-3xl">
          <p className="text-blue-400 text-sm font-medium">
            Career Intelligence
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Previous Searches
          </h1>

          <p className="text-slate-400 mt-3">
            Review the skills you searched with and the careers SkillGraph
            recommended.
          </p>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/60 p-12 text-center">
            <div className="w-9 h-9 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="text-slate-400 mt-5">
              Loading your search history...
            </p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-6 text-red-300">
            {error}
          </div>
        )}

        {/* EMPTY */}

        {!loading && !error && history.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
            <div className="text-5xl">◷</div>

            <h2 className="text-xl font-semibold mt-5">No searches yet</h2>

            <p className="text-slate-500 mt-2">
              Your career recommendation searches will appear here.
            </p>

            <Link
              href="/dashboard"
              className="inline-block mt-6 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-semibold"
            >
              Find Careers
            </Link>
          </div>
        )}

        {/* HISTORY */}

        {!loading && !error && history.length > 0 && (
          <div className="mt-10 space-y-5">
            {history.map((item, index) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 md:p-7 hover:border-blue-500/30 transition"
              >
                {/* HEADER */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                      Search #{history.length - index}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>

                  <span className="text-sm text-slate-400">
                    {item.skills.length} skills
                  </span>
                </div>

                {/* SKILLS */}

                <div className="flex flex-wrap gap-2 mt-5">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/10 text-blue-300 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* RECOMMENDATIONS */}

                <div className="mt-7">
                  <p className="text-sm font-medium">Recommended careers</p>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    {item.recommendations.slice(0, 6).map((recommendation) => (
                      <Link
                        key={recommendation.role}
                        href={`/careers/${encodeURIComponent(
                          recommendation.role,
                        )}`}
                        className="rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-blue-500/30 transition"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium">
                            {recommendation.role}
                          </span>

                          <span className="text-blue-400 text-sm font-semibold">
                            {recommendation.matchPercentage}%
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
