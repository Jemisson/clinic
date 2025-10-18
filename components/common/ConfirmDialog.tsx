"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import * as React from "react"

type StatusValue = "active" | "inactive"

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetStatus: StatusValue
  entityLabel?: string
  entityName?: string
  title?: string
  confirmLabel?: string
  deactivateDescription?: React.ReactNode
  activateDescription?: React.ReactNode
  description?: React.ReactNode

  loading?: boolean
  onConfirm: () => Promise<void> | void
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  targetStatus,
  entityLabel,
  entityName,
  title,
  confirmLabel,
  deactivateDescription,
  activateDescription,
  description,
  loading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const isDeactivate = String(targetStatus) === "inactive"

  const TitleIcon = isDeactivate ? AlertTriangle : CheckCircle2
  const fallbackTitle = isDeactivate
    ? `Desativar ${entityLabel ?? "item"}`
    : `Reativar ${entityLabel ?? "item"}`
  const fallbackConfirm = isDeactivate ? "Desativar" : "Reativar"

  const effectiveTitle = title ?? fallbackTitle
  const effectiveConfirm = confirmLabel ?? fallbackConfirm
  const confirmVariant = (isDeactivate ? "destructive" : "default") as
    | "default"
    | "destructive"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"

  const defaultDescription = (
    <>
      {entityName ? (
        <>Você está alterando o status de <b>{entityName}</b>. </>
      ) : null}
      {isDeactivate ? (
        <>Ao desativar, o registro ficará indisponível nas rotinas que dependem de status ativo. Você poderá reativá-lo depois.</>
      ) : (
        <>Ao reativar, o registro volta a ficar disponível nas rotinas do sistema.</>
      )}
    </>
  )

  const effectiveDescription =
    (isDeactivate ? deactivateDescription : activateDescription) ??
    description ??
    defaultDescription

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TitleIcon
              className={isDeactivate ? "h-5 w-5 text-amber-500" : "h-5 w-5 text-green-600"}
            />
            {effectiveTitle}
          </DialogTitle>
          <DialogDescription>{effectiveDescription}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>Cancelar</Button>
          </DialogClose>
          <Button onClick={onConfirm} disabled={loading} variant={confirmVariant}>
            {loading ? (isDeactivate ? "Desativando..." : "Reativando...") : effectiveConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
