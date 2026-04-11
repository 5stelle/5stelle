'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ListChecks } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

interface ChecklistItem {
  label: string
  href?: string
  done: boolean
}

interface QuickStartChecklistProps {
  hasFormWithQuestions: boolean
  hasSocialLinks: boolean
  hasGoogleConnected: boolean
}

export function QuickStartChecklist({
  hasFormWithQuestions,
  hasSocialLinks,
  hasGoogleConnected,
}: QuickStartChecklistProps) {
  const [open, setOpen] = useState(false)

  const items: ChecklistItem[] = [
    { label: 'Personalizza il modulo con le domande che contano', href: '/dashboard/form-builder', done: hasFormWithQuestions },
    { label: 'Collega il profilo Google per monitorare le recensioni', href: '/dashboard/settings', done: hasGoogleConnected },
    { label: 'Configura i link social e le piattaforme di recensioni', href: '/dashboard/settings', done: hasSocialLinks },
    { label: 'Condividi il QR code e ottieni il primo feedback', href: '/dashboard/qr-codes', done: false },
  ]

  const completed = items.filter((i) => i.done).length
  const allDone = completed === items.length

  if (allDone) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative shrink-0">
          <ListChecks className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
            {items.length - completed}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Setup del tuo account</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 mt-1">
          <Progress value={(completed / items.length) * 100} className="h-2" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {completed}/{items.length}
          </span>
        </div>
        <ol className="space-y-3 mt-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              {item.done ? (
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground shrink-0">
                  <Check className="h-4 w-4" />
                </div>
              ) : (
                <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-muted-foreground/30 text-muted-foreground text-sm font-medium shrink-0">
                  {index + 1}
                </div>
              )}

              {item.href && !item.done ? (
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`text-sm ${
                    item.done
                      ? 'line-through text-muted-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  )
}
