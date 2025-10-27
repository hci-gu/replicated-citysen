import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(categories, { headers: { "Cache-Control": "max-age=3600" } });
  } catch (error) {
    console.error("Failed to load categories", error);
    return NextResponse.json({ error: "Unable to load categories" }, { status: 503 });
  }
}
