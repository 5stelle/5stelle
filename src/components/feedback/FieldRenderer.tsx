'use client'

import type { Question } from '@/types/database.types'
import type { AnswerValue } from '@/types/forms.types'
import { SentimentField } from './fields/SentimentField'
import { StarRatingField } from './fields/StarRatingField'
import { OpenTextField } from './fields/OpenTextField'
import { MultipleChoiceField } from './fields/MultipleChoiceField'
import { SingleChoiceField } from './fields/SingleChoiceField'

interface FieldRendererProps {
  question: Question
  value: AnswerValue | undefined
  onChange: (value: AnswerValue) => void
}

export function FieldRenderer({
  question,
  value,
  onChange,
}: FieldRendererProps) {
  const props = { question, value, onChange }

  switch (question.type) {
    case 'sentiment':
      return <SentimentField {...props} />
    case 'star_rating':
      return <StarRatingField {...props} />
    case 'open_text':
      return <OpenTextField {...props} />
    case 'multiple_choice':
      return <MultipleChoiceField {...props} />
    case 'single_choice':
      return <SingleChoiceField {...props} />
    default:
      return <div>Tipo di domanda non supportato</div>
  }
}
