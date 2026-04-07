'use client'

import { useState } from 'react'
import type { FieldProps } from '@/types/forms.types'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

export function StarRatingField({ value, onChange }: FieldProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const currentValue = (value as number) || 0
  const displayValue = hoverValue ?? currentValue

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(null)}
            className="p-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring rounded-full"
          >
            <Star
              className={cn(
                'h-10 w-10 transition-colors',
                star <= displayValue
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-200'
              )}
            />
          </button>
        ))}
      </div>
      <div className="text-center text-sm text-muted-foreground">
        {currentValue === 0 && 'Seleziona una valutazione'}
        {currentValue === 1 && 'Pessimo'}
        {currentValue === 2 && 'Scarso'}
        {currentValue === 3 && 'Nella media'}
        {currentValue === 4 && 'Buono'}
        {currentValue === 5 && 'Eccellente'}
      </div>
    </div>
  )
}
