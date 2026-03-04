'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import QRCode from 'qrcode'
import { jsPDF } from 'jspdf'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Copy, Check, ExternalLink, Plus, Loader2, UtensilsCrossed, Pencil } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import type { Table } from '@/types/database.types'
import { createClient } from '@/lib/supabase/client'
import { encodeTableId } from '@/lib/utils'

interface QRCodeClientProps {
  baseUrl: string
  restaurantId: string
  restaurantName: string
  initialTables: Table[]
}

function QRCodeCard({
  url,
  label,
  sublabel,
  onDownloadPDF,
  isGenerating,
}: {
  url: string
  label: string
  sublabel?: string
  onDownloadPDF?: () => void
  isGenerating?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#ffffff' },
      })
    }
  }, [url])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('URL copiato!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <CardContent className="flex flex-col items-center py-6">
        <p className="font-medium text-sm mb-1">{label}</p>
        {sublabel && (
          <p className="text-xs text-muted-foreground mb-3">{sublabel}</p>
        )}
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <canvas ref={canvasRef} />
        </div>
        <div className="flex gap-2 mt-4 w-full max-w-xs">
          <Input value={url} readOnly className="font-mono text-xs" />
          <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
        {onDownloadPDF && (
          <div className="w-full max-w-xs mt-4">
            <Button
              className="w-full"
              onClick={onDownloadPDF}
              disabled={isGenerating}
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generazione...' : 'Scarica PDF'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function TableQRCard({
  table,
  url,
  onDownloadPDF,
  onToggleActive,
  onRename,
  isGenerating,
  isToggling,
  autoFocus,
}: {
  table: Table
  url: string
  onDownloadPDF: () => void
  onToggleActive: () => void
  onRename: (name: string) => void
  isGenerating: boolean
  isToggling: boolean
  autoFocus?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(autoFocus ?? false)
  const [editName, setEditName] = useState(table.name)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#ffffff' },
      })
    }
  }, [url])

  useEffect(() => {
    if (autoFocus && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [autoFocus])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('URL copiato!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveName = () => {
    const trimmed = editName.trim()
    if (trimmed && trimmed !== table.name) {
      onRename(trimmed)
    } else {
      setEditName(table.name)
    }
    setIsEditing(false)
  }

  const isActive = table.is_active

  return (
    <Card className={`transition-all duration-200 ${isActive ? 'hover:-translate-y-1 hover:shadow-md' : 'opacity-60 grayscale'}`}>
      <CardContent className="flex flex-col items-center py-6">
        {/* Active toggle + name */}
        <div className="flex items-center gap-2 mb-1 w-full max-w-xs">
          <Switch
            checked={isActive}
            onCheckedChange={onToggleActive}
            disabled={isToggling}
            size="sm"
          />
          <div className="flex-1 flex items-center justify-center gap-1.5">
            {isEditing ? (
              <Input
                ref={nameInputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName()
                  if (e.key === 'Escape') {
                    setEditName(table.name)
                    setIsEditing(false)
                  }
                }}
                className="h-7 text-sm font-medium text-center w-40"
              />
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors"
              >
                {table.name}
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
          {!isActive && (
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Disattivato
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-3">{table.identifier}</p>

        <div className="bg-white p-3 rounded-lg shadow-sm">
          <canvas ref={canvasRef} />
        </div>
        <div className="flex gap-2 mt-4 w-full max-w-xs">
          <Input value={url} readOnly className="font-mono text-xs" />
          <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
        {isActive && (
          <div className="flex gap-2 w-full max-w-xs mt-4">
            <Button
              className="flex-1"
              onClick={onDownloadPDF}
              disabled={isGenerating}
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generazione...' : 'Scarica PDF'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function QRCodeClient({
  baseUrl,
  restaurantId,
  restaurantName,
  initialTables,
}: QRCodeClientProps) {
  const supabase = createClient()
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null)

  const generalUrl = baseUrl

  const handleAddTable = async () => {
    const nextNumber = tables.length + 1
    const name = `Tavolo ${nextNumber}`
    const identifier = slugify(name)

    // Ensure unique identifier
    let finalIdentifier = identifier
    let counter = nextNumber
    while (tables.some((t) => t.identifier === finalIdentifier)) {
      counter++
      finalIdentifier = slugify(`Tavolo ${counter}`)
    }
    const finalName = counter !== nextNumber ? `Tavolo ${counter}` : name

    setIsAdding(true)
    try {
      const { data, error } = await supabase
        .from('tables')
        .insert({ restaurant_id: restaurantId, name: finalName, identifier: finalIdentifier })
        .select()
        .single()

      if (error) throw error
      const newTable = data as Table
      setTables((prev) => [...prev, newTable])
      setNewlyAddedId(newTable.id)
      toast.success('Tavolo aggiunto')
    } catch {
      console.error('Failed to add table')
      toast.error("Errore nell'aggiungere il tavolo")
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleTable = async (id: string, currentStatus: boolean) => {
    setTogglingId(id)
    try {
      const { error } = await supabase
        .from('tables')
        .update({ is_active: !currentStatus })
        .eq('id', id)
      if (error) throw error
      setTables((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_active: !currentStatus } : t))
      )
      toast.success(!currentStatus ? 'Tavolo attivato' : 'Tavolo disattivato')
    } catch {
      console.error('Failed to toggle table')
      toast.error('Errore nel modificare lo stato del tavolo')
    } finally {
      setTogglingId(null)
    }
  }

  const handleRenameTable = async (id: string, newName: string) => {
    const newIdentifier = slugify(newName)
    if (!newIdentifier) {
      toast.error('Nome tavolo non valido')
      return
    }
    if (tables.some((t) => t.id !== id && t.identifier === newIdentifier)) {
      toast.error('Esiste già un tavolo con questo nome')
      return
    }

    try {
      const { error } = await supabase
        .from('tables')
        .update({ name: newName, identifier: newIdentifier })
        .eq('id', id)

      if (error) throw error
      setTables((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, name: newName, identifier: newIdentifier } : t
        )
      )
      toast.success('Tavolo rinominato')
    } catch {
      console.error('Failed to rename table')
      toast.error('Errore nel rinominare il tavolo')
    }
  }

  const handleDownloadSinglePDF = useCallback(
    async (url: string, label: string) => {
      setIsGenerating(true)
      try {
        const canvas = document.createElement('canvas')
        await QRCode.toCanvas(canvas, url, {
          width: 512,
          margin: 2,
          errorCorrectionLevel: 'H',
        })

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
        const pageWidth = pdf.internal.pageSize.getWidth()

        pdf.setFontSize(24)
        pdf.setFont('helvetica', 'bold')
        const titleWidth = pdf.getTextWidth(restaurantName)
        pdf.text(restaurantName, (pageWidth - titleWidth) / 2, 40)

        if (label !== restaurantName) {
          pdf.setFontSize(18)
          pdf.setFont('helvetica', 'normal')
          const labelWidth = pdf.getTextWidth(label)
          pdf.text(label, (pageWidth - labelWidth) / 2, 52)
        }

        const qrDataUrl = canvas.toDataURL('image/png')
        const qrSize = 80
        const qrX = (pageWidth - qrSize) / 2
        const qrY = label !== restaurantName ? 60 : 50
        pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize)

        pdf.setFontSize(16)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(0, 0, 0)
        const instruction = 'Scansiona per lasciare un feedback'
        const instrWidth = pdf.getTextWidth(instruction)
        pdf.text(instruction, (pageWidth - instrWidth) / 2, qrY + qrSize + 15)

        pdf.setFontSize(10)
        pdf.setTextColor(128, 128, 128)
        const urlWidth = pdf.getTextWidth(url)
        pdf.text(url, (pageWidth - urlWidth) / 2, qrY + qrSize + 25)

        const filename = `qr-${label.toLowerCase().replace(/\s+/g, '-')}.pdf`
        pdf.save(filename)
        toast.success('PDF scaricato!')
      } catch {
        console.error('Failed to generate PDF')
        toast.error('Errore nel generare il PDF')
      } finally {
        setIsGenerating(false)
      }
    },
    [restaurantName]
  )

  const handleDownloadAllPDF = useCallback(async () => {
    const activeTables = tables.filter((t) => t.is_active)
    if (activeTables.length === 0) return

    setIsGenerating(true)
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()

      const allItems = [
        { label: 'QR Code Generale', url: generalUrl },
        ...activeTables.map((t) => ({
          label: t.name,
          url: `${baseUrl}?t=${encodeTableId(t.identifier)}`,
        })),
      ]

      for (let i = 0; i < allItems.length; i++) {
        if (i > 0) pdf.addPage()

        const item = allItems[i]
        const canvas = document.createElement('canvas')
        await QRCode.toCanvas(canvas, item.url, {
          width: 512,
          margin: 2,
          errorCorrectionLevel: 'H',
        })

        pdf.setFontSize(24)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(0, 0, 0)
        const titleWidth = pdf.getTextWidth(restaurantName)
        pdf.text(restaurantName, (pageWidth - titleWidth) / 2, 40)

        pdf.setFontSize(18)
        pdf.setFont('helvetica', 'normal')
        const labelWidth = pdf.getTextWidth(item.label)
        pdf.text(item.label, (pageWidth - labelWidth) / 2, 52)

        const qrDataUrl = canvas.toDataURL('image/png')
        const qrSize = 80
        const qrX = (pageWidth - qrSize) / 2
        pdf.addImage(qrDataUrl, 'PNG', qrX, 60, qrSize, qrSize)

        pdf.setFontSize(16)
        const instruction = 'Scansiona per lasciare un feedback'
        const instrWidth = pdf.getTextWidth(instruction)
        pdf.text(instruction, (pageWidth - instrWidth) / 2, 155)

        pdf.setFontSize(10)
        pdf.setTextColor(128, 128, 128)
        const urlWidth = pdf.getTextWidth(item.url)
        pdf.text(item.url, (pageWidth - urlWidth) / 2, 165)
      }

      pdf.save(
        `qr-codes-${restaurantName.toLowerCase().replace(/\s+/g, '-')}.pdf`
      )
      toast.success('PDF scaricato!')
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      toast.error('Errore nel generare il PDF')
    } finally {
      setIsGenerating(false)
    }
  }, [tables, generalUrl, baseUrl, restaurantName])

  return (
    <div className="space-y-8">
      {/* General QR code */}
      <div>
        <h2 className="text-lg font-semibold mb-3">QR Code Generale</h2>
        <QRCodeCard
          url={generalUrl}
          label={restaurantName}
          onDownloadPDF={() => handleDownloadSinglePDF(generalUrl, restaurantName)}
          isGenerating={isGenerating}
        />
      </div>

      {/* Table QR codes */}
      <Card>
        <CardHeader>
          <div className="space-y-3">
            <div>
              <CardTitle className="text-lg">QR Code per Tavolo</CardTitle>
              <CardDescription>
                Crea QR code dedicati per tracciare i feedback per tavolo
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {tables.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadAllPDF}
                  disabled={isGenerating}
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Scarica tutti
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleAddTable}
                disabled={isAdding}
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <Plus className="h-4 w-4 mr-1.5" />
                )}
                Aggiungi Tavolo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tables.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <AnimatePresence initial={false}>
                {[...tables]
                  .sort((a, b) => Number(b.is_active) - Number(a.is_active))
                  .map((table) => {
                    const tableUrl = `${baseUrl}?t=${encodeTableId(table.identifier)}`
                    return (
                      <motion.div
                        key={table.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        layout
                      >
                        <TableQRCard
                          table={table}
                          url={tableUrl}
                          onDownloadPDF={() => handleDownloadSinglePDF(tableUrl, table.name)}
                          onToggleActive={() => handleToggleTable(table.id, table.is_active)}
                          onRename={(name) => handleRenameTable(table.id, name)}
                          isGenerating={isGenerating}
                          isToggling={togglingId === table.id}
                          autoFocus={newlyAddedId === table.id}
                        />
                      </motion.div>
                    )
                  })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-8">
              <UtensilsCrossed className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Nessun tavolo creato. Aggiungi un tavolo per generare QR code dedicati.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-muted/50">
        <CardContent className="py-4">
          <h4 className="font-medium mb-2">Consigli</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>- Stampa il QR code in formato A5 o A6</li>
            <li>- Posiziona un QR code dedicato su ogni tavolo</li>
            <li>- Assicurati che sia ben illuminato e visibile</li>
            <li>- Testa sempre il QR code prima di stamparlo</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
