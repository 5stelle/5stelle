import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Feedback',
  robots: { index: false, follow: false },
}
import { notFound, redirect } from 'next/navigation'
import type { Restaurant, Form, Question } from '@/types/database.types'
import { QuestionPageClient } from '@/components/feedback/QuestionPageClient'
import { decodeTableId } from '@/lib/utils'
import { verifyPreviewToken } from '@/lib/preview-token'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    restaurantSlug: string
    formId: string
    index: string
  }>
  searchParams: Promise<{ t?: string; preview?: string }>
}

export default async function QuestionPage({ params, searchParams }: Props) {
  const { restaurantSlug, formId, index } = await params
  const { t, preview } = await searchParams
  const isPreview = !!preview && verifyPreviewToken(formId, preview)
  const questionIndex = parseInt(index, 10)
  const supabase = await createClient()

  // Decode table identifier from URL param
  let tableIdentifier: string | null = null
  if (t) {
    try {
      tableIdentifier = decodeTableId(t)
    } catch {
      // Invalid encoding, ignore
    }
  }

  // Validate index
  if (isNaN(questionIndex) || questionIndex < 1) {
    const query = t ? `?t=${encodeURIComponent(t)}` : ''
    redirect(`/r/${restaurantSlug}/${formId}/1${query}`)
  }

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

  // Check if table is active
  if (tableIdentifier) {
    const { data: tableData } = await supabase
      .from('tables')
      .select('is_active')
      .eq('restaurant_id', restaurant.id)
      .eq('identifier', tableIdentifier)
      .single()

    if (tableData && !tableData.is_active) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center space-y-3">
            <h1 className="text-xl font-semibold">Tavolo non attivo</h1>
            <p className="text-muted-foreground text-sm">
              Questo tavolo non è al momento attivo. Chiedi al personale per assistenza.
            </p>
          </div>
        </div>
      )
    }
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

  // Check if index is valid
  if (questionIndex > questions.length) {
    redirect(`/r/${restaurantSlug}/${formId}/review`)
  }

  const currentQuestion = questions[questionIndex - 1]
  const totalQuestions = questions.length
  const isFirst = questionIndex === 1
  const isLast = questionIndex === totalQuestions

  return (
    <QuestionPageClient
      question={currentQuestion}
      questionIndex={questionIndex}
      totalQuestions={totalQuestions}
      isFirst={isFirst}
      isLast={isLast}
      formId={formId}
      restaurantSlug={restaurantSlug}
      tableIdentifier={tableIdentifier}
      tableParam={t || null}
      isPreview={isPreview}
      previewToken={isPreview ? preview : null}
    />
  )
}
