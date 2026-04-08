const API_KEY = process.env.GOOGLE_PLACES_API_KEY!
const BASE_URL = 'https://places.googleapis.com/v1'

export interface PlacePrediction {
  placeId: string
  mainText: string
  secondaryText: string
}

export interface PlaceReview {
  authorName: string
  rating: number
  text: string
  relativeTime: string
}

export interface PlaceDetails {
  placeId: string
  displayName: string
  formattedAddress: string
  rating: number | null
  userRatingCount: number | null
  reviews: PlaceReview[] | null
  photoUri: string | null
  googleMapsUri: string | null
}

export async function searchPlaces(query: string): Promise<PlacePrediction[]> {
  const response = await fetch(`${BASE_URL}/places:autocomplete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
    },
    body: JSON.stringify({
      input: query,
      includedPrimaryTypes: [
        'restaurant',
        'cafe',
        'bar',
        'meal_takeaway',
        'meal_delivery',
      ],
      includedRegionCodes: ['it'],
      languageCode: 'it',
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error('Places Autocomplete error body:', errorBody)
    throw new Error(`Places Autocomplete failed: ${response.status}`)
  }

  const data = await response.json()

  return (data.suggestions || [])
    .filter((s: Record<string, unknown>) => s.placePrediction)
    .map((s: Record<string, Record<string, unknown>>) => {
      const p = s.placePrediction as Record<string, unknown>
      const sf = p.structuredFormat as Record<string, Record<string, string>> | undefined
      const text = p.text as Record<string, string> | undefined
      return {
        placeId: p.placeId as string,
        mainText: sf?.mainText?.text || text?.text || '',
        secondaryText: sf?.secondaryText?.text || '',
      }
    })
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const response = await fetch(`${BASE_URL}/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask':
        'displayName,formattedAddress,rating,userRatingCount,reviews,photos,googleMapsUri',
    },
  })

  if (!response.ok) {
    throw new Error(`Place Details failed: ${response.status}`)
  }

  const data = await response.json()

  // Resolve first photo to a public CDN URL
  let photoUri: string | null = null
  if (data.photos?.[0]?.name) {
    try {
      const photoRes = await fetch(
        `${BASE_URL}/${data.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&key=${API_KEY}&skipHttpRedirect=true`
      )
      if (photoRes.ok) {
        const photoData = await photoRes.json()
        photoUri = photoData.photoUri || null
      }
    } catch {
      // Photo fetch failed — non-critical
    }
  }

  return {
    placeId,
    displayName: data.displayName?.text || '',
    formattedAddress: data.formattedAddress || '',
    rating: data.rating ?? null,
    userRatingCount: data.userRatingCount ?? null,
    reviews:
      data.reviews?.slice(0, 5).map(
        (r: Record<string, unknown>) => ({
          authorName:
            (r.authorAttribution as Record<string, string>)?.displayName || 'Anonimo',
          rating: (r.rating as number) || 0,
          text: (r.text as Record<string, string>)?.text || '',
          relativeTime: (r.relativePublishTimeDescription as string) || '',
        })
      ) || null,
    photoUri,
    googleMapsUri: data.googleMapsUri || null,
  }
}
