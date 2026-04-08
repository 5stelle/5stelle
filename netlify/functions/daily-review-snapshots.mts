import type { Config } from '@netlify/functions'

export default async () => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://5stelle.app'
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.error('CRON_SECRET not set')
    return new Response('CRON_SECRET not set', { status: 500 })
  }

  try {
    const response = await fetch(`${appUrl}/api/cron/review-snapshots`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
      },
    })

    const body = await response.text()
    console.log(`Cron response: ${response.status} — ${body}`)

    return new Response(body, { status: response.status })
  } catch (error) {
    console.error('Cron trigger failed:', error)
    return new Response('Trigger failed', { status: 500 })
  }
}

export const config: Config = {
  schedule: '0 3 * * *', // Every day at 3:00 AM UTC
}
