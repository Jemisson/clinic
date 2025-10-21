'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'

export type LightboxItem = {
  src: string
  alt?: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: LightboxItem[]
  initialIndex?: number
  className?: string
}

export default function ImageLightbox({
  open,
  onOpenChange,
  items,
  initialIndex = 0,
  className,
}: Props) {
  const [index, setIndex] = useState(initialIndex)

  useEffect(() => {
    if (open)
      setIndex(
        Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0)),
      )
  }, [open, initialIndex, items.length])

  const hasItems = items.length > 0
  const canPrev = hasItems && index > 0
  const canNext = hasItems && index < items.length - 1

  const goPrev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i))
  }, [])

  const goNext = useCallback(() => {
    setIndex((i) => (i < items.length - 1 ? i + 1 : i))
  }, [items.length])

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, goPrev, goNext])

  const current = hasItems ? items[index] : null
  const titleText = hasItems
    ? `Imagem ${index + 1} de ${items.length}`
    : 'Visualização de imagem'

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className={clsx(
          'max-w-[95vw] sm:max-w-5xl bg-black/95 border-0 p-0 outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          className,
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>
            <VisuallyHidden>{titleText}</VisuallyHidden>
          </DialogTitle>
        </DialogHeader>

        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2 pointer-events-none">
          <div className="text-xl text-white pointer-events-auto">
            {hasItems ? `${index + 1}/${items.length}` : ''}
          </div>
        </div>

        {hasItems && (
          <>
            <button
              aria-label="Anterior"
              onClick={goPrev}
              disabled={!canPrev}
              className={clsx(
                'absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2',
                'bg-white/10 hover:bg-white/20 text-white disabled:opacity-40 disabled:cursor-not-allowed',
              )}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              aria-label="Próximo"
              onClick={goNext}
              disabled={!canNext}
              className={clsx(
                'absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full p-2',
                'bg-white/10 hover:bg-white/20 text-white disabled:opacity-40 disabled:cursor-not-allowed',
              )}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <div className="flex items-center justify-center p-3">
          {current ? (
            <Image
              src={current.src}
              alt={current.alt ?? ''}
              width={800}
              height={600}
              className="max-h-[85vh] w-auto object-contain select-none"
              draggable={false}
            />
          ) : (
            <div className="h-[60vh] w-full grid place-content-center text-white/70 text-sm">
              Nenhuma imagem
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
