'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import type { Restaurant, Form } from '@/types/database.types'
import { Card, CardContent } from '@/components/ui/card'
import { Gift } from 'lucide-react'
import { PLATFORMS } from '@/lib/constants/platforms'

interface RewardClientProps {
  restaurant: Restaurant
  form: Form
  restaurantSlug: string
  formId: string
  isPreview?: boolean
}

export function RewardClient({ restaurant, form, restaurantSlug, formId, isPreview = false }: RewardClientProps) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const hasChecked = useRef(false)

  useEffect(() => {
    if (hasChecked.current) return
    hasChecked.current = true

    const submissionId = sessionStorage.getItem('feedback_submission')
    if (!submissionId && !isPreview) {
      router.replace(`/r/${restaurantSlug}/${formId}/1`)
      return
    }

    setAuthorized(true)
    sessionStorage.removeItem('feedback_submission')
    sessionStorage.removeItem('feedback_answers')
    sessionStorage.removeItem('feedback_sentiment')

    // 3 timed bursts of confetti (~30 particles per side per burst)
    const burst = (delay: number) => {
      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b'],
        })
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b'],
        })
      }, delay)
    }

    burst(0)
    burst(300)
    burst(600)
  }, [router, restaurantSlug, formId])

  if (!authorized) return null

  const links = (restaurant.social_links || {}) as Record<string, string>

  const isSafeUrl = (url: string) =>
    url.startsWith('https://') || url.startsWith('http://')

  const socialFollowLinks = Object.entries(links)
    .filter(([key, val]) => val && PLATFORMS[key]?.category === 'social')
    .map(([key, val]) => ({
      platform: PLATFORMS[key],
      url: PLATFORMS[key].buildUrl(val),
    }))
    .filter(({ url }) => isSafeUrl(url))

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
            <Gift className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold">Grazie!</h1>

          <p className="text-muted-foreground">
            Il tuo feedback è stato inviato con successo.
          </p>
        </div>

        {form.reward_text && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <p className="text-lg font-medium">{form.reward_text}</p>
            </CardContent>
          </Card>
        )}

        {socialFollowLinks.length > 0 && (
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Seguici!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {socialFollowLinks.map(({ platform, url }) => {
                const Icon = platform.icon
                return (
                  <a
                    key={platform.key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${platform.buttonColor} text-white rounded-xl px-5 py-3 flex items-center gap-2.5 transition-transform active:scale-[0.98]`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium text-sm">{platform.name}</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
