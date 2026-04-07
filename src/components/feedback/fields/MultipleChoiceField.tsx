'use client'

import type { FieldProps } from '@/types/forms.types'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface Option {
  id: string
  label: string
}

export function MultipleChoiceField({ question, value, onChange }: FieldProps) {
  const options = (question.options as unknown as Option[]) || []
  const selectedValues = (value as string[]) || []

  const handleChange = (optionLabel: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, optionLabel])
    } else {
      onChange(selectedValues.filter((v) => v !== optionLabel))
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {options.map((option) => {
          const isChecked = selectedValues.includes(option.label)
          return (
            <label
              key={option.id}
              className={cn(
                'flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors',
                isChecked
                  ? 'border-primary bg-primary/5'
                  : 'hover:bg-muted/50'
              )}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleChange(option.label, checked as boolean)
                }
              />
              <span className="text-lg">{option.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
