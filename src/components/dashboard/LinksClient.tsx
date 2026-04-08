'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Restaurant } from '@/types/database.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Share2, Plus, X, Check } from 'lucide-react'
import {
  PLATFORMS,
  INITIAL_PLATFORM_KEYS,
  ALL_PLATFORM_KEYS,
  validatePlatformValue,
} from '@/lib/constants/platforms'
import { GooglePlaceIdFinder } from './GooglePlaceIdFinder'

interface LinksClientProps {
  restaurant: Restaurant
}

export function LinksClient({ restaurant }: LinksClientProps) {
  const supabase = createClient()

  const existingLinks = (restaurant.social_links || {}) as Record<string, string>
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(existingLinks)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Track which platforms are visible (initial defaults + any that have values + any user added)
  const initialVisible = new Set([
    ...INITIAL_PLATFORM_KEYS,
    ...Object.keys(existingLinks).filter((k) => existingLinks[k]),
  ])
  const [visiblePlatforms, setVisiblePlatforms] = useState<Set<string>>(initialVisible)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Validate and clean all values
      const cleaned: Record<string, string> = {}
      for (const [key, val] of Object.entries(socialLinks)) {
        const result = validatePlatformValue(key, val)
        if (!result.ok) {
          toast.error(result.error)
          setIsSaving(false)
          return
        }
        if (result.value) {
          cleaned[key] = result.value
        }
      }

      const { error } = await supabase
        .from('restaurants')
        .update({ social_links: cleaned })
        .eq('id', restaurant.id)

      if (error) throw error
      toast.success('Link salvati')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      console.error('Failed to save social links')
      toast.error('Errore nel salvare i link')
    } finally {
      setIsSaving(false)
    }
  }

  const updateLink = (key: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }))
  }

  const addPlatform = (key: string) => {
    setVisiblePlatforms((prev) => new Set([...prev, key]))
  }

  const canRemove = (key: string): boolean => {
    const platform = PLATFORMS[key]
    if (!platform) return false
    const sameCategoryVisible = [...visiblePlatforms].filter(
      (k) => PLATFORMS[k]?.category === platform.category
    )
    return sameCategoryVisible.length > 1
  }

  const removePlatform = (key: string) => {
    if (!canRemove(key)) return
    setVisiblePlatforms((prev) => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
    setSocialLinks((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  // Platforms not yet visible that can be added
  const addablePlatforms = ALL_PLATFORM_KEYS.filter(
    (k) => !visiblePlatforms.has(k)
  )

  const reviewPlatforms = [...visiblePlatforms].filter(
    (k) => PLATFORMS[k]?.category === 'review'
  )
  const socialPlatforms = [...visiblePlatforms].filter(
    (k) => PLATFORMS[k]?.category === 'social'
  )

  const renderPlatformInput = (key: string, index: number) => {
    const platform = PLATFORMS[key]
    if (!platform) return null

    const removable = canRemove(key)
    const Icon = platform.icon

    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor={`social-${key}`} className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {platform.name}
          </Label>
          {removable && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => removePlatform(key)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        {key === 'google' ? (
          <GooglePlaceIdFinder
            value={socialLinks[key] || ''}
            onChange={(v) => updateLink(key, v)}
            disabled={isSaving}
          />
        ) : platform.prefix ? (
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 rounded-l-md">
              {platform.prefix}
            </span>
            <Input
              id={`social-${key}`}
              value={socialLinks[key] || ''}
              onChange={(e) => updateLink(key, e.target.value)}
              placeholder={platform.placeholder}
              className="rounded-l-none"
              disabled={isSaving}
            />
          </div>
        ) : (
          <Input
            id={`social-${key}`}
            value={socialLinks[key] || ''}
            onChange={(e) => updateLink(key, e.target.value)}
            placeholder={platform.placeholder}
            disabled={isSaving}
          />
        )}
      </motion.div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Link e Recensioni</CardTitle>
          <Share2 className="h-5 w-5 text-muted-foreground/50" />
        </div>
        <CardDescription>
          Piattaforme di recensioni (mostrate dopo feedback positivi) e profili social
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Review platforms */}
        {reviewPlatforms.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Piattaforme di Recensioni
            </h3>
            {reviewPlatforms.map((key, i) => renderPlatformInput(key, i))}
          </div>
        )}

        {/* Social platforms */}
        {socialPlatforms.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Social
            </h3>
            {socialPlatforms.map((key, i) => renderPlatformInput(key, i))}
          </div>
        )}

        {/* Add platform button */}
        {addablePlatforms.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Aggiungi piattaforma:</p>
            <div className="flex flex-wrap gap-2">
              {addablePlatforms.map((key) => {
                const platform = PLATFORMS[key]
                const Icon = platform.icon
                return (
                  <Button
                    key={key}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addPlatform(key)}
                  >
                    <Icon className="h-3.5 w-3.5 mr-1.5" />
                    {platform.name}
                    <Plus className="h-3 w-3 ml-1" />
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvataggio...
              </>
            ) : saved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Salvato
              </>
            ) : (
              'Salva link'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
