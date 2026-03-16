---
description: How to add a new domain resource (Full-stack feature)
---

# Adding a New Domain Resource

Follow this end-to-end blueprint to ensure consistency across all layers of the Gym Tracker.

## 1. Database Layer
1. **Migration**: Create a new SQL file in `supabase/` or append to `schema.sql`.
2. **RLS**: Ensure Row Level Security is enabled.
3. **Draft Types**: Update `src/types/index.ts` with the new snake_case interface.

## 2. API Layer
1. **Route**: Create `src/app/api/[resource]/route.ts`.
2. **Standard Response**:
   ```typescript
   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
   return NextResponse.json(data);
   ```

## 3. Client & Hook Layer
1. **Client**: Add a new method in `src/lib/api/client.ts`.
2. **Hook**: Create `src/hooks/use[Resource].ts`.
   - Pattern: Must return `{ data, loading, error, refetch }`.

## 4. UI Layer
1. **Feature Page**: Create or update a page in `src/app/`.
2. **Components**: Use `src/components/ui` for primitives.
3. **Aesthetic Check**: Use `premium-ui-standard.md` for styling validation.

## Verification
- [ ] Build project: `npm run build`
- [ ] Lint check: `npm run lint`
- [ ] Manual test: Verify data flow from DB to UI.
