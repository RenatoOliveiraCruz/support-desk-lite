# Support Desk Lite

Mini sistema de chamados para demonstrar uma aplicação full stack com:

- Next.js (App Router)
- React
- TypeScript
- API Routes
- Prisma ORM
- PostgreSQL
- CRUD básico
- Validação de entrada
- Deploy preparado para Vercel

## Funcionalidades

- Criar chamado
- Listar chamados
- Filtrar por status
- Alterar status
- Prioridade
- Contadores do dashboard

## Arquitetura

Browser → Next.js/React → API Route → Prisma → PostgreSQL

## Rodar localmente

```bash
npm install
cp .env.example .env
```

Preencha `DATABASE_URL` com uma conexão PostgreSQL.

Depois:

```bash
npx prisma db push
npm run dev
```

Abra http://localhost:3000

## Deploy

1. Crie um banco PostgreSQL hospedado (Neon, Supabase ou outro provider).
2. Crie `DATABASE_URL`.
3. Suba o projeto para GitHub.
4. Importe o repositório na Vercel.
5. Adicione `DATABASE_URL` nas Environment Variables.
6. No primeiro deploy, o build executa `prisma generate`.
7. Antes do uso, execute `npx prisma db push` apontando para o banco de produção.

## O que explicar na entrevista

- React é usado para a interface e estado do dashboard.
- Next.js fornece a aplicação web e as rotas de API.
- TypeScript tipa os dados e reduz erros em desenvolvimento.
- Prisma faz a camada de acesso ao PostgreSQL.
- PostgreSQL armazena os chamados.
- `GET /api/tickets` lista.
- `POST /api/tickets` cria.
- `PATCH /api/tickets/:id` atualiza status.
