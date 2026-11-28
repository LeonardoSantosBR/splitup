# SplitUp

Web application for splitting expenses in groups, tracking balances, and simplifying debts.

<img width="828" height="301" alt="Gemini_Generated_Image_881wd5881wd5881w-removebg-preview" src="https://github.com/user-attachments/assets/56593d2c-45b9-444f-ad4f-42607a1e6066" />

## Stack

- Next.js with App Router, React, and strict TypeScript
- Tailwind CSS
- Prisma + PostgreSQL (to be configured in the next stage)
- Vitest, Testing Library, and Playwright
- Biome for linting and formatting

## Development

Requirements: Node.js and pnpm.

```bash
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
pnpm lint       # checks linting and formatting
pnpm format     # formats the files
pnpm typecheck  # checks TypeScript
pnpm test       # unit and component tests
pnpm test:e2e   # Playwright tests
pnpm build      # production build
pnpm prisma:validate # validates the Prisma schema
pnpm prisma:generate # generates the Prisma client
pnpm prisma:migrate  # creates/applies a local migration
```

## Structure

```text
src/
  app/                 # routes, layouts, and server actions
  components/          # reusable components
  lib/domain/          # pure financial rules
  lib/db/              # database access
  lib/validation/      # shared schemas
  tests/               # setup and E2E tests
lambda/                # AWS Lambda functions
```

Monetary values must be stored and calculated as integer cents. See `AGENTS.md` for the project's complete rules.

## Authentication

The project uses Auth.js with Google OAuth. Configure `AUTH_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET` in `.env.local`. In the Google Cloud Console, add `http://localhost:3000/api/auth/callback/google` as a redirect URI during development.

## Database

Copy `.env.example` to `.env.local`, configure `DATABASE_URL`, and run:

```bash
pnpm prisma:validate
pnpm prisma:generate
pnpm prisma:migrate --name init
```
