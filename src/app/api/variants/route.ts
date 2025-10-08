export const runtime = 'edge'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('image_catalog')
      .select('id, url, weight, theme')
      .eq('is_active', true)
      .order('weight', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data || [])

  } catch (error) {
    console.error('Error fetching variants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch variants' },
      { status: 500 }
    )
  }
}
