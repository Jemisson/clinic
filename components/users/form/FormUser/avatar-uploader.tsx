"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CircleUserRoundIcon, UploadIcon, XIcon, CameraIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ClearSource = "initial" | "new"

interface Props {
  value?: File | null
  onChange: (file: File | null) => void
  className?: string
  initialUrl?: string
  onClear?: (source: ClearSource) => void
}

export default function AvatarUploader({
  value,
  onChange,
  className,
  initialUrl,
  onClear,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [camOpen, setCamOpen] = useState(false)
  const [camError, setCamError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const previewUrl = useMemo(() => {
    if (value instanceof File) {
      try {
        return URL.createObjectURL(value)
      } catch {
        return null
      }
    }
    return initialUrl ?? null
  }, [value, initialUrl])

  useEffect(() => {
    if (!(value instanceof File)) return
    const url = previewUrl
    return () => {
      try {
        url && URL.revokeObjectURL(url)
      } catch {}
    }
  }, [previewUrl, value])

  const openPicker = () => inputRef.current?.click()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onChange(file)
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

  const clear = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    const source: ClearSource = value instanceof File ? "new" : "initial"
    onChange(null)
    onClear?.(source)
    if (inputRef.current) inputRef.current.value = ""
  }

  const showClear = Boolean(previewUrl)

  const openCamera = async () => {
    setCamError(null)
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError("Acesso à câmera não suportado neste navegador.")
      setCamOpen(true)
      return
    }

    try {
      setCamOpen(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })
      streamRef.current = stream

      await new Promise<void>((resolve) => {
        const iv = setInterval(() => {
          if (videoRef.current) {
            clearInterval(iv)
            resolve()
          }
        }, 10)
      })

      const video = videoRef.current!
      video.srcObject = stream
      video.playsInline = true
      video.muted = true

      await new Promise<void>((resolve) => {
        const onLoaded = () => {
          video.removeEventListener("loadedmetadata", onLoaded)
          resolve()
        }
        video.addEventListener("loadedmetadata", onLoaded, { once: true })
      })

      try {
        await video.play()
      } catch {
        await new Promise<void>((resolve) => {
          const onCanPlay = () => {
            video.removeEventListener("canplay", onCanPlay)
            resolve()
          }
          video.addEventListener("canplay", onCanPlay, { once: true })
        })
        await video.play()
      }
    } catch (err: any) {
      setCamError(err?.message || "Não foi possível acessar a câmera.")
    }
  }

  const stopCamera = () => {
    const s = streamRef.current
    if (s) {
      s.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  const closeCamera = () => {
    stopCamera()
    setCamOpen(false)
  }

  const capturePhoto = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const w = video.videoWidth || 1280
    const h = video.videoHeight || 720
    canvas.width = w
    canvas.height = h

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)

    await new Promise<void>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `camera_${Date.now()}.jpg`, { type: "image/jpeg" })
            onChange(file)
          }
          resolve()
        },
        "image/jpeg",
        0.92
      )
    })

    closeCamera()
  }

  return (
    <>
      <div className={cn("flex items-start gap-4", className)}>
        <div className="relative inline-flex group">
          <div
            className={cn(
              "relative flex size-24 md:size-28 items-center justify-center overflow-hidden rounded-full",
              "border border-dashed border-input bg-muted"
            )}
            aria-label={previewUrl ? "Pré-visualização da foto" : "Sem foto"}
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
                <span>Sem foto</span>
              </div>
            )}
          </div>

          {showClear && (
            <Button
              type="button"
              onClick={clear}
              size="icon"
              variant="secondary"
              className={cn(
                "absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none",
                "hidden group-hover:flex"
              )}
              aria-label="Remover imagem"
              title="Remover imagem"
              tabIndex={-1}
            >
              <XIcon className="size-3.5" />
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={openPicker}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={cn(
              "border-input hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50",
              "relative flex h-28 w-full max-w-md items-center justify-center overflow-hidden rounded-md",
              "border border-dashed transition-colors outline-none focus-visible:ring-[3px] bg-background"
            )}
            aria-label={previewUrl ? "Trocar foto" : "Enviar foto"}
          >
            <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground px-2">
              <UploadIcon className="size-5 opacity-70" />
              <span className="text-center leading-tight">
                Arraste a foto aqui
                <br /> ou clique
              </span>
            </div>
          </button>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={openPicker}>
              Selecionar arquivo
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={openCamera}
              title="Abrir câmera"
            >
              <CameraIcon className="mr-1 h-4 w-4" />
              Abrir câmera
            </Button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleInputChange}
            tabIndex={-1}
          />

          <p className="text-xs text-muted-foreground">
            PNG, JPG ou WEBP • até 5MB
          </p>
        </div>
      </div>

      {camOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-lg bg-background shadow-lg border">
            <div className="p-4 border-b">
              <h3 className="text-sm font-medium">Câmera</h3>
              {camError && (
                <p className="mt-1 text-xs text-destructive">{camError}</p>
              )}
            </div>

            <div className="p-4">
              <div className="w-full rounded-md overflow-hidden bg-black aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain bg-black"
                  playsInline
                  muted
                  autoPlay
                />
              </div>
            </div>

            <div className="p-4 flex items-center justify-end gap-2 border-t">
              <Button type="button" variant="outline" onClick={closeCamera}>
                Cancelar
              </Button>
              <Button type="button" onClick={capturePhoto}>
                Capturar
              </Button>
            </div>

            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </>
  )
}
