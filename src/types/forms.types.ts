import type { Question, QuestionType, Sentiment } from './database.types'

// Form builder types
export interface QuestionOption {
  id: string
  label: string
}

export interface FormTemplate {
  id: string
  name: string
  description: string
  questions: Omit<Question, 'id' | 'form_id' | 'created_at' | 'is_active'>[]
}

// Customer feedback flow types
export interface FeedbackState {
  submissionId: string | null
  answers: Record<string, AnswerValue>
  currentIndex: number
  overallSentiment: Sentiment | null
}

export type AnswerValue =
  | string           // open_text, single_choice
  | number           // star_rating
  | string[]         // multiple_choice
  | Sentiment        // sentiment

// Field component props
export interface FieldProps {
  question: Question
  value: AnswerValue | undefined
  onChange: (value: AnswerValue) => void
}

// Question type metadata
export interface QuestionTypeMeta {
  type: QuestionType
  label: string
  icon: string
  description: string
}

export const QUESTION_TYPE_META: Record<QuestionType, Omit<QuestionTypeMeta, 'type'>> = {
  sentiment: {
    label: 'Valutazione generale',
    icon: 'smile',
    description: 'Scegli tra Pessimo, Ok e Ottimo',
  },
  star_rating: {
    label: 'Stelle',
    icon: 'star',
    description: 'Valutazione da 1 a 5 stelle',
  },
  open_text: {
    label: 'Testo libero',
    icon: 'text',
    description: 'Campo di testo aperto',
  },
  multiple_choice: {
    label: 'Scelta multipla',
    icon: 'check-square',
    description: 'Seleziona una o più opzioni',
  },
  single_choice: {
    label: 'Scelta singola',
    icon: 'circle-dot',
    description: 'Seleziona una sola opzione',
  },
}

// Default templates
export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: 'quick-simple',
    name: 'Veloce e Semplice',
    description: '2 domande: valutazione generale + commento',
    questions: [
      {
        type: 'sentiment',
        label: 'Come è stata la tua esperienza?',
        description: null,
        is_required: true,
        options: null,
        order_index: 0,
      },
      {
        type: 'open_text',
        label: 'Vuoi lasciarci un commento?',
        description: 'Facoltativo',
        is_required: false,
        options: null,
        order_index: 1,
      },
    ],
  },
  {
    id: 'detailed',
    name: 'Feedback Dettagliato',
    description: '4 domande: valutazione + cibo + servizio + commento',
    questions: [
      {
        type: 'sentiment',
        label: 'Come è stata la tua esperienza complessiva?',
        description: null,
        is_required: true,
        options: null,
        order_index: 0,
      },
      {
        type: 'star_rating',
        label: 'Come valuti il cibo?',
        description: null,
        is_required: true,
        options: null,
        order_index: 1,
      },
      {
        type: 'star_rating',
        label: 'Come valuti il servizio?',
        description: null,
        is_required: true,
        options: null,
        order_index: 2,
      },
      {
        type: 'open_text',
        label: 'Hai suggerimenti per migliorare?',
        description: 'Facoltativo',
        is_required: false,
        options: null,
        order_index: 3,
      },
    ],
  },
]

// Max questions per form
export const MAX_QUESTIONS_PER_FORM = 6
