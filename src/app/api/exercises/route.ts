import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('exercises')
    .select('id, name, muscle_group, sub_category, exercise_type, is_custom, created_at')
    .order('muscle_group')
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
