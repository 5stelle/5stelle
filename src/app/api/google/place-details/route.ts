import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPlaceDetails } from '@/lib/google-places'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const placeId = request.nextUrl.searchParams.get('placeId')
  if (!placeId) {
    return NextResponse.json({ error: 'placeId required' }, { status: 400 })
  }

  try {
    const details = await getPlaceDetails(placeId)
    return NextResponse.json(details)
  } catch (error) {
    console.error('Place Details error:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero dei dettagli' },
      { status: 500 }
    )
  }
}
