'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

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

const DISMISSED_KEY = 'quickstart_dismissed'

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export function QuickStartChecklist({
  hasFormWithQuestions,
  hasSocialLinks,
  hasGoogleConnected,
}: QuickStartChecklistProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(DISMISSED_KEY) === 'true'
  })

  if (dismissed) return null

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true')
    setDismissed(true)
  }

  const items: ChecklistItem[] = [
    { label: 'Personalizza il modulo con le domande che contano', href: '/dashboard/form-builder', done: hasFormWithQuestions },
    { label: 'Collega il profilo Google per monitorare le recensioni', href: '/dashboard/links', done: hasGoogleConnected },
    { label: 'Configura i link social e le piattaforme di recensioni', href: '/dashboard/links', done: hasSocialLinks },
    { label: 'Condividi il QR code e ottieni il primo feedback', href: '/dashboard/qr-codes', done: false },
  ]

  const completed = items.filter((i) => i.done).length
  const progressValue = (completed / items.length) * 100

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Inizia qui</CardTitle>
            <button
              onClick={handleDismiss}
              className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Chiudi"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Progress value={progressValue} className="h-2" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {completed}/{items.length}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <motion.ol
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {items.map((item, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className="flex items-center gap-3"
              >
                {/* Number / check circle */}
                {item.done ? (
                  <motion.div
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-muted-foreground/30 text-muted-foreground text-sm font-medium shrink-0">
                    {index + 1}
                  </div>
                )}

                {/* Label */}
                {item.href && !item.done ? (
                  <Link
                    href={item.href}
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
              </motion.li>
            ))}
          </motion.ol>
        </CardContent>
      </Card>
    </motion.div>
  )
}
