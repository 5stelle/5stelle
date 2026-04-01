'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Check } from 'lucide-react'
import Image from 'next/image'

export default function ResetPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('La password deve essere di almeno 8 caratteri')
      return
    }
    if (!/[A-Z]/.test(password)) {
      setError('La password deve contenere almeno una lettera maiuscola')
      return
    }
    if (!/[0-9]/.test(password)) {
      setError('La password deve contenere almeno un numero')
      return
    }
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/~`]/.test(password)) {
      setError('La password deve contenere almeno un carattere speciale')
      return
    }

    if (password !== confirmPassword) {
      setError('Le password non corrispondono')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Si è verificato un errore. Riprova.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Image src="/logo-5stelle.svg" alt="5stelle" width={160} height={32} className="mb-6" />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Nuova password</CardTitle>
          <CardDescription>
            Scegli una nuova password per il tuo account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Nuova password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Inserisci la nuova password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
                disabled={isLoading}
              />
              {(passwordFocused || password.length > 0) && (
                <ul className="space-y-1.5 text-xs pt-1">
                  {[
                    { met: password.length >= 8, label: 'Almeno 8 caratteri' },
                    { met: /[A-Z]/.test(password), label: 'Una lettera maiuscola' },
                    { met: /[0-9]/.test(password), label: 'Un numero' },
                    { met: /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/~`]/.test(password), label: 'Un carattere speciale' },
                  ].map((req) => (
                    <li key={req.label} className="flex items-center gap-2">
                      {req.met ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/30" />
                      )}
                      <span className={req.met ? 'text-green-600' : 'text-muted-foreground'}>
                        {req.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma nuova password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ripeti la password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="pt-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvataggio in corso...
                </>
              ) : (
                'Salva nuova password'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
