'use client'

import type { FieldProps } from '@/types/forms.types'
import type { Sentiment } from '@/types/database.types'
import { cn } from '@/lib/utils'
import { Frown, Meh, Smile } from 'lucide-react'

const sentiments: { value: Sentiment; label: string; icon: typeof Smile; color: string }[] = [
  { value: 'bad', label: 'Negativa', icon: Frown, color: 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100' },
  { value: 'ok', label: 'Ok', icon: Meh, color: 'text-yellow-500 border-yellow-200 bg-yellow-50 hover:bg-yellow-100' },
  { value: 'great', label: 'Positiva', icon: Smile, color: 'text-green-500 border-green-200 bg-green-50 hover:bg-green-100' },
]

export function SentimentField({ value, onChange }: FieldProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4">
        {sentiments.map((sentiment) => {
          const Icon = sentiment.icon
          const isSelected = value === sentiment.value
          return (
            <button
              key={sentiment.value}
              type="button"
              onClick={() => onChange(sentiment.value)}
              className={cn(
                'flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all',
                isSelected
                  ? `${sentiment.color} border-current ring-2 ring-offset-2 ring-current`
                  : 'border-muted hover:border-muted-foreground/30 bg-background'
              )}
            >
              <Icon className={cn('h-12 w-12', isSelected && sentiment.color.split(' ')[0])} />
              <span className="font-medium">{sentiment.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
