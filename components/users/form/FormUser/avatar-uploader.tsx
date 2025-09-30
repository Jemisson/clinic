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

interface Props {
  value?: File | null
  onChange: (file: File | null) => void
  className?: string
  initialUrl?: string
}

export default function AvatarUploader({ value, onChange, className, initialUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  // URL para prévia:
  // - se houver File, cria um objectURL
  // - senão, usa a initialUrl (se existir)
  const previewUrl = useMemo(() => {
    if (value instanceof File) {
      try { return URL.createObjectURL(value) } catch { return null }
    }
    return initialUrl ?? null
  }, [value, initialUrl])

  // Revogar apenas objectURLs criados para File
  useEffect(() => {
    if (!(value instanceof File)) return
    const url = previewUrl
    return () => {
      try { url && URL.revokeObjectURL(url) } catch {}
    }
  }, [previewUrl, value])

  const openPicker = () => inputRef.current?.click()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onChange(file)
    // Permite re-selecionar o mesmo arquivo no futuro
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0] ?? null
    if (file && file.type.startsWith("image/")) {
      onChange(file)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault()
  }

  const clear = () => {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  // Mostrar "X" apenas quando há um File selecionado (não apenas a foto inicial do servidor)
  const showClear = value instanceof File

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

        {showClear && (
          <Button
            type="button"
            onClick={clear}
            size="icon"
            className="absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
            aria-label="Remover imagem selecionada"
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
