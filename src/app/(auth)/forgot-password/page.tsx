'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })

      if (error) {
        console.error('Password reset error:', error.message)
        if (error.message.toLowerCase().includes('rate')) {
          setError('Troppi tentativi. Riprova tra qualche minuto.')
        } else {
          setError('Impossibile inviare l\'email di recupero. Verifica l\'indirizzo e riprova.')
        }
        setIsLoading(false)
        return
      }

      setEmailSent(true)
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
        {emailSent ? (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Controlla la tua email</CardTitle>
              <CardDescription>
                Abbiamo inviato un link per reimpostare la password a <span className="font-medium text-foreground">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-4 pt-2">
              <p className="text-xs text-muted-foreground text-center">
                Non hai ricevuto l&apos;email? Controlla la cartella spam oppure riprova.
              </p>
              <Link href="/login" className="text-sm text-primary hover:underline flex items-center gap-1 mx-auto">
                <ArrowLeft className="h-4 w-4" />
                Torna al login
              </Link>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Password dimenticata?</CardTitle>
              <CardDescription>
                Inserisci la tua email e ti invieremo un link per reimpostare la password
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
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    'Invia link di recupero'
                  )}
                </Button>
                <Link href="/login" className="text-sm text-primary hover:underline flex items-center gap-1 mx-auto">
                  <ArrowLeft className="h-4 w-4" />
                  Torna al login
                </Link>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
    </div>
  )
}
