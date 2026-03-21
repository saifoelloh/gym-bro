---
description: How to add a new API endpoint in the Gym Tracker project
---

# Add New API Endpoint Workflow

Follow these steps to add a new API endpoint consistently.

## 1. Define Types
Add necessary request/response interfaces in `src/types/index.ts`.
- Use `PascalCase` for interface names.
- Entity properties should use `snake_case` (matching database).

## 2. Create API Route
Create a new directory and `route.ts` in `src/app/api/`.
- File: `src/app/api/[resource]/route.ts` or `src/app/api/[resource]/[id]/route.ts`.
- Pattern:
  ```typescript
  import { NextRequest, NextResponse } from 'next/server'
  import { createServerSupabaseClient } from '@/lib/supabase/server'
  // import { ZodSchema } from '@/lib/schemas'

  export async function GET(req: NextRequest) {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // const body = ZodSchema.parse(await req.json()) // for POST/PUT
    const { data, error } = await supabase.from('...').select('...').eq('user_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }
  ```

## 3. Update API Client
Add the new method to the `api` object in `src/lib/api/client.ts`.
- Maintain the nested structure (e.g., `api.workouts.list`).
- Use the `fetcher<T>` helper for automatic error handling.

## 4. Create/Update Hook
Create or update a hook in `src/hooks/` (e.g., `useMyResource.ts`) using `useSWR`.
- Pattern:
  ```typescript
  import useSWR from 'swr'
  
  const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
  }

  export function useResource() {
    const { data, error, isLoading, mutate } = useSWR<T[]>('/api/resource', fetcher)
    return { data: data || [], loading: isLoading, error, refetch: mutate }
  }
  ```

## 5. Usage in Components
- Import the custom hook in your component.
- **NO** direct `api` or `supabase` calls in standard UI components if a hook is available.

## 6. Verification
- [ ] Run `npm run lint` to check for type errors.
- [ ] Test the endpoint using a browser or curl.
- [ ] Verify error handling by forcing a failed query.

> [!WARNING]
> Always return errors as `{ error: "message" }` to ensure the frontend `fetcher` can parse it correctly.
