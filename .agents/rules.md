# Gym Tracker Project Rules & Guidelines

## 1. Project Overview
- **Tech Stack**: Next.js 14 (App Router), React 18, Tailwind CSS, Supabase (PostgreSQL).
- **Architecture**: Layered approach (DB -> API -> Hooks -> UI).

## 2. Layered Architecture Guidelines

### A. Database Layer (Supabase/PostgreSQL)
- **Schema**: Tables and columns MUST use `snake_case`.
- **Migration Order**: 
    1. `supabase/schema.sql` (Base tables, RLS, Functions).
    2. `supabase/schema_templates.sql` (Workout templates).
    3. `supabase/schema_expand_exercises.sql` (Full exercise library).
- **RLS**: Every table MUST have Row Level Security enabled.
- **Enums**: Check constraints (e.g., `exercise_type`) should be kept updated in SQL.

### B. API Layer (Next.js API Routes)
- **Response Format**: Status 200/201 for success. Errors MUST return `{ error: string }` with 4xx/5xx status.
- **Supabase Client**: Use the centralized client from `@/lib/supabase`.
- **Logic**: Calculations (Volume, RPE) should ideally be done or validated at this layer to ensure consistency.

### C. Hook & Service Layer (`src/hooks`, `src/lib/api`)
- **Centralized API**: Use `src/lib/api/client.ts` for all external calls.
- **Hook Boilerplate**: Every data hook MUST provide `{ data, loading, error, refetch }`.
- **Types**: Always use types from `src/types/index.ts`. Propagate these types from API responses to hooks.

### D. UI Layer (`src/components`)
- **Visual Source of Truth**: Refer to [.agents/design-system.md](file:///Users/ekuid/Documents/saipul/gym-tracker/.agents/design-system.md) for all color tokens, typography, and premium aesthetic guidelines.
- **Components**: Use `src/components/ui/` for primitives. Always check for existing components before creating new ones.
- **Icons**: Use `lucide-react`.

# Premium UI Standards

This guide ensures every dynamic and interactive elements feel premium and "Vibe-Check" approved. Refer to the [Design System](file:///Users/ekuid/Documents/saipul/gym-tracker/.agents/design-system.md) for the full palette and typography rules.

## 1. Visual Alignment
- **Checklist**:
    - [ ] Is it using `italic` + `font-black` (Oswald) for primary headers/actions?
    - [ ] Does it have `active:scale-95` on click?
    - [ ] Is it using `bg-surface` or `bg-card` for layering instead of plain black?

## 3. Domain Logic & Calculations
- **Volume**: `weight_kg * reps`.
- **RPE**: 1-10 intensity scale.
- **Exercise Types**: 
    - `weighted`: Standard weight.
    - `bodyweight_variable`: Bodyweight +/- added/removed weight.
    - `assisted`: Weight value represents assistance amount (negative logic).
    - `timed`: Duration-based exercises.

## 4. Coding Standards & Conventions
- **Naming**: 
    - Components: `PascalCase`.
    - Functions/Variables: `camelCase`.
    - Database/Types: `snake_case` (for entity matching).
- **Git**: Follow Conventional Commits (`feat`, `fix`, `docs`, `refactor`). Use imperative mood ("Add", "Fix").

## 5. ⛔ Don'ts
- **NO Direct DB Access in UI**: Always go through `src/hooks` -> `api`.
- **NO Generic Components**: Check `src/components/ui` before creating new primitive components.
- **NO Hardcoding**: Use `.env` variables via centralized config.
- **NO Skipping Validation**: Always validate payload shapes in API routes.

## 6. Communication Preferences
- **Language**: Mix of Indonesian and English (chat), English (code/comments).
- **Documentation**: Maintain `task.md` and implementation plans for all complex feature additions.

## 7. Documentation Maintenance (Sync)
- **Automatic Check**: A Git pre-commit hook (`doc-guard.sh`) is active.
- **AI Responsibility**: Every time I (the AI) modify `API`, `Types`, or `DB` layers, I MUST proactively ask or check if `.agents/` rules/workflows need an update.
- **Consistency**: The `README.md` should always reflect the current state of supported exercise types and setup guides.
