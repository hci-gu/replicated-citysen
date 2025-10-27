import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const session = await requireSession();
    const alerts = await prisma.alert.findMany({ where: { userId: session.user!.id }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(alerts);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const alert = await prisma.alert.create({
      data: {
        userId: session.user!.id,
        query: body.query,
        enabled: body.enabled ?? true
      }
    });
    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    if ((error as Error).message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Unable to create alert" }, { status: 400 });
  }
}
