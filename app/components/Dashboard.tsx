 "use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Status = "OPEN" | "IN_PROGRESS" | "RESOLVED";
type Priority = "LOW" | "MEDIUM" | "HIGH";

type Ticket = {
  id: string;
  title: string;
  description: string;
  customer: string;
  status: Status;
  priority: Priority;
  createdAt: string;
};

const statusLabel: Record<Status, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em andamento",
  RESOLVED: "Resolvido"
};

const priorityLabel: Record<Priority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta"
};

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<"ALL" | Status>("ALL");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadTickets() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/tickets", { cache: "no-store" });
      if (!response.ok) throw new Error("Falha ao carregar chamados");
      setTickets(await response.json());
    } catch {
      setError("Não foi possível carregar os chamados. Confira o banco de dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function createTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get("title")),
      description: String(form.get("description")),
      customer: String(form.get("customer")),
      priority: String(form.get("priority"))
    };

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Falha ao criar chamado");
      }

      event.currentTarget.reset();
      await loadTickets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: Status) {
    const response = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (response.ok) await loadTickets();
    else setError("Não foi possível atualizar o chamado.");
  }

  const visibleTickets = useMemo(
    () => filter === "ALL" ? tickets : tickets.filter((t) => t.status === filter),
    [tickets, filter]
  );

  const counters = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "OPEN").length,
    progress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter((t) => t.status === "RESOLVED").length
  };

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <span className="eyebrow">SUPPORT DESK LITE</span>
          <h1>Central de chamados</h1>
          <p>Mini sistema full stack com Next.js, TypeScript, React, Prisma e PostgreSQL.</p>
        </div>
        <div className="stack">Next.js · TypeScript · PostgreSQL</div>
      </header>

      <section className="stats">
        <Stat label="Total" value={counters.total} />
        <Stat label="Abertos" value={counters.open} />
        <Stat label="Em andamento" value={counters.progress} />
        <Stat label="Resolvidos" value={counters.resolved} />
      </section>

      <section className="grid">
        <div className="panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">NOVO CHAMADO</span>
              <h2>Registrar atendimento</h2>
            </div>
          </div>

          <form onSubmit={createTicket} className="form">
            <label>
              Cliente
              <input name="customer" placeholder="Ex.: Acme Ltda." required />
            </label>
            <label>
              Título
              <input name="title" placeholder="Ex.: Sistema não abre" required />
            </label>
            <label>
              Descrição
              <textarea name="description" placeholder="Descreva o problema..." required />
            </label>
            <label>
              Prioridade
              <select name="priority" defaultValue="MEDIUM">
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </label>
            <button disabled={saving}>{saving ? "Salvando..." : "Criar chamado"}</button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">OPERAÇÃO</span>
              <h2>Chamados recentes</h2>
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value as "ALL" | Status)}>
              <option value="ALL">Todos</option>
              <option value="OPEN">Abertos</option>
              <option value="IN_PROGRESS">Em andamento</option>
              <option value="RESOLVED">Resolvidos</option>
            </select>
          </div>

          {error && <div className="error">{error}</div>}
          {loading ? (
            <div className="empty">Carregando...</div>
          ) : visibleTickets.length === 0 ? (
            <div className="empty">Nenhum chamado encontrado.</div>
          ) : (
            <div className="tickets">
              {visibleTickets.map((ticket) => (
                <article className="ticket" key={ticket.id}>
                  <div className="ticket-top">
                    <div>
                      <strong>{ticket.title}</strong>
                      <span>{ticket.customer}</span>
                    </div>
                    <span className={`priority ${ticket.priority.toLowerCase()}`}>
                      {priorityLabel[ticket.priority]}
                    </span>
                  </div>
                  <p>{ticket.description}</p>
                  <div className="ticket-bottom">
                    <span className={`status ${ticket.status.toLowerCase()}`}>
                      {statusLabel[ticket.status]}
                    </span>
                    <select
                      value={ticket.status}
                      onChange={(e) => updateStatus(ticket.id, e.target.value as Status)}
                    >
                      <option value="OPEN">Aberto</option>
                      <option value="IN_PROGRESS">Em andamento</option>
                      <option value="RESOLVED">Resolvido</option>
                    </select>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer>Projeto de portfólio · CRUD de chamados · PostgreSQL</footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
