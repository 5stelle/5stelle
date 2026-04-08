import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchPlaces } from '@/lib/google-places'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const query = request.nextUrl.searchParams.get('q')
  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    const suggestions = await searchPlaces(query)
    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Places Autocomplete error:', error)
    return NextResponse.json(
      { error: 'Errore nella ricerca' },
      { status: 500 }
    )
  }
}
