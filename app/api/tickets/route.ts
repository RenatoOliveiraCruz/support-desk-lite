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
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    const { title, description, customer, priority } = body as Record<string, unknown>;

    if (typeof title !== "string" || typeof description !== "string" || typeof customer !== "string" ||
        !title.trim() || !description.trim() || !customer.trim()) {
      return NextResponse.json(
        { error: "Título, descrição e cliente são obrigatórios." },
        { status: 400 }
      );
    }

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanCustomer = customer.trim();
    if (cleanTitle.length > 120 || cleanDescription.length > 2000 || cleanCustomer.length > 120) {
      return NextResponse.json(
        { error: "Use até 120 caracteres no título e cliente e até 2.000 na descrição." },
        { status: 400 }
      );
    }

    const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];
    if (priority && !allowedPriorities.includes(priority)) {
      return NextResponse.json({ error: "Prioridade inválida." }, { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title: cleanTitle,
        description: cleanDescription,
        customer: cleanCustomer,
        priority: priority ?? "MEDIUM"
      }
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar chamado." }, { status: 500 });
  }
}
