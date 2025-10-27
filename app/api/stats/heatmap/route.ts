import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const timeStart = searchParams.get("timeStart");
  const timeEnd = searchParams.get("timeEnd");

  const incidents = await prisma.incident.findMany({
    where: {
      occurredAt: {
        gte: timeStart ? new Date(timeStart) : undefined,
        lte: timeEnd ? new Date(timeEnd) : undefined
      }
    },
    select: { geom: true }
  });

  const buckets = incidents.map((incident) => {
    const coordinates = (incident.geom as any).geometry.coordinates;
    return {
      coordinates,
      weight: 1
    };
  });

  return NextResponse.json({ points: buckets }, { headers: { "Cache-Control": "max-age=30" } });
}
