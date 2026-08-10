import driver from "@/lib/cognodb";

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log("Clearing existing database...");

    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    console.log("Creating skills...");

    await session.run(`
      CREATE
        (:Skill {name: "Java"}),
        (:Skill {name: "Python"}),
        (:Skill {name: "JavaScript"}),
        (:Skill {name: "React"}),
        (:Skill {name: "Node.js"}),
        (:Skill {name: "SQL"}),
        (:Skill {name: "MongoDB"}),
        (:Skill {name: "Spring Boot"}),
        (:Skill {name: "Docker"}),
        (:Skill {name: "Git"}),
        (:Skill {name: "REST APIs"}),
        (:Skill {name: "AWS"})
    `);

    console.log("Creating job roles...");

    await session.run(`
      CREATE
        (:JobRole {name: "Backend Developer"}),
        (:JobRole {name: "Frontend Developer"}),
        (:JobRole {name: "Full Stack Developer"}),
        (:JobRole {name: "Java Developer"}),
        (:JobRole {name: "Cloud Developer"})
    `);

    console.log("Creating relationships...");

    await session.run(`
      MATCH
        (java:Skill {name: "Java"}),
        (spring:Skill {name: "Spring Boot"}),
        (javascript:Skill {name: "JavaScript"}),
        (react:Skill {name: "React"}),
        (node:Skill {name: "Node.js"}),
        (rest:Skill {name: "REST APIs"}),
        (docker:Skill {name: "Docker"}),
        (aws:Skill {name: "AWS"}),
        (backend:JobRole {name: "Backend Developer"}),
        (frontend:JobRole {name: "Frontend Developer"}),
        (fullstack:JobRole {name: "Full Stack Developer"}),
        (javaDeveloper:JobRole {name: "Java Developer"}),
        (cloud:JobRole {name: "Cloud Developer"})

      CREATE
        (java)-[:RELATED_TO]->(spring),
        (javascript)-[:RELATED_TO]->(react),
        (node)-[:RELATED_TO]->(rest),

        (spring)-[:REQUIRED_FOR]->(backend),
        (node)-[:REQUIRED_FOR]->(backend),
        (rest)-[:REQUIRED_FOR]->(backend),

        (react)-[:REQUIRED_FOR]->(frontend),
        (javascript)-[:REQUIRED_FOR]->(frontend),

        (java)-[:REQUIRED_FOR]->(javaDeveloper),
        (spring)-[:REQUIRED_FOR]->(javaDeveloper),

        (docker)-[:REQUIRED_FOR]->(cloud),
        (aws)-[:REQUIRED_FOR]->(cloud),

        (react)-[:REQUIRED_FOR]->(fullstack),
        (node)-[:REQUIRED_FOR]->(fullstack)
    `);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();