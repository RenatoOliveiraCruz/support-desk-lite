'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';

type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

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
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  RESOLVED: 'Resolvido',
};

const priorityLabel: Record<Priority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
};

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<'ALL' | Status>('ALL');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [error, setError] = useState('');

  async function loadTickets() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/tickets', { cache: 'no-store' });
      if (!response.ok) throw new Error('Falha ao carregar chamados');
      setTickets(await response.json());
    } catch {
      setError(
        'Não foi possível carregar os chamados. Confira o banco de dados.',
      );
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
    setError('');

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      title: String(form.get('title')),
      description: String(form.get('description')),
      customer: String(form.get('customer')),
      priority: String(form.get('priority')),
    };

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? 'Falha ao criar chamado');
      }

      formElement.reset();
      await loadTickets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: Status) {
    setUpdatingId(id);
    setError('');
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok)
        throw new Error('Não foi possível atualizar o chamado.');
      await loadTickets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setUpdatingId(null);
    }
  }

  const visibleTickets = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
    return tickets.filter((ticket) => {
      const matchesStatus = filter === 'ALL' || ticket.status === filter;
      const matchesQuery =
        !normalizedQuery ||
        `${ticket.title} ${ticket.customer} ${ticket.description}`
          .toLocaleLowerCase('pt-BR')
          .includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [tickets, filter, query]);
  const pageCount = Math.max(1, Math.ceil(visibleTickets.length / pageSize));
  const pageTickets = visibleTickets.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  useEffect(() => setPage(1), [filter, query]);
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const counters = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'OPEN').length,
    progress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter((t) => t.status === 'RESOLVED').length,
  };

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <span className="eyebrow">SUPPORT DESK LITE</span>
          <h1>Central de chamados</h1>
          <p>
            Sistema full stack com Next.js, TypeScript, React, Prisma e
            PostgreSQL.
          </p>
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
              <input
                name="customer"
                placeholder="Ex.: Acme Ltda."
                maxLength={120}
                required
              />
            </label>
            <label>
              Título
              <input
                name="title"
                placeholder="Ex.: Sistema não abre"
                maxLength={120}
                required
              />
            </label>
            <label>
              Descrição
              <textarea
                name="description"
                placeholder="Descreva o problema..."
                maxLength={2000}
                required
              />
            </label>
            <label>
              Prioridade
              <select name="priority" defaultValue="MEDIUM">
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </label>
            <button disabled={saving}>
              {saving ? 'Salvando...' : 'Criar chamado'}
            </button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">OPERAÇÃO</span>
              <h2>Chamados recentes</h2>
            </div>
            <label className="search-label">
              <span className="visually-hidden">Buscar chamados</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar chamados..."
                aria-label="Buscar chamados por cliente, título ou descrição"
              />
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'ALL' | Status)}
            >
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
              {pageTickets.map((ticket) => (
                <article className="ticket" key={ticket.id}>
                  <div className="ticket-top">
                    <div>
                      <strong>{ticket.title}</strong>
                      <span>{ticket.customer}</span>
                    </div>
                    <span
                      className={`priority ${ticket.priority.toLowerCase()}`}
                    >
                      {priorityLabel[ticket.priority]}
                    </span>
                  </div>
                  <p>{ticket.description}</p>
                  <div className="ticket-bottom">
                    <div className="ticket-meta">
                      <span className={`status ${ticket.status.toLowerCase()}`}>
                        {statusLabel[ticket.status]}
                      </span>
                      <time dateTime={ticket.createdAt}>
                        {new Intl.DateTimeFormat('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        }).format(new Date(ticket.createdAt))}
                      </time>
                    </div>
                    <select
                      value={ticket.status}
                      disabled={updatingId === ticket.id}
                      aria-label={`Alterar status de ${ticket.title}`}
                      onChange={(e) =>
                        updateStatus(ticket.id, e.target.value as Status)
                      }
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
          {!loading && visibleTickets.length > 0 && (
            <div className="pagination">
              <span>
                {visibleTickets.length} chamado
                {visibleTickets.length === 1 ? '' : 's'}
              </span>
              <div>
                <button
                  type="button"
                  className="page-button"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Anterior
                </button>
                <span className="page-count">
                  {page} / {pageCount}
                </span>
                <button
                  type="button"
                  className="page-button"
                  disabled={page === pageCount}
                  onClick={() => setPage(page + 1)}
                >
                  Próxima
                </button>
              </div>
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
