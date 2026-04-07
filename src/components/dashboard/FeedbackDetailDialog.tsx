'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Submission, Question, Answer } from '@/types/database.types'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Frown, Meh, Smile, Star, CircleAlert } from 'lucide-react'

interface FeedbackDetailDialogProps {
  submission: Submission | null
  formId?: string
  tableNames?: Record<string, string>
  onClose: () => void
}

interface AnswerWithQuestion extends Answer {
  question?: Question
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function SentimentDisplay({ sentiment }: { sentiment: string | null }) {
  switch (sentiment) {
    case 'great':
      return (
        <div className="flex items-center gap-2 text-green-600">
          <Smile className="h-5 w-5" />
          <span>Ottimo</span>
        </div>
      )
    case 'ok':
      return (
        <div className="flex items-center gap-2 text-yellow-600">
          <Meh className="h-5 w-5" />
          <span>Ok</span>
        </div>
      )
    case 'bad':
      return (
        <div className="flex items-center gap-2 text-red-600">
          <Frown className="h-5 w-5" />
          <span>Negativo</span>
        </div>
      )
    default:
      return <span>-</span>
  }
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

function AnswerDisplay({ answer, question }: { answer: Answer; question?: Question }) {
  const value = answer.value

  if (!question) {
    return <span className="text-muted-foreground">-</span>
  }

  switch (question.type) {
    case 'sentiment':
      return <SentimentDisplay sentiment={value as string} />
    case 'star_rating':
      return <StarRating value={value as number} />
    case 'open_text':
      return (
        <p className="text-foreground whitespace-pre-wrap">
          {(value as string) || <span className="text-muted-foreground italic">Nessuna risposta</span>}
        </p>
      )
    case 'multiple_choice':
      const choices = value as string[]
      return choices.length > 0 ? (
        <ul className="list-disc list-inside">
          {choices.map((choice, i) => (
            <li key={i}>{choice}</li>
          ))}
        </ul>
      ) : (
        <span className="text-muted-foreground italic">Nessuna selezione</span>
      )
    case 'single_choice':
      return <span>{value as string}</span>
    default:
      return <span>{JSON.stringify(value)}</span>
  }
}

export function FeedbackDetailDialog({
  submission,
  formId,
  tableNames = {},
  onClose,
}: FeedbackDetailDialogProps) {
  const supabase = createClient()
  const [answers, setAnswers] = useState<AnswerWithQuestion[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    if (!submission || !formId) return

    const fetchDetails = async () => {
      setIsLoading(true)
      setLoadError(false)

      // Fetch answers and questions
      const [answersResult, questionsResult] = await Promise.all([
        supabase
          .from('answers')
          .select('*')
          .eq('submission_id', submission.id),
        supabase
          .from('questions')
          .select('*')
          .eq('form_id', formId)
          .order('order_index', { ascending: true }),
      ])

      if (answersResult.error || questionsResult.error) {
        console.error('Failed to load feedback details')
        setLoadError(true)
        setIsLoading(false)
        return
      }

      setAnswers((answersResult.data || []) as Answer[])
      setQuestions((questionsResult.data || []) as Question[])
      setIsLoading(false)
    }

    fetchDetails()
  }, [submission, formId, supabase])

  // Match answers with their questions (answers drive the list, so soft-deleted questions still render)
  const answersWithQuestions = answers
    .map((answer) => {
      const question = questions.find((q) => q.id === answer.question_id)
      return { question, answer }
    })
    .sort((a, b) => (a.question?.order_index ?? 0) - (b.question?.order_index ?? 0))

  return (
    <Dialog open={!!submission} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dettaglio Feedback</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CircleAlert className="h-8 w-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium mb-1">Errore nel caricamento</p>
            <p className="text-sm text-muted-foreground">
              Non è stato possibile caricare i dettagli. Chiudi e riprova.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-muted-foreground"
            >
              {submission && formatDate(submission.created_at)}
              {submission?.table_identifier && (
                <span className="ml-2 inline-flex items-center text-xs font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                  {tableNames[submission.table_identifier] || submission.table_identifier}
                </span>
              )}
            </motion.div>

            <div className="space-y-4">
              {answersWithQuestions.map(({ question, answer }, i) => (
                <motion.div
                  key={answer.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.06, ease: 'easeOut' }}
                  className="space-y-1"
                >
                  <p className="font-medium text-sm">
                    {question?.label ?? 'Domanda rimossa'}
                  </p>
                  <AnswerDisplay answer={answer} question={question} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
