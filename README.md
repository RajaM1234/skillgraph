SkillGraph

Graph-Based Skill & Career Recommendation Platform

Live Demo: https://skillgraph-oyk9.vercel.app/

SkillGraph is a graph-based career recommendation platform that helps users discover suitable career paths based on their existing technical skills.

Users can select the skills they already know, and SkillGraph analyzes relationships between skills and career roles to identify suitable careers, related skills, and skills they may need to learn.

---

🎯 Use Case

Choosing a career path can be difficult because technical skills are highly connected.

For example:

Java
↓
RELATED_TO
↓
Spring Boot
↓
REQUIRED_FOR
↓
Backend Developer

A user who already knows Java may therefore be closer to a Backend Developer role even if they have not yet learned every required technology.

SkillGraph uses these relationships to provide meaningful career recommendations instead of treating skills as isolated values.

---

🧠 Why a Graph Database?

The core problem in SkillGraph is relationship-driven.

A user's skills are connected to other skills, technologies, and career roles.

The graph can represent relationships such as:

User
│
│ HAS_SKILL
▼
Skill
│
│ RELATED_TO
▼
Related Skill
│
│ REQUIRED_FOR
▼
Job Role

This type of multi-hop traversal is naturally represented using a graph database.

With a traditional relational approach, the same operation could require multiple tables and joins.

With CognoDB, SkillGraph can directly traverse connected nodes and relationships using Cypher.

This makes a graph database a natural fit for discovering career paths based on connected skills.

---

✨ Features

🔐 Authentication

- User registration
- User login
- JWT authentication
- Password hashing with bcrypt
- HTTP-only authentication cookies
- Logout
- Protected user-specific data

🧩 Skill Selection

- Search skills
- Browse skills by category
- Select multiple skills
- Remove selected skills
- Categorized skill discovery

💼 Career Recommendations

SkillGraph compares the user's selected skills with career requirements and provides:

- Match percentage
- Direct skill matches
- Related skill matches
- Missing skills
- Required skills

📚 Career Exploration

Users can open an individual career to view:

- Career information
- Required skills
- Skill connections
- Career graph explanation

🕘 Recommendation History

Authenticated users can view previous recommendation searches and the careers that were recommended for those searches.

📱 Responsive UI

The application supports desktop, tablet, and mobile layouts with:

- Loading states
- Empty states
- Error states
- Search and filtering
- Responsive navigation

---

🏗️ Architecture

┌─────────────────────────────┐
│ Next.js Frontend │
│ │
│ Login / Register │
│ Dashboard │
│ Career Pages │
│ Profile │
└──────────────┬──────────────┘
│
│ HTTP
▼
┌─────────────────────────────┐
│ Next.js API Routes │
│ │
│ Authentication │
│ Skills │
│ Careers │
│ Recommendations │
│ History │
└──────────────┬──────────────┘
│
│ Cypher
▼
┌─────────────────────────────┐
│ CognoDB │
│ Graph Database │
│ │
│ User ── Skill ── JobRole │
│ │ │ │
│ └─ Related ┘ │
└─────────────────────────────┘

---

📊 Graph Data Model

Nodes

- "User"
- "Skill"
- "JobRole"
- "Search"

Relationships

User ──HAS_SKILL──────> Skill

Skill ──RELATED_TO────> Skill

Skill ──REQUIRES──────> JobRole

User ──MADE_SEARCH────> Search

Search ──RECOMMENDED──> JobRole

Graph Overview

                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           │
                       HAS_SKILL
                           │
                           ▼
                    ┌─────────────┐
                    │    Skill    │
                    └──────┬──────┘
                           │
                       RELATED_TO
                           │
                           ▼
                    ┌─────────────┐
                    │    Skill    │
                    └──────┬──────┘
                           │
                        REQUIRES
                           │
                           ▼
                    ┌─────────────┐
                    │   JobRole   │
                    └─────────────┘


                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           │
                      MADE_SEARCH
                           │
                           ▼
                    ┌─────────────┐
                    │   Search    │
                    └──────┬──────┘
                           │
                       RECOMMENDED
                           │
                           ▼
                    ┌─────────────┐
                    │   JobRole   │
                    └─────────────┘

A visual version of the graph model is included in the project screenshots.

---

🔍 Recommendation Engine

SkillGraph uses graph relationships to calculate career compatibility.

There are two important types of matches.

Direct Match

If the selected skill is directly required by a career:

Score = 1.0

Related Match

If the selected skill is connected to a required skill through the graph:

Score = 0.5

Therefore, a direct skill match has more influence than a related skill.

The final match percentage is calculated using the weighted skill matches compared with the total number of required skills.

---

🔗 Multi-Hop Traversal

One of the key graph operations is traversing multiple relationships.

For example:

User
↓
HAS_SKILL
↓
Skill
↓
RELATED_TO
↓
Related Skill
↓
REQUIRES
↓
JobRole

This allows the application to discover career opportunities through connected skills.

This multi-hop relationship traversal is one of the main reasons CognoDB is useful for this application.

---

💻 Technology Stack

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

Backend

- Next.js API Routes
- Node.js
- TypeScript

Authentication

- JSON Web Tokens (JWT)
- bcrypt

Database

- CognoDB
- openCypher
- Neo4j JavaScript Driver

Deployment

- Vercel

---

📁 Project Structure

