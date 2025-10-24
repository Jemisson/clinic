'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import DragAndDropField from './DragAndDropField';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string | number;
  onDidUpload?: () => void;
};

const REQUIRED_OPTIONS = [
  { value: 'Anamnese', label: 'Anamnese' },
  { value: 'Uso de Imagem', label: 'Uso de Imagem' },
];

export default function AddAttachmentDialog({
  open,
  onOpenChange,
  patientId,
  onDidUpload,
}: Props) {
  const [isRequiredType, setIsRequiredType] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [requiredTitle, setRequiredTitle] = React.useState(
    REQUIRED_OPTIONS[0].value,
  );
  const [file, setFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // reset ao fechar
  React.useEffect(() => {
    if (!open) {
      setIsRequiredType(false);
      setTitle('');
      setRequiredTitle(REQUIRED_OPTIONS[0].value);
      setFile(null);
      setSubmitting(false);
      setErrorMsg(null);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Selecione um arquivo.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    // (a) determinar o título que vamos mandar
    const finalTitle = isRequiredType ? requiredTitle : title || requiredTitle;

    // (b) determinar o kind
    // regra inicial: se o nome parece um exame, podemos mandar 'exam', senão 'document'.
    // por enquanto vamos mandar sempre 'document' porque é mais seguro em termos legais.
    const kind: 'document' | 'exam' = 'document';

    // (c) montar payload pra PatientAttachmentsService.create
    // vamos deixar comentado agora; plugar depois
    /*
    try {
      await PatientAttachmentsService.create(patientId, {
        title: finalTitle,
        kind,
        captured_at: new Date().toISOString(),
      }, {
        file,
      });

      if (onDidUpload) {
        await onDidUpload();
      }

      onOpenChange(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao enviar arquivo.');
    } finally {
      setSubmitting(false);
    }
    */

    // por enquanto só fecha e imprime
    console.log('Enviar:', {
      patientId,
      finalTitle,
      kind,
      file,
    });
    setSubmitting(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Novo arquivo</DialogTitle>
          <DialogDescription>
            Envie PDF ou imagem. Campos obrigatórios marcados com *.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Switch: marcar como documento obrigatório */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">
                Termos, condições e anamnese
              </Label>
              <p className="text-xs text-muted-foreground">
                Marque se este arquivo é um documento obrigatório (ex. Anamnese,
                Uso de Imagem).
              </p>
            </div>
            <Switch
              checked={isRequiredType}
              onCheckedChange={(checked) => setIsRequiredType(checked)}
            />
          </div>

          {/* Se for obrigatório: select fixo dos obrigatórios */}
          {isRequiredType ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Documento obrigatório *
              </Label>
              <select
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={requiredTitle}
                onChange={(e) => setRequiredTitle(e.target.value)}
              >
                {REQUIRED_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            // Se NÃO for obrigatório: campo livre de nome
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nome do documento *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Exame Raio-X, Laudo, Receita..."
                required
              />
            </div>
          )}

          {/* Drag & Drop */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Arquivo *</Label>
            <DragAndDropField file={file} onFileChange={setFile} />
            <p className="text-[11px] text-muted-foreground">
              Formatos aceitos: PDF, JPG, PNG, WEBP, HEIC (máx 25MB).
            </p>
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600 leading-tight">{errorMsg}</p>
          )}

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl px-4"
                disabled={submitting}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="rounded-xl px-4"
              disabled={submitting}
            >
              {submitting ? 'Enviando…' : 'Enviar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
