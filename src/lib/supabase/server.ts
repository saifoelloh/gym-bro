import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export function createServerSupabaseClient() {
    const cookieStore = cookies()
    const token = cookieStore.get('sb-access-token')?.value

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    return createClient(url, key, {
        global: {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
    })
}
