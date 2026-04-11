import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Restaurant, Form, Question } from '@/types/database.types'
import { TurnstileProvider } from '@/components/feedback/TurnstileProvider'
import { PreviewBanner } from '@/components/feedback/PreviewBanner'

interface Props {
  children: React.ReactNode
  params: Promise<{
    restaurantSlug: string
    formId: string
  }>
}

export async function generateMetadata({ params }: Props) {
  const { restaurantSlug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('restaurants')
    .select('name')
    .eq('slug', restaurantSlug)
    .single()

  const restaurant = data as { name: string } | null

  return {
    title: restaurant ? `Feedback - ${restaurant.name}` : 'Feedback',
    description: 'Lascia un feedback sulla tua esperienza',
  }
}

export default async function FeedbackLayout({ children, params }: Props) {
  const { restaurantSlug, formId } = await params
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
    .eq('is_active', true)
    .single()

  const form = formData as Form | null

  if (!form) {
    notFound()
  }

  // Fetch questions
  const { data: questionsData } = await supabase
    .from('questions')
    .select('*')
    .eq('form_id', form.id)
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  const questions = (questionsData || []) as Question[]

  if (questions.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PreviewBanner />

      {/* Header with restaurant name */}
      <header className="py-4 px-6 border-b">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="font-semibold text-lg">{restaurant.name}</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <TurnstileProvider>
          {children}
        </TurnstileProvider>
      </main>
    </div>
  )
}
