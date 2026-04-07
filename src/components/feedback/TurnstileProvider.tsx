'use client'

import { createContext, useContext, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

interface TurnstileContextValue {
  token: string | null
}

const TurnstileContext = createContext<TurnstileContextValue>({ token: null })

export function useTurnstile() {
  return useContext(TurnstileContext)
}

export function TurnstileProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  return (
    <TurnstileContext.Provider value={{ token }}>
      {siteKey && (
        <Turnstile
          siteKey={siteKey}
          options={{ size: 'invisible', refreshExpired: 'auto' }}
          onSuccess={setToken}
          onExpire={() => setToken(null)}
        />
      )}
      {children}
    </TurnstileContext.Provider>
  )
}
