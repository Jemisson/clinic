"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function StepPhoto({
  initialPhotoUrl,
  onChangeFile,
  onRemovePhoto,
}: {
  initialPhotoUrl?: string
  onChangeFile?: (file: File | null) => void
  onRemovePhoto?: (remove: boolean) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(initialPhotoUrl ?? null)

  return (
    <div className="flex items-start gap-4">
      <div className="size-24 relative rounded overflow-hidden border bg-muted">
        {preview ? (
          <img src={preview} alt="preview" className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full grid place-items-center text-sm text-muted-foreground">Sem foto</div>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <Label>Foto do paciente</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null
            setFile(f)
            onChangeFile?.(f)
            if (f) {
              const url = URL.createObjectURL(f)
              setPreview(url)
              onRemovePhoto?.(false)
            } else {
              setPreview(initialPhotoUrl ?? null)
            }
          }}
        />
        {initialPhotoUrl && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFile(null)
              setPreview(null)
              onChangeFile?.(null)
              onRemovePhoto?.(true)
            }}
          >
            Remover foto
          </Button>
        )}
        <p className="text-xs text-muted-foreground">Upload opcional (pode ser enviado após salvar o paciente).</p>
      </div>
    </div>
  )
}
