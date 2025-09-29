"use client"

import {
  useEffect,
  useMemo,
  useRef
} from "react"
import {
  CircleUserRoundIcon,
  XIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type Props = {
  value?: File | null
  onChange: (file: File | null) => void
  className?: string
}

export default function AvatarUploader({ value, onChange, className }: Props) {
  const previewUrl = useMemo(() => {
    if (!value) return null
    try {
      return URL.createObjectURL(value)
    } catch {
      return null
    }
  }, [value])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const inputRef = useRef<HTMLInputElement>(null)

  const openPicker = () => inputRef.current?.click()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onChange(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      onChange(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }

  const clear = () => onChange(null)

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <div className="relative inline-flex">

        <button
          type="button"
          onClick={openPicker}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={cn(
            "border-input hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50",
            "relative flex size-24 md:size-28 items-center justify-center overflow-hidden rounded-full",
            "border border-dashed transition-colors outline-none focus-visible:ring-[3px]"
          )}
          aria-label={previewUrl ? "Trocar foto" : "Enviar foto"}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Pré-visualização do avatar"
              className="size-full object-cover"
              width={112}
              height={112}
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <CircleUserRoundIcon className="size-6 opacity-60" />
              <span>Arraste ou clique</span>
            </div>
          )}
        </button>

        {previewUrl && (
          <Button
            type="button"
            onClick={clear}
            size="icon"
            className="absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
            aria-label="Remover imagem"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleInputChange}
          tabIndex={-1}
        />
      </div>
    </div>
  )
}
