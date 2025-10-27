import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "General", slug: "general", color: "#0ea5e9", icon: "MapPin" },
    { name: "Infrastructure", slug: "infrastructure", color: "#f97316", icon: "Wrench" },
    { name: "Environment", slug: "environment", color: "#22c55e", icon: "Leaf" }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  const now = new Date();
  const category = await prisma.category.findFirst({ where: { slug: "general" } });
  if (!category) return;

  for (let i = 0; i < 100; i++) {
    const occurredAt = new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 7);
    await prisma.incident.upsert({
      where: { id: `seed-${i}` },
      update: {},
      create: {
        id: `seed-${i}`,
        title: `Event #${i + 1}`,
        description: "Synthetic incident generated for demos.",
        categoryId: category.id,
        source: "seed",
        severity: 1 + Math.floor(Math.random() * 5),
        occurredAt,
        geom: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [11.95 + Math.random() * 0.1, 57.7 + Math.random() * 0.1]
          },
          properties: {}
        }
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
