import driver from "@/lib/cognodb";

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log("Clearing existing database...");

    // Remove the old graph completely.
    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    console.log("Creating skills...");

    // Create all skills used by the career graph.
    await session.run(
      `
      UNWIND $skills AS skillName
      CREATE (:Skill {name: skillName})
      `,
      {
        skills: [
          // Programming
          "Java",
          "Python",
          "JavaScript",
          "TypeScript",
          "C",
          "C++",

          // Web fundamentals
          "HTML",
          "CSS",
          "Responsive Design",
          "Web Accessibility",

          // Frontend
          "React",
          "Next.js",
          "Angular",
          "Vue.js",
          "Redux",

          // Backend
          "Node.js",
          "Express.js",
          "Spring Boot",
          "Django",
          "Flask",

          // APIs
          "REST APIs",
          "GraphQL",
          "API Authentication",
          "JWT",

          // Databases
          "SQL",
          "PostgreSQL",
          "MySQL",
          "MongoDB",
          "Redis",
          "Database Design",
          "Database Indexing",

          // Computer science
          "Data Structures",
          "Algorithms",
          "Object-Oriented Programming",
          "Operating Systems",
          "Computer Networks",
          "DBMS",

          // Software development
          "Git",
          "GitHub",
          "Testing",
          "Debugging",
          "Clean Code",
          "System Design",

          // DevOps
          "Linux",
          "Docker",
          "Kubernetes",
          "CI/CD",

          // Cloud
          "Cloud Computing",
          "AWS",
          "Azure",
          "Google Cloud",

          // Security
          "Authentication",
          "Authorization",
          "Cybersecurity",
          "OAuth",

          // AI / ML
          "Machine Learning",
          "Deep Learning",
          "Data Analysis",
          "Pandas",
          "NumPy",
          "TensorFlow",
          "PyTorch",

          // Data engineering
          "Data Engineering",
          "ETL",
          "Apache Spark",

          // Advanced
          "Microservices",
          "Message Queues",
          "Performance Optimization",
          "JPA",
          "Caching",
        ],
      },
    );

    console.log("Creating job roles...");

    await session.run(
      `
      UNWIND $roles AS roleName
      CREATE (:JobRole {name: roleName})
      `,
      {
        roles: [
          "Frontend Developer",
          "Backend Developer",
          "Full Stack Developer",
          "Software Engineer",
          "Java Developer",
          "Node.js Developer",
          "React Developer",
          "Cloud Engineer",
          "DevOps Engineer",
          "Data Engineer",
          "Data Scientist",
          "AI/ML Engineer",
        ],
      },
    );

    console.log("Creating career → skill relationships...");

    const careerSkills: Record<string, string[]> = {
      "Frontend Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Responsive Design",
        "Web Accessibility",
        "Git",
        "GitHub",
        "REST APIs",
        "Testing",
        "Debugging",
      ],

      "Backend Developer": [
        "JavaScript",
        "TypeScript",
        "Node.js",
        "Express.js",
        "REST APIs",
        "SQL",
        "PostgreSQL",
        "MongoDB",
        "Database Design",
        "Database Indexing",
        "Authentication",
        "Authorization",
        "JWT",
        "Git",
        "GitHub",
        "Docker",
        "Testing",
      ],

      "Full Stack Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Express.js",
        "REST APIs",
        "SQL",
        "PostgreSQL",
        "MongoDB",
        "Database Design",
        "Git",
        "GitHub",
        "Docker",
        "Authentication",
        "JWT",
        "Testing",
        "Debugging",
      ],

      "Software Engineer": [
        "Java",
        "Python",
        "JavaScript",
        "Data Structures",
        "Algorithms",
        "Object-Oriented Programming",
        "DBMS",
        "Operating Systems",
        "Computer Networks",
        "Git",
        "GitHub",
        "Testing",
        "Debugging",
        "Clean Code",
        "System Design",
        "SQL",
      ],

      "Java Developer": [
        "Java",
        "Object-Oriented Programming",
        "Data Structures",
        "Algorithms",
        "Spring Boot",
        "REST APIs",
        "SQL",
        "PostgreSQL",
        "MySQL",
        "JPA",
        "Authentication",
        "Authorization",
        "Git",
        "GitHub",
        "Docker",
        "Testing",
      ],

      "Node.js Developer": [
        "JavaScript",
        "TypeScript",
        "Node.js",
        "Express.js",
        "REST APIs",
        "GraphQL",
        "MongoDB",
        "PostgreSQL",
        "Redis",
        "JWT",
        "Authentication",
        "Authorization",
        "Git",
        "GitHub",
        "Docker",
        "Testing",
      ],

      "React Developer": [
        "JavaScript",
        "TypeScript",
        "HTML",
        "CSS",
        "React",
        "Next.js",
        "Redux",
        "Responsive Design",
        "Web Accessibility",
        "REST APIs",
        "Git",
        "GitHub",
        "Testing",
        "Debugging",
      ],

      "Cloud Engineer": [
        "Linux",
        "Cloud Computing",
        "AWS",
        "Azure",
        "Google Cloud",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "Git",
        "GitHub",
        "Computer Networks",
        "Cybersecurity",
        "Performance Optimization",
      ],

      "DevOps Engineer": [
        "Linux",
        "Git",
        "GitHub",
        "Docker",
        "Kubernetes",
        "CI/CD",
        "AWS",
        "Azure",
        "Cloud Computing",
        "Computer Networks",
        "Cybersecurity",
        "Performance Optimization",
        "System Design",
      ],

      "Data Engineer": [
        "Python",
        "SQL",
        "PostgreSQL",
        "MySQL",
        "Data Engineering",
        "ETL",
        "Apache Spark",
        "Data Analysis",
        "Linux",
        "Docker",
        "AWS",
        "Git",
        "GitHub",
      ],

      "Data Scientist": [
        "Python",
        "SQL",
        "Data Analysis",
        "Pandas",
        "NumPy",
        "Machine Learning",
        "Deep Learning",
        "TensorFlow",
        "PyTorch",
        "Data Engineering",
        "Git",
        "GitHub",
      ],

      "AI/ML Engineer": [
        "Python",
        "Data Structures",
        "Algorithms",
        "NumPy",
        "Pandas",
        "Machine Learning",
        "Deep Learning",
        "TensorFlow",
        "PyTorch",
        "Data Analysis",
        "Docker",
        "Cloud Computing",
        "Git",
        "GitHub",
      ],
    };

    for (const [role, requiredSkills] of Object.entries(careerSkills)) {
      await session.run(
        `
        MATCH (job:JobRole {name: $role})
        UNWIND $skills AS skillName
        MATCH (skill:Skill {name: skillName})
        CREATE (job)-[:REQUIRES]->(skill)
        `,
        {
          role,
          skills: requiredSkills,
        },
      );
    }

    console.log("Creating skill → skill relationships...");

    const relatedSkills: Record<string, string[]> = {
      JavaScript: ["TypeScript", "React", "Node.js"],
      TypeScript: ["JavaScript", "React", "Next.js"],
      Java: [
        "Object-Oriented Programming",
        "Spring Boot",
        "Data Structures",
        "Algorithms",
      ],
      Python: [
        "Data Analysis",
        "Machine Learning",
        "Pandas",
        "NumPy",
        "Django",
        "Flask",
      ],

      HTML: ["CSS", "JavaScript", "Web Accessibility"],
      CSS: ["HTML", "Responsive Design", "JavaScript"],
      "Responsive Design": ["CSS", "HTML", "Web Accessibility"],

      React: ["JavaScript", "TypeScript", "Next.js", "Redux", "REST APIs"],

      "Next.js": ["React", "TypeScript", "JavaScript"],
      Angular: ["TypeScript", "JavaScript", "REST APIs"],
      "Vue.js": ["JavaScript", "TypeScript", "REST APIs"],
      Redux: ["React", "JavaScript", "TypeScript"],

      "Node.js": [
        "JavaScript",
        "TypeScript",
        "Express.js",
        "REST APIs",
        "MongoDB",
      ],

      "Express.js": ["Node.js", "JavaScript", "REST APIs", "JWT"],

      "Spring Boot": [
        "Java",
        "REST APIs",
        "Object-Oriented Programming",
        "SQL",
        "JPA",
      ],

      Django: ["Python", "REST APIs", "SQL"],
      Flask: ["Python", "REST APIs", "SQL"],

      "REST APIs": [
        "Node.js",
        "Express.js",
        "Spring Boot",
        "Authentication",
        "JWT",
        "GraphQL",
      ],

      GraphQL: ["REST APIs", "Node.js", "React"],

      JWT: ["Authentication", "Authorization", "API Authentication"],

      "API Authentication": ["Authentication", "Authorization", "JWT"],

      SQL: [
        "PostgreSQL",
        "MySQL",
        "Database Design",
        "Database Indexing",
        "DBMS",
      ],

      PostgreSQL: ["SQL", "Database Design", "Database Indexing"],

      MySQL: ["SQL", "Database Design", "Database Indexing"],

      MongoDB: ["Node.js", "JavaScript", "Database Design"],

      Redis: ["Node.js", "Caching", "Performance Optimization"],

      "Database Design": ["SQL", "DBMS", "Database Indexing"],

      "Database Indexing": [
        "SQL",
        "Database Design",
        "Performance Optimization",
      ],

      "Data Structures": [
        "Algorithms",
        "Java",
        "Python",
        "C++",
        "System Design",
      ],

      Algorithms: [
        "Data Structures",
        "Java",
        "Python",
        "C++",
        "Performance Optimization",
      ],

      "Object-Oriented Programming": [
        "Java",
        "C++",
        "Clean Code",
        "System Design",
      ],

      DBMS: ["SQL", "Database Design", "Database Indexing"],

      "Operating Systems": ["Linux", "Computer Networks"],

      "Computer Networks": ["Linux", "Cloud Computing", "Cybersecurity"],

      Git: ["GitHub", "CI/CD", "Docker"],

      GitHub: ["Git", "CI/CD"],

      Testing: ["Debugging", "Clean Code", "CI/CD"],

      Debugging: ["Testing", "Performance Optimization"],

      "Clean Code": ["Testing", "Object-Oriented Programming"],

      "System Design": [
        "Microservices",
        "Message Queues",
        "Performance Optimization",
      ],

      Linux: ["Docker", "Kubernetes", "Cloud Computing", "Computer Networks"],

      Docker: ["Linux", "Kubernetes", "CI/CD", "Cloud Computing"],

      Kubernetes: ["Docker", "Cloud Computing", "CI/CD"],

      "CI/CD": ["GitHub", "Docker", "Kubernetes"],

      "Cloud Computing": [
        "AWS",
        "Azure",
        "Google Cloud",
        "Docker",
        "Kubernetes",
      ],

      AWS: ["Cloud Computing", "Docker", "Kubernetes", "Linux"],

      Azure: ["Cloud Computing", "Docker", "Kubernetes", "Linux"],

      "Google Cloud": ["Cloud Computing", "Docker", "Kubernetes", "Linux"],

      Authentication: ["Authorization", "JWT", "OAuth"],

      Authorization: ["Authentication", "JWT", "OAuth"],

      OAuth: ["Authentication", "Authorization"],

      Cybersecurity: ["Authentication", "Authorization", "OAuth"],

      "Machine Learning": [
        "Python",
        "Data Analysis",
        "NumPy",
        "Pandas",
        "Deep Learning",
      ],

      "Deep Learning": ["Machine Learning", "TensorFlow", "PyTorch"],

      "Data Analysis": ["Python", "Pandas", "NumPy", "Machine Learning"],

      Pandas: ["Python", "NumPy", "Data Analysis"],

      NumPy: ["Python", "Pandas", "Machine Learning"],

      TensorFlow: ["Python", "Deep Learning", "Machine Learning"],

      PyTorch: ["Python", "Deep Learning", "Machine Learning"],

      "Data Engineering": [
        "Python",
        "SQL",
        "ETL",
        "Apache Spark",
        "Data Analysis",
      ],

      ETL: ["Data Engineering", "SQL", "Apache Spark"],

      "Apache Spark": ["Python", "Data Engineering", "ETL"],

      Microservices: ["Spring Boot", "Node.js", "Docker", "Kubernetes"],

      "Message Queues": ["Microservices", "System Design"],

      "Performance Optimization": [
        "Database Indexing",
        "Caching",
        "System Design",
      ],

      JPA: ["Java", "Spring Boot", "SQL"],

      Caching: ["Redis", "Performance Optimization"],
    };

    for (const [skill, related] of Object.entries(relatedSkills)) {
      await session.run(
        `
        MATCH (a:Skill {name: $skill})
        UNWIND $relatedSkills AS relatedName
        MATCH (b:Skill {name: relatedName})
        CREATE (a)-[:RELATED_TO]->(b)
        `,
        {
          skill,
          relatedSkills: related,
        },
      );
    }

    console.log("Creating indexes...");

    await session.run(`
      CREATE INDEX skill_name_index IF NOT EXISTS
      FOR (s:Skill)
      ON (s.name)
    `);

    await session.run(`
      CREATE INDEX job_role_name_index IF NOT EXISTS
      FOR (j:JobRole)
      ON (j.name)
    `);

    console.log("Checking database...");

    const nodeResult = await session.run(`
      MATCH (n)
      RETURN labels(n)[0] AS type, count(n) AS count
      ORDER BY type
    `);

    for (const record of nodeResult.records) {
      const count = record.get("count");

      console.log(
        `${record.get("type")}: ${
          typeof count === "number" ? count : count.toNumber()
        }`,
      );
    }

    const relationshipResult = await session.run(`
      MATCH ()-[r]->()
      RETURN type(r) AS type, count(r) AS count
      ORDER BY type
    `);

    for (const record of relationshipResult.records) {
      const count = record.get("count");

      console.log(
        `${record.get("type")}: ${
          typeof count === "number" ? count : count.toNumber()
        }`,
      );
    }

    console.log("✅ Skill graph seeded successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await session.close();
  }
}

seedDatabase();
