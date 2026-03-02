import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Recensione',
  robots: { index: false, follow: false },
}
import { notFound } from 'next/navigation'
import type { Restaurant, Form } from '@/types/database.types'
import { ReviewPromptClient } from '@/components/feedback/ReviewPromptClient'
import { verifyPreviewToken } from '@/lib/preview-token'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    restaurantSlug: string
    formId: string
  }>
  searchParams: Promise<{ preview?: string }>
}

export default async function ReviewPage({ params, searchParams }: Props) {
  const { restaurantSlug, formId } = await params
  const { preview } = await searchParams
  const isPreview = !!preview && verifyPreviewToken(formId, preview)
  const supabase = await createClient()

  // Fetch restaurant
  const { data: restaurantData } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', restaurantSlug)
    .single()

  const restaurant = restaurantData as Restaurant | null

  if (!restaurant) {
    notFound()
  }

  // Fetch form
  const { data: formData } = await supabase
    .from('forms')
    .select('*')
    .eq('id', formId)
    .eq('restaurant_id', restaurant.id)
    .single()

  const form = formData as Form | null

  if (!form) {
    notFound()
  }

  return (
    <ReviewPromptClient
      restaurant={restaurant}
      form={form}
      restaurantSlug={restaurantSlug}
      formId={formId}
      isPreview={isPreview}
      previewToken={isPreview ? preview : null}
    />
  )
}
