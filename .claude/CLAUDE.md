# CLAUDE.md

## Frontend Project Overview

This repository contains the frontend application for Aduvanta.

Aduvanta is an enterprise-grade customs and foreign trade operations platform.
The frontend must feel modern, reliable, operationally clear, and built for serious business workflows.

This is not a landing-page-first product.
This frontend must be built as a real enterprise application from the beginning.

The current priority is the foundation layer:

- authentication
- protected dashboard shell
- organization switching
- users management
- roles and permissions views
- audit logs views

Do not prioritize advanced dashboards, marketing pages, finance, AI, or decorative UI before the foundation is working correctly.

---

## Official Frontend Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- React Hook Form
- Zod
- TanStack Query
- Zustand only when truly necessary for cross-screen client state
- Sentry
- Optional later-stage OpenTelemetry browser instrumentation

---

## Global Rules

### Code Style

- Comments in English only
- Prefer functional programming over OOP
- Write pure functions whenever possible
- Follow DRY, KISS, and YAGNI principles
- Use strict typing everywhere
- Check if logic already exists before writing new code
- Avoid untyped variables and generic types
- Never use default parameter values
- Create proper type definitions for complex data structures
- All imports at the top of the file
- Write simple single-purpose functions
- Avoid multi-mode behavior and flag parameters that switch logic

### Error Handling

- Always raise errors explicitly, never silently ignore them
- Use clear and actionable error messages
- Avoid catch-all error handling that hides the root cause
- No fallbacks unless explicitly requested
- Fix root causes, not symptoms
- Logging should use structured fields instead of interpolated dynamic strings

### Libraries and Dependencies

- Install dependencies in the project environment, not globally
- Add dependencies to project config files
- Do not introduce new dependencies without a clear reason
- If a dependency is already installed, inspect real usage before adding alternatives

### Claude Code Workflow

- Read the existing code and relevant `CLAUDE.md` files before editing
- Keep changes minimal and related to the current request
- Match the existing repository style
- Do not revert unrelated changes
- If unsure, inspect the codebase instead of inventing patterns
- Run lint and relevant tests if the task changed code

---

## Frontend Architecture Rules

### General Structure

Frontend code must be organized around:

- route groups
- domain features
- shared UI components
- providers
- typed API integrations
- app-level utilities

Recommended top-level structure:

- `src/app`
- `src/components`
- `src/features`
- `src/lib`
- `src/providers`
- `src/types`

### Route Organization

Use route groups to separate concerns:

- `(auth)` for auth-related routes
- `(dashboard)` for authenticated application routes

Examples:

- `src/app/(auth)/login/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/app/(dashboard)/users/page.tsx`

Do not mix unauthenticated and authenticated concerns in the same route structure.

### Dashboard Protection

- All dashboard routes must be protected
- Never render protected application screens before auth state is known
- Never assume the active organization without explicit context
- Route protection is required for all internal platform pages

### Component Boundaries

Prefer this separation:

- `components/ui` for generic UI building blocks
- `components/layout` for app shell pieces
- `components/<domain>` for reusable domain-specific UI pieces
- `features/<domain>` for domain logic, hooks, schemas, and typed API functions

Do not put business logic inside generic UI components.

---

## State Management Rules

### Server State

- Use TanStack Query for server state
- Keep fetching logic out of presentational components
- Use typed query keys and typed response models
- Invalidate queries intentionally after mutations
- Do not duplicate server state in Zustand or component state

### Client State

- Use local component state for local UI concerns
- Use React context when state belongs to a clear subtree
- Use Zustand only when state is truly cross-screen and client-side
- Do not use global stores for everything

### Auth State

- Auth state must be centralized
- Auth session and current user context must be available through a dedicated auth layer
- Active organization context must be explicit and typed
- Never infer permissions from UI state alone

---

## Forms and Validation Rules

- Use React Hook Form for forms
- Use Zod for schema validation
- Keep schemas close to the feature they belong to
- Use typed form values
- Avoid inline validation logic spread across components
- Do not rely only on HTML validation
- Keep form submission logic outside visual-only components

Examples of preferred placement:

- `features/auth/schemas/login.schema.ts`
- `features/users/schemas/invite-user.schema.ts`

---

## Permissions and Navigation Rules

- Sidebar navigation must be permission-aware
- Page rendering must be permission-aware
- Action buttons must be permission-aware
- Frontend permission checks are for UX only
- Backend authorization remains the source of truth

Do not hardcode scattered permission strings in multiple components.
Permission codes must come from a central place.

Recommended file:

- `src/lib/permissions.ts`

---

## Data and API Rules

- All API interactions must be typed
- Centralize API client configuration
- Avoid ad hoc `fetch` logic spread across the app
- Prefer domain-specific API functions inside each feature
- Normalize API response handling patterns

Recommended structure:

- `features/users/api/get-users.ts`
- `features/users/api/invite-user.ts`
- `features/organizations/api/get-organizations.ts`

Shared API configuration should live in:

- `src/lib/api-client.ts`

---

## UI and UX Principles

The UI must feel:

- modern
- enterprise-grade
- clear
- efficient
- trustworthy
- operationally focused

### Priorities

- clarity over decoration
- speed over cleverness
- consistency over visual experimentation
- dense but readable layouts
- strong hierarchy for tables, forms, filters, and status indicators

### Avoid

- decorative complexity without functional value
- oversized empty layouts that waste screen space
- excessive animation
- inconsistent spacing systems
- random color usage for business states

### Favor

- strong tables
- filters
- status badges
- timelines
- audit visibility
- structured detail views
- predictable dashboard navigation

---
