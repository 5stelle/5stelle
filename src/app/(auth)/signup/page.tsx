'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Check } from 'lucide-react'
import Image from 'next/image'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Password validation
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('already registered')) {
          setError('Questa email è già registrata')
        } else {
          setError(error.message)
        }
        return
      }

      // Auto-login successful, redirect to onboarding
      router.push('/onboarding')
      router.refresh()
    } catch {
      setError('Si è verificato un errore. Riprova.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Image src="/logo-5stelle.svg" alt="5stelle" width={160} height={32} className="mb-6" />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crea il tuo account</CardTitle>
          <CardDescription>
            Inizia a raccogliere feedback dai tuoi clienti
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@ristorante.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Crea una password"
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
              <Label htmlFor="confirmPassword">Conferma password</Label>
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
          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrazione in corso...
                </>
              ) : (
                'Registrati'
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Registrandoti accetti i{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Termini di Servizio
              </Link>{' '}
              e la{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Hai già un account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Accedi
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
