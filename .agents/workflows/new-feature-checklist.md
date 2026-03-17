---
description: Step-by-step for adding a new feature
---

1. **DB**: Create migration in `supabase/migrations/` and update `schema.sql`.
2. **Types**: Add/update interfaces in `src/types/index.ts`.
3. **API**: Implement Next.js Route Handlers. Add Zod validation.
4. **Hooks**: Create/update data-fetching hooks.
5. **UI**: Build components using the design system tokens.
6. **Metadata**: Add SEO/OG metadata for navigation pages.
7. **Testing**: Add unit tests for logic and hooks.
