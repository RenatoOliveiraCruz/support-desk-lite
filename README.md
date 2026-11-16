# Support Desk Lite

> Aplicação web para gerenciamento de chamados de suporte, desenvolvida com Next.js, TypeScript, Prisma e PostgreSQL.

**Support Desk Lite** é um sistema de gerenciamento de chamados que centraliza a abertura, acompanhamento e atualização de solicitações de suporte em uma interface única.

O projeto foi estruturado como uma aplicação full stack, com separação clara entre interface, regras de aplicação, API e persistência de dados.

<br>

[**🌐 Acessar aplicação**](https://support-desk-lite-ky6uapt80-renato-oliveira-cruz.vercel.app/) · [**📦 Repositório**](https://github.com/RenatoOliveiraCruz/support-desk-lite)

---

## Visão geral

O sistema representa um fluxo básico de atendimento baseado em tickets.

Cada chamado possui informações como **título, descrição, prioridade e status**, permitindo acompanhar sua situação e organizar a fila de atendimento.

Além do gerenciamento individual dos chamados, a aplicação apresenta indicadores resumidos no dashboard e recursos de filtragem para facilitar a visualização dos tickets.

### Principais recursos

* Criação de chamados
* Listagem de chamados
* Filtragem por status
* Definição de prioridade
* Alteração de status
* Dashboard com contadores
* Validação de dados de entrada
* Persistência em banco de dados relacional
* API integrada à aplicação
* Interface web responsiva
* Deploy em ambiente de produção

---

## Stack

| Tecnologia     | Utilização              |
| -------------- | ----------------------- |
| **Next.js 15** | Framework da aplicação  |
| **React 19**   | Construção da interface |
| **TypeScript** | Tipagem estática        |
| **Prisma 6**   | ORM e acesso ao banco   |
| **PostgreSQL** | Persistência dos dados  |
| **Vercel**     | Deploy da aplicação     |

---

## Arquitetura

A aplicação segue um fluxo full stack utilizando os recursos do próprio Next.js para integrar interface, API e persistência.

```text
┌─────────────────────────────┐
│           Browser           │
│       React / Next.js       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Next.js App Router    │
│          API Routes         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│          Prisma ORM         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
└─────────────────────────────┘
```

O fluxo principal de dados pode ser resumido como:

**Interface → API → Prisma → PostgreSQL → API → Interface**

Essa estrutura mantém a comunicação com o banco concentrada na camada de persistência, enquanto o frontend trabalha através da API da aplicação.

---

## Modelo funcional

O ciclo principal de um chamado é:

```text
Criar chamado
      │
      ▼
Definir prioridade
      │
      ▼
Acompanhar status
      │
      ▼
Atualizar chamado
      │
      ▼
Encerrar atendimento
```

Os chamados também podem ser filtrados pelo seu status, permitindo visualizar diferentes estados da fila de atendimento.

---

## Dashboard

O dashboard apresenta uma visão resumida da operação através de contadores de chamados.

Esses indicadores permitem identificar rapidamente a quantidade de tickets em cada situação e acompanhar o estado atual da fila.

```text
┌──────────────────┐
│     DASHBOARD    │
├──────────────────┤
│ Total de tickets │
│ Tickets abertos  │
│ Tickets fechados │
│ Outros status    │
└──────────────────┘
```

---

## API

A camada de API é responsável por intermediar as operações realizadas pela interface e o banco de dados.

Entre as operações suportadas estão:

* criação de chamados;
* consulta de chamados;
* atualização de status;
* atualização de informações;
* filtragem dos registros;
* persistência através do Prisma ORM.

A API utiliza os recursos do Next.js para manter backend e frontend integrados dentro da mesma aplicação.

---

## Banco de dados

O PostgreSQL é utilizado como banco de dados relacional da aplicação.

O acesso aos dados é realizado através do **Prisma ORM**, permitindo trabalhar com o modelo de dados utilizando TypeScript e mantendo as operações de persistência organizadas.

### Prisma

As operações de banco passam pelo Prisma Client:

```text
Application
     │
     ▼
Prisma Client
     │
     ▼
PostgreSQL
```

Isso reduz a necessidade de trabalhar diretamente com consultas SQL em cada operação da aplicação e fornece tipagem para o acesso aos dados.

---

## Validação

Os dados recebidos pela aplicação são validados antes de serem processados.

Isso evita que informações inválidas sejam persistidas e mantém as regras básicas do domínio concentradas no fluxo da aplicação.

---

## Executando localmente

### Pré-requisitos

* Node.js
* PostgreSQL
* npm
* Git

### 1. Clone o repositório

```bash
git clone https://github.com/RenatoOliveiraCruz/support-desk-lite.git

cd support-desk-lite
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` a partir do exemplo disponibilizado no projeto:

```bash
cp .env.example .env
```

Configure a conexão com o PostgreSQL conforme o ambiente local.

### 4. Gere o Prisma Client

```bash
npx prisma generate
```

### 5. Sincronize o banco

```bash
npx prisma db push
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

---

## Scripts

| Comando             | Função                                                              |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | Inicia o ambiente de desenvolvimento                                |
| `npm run build`     | Gera o Prisma Client, sincroniza o banco e cria o build de produção |
| `npm run start`     | Inicia a aplicação em produção                                      |
| `npm run lint`      | Executa a verificação de lint                                       |
| `npm run db:push`   | Sincroniza o schema Prisma com o banco                              |
| `npm run db:studio` | Abre o Prisma Studio                                                |

---

## Deploy

A aplicação está preparada para execução em ambiente de produção através da **Vercel**.

### Produção

**Live Demo:**
https://support-desk-lite-ky6uapt80-renato-oliveira-cruz.vercel.app/

O ambiente de produção utiliza as mesmas camadas da aplicação:

```text
Vercel
  │
  ├── Next.js
  │
  ├── React
  │
  └── Prisma
         │
         ▼
      PostgreSQL
```

---

## Decisões técnicas

### Next.js

O Next.js concentra a estrutura da aplicação, permitindo trabalhar com frontend e backend dentro do mesmo projeto.

### TypeScript

O TypeScript adiciona tipagem estática ao projeto, facilitando a manutenção e reduzindo inconsistências durante o desenvolvimento.

### Prisma

O Prisma atua como camada de acesso ao banco, fornecendo uma API tipada para trabalhar com os dados da aplicação.

### PostgreSQL

O PostgreSQL fornece uma base relacional adequada para representar entidades e relações do sistema de chamados.

---

## Estrutura conceitual

```text
support-desk-lite/
│
├── app/
│   ├── pages e componentes
│   └── rotas da aplicação
│
├── API
│   └── operações dos chamados
│
├── prisma/
│   └── schema do banco
│
├── public/
│   └── arquivos estáticos
│
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

> A estrutura acima representa a organização conceitual da aplicação. A implementação atual do repositório deve ser considerada a referência definitiva.

---

## Próximos passos

Possíveis evoluções para o sistema:

* [ ] Autenticação de usuários
* [ ] Controle de acesso por perfil
* [ ] Atribuição de chamados a atendentes
* [ ] Histórico de alterações
* [ ] Comentários internos nos tickets
* [ ] Busca por texto
* [ ] Filtros combinados
* [ ] Paginação
* [ ] Métricas de atendimento
* [ ] SLA e prazos de resolução
* [ ] Notificações
* [ ] Testes automatizados

---

## Objetivo

O Support Desk Lite demonstra a implementação de uma aplicação web full stack com **interface, API, regras de aplicação e persistência relacional**, utilizando uma stack moderna baseada em TypeScript.

O projeto também serve como base para evoluções futuras em direção a uma plataforma de atendimento mais completa.

---

## Autor

### Renato Julio Oliveira da Cruz

**Desenvolvedor de Sistemas**

[GitHub](https://github.com/RenatoOliveiraCruz)
