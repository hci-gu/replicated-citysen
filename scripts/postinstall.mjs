import { execSync } from "node:child_process";
import { ensureDatabaseUrl } from "../lib/ensureDatabaseUrl.js";

function runCommand(command, label) {
  console.log(`\n• ${label}`);
  execSync(command, { stdio: "inherit" });
}

try {
  const resolvedDatabaseUrl = ensureDatabaseUrl({
    preferDirectConnection: true,
    setShadowDatabaseUrl: true
  });

  runCommand("prisma generate", "Generating Prisma Client");

  const isPooledConnection =
    resolvedDatabaseUrl && process.env.POSTGRES_URL === resolvedDatabaseUrl;

  if (!resolvedDatabaseUrl) {
    console.warn("\n⚠️  Skipping Prisma migrations and seed because DATABASE_URL is not set.");
    process.exit(0);
  }

  if (isPooledConnection) {
    console.warn(
      "\n⚠️  Skipping Prisma migrations and seed because only a pooled DATABASE_URL is available."
    );
    process.exit(0);
  }

  runCommand("prisma migrate deploy", "Applying database migrations");
  runCommand("prisma db seed", "Seeding database");
} catch (error) {
  console.error("\nPostinstall database setup failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
