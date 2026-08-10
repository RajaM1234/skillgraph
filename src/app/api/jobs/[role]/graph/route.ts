import { NextRequest, NextResponse } from "next/server";
import driver from "@/lib/cognodb";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ role: string }>;
  }
) {
  const session = driver.session();

  try {
    const { role } = await context.params;
    const decodedRole = decodeURIComponent(role);

    const result = await session.run(
      `
      MATCH (job:JobRole {name: $role})

      OPTIONAL MATCH (job)-[:REQUIRES]->(skill:Skill)

      WITH job, collect(DISTINCT skill) AS directSkills

      UNWIND directSkills AS skill

      OPTIONAL MATCH (skill)-[:RELATED_TO]-(related:Skill)

      RETURN
        job.name AS role,

        collect(DISTINCT {
          id: skill.name,
          label: skill.name,
          type: "skill"
        }) AS directSkills,

        collect(DISTINCT {
          id: related.name,
          label: related.name,
          type: "relatedSkill"
        }) AS relatedSkills,

        collect(DISTINCT {
          source: skill.name,
          target: related.name,
          type: "RELATED_TO"
        }) AS relatedEdges
      `,
      {
        role: decodedRole,
      }
    );

    if (result.records.length === 0) {
      return NextResponse.json(
        {
          error: "Career not found",
        },
        {
          status: 404,
        }
      );
    }

    const record = result.records[0];

    const directSkills =
      record.get("directSkills") || [];

    const relatedSkills =
      record.get("relatedSkills") || [];

    const relatedEdges =
      record.get("relatedEdges") || [];

    /*
     * Career node
     */
    const careerNode = {
      id: decodedRole,
      label: decodedRole,
      type: "career",
    };

    /*
     * Direct skill nodes
     */
    const directNodes = directSkills
      .filter(
        (skill: any) =>
          skill.id !== null
      )
      .map((skill: any) => ({
        id: skill.id,
        label: skill.label,
        type: "skill",
      }));

    /*
     * Related skill nodes
     */
    const relatedNodes = relatedSkills
      .filter(
        (skill: any) =>
          skill.id !== null &&
          skill.id !== undefined
      )
      .map((skill: any) => ({
        id: skill.id,
        label: skill.label,
        type: "relatedSkill",
      }));

    /*
     * Remove duplicate nodes.
     */
    const nodeMap = new Map<
      string,
      {
        id: string;
        label: string;
        type: string;
      }
    >();

    nodeMap.set(
      careerNode.id,
      careerNode
    );

    for (const node of directNodes) {
      nodeMap.set(node.id, node);
    }

    for (const node of relatedNodes) {
      if (!nodeMap.has(node.id)) {
        nodeMap.set(node.id, node);
      }
    }

    const nodes = Array.from(
      nodeMap.values()
    );

    /*
     * Career → required skill edges
     */
    const careerEdges = directNodes.map(
      (skill: any) => ({
        id: `${decodedRole}-REQUIRES-${skill.id}`,
        source: decodedRole,
        target: skill.id,
        type: "REQUIRES",
      })
    );

    /*
     * Related skill edges.
     *
     * Ignore null/self relationships.
     */
    const relationshipMap =
      new Map<string, any>();

    for (const edge of relatedEdges) {
      if (
        !edge.source ||
        !edge.target ||
        edge.source === edge.target
      ) {
        continue;
      }

      const ids = [
        edge.source,
        edge.target,
      ].sort();

      const key = `${ids[0]}-${ids[1]}`;

      if (!relationshipMap.has(key)) {
        relationshipMap.set(key, {
          id: `RELATED-${key}`,
          source: edge.source,
          target: edge.target,
          type: "RELATED_TO",
        });
      }
    }

    const edges = [
      ...careerEdges,
      ...Array.from(
        relationshipMap.values()
      ),
    ];

    return NextResponse.json({
      role: decodedRole,
      nodes,
      edges,
    });
  } catch (error) {
    console.error(
      "Career graph error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load career graph",
      },
      {
        status: 500,
      }
    );
  } finally {
    await session.close();
  }
}