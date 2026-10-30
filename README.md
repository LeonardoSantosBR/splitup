# SplitUp

Aplicação web para dividir despesas em grupos, acompanhar saldos e simplificar dívidas.

## Stack

- Next.js com App Router, React e TypeScript strict
- Tailwind CSS
- Prisma + PostgreSQL (a ser configurado na próxima etapa)
- Vitest, Testing Library e Playwright
- Biome para lint e formatação

## Desenvolvimento

Requisitos: Node.js e pnpm.

```bash
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Comandos

```bash
pnpm lint       # verifica lint e formatação
pnpm format     # formata os arquivos
pnpm typecheck  # verifica TypeScript
pnpm test       # testes unitários e de componentes
pnpm test:e2e   # testes Playwright
pnpm build      # build de produção
```

## Estrutura

```text
src/
  app/                 # rotas, layouts e server actions
  components/          # componentes reutilizáveis
  lib/domain/          # regras financeiras puras
  lib/db/              # acesso ao banco
  lib/validation/      # schemas compartilhados
  tests/               # setup e testes E2E
```

Valores monetários devem ser armazenados e calculados como inteiros em centavos. Consulte `AGENTS.md` para as regras completas do projeto.
