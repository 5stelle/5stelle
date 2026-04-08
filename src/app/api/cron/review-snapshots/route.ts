import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getPlaceDetails } from '@/lib/google-places'

export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  const expected = `Bearer ${process.env.CRON_SECRET}`

  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch all restaurants with a Google Place ID in social_links
  const { data: restaurants, error: fetchError } = await supabaseAdmin
    .from('restaurants')
    .select('id, social_links')
    .not('social_links', 'is', null)

  if (fetchError) {
    console.error('Cron: failed to fetch restaurants', fetchError)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  // Filter to restaurants that have a google place ID
  const withGoogle = (restaurants || []).filter((r) => {
    const links = r.social_links as Record<string, string> | null
    return links?.google && links.google.startsWith('ChIJ')
  })

  if (withGoogle.length === 0) {
    return NextResponse.json({ message: 'No restaurants with Google Place ID', processed: 0 })
  }

  let success = 0
  let failed = 0

  for (const restaurant of withGoogle) {
    const placeId = (restaurant.social_links as Record<string, string>).google

    try {
      const details = await getPlaceDetails(placeId)

      const { error: insertError } = await supabaseAdmin
        .from('review_snapshots')
        .insert({
          restaurant_id: restaurant.id,
          rating: details.rating,
          review_count: details.userRatingCount,
          recent_reviews: details.reviews,
          is_baseline: false,
        })

      if (insertError) {
        console.error(`Cron: snapshot insert failed for ${restaurant.id}`, insertError)
        failed++
      } else {
        success++
      }
    } catch (error) {
      console.error(`Cron: Place Details failed for ${restaurant.id}`, error)
      failed++
    }
  }

  return NextResponse.json({
    message: 'Cron completed',
    total: withGoogle.length,
    success,
    failed,
  })
}
