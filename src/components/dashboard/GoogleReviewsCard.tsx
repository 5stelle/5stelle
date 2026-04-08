'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface SnapshotData {
  rating: number | null
  reviewCount: number | null
  fetchedAt: string
}

interface GoogleReviewsCardProps {
  isConnected: boolean
  baseline: SnapshotData | null
  latest: SnapshotData | null
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function GoogleReviewsCard({
  isConnected,
  baseline,
  latest,
}: GoogleReviewsCardProps) {
  // Not connected — nudge banner
  if (!isConnected) {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 shrink-0">
              <Star className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">
                Collega il tuo ristorante a Google
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Monitora le tue recensioni e scopri come migliorano con 5stelle
              </p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/settings">
                Collega ora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Connected but no snapshots yet (edge case)
  if (!latest) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recensioni Google
            </CardTitle>
            <Star className="h-4 w-4 text-amber-400" />
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <p className="text-sm text-muted-foreground text-center py-6">
            I dati delle recensioni saranno disponibili a breve
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculate deltas
  const ratingDelta =
    baseline && latest.rating != null && baseline.rating != null
      ? latest.rating - baseline.rating
      : null
  const reviewDelta =
    baseline && latest.reviewCount != null && baseline.reviewCount != null
      ? latest.reviewCount - baseline.reviewCount
      : null

  const ratingTrend =
    ratingDelta != null
      ? ratingDelta > 0
        ? 'up'
        : ratingDelta < 0
          ? 'down'
          : 'neutral'
      : null
  const reviewTrend =
    reviewDelta != null
      ? reviewDelta > 0
        ? 'up'
        : reviewDelta < 0
          ? 'down'
          : 'neutral'
      : null

  const TrendIcon = (trend: string | null) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === 'down')
      return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const trendColor = (trend: string | null) => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-muted-foreground'
  }

  return (
    <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recensioni Google
          </CardTitle>
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Current rating */}
          <div className="rounded-lg bg-muted/50 p-3.5">
            <p className="text-xs text-muted-foreground mb-1">Valutazione</p>
            <div className="flex items-end gap-1.5">
              <span className="text-2xl font-bold">
                {latest.rating != null ? latest.rating.toFixed(1) : '—'}
              </span>
              <span className="text-xs text-muted-foreground mb-1">/5</span>
            </div>
            {ratingDelta != null && ratingDelta !== 0 && (
              <div className={`flex items-center gap-1 mt-1 ${trendColor(ratingTrend)}`}>
                {TrendIcon(ratingTrend)}
                <span className="text-xs font-medium">
                  {ratingDelta > 0 ? '+' : ''}
                  {ratingDelta.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Review count */}
          <div className="rounded-lg bg-muted/50 p-3.5">
            <p className="text-xs text-muted-foreground mb-1">Recensioni</p>
            <span className="text-2xl font-bold">
              {latest.reviewCount != null
                ? latest.reviewCount.toLocaleString('it-IT')
                : '—'}
            </span>
            {reviewDelta != null && reviewDelta !== 0 && (
              <div className={`flex items-center gap-1 mt-1 ${trendColor(reviewTrend)}`}>
                {TrendIcon(reviewTrend)}
                <span className="text-xs font-medium">
                  +{reviewDelta.toLocaleString('it-IT')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Baseline reference */}
        {baseline && (
          <div className="mt-4 pt-3 border-t text-xs text-muted-foreground space-y-0.5">
            <p>
              Monitoraggio dal{' '}
              <span className="font-medium">{formatDate(baseline.fetchedAt)}</span>
            </p>
            {baseline.rating != null && (
              <p>
                Partenza: {baseline.rating.toFixed(1)} stelle
                {baseline.reviewCount != null && (
                  <> ({baseline.reviewCount.toLocaleString('it-IT')} recensioni)</>
                )}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
