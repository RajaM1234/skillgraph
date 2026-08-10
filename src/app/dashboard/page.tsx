"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Recommendation = {
  role: string;
  matchedSkills: string[];
  relatedSkills?: string[];
  missingSkills: string[];
  requiredSkills: string[];
  matchedCount: number;
  relatedCount?: number;
  requiredCount: number;
  matchPercentage: number;
};

const categories: Record<string, string[]> = {
  Programming: ["Java", "Python", "JavaScript", "TypeScript", "C", "C++"],

  Frontend: [
    "HTML",
    "CSS",
    "Responsive Design",
    "Web Accessibility",
    "React",
    "Next.js",
    "Angular",
    "Vue.js",
    "Redux",
  ],

  Backend: [
    "Node.js",
    "Express.js",
    "Spring Boot",
    "Django",
    "Flask",
    "REST APIs",
    "GraphQL",
    "API Authentication",
    "JWT",
  ],

  Databases: [
    "SQL",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Database Design",
    "Database Indexing",
  ],

  "Core CS": [
    "Data Structures",
    "Algorithms",
    "Object-Oriented Programming",
    "Operating Systems",
    "Computer Networks",
    "DBMS",
  ],

  Development: [
    "Git",
    "GitHub",
    "Testing",
    "Debugging",
    "Clean Code",
    "System Design",
  ],

  DevOps: ["Linux", "Docker", "Kubernetes", "CI/CD"],

  Cloud: ["Cloud Computing", "AWS", "Azure", "Google Cloud"],

  Security: ["Authentication", "Authorization", "Cybersecurity", "OAuth"],

  "AI / ML": [
    "Machine Learning",
    "Deep Learning",
    "Data Analysis",
    "Pandas",
    "NumPy",
    "TensorFlow",
    "PyTorch",
  ],

  "Data Engineering": ["Data Engineering", "ETL", "Apache Spark"],

  Advanced: [
    "Microservices",
    "Message Queues",
    "Performance Optimization",
    "JPA",
    "Caching",
  ],
};

