import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(tickets);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, customer, priority } = body;

    if (!title || !description || !customer) {
      return NextResponse.json(
        { error: "Título, descrição e cliente são obrigatórios." },
        { status: 400 }
      );
    }

    const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];
    if (priority && !allowedPriorities.includes(priority)) {
      return NextResponse.json({ error: "Prioridade inválida." }, { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        customer,
        priority: priority ?? "MEDIUM"
      }
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar chamado." }, { status: 500 });
  }
}
