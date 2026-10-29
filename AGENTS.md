# AGENTS.md

## Project overview

**SplitUp** is a group expense-sharing web app, in the spirit of Splitwise. Users create groups (a trip, a shared flat), log who paid for what, split costs in different ways, and see who owes whom. The app's key feature is a **debt-simplification algorithm** that settles the whole group with the fewest possible transfers.

This is a portfolio project. Priorities, in order: correctness of money logic, clean and readable code, good UX on mobile, test coverage on the core domain, and a deployed live demo.

## Tech stack

- **Framework:** Next.js (App Router), React, TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Neon or Supabase) with Prisma ORM
- **Auth:** Auth.js (email magic link or OAuth)
- **Forms and validation:** React Hook Form + Zod (shared schemas for client and server)
- **Charts:** Recharts
- **Testing:** Vitest + Testing Library (unit/component), Playwright (E2E)
- **Deploy:** Vercel

## Core features

1. **Groups:** create a group, invite members through a shareable link.
2. **Expenses:** register an expense with payer, amount, category, date and participants.
3. **Split modes:** equal, by percentage, by exact amounts.
4. **Balances:** per-member net balance, updated right after each expense.
5. **Settle up:** compute the minimum set of transfers that clears all debts, and let users record payments.
6. **Insights:** spending by category and by person (charts).
7. **Export:** group summary as CSV or PDF.

## Domain rules (important)

- **Money is always stored and computed as integers in cents.** Never use floating point for amounts. Format to currency only at the UI boundary.
- When a split does not divide evenly, distribute the leftover cents deterministically (for example, to the first participants in a stable order) so that the sum of shares always equals the total exactly.
- The sum of all member balances in a group must always be zero. Add an invariant check and tests for it.
- Debt simplification: compute net balances, then repeatedly match the largest creditor with the largest debtor (greedy with two heaps). Keep this logic in a pure function with no I/O.
- A user can only read or modify data of groups they belong to. Enforce this on the server for every query and action, never only in the UI.

## Architecture and conventions

- Prefer **Server Components** by default; add `"use client"` only where interactivity requires it.
- Use **Server Actions** for mutations, validated with Zod. Return typed results (success or field errors), do not throw for expected validation failures.
- Use `useOptimistic` for adding expenses and recording payments, with rollback on failure.
- Keep domain logic (splitting, balances, simplification) in `src/lib/domain/` as pure, framework-free TypeScript.
- Keep database access in `src/lib/db/` (Prisma queries); components never import Prisma directly.
- Suggested structure:

```
src/
  app/                 # routes, layouts, server actions
  components/          # UI components
  lib/
    domain/            # pure money and settlement logic (heavily tested)
    db/                # Prisma queries
    validation/        # Zod schemas
  tests/               # E2E specs (Playwright)
prisma/                # schema and migrations
```

- Naming: `camelCase` for variables and functions, `PascalCase` for components and types, `kebab-case` for file names.
- No `any`. Prefer explicit return types on exported functions.
- Keep components small; extract hooks when logic is reused.
- Accessibility: semantic HTML, labels on all inputs, keyboard-navigable flows, sufficient color contrast.
- Mobile-first layouts; verify at 375px width.

## Commands

Package manager: **pnpm** (assumption, change if needed).

```bash
pnpm install          # install dependencies
pnpm dev              # start the dev server
pnpm build            # production build
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
pnpm test             # unit and component tests (Vitest)
pnpm test:e2e         # end-to-end tests (Playwright)
pnpm prisma migrate dev   # apply migrations locally
```

## Testing expectations

- Every function in `src/lib/domain/` must have unit tests, including edge cases: uneven splits, zero amounts, a single participant, a group of one, large groups, and the zero-sum invariant.
- Add at least one E2E flow: sign in, create a group, add an expense, see updated balances, settle up.
- Before finishing any task, run `pnpm lint`, `pnpm typecheck` and `pnpm test`, and fix failures.

## Definition of done

- Feature works on mobile and desktop.
- Types, lint and tests pass.
- No secrets in the repo; environment variables documented in `.env.example`.
- README updated when setup or features change.

## Out of scope (for now)

- Real payment processing or bank integrations
- Multi-currency conversion
- Native mobile apps
- Receipt OCR

## Working style for agents

- Make small, focused changes and explain what changed and why.
- Do not add new dependencies without a clear reason; mention it when you do.
- If a requirement is ambiguous, state your assumption briefly and proceed with the simplest reasonable option.
- Never change the money model (integer cents) or the authorization rules without explicit instruction.
