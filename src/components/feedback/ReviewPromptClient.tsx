'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Restaurant, Form } from '@/types/database.types'
import { PLATFORMS } from '@/lib/constants/platforms'
import { Button } from '@/components/ui/button'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ReviewPromptClientProps {
  restaurant: Restaurant
  form: Form
  restaurantSlug: string
  formId: string
  isPreview?: boolean
  previewToken?: string | null
}

const SENTIMENT_KEY = 'feedback_sentiment'

const isSafeUrl = (url: string) =>
  url.startsWith('https://') || url.startsWith('http://')

export function ReviewPromptClient({
  restaurant,
  form,
  restaurantSlug,
  formId,
  isPreview = false,
  previewToken = null,
}: ReviewPromptClientProps) {
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [sentiment, setSentiment] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(10)
  const [linkClicked, setLinkClicked] = useState(false)
  const clickTracked = useRef(false)

  const rewardUrl = `/r/${restaurantSlug}/${formId}/reward${isPreview && previewToken ? `?preview=${encodeURIComponent(previewToken)}` : ''}`

  // Read sentiment after mount to avoid hydration mismatch
  useEffect(() => {
    const submissionId = sessionStorage.getItem('feedback_submission')
    if (!submissionId && !isPreview) {
      router.replace(`/r/${restaurantSlug}/${formId}/1`)
      return
    }

    const stored = sessionStorage.getItem(SENTIMENT_KEY)
    setSentiment(stored)
    setMounted(true)

    if (stored !== 'great') {
      router.replace(rewardUrl)
      return
    }

    // Track that the review prompt was shown
    if (submissionId && !isPreview) {
      const supabase = createClient()
      supabase
        .from('submissions')
        .update({ review_prompt_shown_at: new Date().toISOString() })
        .eq('id', submissionId)
        .then()
    }
  }, [router, rewardUrl, restaurantSlug, formId, isPreview])

  // Countdown timer
  useEffect(() => {
    if (!mounted || sentiment !== 'great') return
    if (countdown <= 0) return

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, sentiment, mounted])

  // Don't render anything until mounted + sentiment check
  if (!mounted || sentiment !== 'great') return null

  const canContinue = linkClicked || countdown === 0

  // Build platform links
  const links = (restaurant.social_links || {}) as Record<string, string>

  const allReviewLinks = Object.entries(links)
    .filter(([key, val]) => val && PLATFORMS[key]?.category === 'review')
    .map(([key, val]) => ({
      platform: PLATFORMS[key],
      url: PLATFORMS[key].buildUrl(val),
    }))
    .filter(({ url }) => isSafeUrl(url))

  // Google is always the primary review platform
  const primaryLink = allReviewLinks.find(({ platform }) => platform.key === 'google') || null
  const secondaryLinks = primaryLink
    ? allReviewLinks.filter(({ platform }) => platform.key !== 'google')
    : allReviewLinks

  const handleContinue = () => {
    router.push(rewardUrl)
  }

  const handleLinkClick = (platformKey: string) => {
    setLinkClicked(true)

    // Track the first click only
    if (clickTracked.current || isPreview) return
    clickTracked.current = true

    const submissionId = sessionStorage.getItem('feedback_submission')
    if (!submissionId) return

    const supabase = createClient()
    supabase
      .from('submissions')
      .update({
        review_link_clicked_at: new Date().toISOString(),
        review_platform_clicked: platformKey,
      })
      .eq('id', submissionId)
      .then()
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Ti sei trovato bene? 🎉</h1>
          <p className="text-muted-foreground text-base">
            Siamo felicissimi! Una tua recensione ci aiuta a farci conoscere da nuovi clienti. Bastano 30 secondi e per noi fa un&apos;enorme differenza.
          </p>
        </div>

        {/* Primary platform CTA */}
        {primaryLink && (
          <div className="pt-2">
            {(() => {
              const Icon = primaryLink.platform.icon
              return (
                <motion.div
                  animate={{
                    scale: [1, 1.015, 1],
                    boxShadow: [
                      '0 0 10px 2px rgba(251,191,36,0.2)',
                      '0 0 25px 8px rgba(245,158,11,0.4)',
                      '0 0 10px 2px rgba(251,191,36,0.2)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-xl"
                >
                  <div className="relative rounded-xl p-[3px] overflow-hidden">
                    {/* Solid gold base border */}
                    <div className="absolute inset-0 z-0 rounded-xl bg-amber-400" />
                    {/* Rotating reflex highlight */}
                    <motion.div
                      className="absolute inset-[-50%] z-[1]"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent 0%, transparent 70%, rgba(255,255,255,0.85) 78%, #fde68a 82%, transparent 90%, transparent 100%)',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    />
                    <a
                      href={primaryLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleLinkClick(primaryLink.platform.key)}
                      className={`${primaryLink.platform.buttonColor} text-white w-full rounded-[9px] p-5 flex items-center gap-4 transition-transform active:scale-[0.98] relative z-10`}
                    >
                      <div className={`flex items-center justify-center w-14 h-14 rounded-lg shrink-0 ${primaryLink.platform.key === 'google' ? 'bg-white' : 'bg-white/20'}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-lg">Recensisci su {primaryLink.platform.name}</p>
                        <p className="text-sm text-white/80">Lascia una recensione</p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-white/60 shrink-0" />
                    </a>
                  </div>
                </motion.div>
              )
            })()}
          </div>
        )}

        {/* Secondary platforms */}
        {secondaryLinks.length > 0 && (
          <div className="space-y-3">
            {primaryLink && (
              <p className="text-sm text-muted-foreground">
                Oppure lasciaci una recensione su:
              </p>
            )}
            <div className="flex flex-col gap-2 w-full">
              {secondaryLinks.map(({ platform, url }) => {
                const Icon = platform.icon
                return (
                  <a
                    key={platform.key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(platform.key)}
                    className={`${platform.buttonColor} text-white w-full rounded-xl px-4 py-3 flex items-center gap-3 transition-transform active:scale-[0.98]`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="font-medium text-sm">Recensisci su {platform.name}</span>
                    <ExternalLink className="h-4 w-4 text-white/60 shrink-0 ml-auto" />
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* Continue button */}
        <div className="pt-4">
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            variant={canContinue ? 'default' : 'outline'}
            className={`w-full ${canContinue ? 'bg-black hover:bg-gray-800 text-white' : ''}`}
            size="lg"
          >
            {canContinue ? 'Continua' : `Continua (${countdown})`}
            {canContinue && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
