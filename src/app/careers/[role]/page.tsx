"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type CareerData = {
  role: string;
  skills: string[];
};

type GraphNode = {
  id: string;
  label: string;
  type: "career" | "skill" | "relatedSkill";
};

type GraphEdge = {
  id: string;
  source: string;
  target: string;
  type: "REQUIRES" | "RELATED_TO";
};

type GraphData = {
  role: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export default function CareerPage() {
  const params = useParams();

  const role = decodeURIComponent(params.role as string);

  const [career, setCareer] = useState<CareerData | null>(null);

  const [graph, setGraph] = useState<GraphData | null>(null);

  const [loading, setLoading] = useState(true);

  const [graphLoading, setGraphLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    async function loadCareer() {
      try {
        setLoading(true);
        setGraphLoading(true);
        setError("");

        const [careerResponse, graphResponse] = await Promise.all([
          fetch(`/api/jobs/${encodeURIComponent(role)}/skills`),

          fetch(`/api/jobs/${encodeURIComponent(role)}/graph`),
        ]);

        const careerData = await careerResponse.json();

        const graphData = await graphResponse.json();

        if (!careerResponse.ok) {
          throw new Error(careerData.error || "Failed to load career");
        }

        if (!graphResponse.ok) {
          throw new Error(graphData.error || "Failed to load graph");
        }

        setCareer({
          role,
          skills: careerData.skills || [],
        });

        setGraph(graphData);
      } catch (error) {
        console.error("Failed to load career:", error);

        setError("Unable to load this career.");
      } finally {
        setLoading(false);
        setGraphLoading(false);
      }
    }

    if (role) {
      loadCareer();
    }
  }, [role]);

  /*
   * Arrange graph nodes around the career.
   */
  const graphPositions = useMemo(() => {
    if (!graph) return [];

    const careerNode = graph.nodes.find((node) => node.type === "career");

    const otherNodes = graph.nodes.filter((node) => node.type !== "career");

    if (!careerNode) return [];

    const centerX = 50;
    const centerY = 50;

    const positions = [
      {
        node: careerNode,
        x: centerX,
        y: centerY,
      },
    ];

    const directNodes = otherNodes.filter((node) => node.type === "skill");

    const relatedNodes = otherNodes.filter(
      (node) => node.type === "relatedSkill",
    );

    directNodes.forEach((node, index) => {
      const total = directNodes.length;

      const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;

      const radius = 30;

      positions.push({
        node,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      });
    });

    relatedNodes.forEach((node, index) => {
      const total = relatedNodes.length;

      const angle = (index / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;

      const radius = 44;

      positions.push({
        node,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      });
    });

    return positions;
  }, [graph]);

  function getPosition(id: string) {
    return graphPositions.find((item) => item.node.id === id);
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#070b14]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
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

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <Link
          href="/dashboard"
          className="text-sm text-slate-500 hover:text-blue-400 transition"
        >
          ← Back to recommendations
        </Link>

        {loading ? (
          <div className="mt-12 text-center p-12 rounded-3xl border border-white/10">
            <div className="w-9 h-9 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="text-slate-400 mt-4">Loading career...</p>
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-300">
            {error}
          </div>
        ) : career ? (
          <>
            {/* HERO */}

            <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-white/[0.03] to-transparent p-7 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    Career Graph
                  </div>

                  <h1 className="text-4xl md:text-6xl font-bold mt-5">
                    {career.role}
                  </h1>

                  <p className="text-slate-400 mt-4 max-w-2xl text-lg">
                    Explore how the skills required for this career connect with
                    each other.
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-500">Required skills</p>

                  <p className="text-4xl font-bold text-blue-400 mt-1">
                    {career.skills.length}
                  </p>
                </div>
              </div>
            </div>

            {/* GRAPH */}

            <div className="mt-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <p className="text-blue-400 text-sm font-medium">
                    Interactive graph
                  </p>

                  <h2 className="text-3xl font-bold mt-1">
                    Skill relationships
                  </h2>

                  <p className="text-slate-400 mt-2">
                    Click a node to inspect its connections.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    Career
                  </span>

                  <span className="flex items-center gap-2 text-slate-400">
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    Required
                  </span>

                  <span className="flex items-center gap-2 text-slate-400">
                    <span className="w-3 h-3 rounded-full bg-purple-400" />
                    Related
                  </span>
                </div>
              </div>

              {graphLoading ? (
                <div className="mt-6 h-[600px] rounded-3xl border border-white/10 bg-slate-900/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-9 h-9 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />

                    <p className="text-slate-400 mt-4">
                      Building skill graph...
                    </p>
                  </div>
                </div>
              ) : graph ? (
                <div className="mt-6 rounded-3xl border border-white/10 bg-[#090e19] overflow-hidden">
                  <div className="relative h-[600px] overflow-hidden">
                    {/* SVG EDGES */}

                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      {graph.edges.map((edge) => {
                        const source = getPosition(edge.source);

                        const target = getPosition(edge.target);

                        if (!source || !target) {
                          return null;
                        }

                        const highlighted =
                          selectedNode === edge.source ||
                          selectedNode === edge.target;

                        return (
                          <line
                            key={edge.id}
                            x1={`${source.x}%`}
                            y1={`${source.y}%`}
                            x2={`${target.x}%`}
                            y2={`${target.y}%`}
                            stroke={
                              highlighted
                                ? "#60a5fa"
                                : edge.type === "REQUIRES"
                                  ? "#334155"
                                  : "#6b21a8"
                            }
                            strokeWidth={highlighted ? "0.6" : "0.35"}
                            strokeDasharray={
                              edge.type === "RELATED_TO" ? "1.5 1" : undefined
                            }
                            opacity={highlighted ? 1 : 0.7}
                          />
                        );
                      })}
                    </svg>

                    {/* NODES */}

                    {graphPositions.map(({ node, x, y }) => {
                      const isCareer = node.type === "career";

                      const isRelated = node.type === "relatedSkill";

                      const selected = selectedNode === node.id;

                      return (
                        <button
                          key={node.id}
                          onClick={() =>
                            setSelectedNode(selected ? null : node.id)
                          }
                          className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                            selected ? "scale-110 z-30" : "z-20"
                          }`}
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                          }}
                        >
                          <div
                            className={`
                                px-3 py-2 md:px-4 md:py-3
                                rounded-xl
                                border
                                shadow-xl
                                max-w-[150px]
                                text-xs md:text-sm
                                font-medium
                                ${
                                  isCareer
                                    ? "bg-blue-500 border-blue-400 text-white shadow-blue-500/20"
                                    : isRelated
                                      ? "bg-purple-500/15 border-purple-500/40 text-purple-300"
                                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                }
                              `}
                          >
                            {node.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* SELECTED NODE */}

                  {selectedNode && (
                    <div className="border-t border-white/10 p-5 bg-white/[0.02]">
                      {(() => {
                        const node = graph.nodes.find(
                          (item) => item.id === selectedNode,
                        );

                        if (!node) {
                          return null;
                        }

                        const connections = graph.edges.filter(
                          (edge) =>
                            edge.source === selectedNode ||
                            edge.target === selectedNode,
                        );

                        return (
                          <div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">
                                  Selected node
                                </p>

                                <h3 className="text-lg font-semibold mt-1">
                                  {node.label}
                                </h3>
                              </div>

                              <button
                                onClick={() => setSelectedNode(null)}
                                className="text-slate-500 hover:text-white text-xl"
                              >
                                ×
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                              {connections.map((edge) => {
                                const other =
                                  edge.source === selectedNode
                                    ? edge.target
                                    : edge.source;

                                return (
                                  <span
                                    key={edge.id}
                                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                                  >
                                    {edge.type === "REQUIRES"
                                      ? "requires"
                                      : "related to"}{" "}
                                    {other}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* SKILLS */}

            <div className="mt-12">
              <p className="text-blue-400 text-sm font-medium">Requirements</p>

              <h2 className="text-3xl font-bold mt-1">
                Skills for {career.role}
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {career.skills.map((skill, index) => (
                  <div
                    key={skill}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 hover:border-blue-500/30 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-semibold">
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
            </div>

            {/* CTA */}

            <div className="mt-12 flex flex-col sm:flex-row gap-3">
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
        ) : null}
      </section>
    </main>
  );
}
