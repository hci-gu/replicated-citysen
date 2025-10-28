import { execSync } from "node:child_process";

function runCommand(command, label) {
  console.log(`\n• ${label}`);
  execSync(command, { stdio: "inherit" });
}

try {
  runCommand("prisma generate", "Generating Prisma Client");

  if (!process.env.DATABASE_URL) {
    console.warn("\n⚠️  Skipping Prisma migrations and seed because DATABASE_URL is not set.");
    process.exit(0);
  }

  runCommand("prisma migrate deploy", "Applying database migrations");
  runCommand("prisma db seed", "Seeding database");
} catch (error) {
  console.error("\nPostinstall database setup failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
