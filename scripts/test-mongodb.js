/**
 * Quick MongoDB connection test.
 * Usage: npm run test:db
 * Requires MONGO_DB_URI in .env.local
 */

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("Missing .env.local — copy .env.example and add your MONGO_DB_URI.");
    process.exit(1);
  }

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();

  const uri = process.env.MONGO_DB_URI;
  if (!uri || uri.includes("<username>") || uri.includes("REPLACE_WITH")) {
    console.error("Set a real MONGO_DB_URI in .env.local before running this test.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME || undefined,
    });

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log("MongoDB connection successful.");
    console.log(`Database: ${mongoose.connection.name}`);
    console.log(
      "Collections:",
      collections.length ? collections.map((c) => c.name).join(", ") : "(none yet — submit an application to create data)"
    );
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message || error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
