import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}
import { redirect } from 'next/navigation'
import type { Restaurant, Submission, Table, ReviewSnapshot } from '@/types/database.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FeedbackList } from '@/components/dashboard/FeedbackList'
import { ScoreRing } from '@/components/dashboard/ScoreRing'
import { QuickStartChecklist } from '@/components/dashboard/QuickStartChecklist'
import { GoogleReviewsCard } from '@/components/dashboard/GoogleReviewsCard'
import { Activity, BarChart3, Smile, Meh, Frown } from 'lucide-react'

function SentimentBar({ great, ok, bad, total }: { great: number; ok: number; bad: number; total: number }) {
  if (total === 0) return null

  const pGreat = (great / total) * 100
  const pOk = (ok / total) * 100
  const pBad = (bad / total) * 100

  return (
    <div className="space-y-2 w-full">
      <div className="flex h-2.5 rounded-full overflow-hidden bg-muted/30">
        {pGreat > 0 && (
          <div className="bg-green-500 transition-all" style={{ width: `${pGreat}%` }} />
        )}
        {pOk > 0 && (
          <div className="bg-yellow-500 transition-all" style={{ width: `${pOk}%` }} />
        )}
        {pBad > 0 && (
          <div className="bg-red-500 transition-all" style={{ width: `${pBad}%` }} />
        )}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          {Math.round(pGreat)}%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
          {Math.round(pOk)}%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          {Math.round(pBad)}%
        </span>
      </div>
    </div>
  )
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Adesso'
  if (diffMins < 60) return `${diffMins} min fa`
  if (diffHours < 24) return `${diffHours} ore fa`
  if (diffDays === 1) return 'Ieri'
  if (diffDays < 7) return `${diffDays} giorni fa`

  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: restaurantData } = await supabase
    .from('restaurants')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  const restaurant = restaurantData as Restaurant | null

  if (!restaurant) {
    redirect('/onboarding')
  }

  const { data: formData } = await supabase
    .from('forms')
    .select('id')
    .eq('restaurant_id', restaurant.id)
    .single()

  // Quick-start checklist data
  let questionsCount = 0
  if (formData) {
    const { count } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('form_id', formData.id)
      .eq('is_active', true)
    questionsCount = count ?? 0
  }
  const hasFormWithQuestions = !!formData && questionsCount > 0
  const hasSocialLinks = !!(
    restaurant.social_links &&
    Object.values(restaurant.social_links).some((v) => v && v.trim() !== '')
  )

  // Fetch tables for identifier → name resolution
  const { data: tablesData } = await supabase
    .from('tables')
    .select('*')
    .eq('restaurant_id', restaurant.id)

  const tables = (tablesData || []) as Table[]
  const tableNames: Record<string, string> = {}
  for (const t of tables) {
    tableNames[t.identifier] = t.name
  }

  // Google Reviews snapshots
  const googlePlaceId = (restaurant.social_links as Record<string, string> | null)?.google || null
  const isGoogleConnected = !!googlePlaceId

  let baselineSnapshot: ReviewSnapshot | null = null
  let latestSnapshot: ReviewSnapshot | null = null

  if (isGoogleConnected) {
    const [{ data: baselineData }, { data: latestData }] = await Promise.all([
      supabase
        .from('review_snapshots')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .eq('is_baseline', true)
        .order('fetched_at', { ascending: true })
        .limit(1)
        .single(),
      supabase
        .from('review_snapshots')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .single(),
    ])

    baselineSnapshot = baselineData as ReviewSnapshot | null
    latestSnapshot = latestData as ReviewSnapshot | null
  }

  let submissions: Submission[] = []
  let stats = { total: 0, great: 0, ok: 0, bad: 0 }
  let todayCount = 0
  let weekCount = 0
  let lastFeedback: string | null = null

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000)

  if (formData) {
    // Lightweight stats query: fetch only what's needed to compute counts (no limit)
    const [{ data: statsData }, { data: submissionsData }] = await Promise.all([
      supabase
        .from('submissions')
        .select('overall_sentiment, created_at')
        .eq('form_id', formData.id)
        .not('completed_at', 'is', null),
      supabase
        .from('submissions')
        .select('*')
        .eq('form_id', formData.id)
        .not('completed_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(200),
    ])

    submissions = (submissionsData || []) as Submission[]

    // Compute stats from the full (unlimited) dataset
    const allSubmissions = statsData || []
    stats.total = allSubmissions.length
    allSubmissions.forEach((s) => {
      if (s.overall_sentiment === 'great') stats.great++
      else if (s.overall_sentiment === 'ok') stats.ok++
      else if (s.overall_sentiment === 'bad') stats.bad++

      const createdAt = new Date(s.created_at)
      if (createdAt >= todayStart) todayCount++
      if (createdAt >= weekStart) weekCount++
    })

    lastFeedback = submissions.length > 0 ? submissions[0].created_at : null
  }

  const score =
    stats.total > 0
      ? Math.round((stats.great * 100 + stats.ok * 50) / stats.total)
      : 0

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Feedback</h1>
        <p className="text-muted-foreground mt-1">
          Visualizza e gestisci i feedback dei tuoi clienti
        </p>
      </div>

      {/* Quick-start checklist for new users */}
      {stats.total === 0 && (
        <QuickStartChecklist
          hasFormWithQuestions={hasFormWithQuestions}
          hasSocialLinks={hasSocialLinks}
          hasGoogleConnected={isGoogleConnected}
        />
      )}

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {/* Overall Score */}
        <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Soddisfazione complessiva
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground/50" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5 pt-2 pb-6">
            {stats.total > 0 ? (
              <>
                <ScoreRing score={score} />
                <SentimentBar
                  great={stats.great}
                  ok={stats.ok}
                  bad={stats.bad}
                  total={stats.total}
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">
                Il punteggio apparirà dopo il primo feedback
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats summary + sentiment counts */}
        <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Riepilogo
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground/50" />
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">Totali</p>
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">Oggi</p>
                <span className="text-2xl font-bold">{todayCount}</span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">Ultimi 7 giorni</p>
                <span className="text-2xl font-bold">{weekCount}</span>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">Ultimo</p>
                <span className="text-lg font-semibold">
                  {lastFeedback ? formatRelativeDate(lastFeedback) : '—'}
                </span>
              </div>
            </div>

            {/* Sentiment counts */}
            {stats.total > 0 && (
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1.5">
                  <Smile className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-semibold text-green-600">{stats.great}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Meh className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-yellow-600">{stats.ok}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Frown className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-semibold text-red-600">{stats.bad}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Google Reviews */}
        <GoogleReviewsCard
          isConnected={isGoogleConnected}
          baseline={
            baselineSnapshot
              ? {
                  rating: baselineSnapshot.rating,
                  reviewCount: baselineSnapshot.review_count,
                  fetchedAt: baselineSnapshot.fetched_at,
                }
              : null
          }
          latest={
            latestSnapshot
              ? {
                  rating: latestSnapshot.rating,
                  reviewCount: latestSnapshot.review_count,
                  fetchedAt: latestSnapshot.fetched_at,
                }
              : null
          }
        />
      </div>

      {/* Feedback List */}
      <FeedbackList submissions={submissions} formId={formData?.id} tableNames={tableNames} />
    </div>
  )
}
