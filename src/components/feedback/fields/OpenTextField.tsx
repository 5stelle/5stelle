'use client'

import type { FieldProps } from '@/types/forms.types'

const MAX_LENGTH = 500

export function OpenTextField({ value, onChange }: FieldProps) {
  const textValue = (value as string) || ''
  const charCount = textValue.length

  return (
    <div className="space-y-2">
      <textarea
        value={textValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Scrivi qui il tuo commento..."
        maxLength={MAX_LENGTH}
        className="w-full min-h-[150px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring text-lg"
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{charCount}/{MAX_LENGTH} caratteri</span>
      </div>
    </div>
  )
}
