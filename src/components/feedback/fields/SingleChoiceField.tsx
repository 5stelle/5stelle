'use client'

import type { FieldProps } from '@/types/forms.types'
import { cn } from '@/lib/utils'
import { Circle, CircleDot } from 'lucide-react'

interface Option {
  id: string
  label: string
}

export function SingleChoiceField({ question, value, onChange }: FieldProps) {
  const options = (question.options as unknown as Option[]) || []
  const selectedValue = value as string

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedValue === option.label
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.label)}
              className={cn(
                'flex items-center gap-4 p-4 border rounded-lg w-full text-left transition-colors',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'hover:bg-muted/50'
              )}
            >
              {isSelected ? (
                <CircleDot className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="text-lg">{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
