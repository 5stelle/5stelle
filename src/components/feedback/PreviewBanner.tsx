'use client'

import { useSearchParams } from 'next/navigation'

export function PreviewBanner() {
  const searchParams = useSearchParams()
  if (!searchParams.get('preview')) return null

  return (
    <div className="bg-amber-500 text-white text-center text-sm font-medium py-1.5 px-4">
      Modalità anteprima — i dati non vengono salvati
    </div>
  )
}
