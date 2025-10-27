import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const session = await requireSession();
    const bookmarks = await prisma.bookmark.findMany({ where: { userId: session.user!.id }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(bookmarks);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: session.user!.id,
        label: body.label,
        params: body.params
      }
    });
    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    if ((error as Error).message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Unable to create bookmark" }, { status: 400 });
  }
}
