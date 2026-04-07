import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Modulo Feedback',
  robots: { index: false, follow: false },
}
import { redirect } from 'next/navigation'
import type { Restaurant, Form, Question } from '@/types/database.types'
import { FormBuilderClient } from '@/components/form-builder/FormBuilderClient'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { generatePreviewToken } from '@/lib/preview-token'

export default async function FormBuilderPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: restaurantData } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  const restaurant = restaurantData as Restaurant | null

  if (!restaurant) {
    redirect('/onboarding')
  }

  // Get the restaurant's form
  const { data: formData } = await supabase
    .from('forms')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .single()

  const form = formData as Form | null

  // Get questions for the form
  let questions: Question[] = []
  if (form) {
    const { data: questionsData } = await supabase
      .from('questions')
      .select('*')
      .eq('form_id', form.id)
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    questions = (questionsData || []) as Question[]
  }

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const previewUrl = form
    ? `${appBaseUrl}/r/${restaurant.slug}/${form.id}?preview=${generatePreviewToken(form.id)}`
    : null

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Modulo Feedback</h1>
          <p className="text-muted-foreground mt-1">
            Personalizza le domande del tuo modulo
          </p>
        </div>
        {previewUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Anteprima
            </a>
          </Button>
        )}
      </div>

      <FormBuilderClient
        form={form}
        initialQuestions={questions}
        restaurantId={restaurant.id}
      />
    </div>
  )
}
