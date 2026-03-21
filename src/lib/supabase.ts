import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!url) throw new Error('Missing SUPABASE_URL')
if (!key) throw new Error('Missing SUPABASE_KEY')

export const supabase = createBrowserClient(url, key)
