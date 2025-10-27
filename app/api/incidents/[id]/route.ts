import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  const incident = await prisma.incident.findUnique({
    where: { id: params.id },
    include: { category: true }
  });

  if (!incident) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(incident);
}
