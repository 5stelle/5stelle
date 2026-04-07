'use client'

import { useState } from 'react'
import type { Form, Question } from '@/types/database.types'
import { QuestionList } from './QuestionList'
import { QuestionEditor } from './QuestionEditor'
import { AddQuestionMenu } from './AddQuestionMenu'
import { RewardTextEditor } from './RewardTextEditor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { MAX_QUESTIONS_PER_FORM } from '@/types/forms.types'
import { CheckCircle2, TriangleAlert } from 'lucide-react'

interface FormBuilderClientProps {
  form: Form | null
  initialQuestions: Question[]
  restaurantId: string
}

export function FormBuilderClient({
  form,
  initialQuestions,
  restaurantId,
}: FormBuilderClientProps) {
  const supabase = createClient()
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [currentForm, setCurrentForm] = useState<Form | null>(form)
  const [isSaving, setIsSaving] = useState(false)

  const handleQuestionsChange = async (newQuestions: Question[]) => {
    setQuestions(newQuestions)

    // Update order_index in database
    setIsSaving(true)
    try {
      const updates = newQuestions.map((q, index) => ({
        id: q.id,
        order_index: index,
      }))

      for (const update of updates) {
        await supabase
          .from('questions')
          .update({ order_index: update.order_index })
          .eq('id', update.id)
      }
    } catch {
      console.error('Failed to update order')
      toast.error('Errore nel salvare l\'ordine')
    } finally {
      setIsSaving(false)
    }
  }

  const handleQuestionUpdate = async (updatedQuestion: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    )
    setEditingQuestion(null)

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('questions')
        .update({
          label: updatedQuestion.label,
          description: updatedQuestion.description,
          is_required: updatedQuestion.is_required,
          options: updatedQuestion.options,
        })
        .eq('id', updatedQuestion.id)

      if (error) throw error
      toast.success('Domanda aggiornata')
    } catch {
      console.error('Failed to update question')
      toast.error('Errore nel salvare la domanda')
    } finally {
      setIsSaving(false)
    }
  }

  const handleQuestionDelete = async (questionId: string) => {
    // Prevent deleting the last sentiment question
    const target = questions.find((q) => q.id === questionId)
    if (target?.type === 'sentiment' && questions.filter((q) => q.type === 'sentiment').length <= 1) {
      toast.error('La domanda di valutazione generale è obbligatoria')
      return
    }

    setQuestions((prev) => prev.filter((q) => q.id !== questionId))

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('questions')
        .update({ is_active: false })
        .eq('id', questionId)

      if (error) throw error
      toast.success('Domanda eliminata')
    } catch {
      console.error('Failed to delete question')
      toast.error('Errore nell\'eliminare la domanda')
    } finally {
      setIsSaving(false)
    }
  }

  const findReactivatable = async (label: string, type: string) => {
    if (!currentForm) return null

    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('form_id', currentForm.id)
      .eq('type', type)
      .eq('is_active', false)

    if (!data) return null
    const normalizedLabel = label.trim().toLowerCase()
    return (data as Question[]).find(
      (q) => q.label.trim().toLowerCase() === normalizedLabel
    ) || null
  }

  const handleAddQuestion = async (newQuestion: Omit<Question, 'id' | 'created_at' | 'is_active'>) => {
    if (questions.length >= MAX_QUESTIONS_PER_FORM) {
      toast.error(`Massimo ${MAX_QUESTIONS_PER_FORM} domande per modulo`)
      return
    }

    if (!currentForm) {
      toast.error('Nessun modulo trovato')
      return
    }

    setIsSaving(true)
    try {
      const existing = await findReactivatable(newQuestion.label, newQuestion.type)

      if (existing) {
        const { data, error } = await supabase
          .from('questions')
          .update({
            is_active: true,
            label: newQuestion.label,
            description: newQuestion.description,
            is_required: newQuestion.is_required,
            options: newQuestion.options,
            order_index: questions.length,
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        setQuestions((prev) => [...prev, data as Question])
      } else {
        const { data, error } = await supabase
          .from('questions')
          .insert({
            ...newQuestion,
            form_id: currentForm.id,
            order_index: questions.length,
          })
          .select()
          .single()

        if (error) throw error
        setQuestions((prev) => [...prev, data as Question])
      }

      toast.success('Domanda aggiunta')
    } catch {
      console.error('Failed to add question')
      toast.error('Errore nell\'aggiungere la domanda')
    } finally {
      setIsSaving(false)
    }
  }

  const handleTemplateApply = async (templateQuestions: Omit<Question, 'id' | 'form_id' | 'created_at' | 'is_active'>[]) => {
    if (!currentForm) return

    setIsSaving(true)
    try {
      // Soft-delete all current active questions
      await supabase
        .from('questions')
        .update({ is_active: false })
        .eq('form_id', currentForm.id)
        .eq('is_active', true)

      // For each template question, try to reactivate or create new
      const newQuestions: Question[] = []

      for (let i = 0; i < templateQuestions.length; i++) {
        const tq = templateQuestions[i]
        const existing = await findReactivatable(tq.label, tq.type)

        if (existing) {
          const { data, error } = await supabase
            .from('questions')
            .update({
              is_active: true,
              label: tq.label,
              description: tq.description,
              is_required: tq.is_required,
              options: tq.options,
              order_index: i,
            })
            .eq('id', existing.id)
            .select()
            .single()

          if (error) throw error
          newQuestions.push(data as Question)
        } else {
          const { data, error } = await supabase
            .from('questions')
            .insert({
              ...tq,
              form_id: currentForm.id,
              order_index: i,
            })
            .select()
            .single()

          if (error) throw error
          newQuestions.push(data as Question)
        }
      }

      setQuestions(newQuestions)
      toast.success('Template applicato')
    } catch {
      console.error('Failed to apply template')
      toast.error('Errore nell\'applicare il template')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRewardTextUpdate = async (rewardText: string) => {
    if (!currentForm) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('forms')
        .update({ reward_text: rewardText })
        .eq('id', currentForm.id)

      if (error) throw error

      setCurrentForm((prev) => (prev ? { ...prev, reward_text: rewardText } : null))
      toast.success('Messaggio premio aggiornato')
    } catch {
      console.error('Failed to update reward text')
      toast.error('Errore nel salvare il messaggio')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Questions */}
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Domande ({questions.length}/{MAX_QUESTIONS_PER_FORM})
              {questions.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {questions.length <= 3 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <TriangleAlert className="h-4 w-4 text-yellow-500" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {questions.length <= 3
                          ? 'Quantità di domande ideale'
                          : 'Molte domande: potrebbero ridurre il tasso di completamento'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
            <AddQuestionMenu
              onAdd={handleAddQuestion}
              onApplyTemplate={handleTemplateApply}
              disabled={isSaving || questions.length >= MAX_QUESTIONS_PER_FORM}
              formId={currentForm?.id || ''}
            />
          </div>
        </CardHeader>
        <CardContent>
          <QuestionList
            questions={questions}
            onReorder={handleQuestionsChange}
            onEdit={setEditingQuestion}
            onDelete={handleQuestionDelete}
            disabled={isSaving}
          />
        </CardContent>
      </Card>

      {/* Reward Text */}
      <RewardTextEditor
        rewardText={currentForm?.reward_text || ''}
        onSave={handleRewardTextUpdate}
        disabled={isSaving}
      />

      {/* Question Editor Dialog */}
      <QuestionEditor
        question={editingQuestion}
        onSave={handleQuestionUpdate}
        onClose={() => setEditingQuestion(null)}
        locked={editingQuestion?.type === 'sentiment' && questions.filter((q) => q.type === 'sentiment').length <= 1}
      />
    </div>
  )
}
