'use client';

import { UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';

type Props = {
  file: File | null;
  onFileChange: (file: File | null) => void;
};

export default function DragAndDropField({ file, onFileChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleFileList(list: FileList | null) {
    if (!list || list.length === 0) return;
    const f = list[0];
    onFileChange(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    handleFileList(e.dataTransfer.files);
  }

  return (
    <div className="space-y-2">
      <div
        className={[
          'flex flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center text-sm transition',
          dragOver
            ? 'border-primary/60 bg-primary/5'
            : 'border-muted-foreground/30 bg-muted/10 hover:bg-muted/20',
        ].join(' ')}
        onClick={handleClick}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
      >
        <UploadCloud className="mb-2 h-6 w-6 text-muted-foreground" />
        {file ? (
          <>
            <div className="text-xs font-medium">{file.name}</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              {Math.ceil(file.size / 1024)} KB
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
              }}
              className="mt-3 text-[11px] underline text-red-600 hover:text-red-700"
            >
              Remover arquivo
            </button>
          </>
        ) : (
          <>
            <div className="text-xs font-medium">
              Arraste e solte aqui, ou clique para selecionar
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              PDF, JPG, PNG, WEBP, HEIC • até 25MB
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,image/*"
        onChange={(e) => handleFileList(e.target.files)}
      />
    </div>
  );
}