export default function DashboardPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [jobs, setJobs] = useState<string[]>([]);

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [skillsResponse, jobsResponse] = await Promise.all([
          fetch("/api/skills"),
          fetch("/api/jobs"),
        ]);

        const skillsData = await skillsResponse.json();
        const jobsData = await jobsResponse.json();

        setSkills(skillsData.skills || []);
        setJobs(jobsData.jobs || []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function toggleSkill(skill: string) {
    setSelectedSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill],
    );

    setRecommendations([]);
  }

  function removeSkill(skill: string) {
    setSelectedSkills((current) => current.filter((item) => item !== skill));

    setRecommendations([]);
  }

  async function getRecommendations() {
    if (selectedSkills.length === 0) {
      setRecommendations([]);
      return;
    }

    setRecommendationLoading(true);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: selectedSkills,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get recommendations");
      }

      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error("Recommendation request failed:", error);

      setRecommendations([]);
    } finally {
      setRecommendationLoading(false);
    }
  }

  const filteredSkills = useMemo(() => {
    let result = skills;

    if (activeCategory !== "All") {
      const categorySkills = categories[activeCategory] || [];

      result = result.filter((skill) => categorySkills.includes(skill));
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((skill) => skill.toLowerCase().includes(query));
    }

    return result;
  }, [skills, search, activeCategory]);

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#070b14]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold tracking-tight"
          >
            Skill
            <span className="text-blue-400">Graph</span>
          </Link>

          <Link
            href="/profile"
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition text-sm"
          >
            Profile
          </Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        {/* HERO */}

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Career Intelligence
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-5 leading-tight">
            Turn your skills into
            <span className="text-blue-400"> career opportunities.</span>
          </h1>

          <p className="text-slate-400 mt-5 text-base md:text-lg leading-relaxed">
            Select the technologies and concepts you already know. Our skill
            graph connects them to real career paths.
          </p>
        </div>

        {/* SELECTED SKILLS */}

        {selectedSkills.length > 0 && (
          <div className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/[0.05] p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-blue-300 font-medium">
                  Your skill profile
                </p>

                <h2 className="text-xl font-semibold mt-1">
                  {selectedSkills.length} skills selected
                </h2>
              </div>

              <button
                onClick={getRecommendations}
                disabled={recommendationLoading}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 font-semibold transition shadow-lg shadow-blue-500/10"
              >
                {recommendationLoading ? "Analyzing..." : "Find My Careers →"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {selectedSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => removeSkill(skill)}
                  className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-300 transition"
                >
                  {skill}
                  <span className="text-blue-400 group-hover:text-red-400">
                    ×
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SKILL SELECTOR */}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
          {/* HEADER */}

          <div className="p-5 md:p-6 border-b border-white/10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  Build your skill profile
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Search or browse by category.
                </p>
              </div>

              <div className="text-sm text-slate-500">
                {skills.length} skills available
              </div>
            </div>

            {/* SEARCH */}

            <div className="relative mt-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                ⌕
              </span>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search skills... e.g. React, Java, Docker"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:border-blue-500 transition placeholder:text-slate-600"
              />
            </div>

            {/* CATEGORIES */}

            <div className="flex gap-2 overflow-x-auto mt-5 pb-1">
              {["All", ...Object.keys(categories)].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm border transition ${
                    activeCategory === category
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* SKILLS */}

          <div className="p-5 md:p-6">
            {loading ? (
              <div className="py-12 text-center text-slate-500">
                Loading skills...
              </div>
            ) : filteredSkills.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-3xl">🔎</div>

                <p className="text-slate-400 mt-3">No skills found.</p>

                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All");
                  }}
                  className="text-blue-400 text-sm mt-2 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredSkills.map((skill) => {
                  const selected = selectedSkills.includes(skill);

                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`text-left px-4 py-3 rounded-xl border transition ${
                        selected
                          ? "bg-blue-500/10 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/5"
                          : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">
                          {skill}
                        </span>

                        {selected && <span className="text-blue-400">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RECOMMENDATIONS */}

        <div className="mt-14">
          <div>
            <p className="text-blue-400 text-sm font-medium">
              AI-powered matching
            </p>

            <h2 className="text-3xl font-bold mt-1">Recommended careers</h2>

            <p className="text-slate-400 mt-2">
              Careers ranked using direct and related skill relationships.
            </p>
          </div>

          {recommendationLoading && (
            <div className="mt-6 p-8 rounded-2xl border border-white/10 bg-white/[0.02] text-center">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />

              <p className="text-slate-400 mt-4">
                Analyzing your skill graph...
              </p>
            </div>
          )}

          {!recommendationLoading && selectedSkills.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-800 p-10 text-center">
              <div className="text-4xl">✨</div>

              <h3 className="text-lg font-semibold mt-4">
                Your recommendations will appear here
              </h3>

              <p className="text-slate-500 mt-2">
                Select a few skills above to discover your strongest career
                paths.
              </p>
            </div>
          )}

          {!recommendationLoading &&
            selectedSkills.length > 0 &&
            recommendations.length === 0 && (
              <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/[0.04] p-6 text-yellow-300">
                No matching careers found. Try selecting a few more skills.
              </div>
            )}

          {!recommendationLoading && recommendations.length > 0 && (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
              {recommendations.map((recommendation) => (
                <div
                  key={recommendation.role}
                  className="group rounded-2xl border border-white/10 bg-slate-900/70 p-6 hover:border-blue-500/40 hover:-translate-y-1 transition duration-300"
                >
                  {/* TOP */}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">
                        Career match
                      </p>

                      <h3 className="text-xl font-semibold mt-2">
                        {recommendation.role}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">
                        {recommendation.matchPercentage}%
                      </div>

                      <p className="text-xs text-slate-500">match</p>
                    </div>
                  </div>

                  {/* PROGRESS */}

                  <div className="h-2 bg-slate-800 rounded-full mt-5 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(
                          recommendation.matchPercentage,
                          100,
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    {recommendation.matchedCount} direct matches
                    {recommendation.relatedCount
                      ? ` · ${recommendation.relatedCount} related`
                      : ""}
                    {" · "}
                    {recommendation.requiredCount} required
                  </p>

                  {/* MATCHED */}

                  {recommendation.matchedSkills.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-medium">You already have</p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {recommendation.matchedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/10 text-blue-300 text-xs"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RELATED */}

                  {recommendation.relatedSkills &&
                    recommendation.relatedSkills.length > 0 && (
                      <div className="mt-5">
                        <p className="text-sm font-medium">
                          Related to your skills
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {recommendation.relatedSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/10 text-purple-300 text-xs"
                            >
                              ↗ {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* MISSING */}

                  {recommendation.missingSkills.length > 0 && (
                    <div className="mt-5">
                      <p className="text-sm font-medium">Skills to learn</p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {recommendation.missingSkills
                          .slice(0, 6)
                          .map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 text-xs"
                            >
                              + {skill}
                            </span>
                          ))}
                      </div>

                      {recommendation.missingSkills.length > 6 && (
                        <p className="text-xs text-slate-600 mt-2">
                          + {recommendation.missingSkills.length - 6} more
                          skills
                        </p>
                      )}
                    </div>
                  )}

                  {/* LINK */}

                  <Link
                    href={`/careers/${encodeURIComponent(recommendation.role)}`}
                    className="block text-center mt-6 py-3 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-blue-500 hover:border-blue-500 transition font-medium text-sm"
                  >
                    Explore career →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ALL CAREERS */}

        <div className="mt-16">
          <p className="text-blue-400 text-sm font-medium">Explore</p>

          <h2 className="text-3xl font-bold mt-1">Career paths</h2>

          <p className="text-slate-400 mt-2">
            Browse every career represented in the graph.
          </p>

          {loading ? (
            <div className="mt-6 text-slate-500">Loading careers...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
              {jobs.map((job) => (
                <Link
                  key={job}
                  href={`/careers/${encodeURIComponent(job)}`}
                  className="group rounded-2xl border border-white/10 bg-slate-900/50 p-5 hover:border-blue-500/40 hover:bg-slate-900 transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition">
                    ◆
                  </div>

                  <h3 className="font-semibold mt-4">{job}</h3>

                  <p className="text-slate-500 text-sm mt-2">
                    Explore the skills connected to this career.
                  </p>

                  <span className="inline-block mt-4 text-sm text-blue-400 group-hover:text-blue-300">
                    Explore →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
