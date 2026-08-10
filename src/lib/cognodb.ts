import neo4j from "neo4j-driver";

const uri =
  process.env.COGNODB_URI || "bolt+s://db-b98f1837.databases.cognodb.com";
const username = process.env.COGNODB_USERNAME || "cognodb";
const password =
  process.env.COGNODB_PASSWORD || "e9616f2a78b96b652142675b4d0e52fc";
if (!uri || !username || !password) {
  throw new Error(
    "Missing CognoDB connection parameters. Please set COGNODB_URI, COGNODB_USERNAME, and COGNODB_PASSWORD in your environment variables.",
  );
}
const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

export default driver;