skillgraph/
│
├── public/
│
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ ├── jobs/
│ │ │ ├── recommendations/
│ │ │ ├── skills/
│ │ │ ├── history/
│ │ │ └── ...
│ │ │
│ │ ├── careers/
│ │ │ └── [role]/
│ │ │ └── page.tsx
│ │ │
│ │ ├── dashboard/
│ │ │ └── page.tsx
│ │ │
│ │ ├── profile/
│ │ │ └── page.tsx
│ │ │
│ │ ├── login/
│ │ │ └── page.tsx
│ │ │
│ │ └── register/
│ │ └── page.tsx
│ │
│ └── lib/
│ ├── auth.ts
│ └── cognodb.ts
│
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
└── README.md

---

☁️ CognoDB Setup

SkillGraph uses CognoDB as its graph database.

1. Create a CognoDB Instance

Create a CognoDB Cloud account and create a free database instance.

After the instance is created, obtain:

- CognoDB connection URI
- Username
- Password

2. Configure Environment Variables

Create a ".env.local" file:

COGNODB_URI=your_cognodb_connection_uri
COGNODB_USERNAME=your_cognodb_username
COGNODB_PASSWORD=your_cognodb_password

JWT_SECRET=your_secure_jwt_secret

Never commit ".env.local" or database credentials to GitHub.

---

🔐 Environment Variables

Variable| Description
"COGNODB_URI"| CognoDB Bolt connection URI
"COGNODB_USERNAME"| CognoDB username
"COGNODB_PASSWORD"| CognoDB password
"JWT_SECRET"| Secret used to sign JWT tokens

---

⚙️ Running Locally

Clone the repository

git clone https://github.com/RajaM1234/skillgraph.git
cd skillgraph

Install dependencies

npm install

Add environment variables

Create ".env.local" and configure the required CognoDB and JWT credentials.

Start the development server

npm run dev

Open:

http://localhost:3000

---

🔎 Main Cypher Queries

Find Skills Required for a Career

MATCH (job:JobRole {name: $role})
<-[:REQUIRES]-(skill:Skill)
RETURN skill.name AS skill

The "$role" parameter allows the same query to be used for different career roles.

---

Skill Relationship Traversal

MATCH (userSkill:Skill)
WHERE userSkill.name IN $skills

OPTIONAL MATCH path =
(userSkill)-[:RELATED_TO*1..2]-(requiredSkill:Skill)

RETURN requiredSkill

This identifies skills that are connected to the user's selected skills.

---

Career Recommendation Traversal

The recommendation engine traverses relationships between:

Selected Skill
↓
RELATED_TO
↓
Required Skill
↓
JobRole

The application then calculates a weighted match percentage.

---

Recommendation History

Previous searches are represented as graph relationships:

User
↓
MADE_SEARCH
↓
Search
↓
RECOMMENDED
↓
JobRole

This allows recommendation history to remain connected to the user within the graph.

---

🌐 API Endpoints

Method| Endpoint| Description
"POST"| "/api/register"| Register a user
"POST"| "/api/login"| Authenticate a user
"POST"| "/api/logout"| Logout
"GET"| "/api/skills"| Retrieve available skills
"GET"| "/api/jobs"| Retrieve available career roles
"GET"| "/api/jobs/:role/skills"| Retrieve skills for a career
"POST"| "/api/recommendations"| Generate career recommendations
"GET"| "/api/history"| Retrieve recommendation history

---

📸 Screenshots

Add the following screenshots to a "screenshots" folder in the repository.

screenshots/
├── home.png
├── dashboard.png
├── recommendations.png
├── career.png
├── profile.png
└── graph-model.png

Landing Page

"SkillGraph Landing Page" (screenshots/home.png)

Dashboard

"SkillGraph Dashboard" (screenshots/dashboard.png)

Career Recommendations

"Career Recommendations" (screenshots/recommendations.png)

Career Details

"Career Details" (screenshots/career.png)

Profile and Recommendation History

"Profile and Recommendation History" (screenshots/profile.png)

Graph Data Model

"Graph Data Model" (screenshots/graph-model.png)

---

🌐 Live Demo

The deployed application is available at:

https://skillgraph-oyk9.vercel.app/

---

🎥 Video Demo

A short screen recording demonstrating the application will be provided with the submission.

The video demonstrates:

1. User registration/login
2. Skill selection
3. Skill search and filtering
4. Career recommendations
5. Direct and related skill matching
6. Career details
7. User profile
8. Recommendation history
9. Graph database model
10. Graph-based recommendation concept

Video: "ADD_VIDEO_LINK_HERE"

---

🛡️ Security

SkillGraph uses several security practices:

- Passwords are hashed using bcrypt.
- JWT is used for authentication.
- Authentication tokens are stored in HTTP-only cookies.
- Database credentials are stored in environment variables.
- Environment files are excluded from version control.
- Cypher queries use parameters instead of directly interpolating user input.

---

🎨 UI / UX

The application provides:

- Responsive design
- Skill search
- Skill categories
- Selected-skill management
- Career match percentages
- Direct and related skill visualization
- Loading states
- Empty states
- Error handling
- Career exploration
- User profile
- Recommendation history

---

👨‍💻 Author

M Raja

Computer Science Engineering
Gokaraju Rangaraju Institute of Engineering and Technology

GitHub: https://github.com/RajaM1234

---

📄 Assignment

This project was developed as part of the CognoDB Application Assignment.
