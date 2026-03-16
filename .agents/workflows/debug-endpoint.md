---
description: How to trace and debug errors in API endpoints
---

# Debugging API Endpoints Workflow

Use this workflow to identify and fix issues in the backend service layer.

## 1. Trace the Error Code
- **Client Side**: Check the browser console. The `fetcher` helper in `src/lib/api/client.ts` prints the error thrown by the API.
- **Server Side**: Look for `HTTP 500` or `HTTP 400` logs in the development console (where `npm run dev` is running).

## 2. Locate the Route
- Identify the path (e.g., `/api/workouts/[id]`).
- Open the corresponding file in `src/app/api/workouts/[id]/route.ts`.

## 3. Debug Database Queries
- Check the Supabase query logic.
- Common issues:
  - Incorrect table name.
  - Missing columns in `.select()`.
  - Type mismatch in `where` or `insert` payloads.
- **Tip**: Add `console.log(data, error)` after the Supabase call to see the raw response.

## 4. Check Types
- Ensure the payload received in `await req.json()` matches the Expected interface in `src/types/index.ts`.

## 5. Verification
- [ ] Fix the issue and restart the dev server if needed.
- [ ] Run `npm run lint` to ensure no regression in types.

> [!TIP]
> Use the Supabase dashboard's "Logs" section if the database error message in the API response is too vague.
