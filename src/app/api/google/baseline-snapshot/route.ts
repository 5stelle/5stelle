import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getPlaceDetails } from '@/lib/google-places'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { restaurantId, placeId } = await request.json()

  if (!restaurantId || !placeId) {
    return NextResponse.json(
      { error: 'restaurantId and placeId required' },
      { status: 400 }
    )
  }

  // Verify ownership
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id')
    .eq('id', restaurantId)
    .eq('owner_id', user.id)
    .single()

  if (!restaurant) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const details = await getPlaceDetails(placeId)

    const { error: insertError } = await supabaseAdmin
      .from('review_snapshots')
      .insert({
        restaurant_id: restaurantId,
        rating: details.rating,
        review_count: details.userRatingCount,
        recent_reviews: details.reviews,
        is_baseline: true,
      })

    if (insertError) {
      console.error('Baseline snapshot insert error:', insertError)
      return NextResponse.json(
        { error: 'Errore nel salvataggio' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      rating: details.rating,
      reviewCount: details.userRatingCount,
    })
  } catch (error) {
    console.error('Baseline snapshot error:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero dei dati Google' },
      { status: 500 }
    )
  }
}
