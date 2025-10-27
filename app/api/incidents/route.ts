import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const searchSchema = z.object({
  bbox: z.string().optional(),
  timeStart: z.coerce.date().optional(),
  timeEnd: z.coerce.date().optional(),
  categories: z.string().optional(),
  severityMin: z.coerce.number().min(1).max(5).optional(),
  severityMax: z.coerce.number().min(1).max(5).optional(),
  q: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
  format: z.enum(["json", "geojson"]).default("json")
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parseResult = searchSchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
  }

  const { bbox, timeStart, timeEnd, categories, severityMin, severityMax, q, limit, cursor, format } = parseResult.data;

  const where: Record<string, unknown> = {};
  if (timeStart || timeEnd) {
    where.occurredAt = {
      gte: timeStart,
      lte: timeEnd
    };
  }
  if (categories) {
    where.categoryId = { in: categories.split(",") };
  }
  if (severityMin || severityMax) {
    where.severity = {
      gte: severityMin ?? 1,
      lte: severityMax ?? 5
    };
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { indexedText: { contains: q, mode: "insensitive" } }
    ];
  }

  const take = limit + 1;
  let incidents = await prisma.incident.findMany({
    where,
    include: { category: true },
    orderBy: { occurredAt: "desc" },
    take,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined
  });

  if (bbox) {
    const [west, south, east, north] = bbox.split(",").map(Number);
    incidents = incidents.filter((incident) => {
      const coordinates = (incident.geom as any)?.geometry?.coordinates ?? (incident.geom as any)?.coordinates;
      if (!coordinates) return true;
      const [lon, lat] = coordinates;
      return lon >= west && lon <= east && lat >= south && lat <= north;
    });
  }

  const hasMore = incidents.length > limit;
  const items = hasMore ? incidents.slice(0, -1) : incidents;
  const nextCursor = hasMore ? incidents[incidents.length - 1].id : null;

  if (format === "geojson") {
    return NextResponse.json(
      {
        type: "FeatureCollection",
        features: items.map((incident) => ({
          type: "Feature",
          geometry: (incident.geom as any)?.geometry ?? (incident.geom as any),
          properties: {
            id: incident.id,
            title: incident.title,
            category: incident.category,
            severity: incident.severity,
            occurredAt: incident.occurredAt
          }
        }))
      },
      {
        headers: { "Cache-Control": "max-age=60" }
      }
    );
  }

  return NextResponse.json(
    {
      items,
      nextCursor,
      totalApprox: null
    },
    { headers: { "Cache-Control": "max-age=30" } }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const incident = await prisma.incident.create({ data: body });
    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Unable to create incident" }, { status: 400 });
  }
}
