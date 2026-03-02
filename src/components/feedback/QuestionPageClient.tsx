'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { Question, Sentiment } from '@/types/database.types'
import type { AnswerValue } from '@/types/forms.types'
import { ProgressBar } from './ProgressBar'
import { QuestionScreen } from './QuestionScreen'
import { NavigationButtons } from './NavigationButtons'
import { Turnstile } from '@marsidev/react-turnstile'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface QuestionPageClientProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  isFirst: boolean
  isLast: boolean
  formId: string
  restaurantSlug: string
  tableIdentifier: string | null
  tableParam: string | null
  isPreview?: boolean
  previewToken?: string | null
}

const SUBMISSION_KEY = 'feedback_submission'
const ANSWERS_KEY = 'feedback_answers'
const SENTIMENT_KEY = 'feedback_sentiment'

export function QuestionPageClient({
  question,
  questionIndex,
  totalQuestions,
  isFirst,
  isLast,
  formId,
  restaurantSlug,
  tableIdentifier,
  tableParam,
  isPreview = false,
  previewToken = null,
}: QuestionPageClientProps) {
  const router = useRouter()
  const supabase = createClient()

  const [answer, setAnswer] = useState<AnswerValue | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const showTurnstile = isLast && !isPreview && !!turnstileSiteKey

  const queryParts: string[] = []
  if (tableParam) queryParts.push(`t=${encodeURIComponent(tableParam)}`)
  if (isPreview && previewToken) queryParts.push(`preview=${encodeURIComponent(previewToken)}`)
  const navQuery = queryParts.length > 0 ? `?${queryParts.join('&')}` : ''

  // Load saved answer from sessionStorage
  useEffect(() => {
    const savedAnswers = sessionStorage.getItem(ANSWERS_KEY)
    if (savedAnswers) {
      const answers = JSON.parse(savedAnswers)
      if (answers[question.id]) {
        setAnswer(answers[question.id])
      } else {
        setAnswer(undefined)
      }
    } else {
      setAnswer(undefined)
    }
  }, [question.id])

  const saveAnswer = async () => {
    if (isPreview) {
      // Preview mode: only save to sessionStorage, skip all DB writes
      if (question.type === 'sentiment' && answer !== undefined) {
        sessionStorage.setItem(SENTIMENT_KEY, answer as string)
      }
      const savedAnswers = JSON.parse(sessionStorage.getItem(ANSWERS_KEY) || '{}')
      savedAnswers[question.id] = answer
      sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(savedAnswers))
      return 'preview'
    }

    // Get or create submission
    let submissionId: string | null = sessionStorage.getItem(SUBMISSION_KEY)

    if (!submissionId) {
      const { data, error } = await supabase
        .from('submissions')
        .insert({
          form_id: formId,
          table_identifier: tableIdentifier || null,
        })
        .select('id')
        .single()

      if (error) throw error
      submissionId = data.id as string
      sessionStorage.setItem(SUBMISSION_KEY, submissionId)
    }

    // Save answer to database
    if (answer !== undefined) {
      // Check if answer already exists
      const { data: existingAnswer } = await supabase
        .from('answers')
        .select('id')
        .eq('submission_id', submissionId)
        .eq('question_id', question.id)
        .single()

      if (existingAnswer) {
        const { error } = await supabase
          .from('answers')
          .update({ value: answer })
          .eq('id', existingAnswer.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('answers')
          .insert({
            submission_id: submissionId,
            question_id: question.id,
            value: answer,
          })
        if (error) throw error
      }

      // Track sentiment if this is a sentiment question
      if (question.type === 'sentiment') {
        sessionStorage.setItem(SENTIMENT_KEY, answer as string)
        const { error } = await supabase
          .from('submissions')
          .update({ overall_sentiment: answer as Sentiment })
          .eq('id', submissionId)
        if (error) throw error
      }
    }

    // Save to sessionStorage for local state
    const savedAnswers = JSON.parse(sessionStorage.getItem(ANSWERS_KEY) || '{}')
    savedAnswers[question.id] = answer
    sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(savedAnswers))

    return submissionId
  }

  const handleNext = async () => {
    setError(null)

    // Validate required
    if (question.is_required && (answer === undefined || answer === '')) {
      setError('Questa domanda è obbligatoria')
      return
    }

    setIsSubmitting(true)
    setDirection('forward')

    try {
      const submissionId = await saveAnswer()

      if (isLast) {
        if (!isPreview) {
          // Verify Turnstile token if configured
          if (turnstileSiteKey && turnstileToken) {
            const verifyRes = await fetch('/api/verify-turnstile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: turnstileToken }),
            })
            const verifyData = await verifyRes.json()

            if (!verifyData.success) {
              toast.error('Verifica di sicurezza fallita. Riprova.')
              setIsSubmitting(false)
              return
            }
          }

          // Mark submission as complete
          const { error: completeError } = await supabase
            .from('submissions')
            .update({ completed_at: new Date().toISOString() })
            .eq('id', submissionId)
          if (completeError) throw completeError
        }

        router.push(`/r/${restaurantSlug}/${formId}/review${isPreview && previewToken ? `?preview=${encodeURIComponent(previewToken)}` : ''}`)
      } else {
        router.push(`/r/${restaurantSlug}/${formId}/${questionIndex + 1}${navQuery}`)
      }
    } catch {
      console.error('Failed to save answer')
      setError('Errore nel salvare la risposta. Riprova.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (isFirst) return
    setDirection('backward')
    router.push(`/r/${restaurantSlug}/${formId}/${questionIndex - 1}${navQuery}`)
  }

  const variants = {
    enter: (dir: 'forward' | 'backward') => ({
      x: dir === 'forward' ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: 'forward' | 'backward') => ({
      x: dir === 'forward' ? -50 : 50,
      opacity: 0,
    }),
  }

  return (
    <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4">
      <ProgressBar current={questionIndex} total={totalQuestions} />

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full py-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={question.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <QuestionScreen
                question={question}
                value={answer}
                onChange={setAnswer}
                error={error}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {showTurnstile && (
          <Turnstile
            siteKey={turnstileSiteKey}
            options={{ size: 'invisible' }}
            onSuccess={setTurnstileToken}
          />
        )}

        <NavigationButtons
          isFirst={isFirst}
          isLast={isLast}
          isSubmitting={isSubmitting}
          isVerifying={showTurnstile && !turnstileToken}
          isVerified={showTurnstile && !!turnstileToken}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </div>
  )
}
