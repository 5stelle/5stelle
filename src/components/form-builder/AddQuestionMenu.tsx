'use client'

import { useState } from 'react'
import type { Question, QuestionType } from '@/types/database.types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  Plus,
  Smile,
  Star,
  AlignLeft,
  CheckSquare,
  CircleDot,
  FileText,
  Loader2,
} from 'lucide-react'
import { QUESTION_TYPE_META, FORM_TEMPLATES } from '@/types/forms.types'

interface AddQuestionMenuProps {
  onAdd: (question: Omit<Question, 'id' | 'created_at' | 'is_active'>) => Promise<void>
  onApplyTemplate: (questions: Omit<Question, 'id' | 'form_id' | 'created_at' | 'is_active'>[]) => Promise<void>
  disabled?: boolean
  formId: string
}

const typeIcons: Record<QuestionType, typeof Smile> = {
  sentiment: Smile,
  star_rating: Star,
  open_text: AlignLeft,
  multiple_choice: CheckSquare,
  single_choice: CircleDot,
}

const defaultLabels: Record<QuestionType, string> = {
  sentiment: 'Come è stata la tua esperienza?',
  star_rating: 'Come valuti questo aspetto?',
  open_text: 'Hai commenti o suggerimenti?',
  multiple_choice: 'Seleziona le opzioni che preferisci',
  single_choice: 'Seleziona un\'opzione',
}

const defaultOptions = [
  { id: '1', label: '' },
]

export function AddQuestionMenu({ onAdd, onApplyTemplate, disabled, formId }: AddQuestionMenuProps) {
  const [open, setOpen] = useState(false)
  const [confirmTemplate, setConfirmTemplate] = useState<typeof FORM_TEMPLATES[0] | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const handleAdd = async (type: QuestionType) => {
    const hasOptions = type === 'multiple_choice' || type === 'single_choice'

    setOpen(false)
    await onAdd({
      form_id: formId,
      type,
      label: defaultLabels[type],
      description: null,
      is_required: type !== 'open_text',
      options: hasOptions ? defaultOptions : null,
      order_index: 0,
    })
  }

  const handleApplyTemplate = async () => {
    if (!confirmTemplate) return

    setIsApplying(true)
    await onApplyTemplate(confirmTemplate.questions)
    setIsApplying(false)
    setConfirmTemplate(null)
    setOpen(false)
  }

  return (
    <>
      <Button disabled={disabled} onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Aggiungi
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Aggiungi domanda</DialogTitle>
            <DialogDescription>
              Scegli il tipo di domanda da aggiungere al modulo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1">
            {(Object.keys(QUESTION_TYPE_META) as QuestionType[]).map((type) => {
              const Icon = typeIcons[type]
              const meta = QUESTION_TYPE_META[type]
              return (
                <button
                  key={type}
                  onClick={() => handleAdd(type)}
                  className="flex items-start gap-3 p-3 w-full text-left rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 bg-muted rounded-md">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{meta.label}</p>
                    <p className="text-xs text-muted-foreground">{meta.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Template predefiniti</p>
            <div className="space-y-1">
              {FORM_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setConfirmTemplate(template)}
                  className="flex items-start gap-3 p-3 w-full text-left rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 bg-muted rounded-md">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{template.name}</p>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmTemplate} onOpenChange={() => setConfirmTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Applica template</DialogTitle>
            <DialogDescription>
              Tutte le domande personalizzate verranno eliminate e sostituite con quelle del template &quot;{confirmTemplate?.name}&quot;. Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmTemplate(null)}
              disabled={isApplying}
            >
              Annulla
            </Button>
            <Button
              variant="destructive"
              onClick={handleApplyTemplate}
              disabled={isApplying}
            >
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applicazione...
                </>
              ) : (
                'Sostituisci domande'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
