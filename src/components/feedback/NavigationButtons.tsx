'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Undo2, ArrowRight, Loader2, Check, ShieldCheck } from 'lucide-react'

interface NavigationButtonsProps {
  isFirst: boolean
  isLast: boolean
  isSubmitting: boolean
  isAnswered: boolean
  isVerifying?: boolean
  isVerified?: boolean
  onBack: () => void
  onNext: () => void
}

export function NavigationButtons({
  isFirst,
  isLast,
  isSubmitting,
  isAnswered,
  isVerifying = false,
  isVerified = false,
  onBack,
  onNext,
}: NavigationButtonsProps) {
  const showVerificationStatus = isVerifying || isVerified
  const isDisabled = isSubmitting || isVerifying || !isAnswered

  const nextButton = (
    <Button onClick={onNext} disabled={isDisabled} className="min-w-[120px]">
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {isLast ? 'Invio...' : 'Salvo...'}
        </>
      ) : isLast ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Completa
        </>
      ) : (
        <>
          Avanti
          <ArrowRight className="h-4 w-4 ml-2" />
        </>
      )}
    </Button>
  )

  return (
    <div className="pt-2 space-y-3 w-full">
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isFirst || isSubmitting}
          className={isFirst ? 'invisible' : ''}
        >
          <Undo2 className="h-4 w-4 mr-2" />
          Indietro
        </Button>

        {!isAnswered && !isSubmitting ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>{nextButton}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Completa la domanda per continuare</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          nextButton
        )}
      </div>

      <AnimatePresence>
        {showVerificationStatus && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center gap-2 text-sm"
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Controllando che tu sia umano...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                <span className="text-green-600">Verifica completata</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
