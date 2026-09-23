import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Status inválido." }, { status: 400 });
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: { status: body.status }
    });

    return NextResponse.json(ticket);
  } catch {
    return NextResponse.json({ error: "Chamado não encontrado." }, { status: 404 });
  }
}
