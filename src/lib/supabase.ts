import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) throw new Error('Missing SUPABASE_URL')
if (!key) throw new Error('Missing SUPABASE_KEY')

export const supabase = createClient(url, key, {
    auth: {
        persistSession: typeof window !== 'undefined',
    }
})
