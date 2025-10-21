"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CameraIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCapture: (file: File) => void
  title?: string
  constraints?: MediaStreamConstraints["video"]
}

export default function CameraCapture({
  open,
  onOpenChange,
  onCapture,
  title = "Câmera",
  constraints = { facingMode: { ideal: "user" }, width: { ideal: 1280 }, height: { ideal: 720 } },
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    async function start() {
      setError(null)
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Acesso à câmera não suportado neste navegador.")
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: constraints, audio: false })
        streamRef.current = stream
        const video = videoRef.current!
        video.srcObject = stream
        video.playsInline = true
        video.muted = true
        await video.play()
      } catch (e: unknown) {
          if (e instanceof Error) {
            setError(e.message)
          } else {
            setError("Não foi possível acessar a câmera.")
          }
      }
    }
    start()

    return () => {
      const s = streamRef.current
      if (s) {
        s.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
    }
  }, [open, constraints])

  async function capture() {
    const video = videoRef.current, canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth || 1280, h = video.videoHeight || 720
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext("2d"); if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)

    await new Promise<void>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `camera_${Date.now()}.jpg`, { type: "image/jpeg" })
          onCapture(file)
        }
        resolve()
      }, "image/jpeg", 0.92)
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CameraIcon className="h-4 w-4" /> {title}
          </DialogTitle>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </DialogHeader>

        <div className="w-full rounded-md overflow-hidden bg-black aspect-video">
          <video ref={videoRef} className="w-full h-full object-contain bg-black" playsInline muted autoPlay />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={capture}>Capturar</Button>
        </DialogFooter>

        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  )
}
