'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Search,
  Loader2,
  MapPin,
  Star,
  ExternalLink,
  RotateCcw,
} from 'lucide-react'

interface PlacePrediction {
  placeId: string
  mainText: string
  secondaryText: string
}

interface PlaceDetails {
  placeId: string
  displayName: string
  formattedAddress: string
  rating: number | null
  userRatingCount: number | null
  photoUri: string | null
  googleMapsUri: string | null
}

interface GooglePlaceSearchProps {
  onComplete: (placeId: string, details: PlaceDetails) => void
  onSkip: () => void
  isSubmitting?: boolean
}

export function GooglePlaceSearch({
  onComplete,
  onSkip,
  isSubmitting = false,
}: GooglePlaceSearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const searchPlaces = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const res = await fetch(
        `/api/google/autocomplete?q=${encodeURIComponent(q)}`
      )
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSuggestions(data.suggestions || [])
      setShowDropdown(true)
    } catch {
      setError('Errore nella ricerca. Riprova.')
      setSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setSelectedPlace(null)
    setError(null)

    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => searchPlaces(value), 300)
  }

  const handleSelectPlace = async (prediction: PlacePrediction) => {
    setShowDropdown(false)
    setQuery(prediction.mainText)
    setIsLoadingDetails(true)
    setError(null)

    try {
      const res = await fetch(
        `/api/google/place-details?placeId=${encodeURIComponent(prediction.placeId)}`
      )
      if (!res.ok) throw new Error()
      const details: PlaceDetails = await res.json()
      setSelectedPlace(details)
    } catch {
      setError('Errore nel caricamento dei dettagli. Riprova.')
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const handleReset = () => {
    setSelectedPlace(null)
    setQuery('')
    setSuggestions([])
    setError(null)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating - fullStars >= 0.3

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className="h-4 w-4 fill-amber-400 text-amber-400"
          />
        )
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <div key={i} className="relative h-4 w-4">
            <Star className="absolute h-4 w-4 text-gray-200" />
            <div className="absolute overflow-hidden w-[50%]">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )
      } else {
        stars.push(
          <Star key={i} className="h-4 w-4 text-gray-200" />
        )
      }
    }
    return stars
  }

  // Confirmation card
  if (selectedPlace) {
    return (
      <div className="space-y-4">
        <div className="border rounded-xl overflow-hidden bg-white">
          {selectedPlace.photoUri && (
            <div className="h-40 w-full overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPlace.photoUri}
                alt={selectedPlace.displayName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg">
                {selectedPlace.displayName}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{selectedPlace.formattedAddress}</span>
              </div>
            </div>

            {selectedPlace.rating != null && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {renderStars(selectedPlace.rating)}
                </div>
                <span className="font-semibold text-sm">
                  {selectedPlace.rating.toFixed(1)}
                </span>
                {selectedPlace.userRatingCount != null && (
                  <span className="text-sm text-muted-foreground">
                    ({selectedPlace.userRatingCount.toLocaleString('it-IT')}{' '}
                    recensioni)
                  </span>
                )}
              </div>
            )}

            {selectedPlace.googleMapsUri && (
              <a
                href={selectedPlace.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Vedi su Google Maps
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => onComplete(selectedPlace.placeId, selectedPlace)}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creazione in corso...
              </>
            ) : (
              "Si, e' il mio!"
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={isSubmitting}
            className="w-full text-muted-foreground"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Non e' il mio, cerca di nuovo
          </Button>
        </div>
      </div>
    )
  }

  // Loading details
  if (isLoadingDetails) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Caricamento dettagli...
        </p>
      </div>
    )
  }

  // Search input + dropdown
  return (
    <div className="space-y-4">
      <div ref={wrapperRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Cerca il nome del tuo ristorante..."
            className="pl-9 pr-9"
            autoFocus
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {showDropdown && suggestions.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((s) => (
              <button
                key={s.placeId}
                type="button"
                onClick={() => handleSelectPlace(s)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
              >
                <p className="font-medium text-sm">{s.mainText}</p>
                {s.secondaryText && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {s.secondaryText}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}

        {showDropdown && !isSearching && query.length >= 2 && suggestions.length === 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg p-4">
            <p className="text-sm text-muted-foreground text-center">
              Nessun risultato trovato. Prova con un nome diverso.
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="pt-2">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 w-full text-center"
        >
          Non trovo il mio ristorante / Non sono ancora su Google
        </button>
        <p className="text-xs text-muted-foreground text-center mt-2 leading-relaxed">
          Se salti questo passaggio, non potremo mostrarti come migliorano le
          tue recensioni grazie a 5stelle. Potrai sempre collegarlo dalle
          impostazioni.
        </p>
      </div>
    </div>
  )
}
