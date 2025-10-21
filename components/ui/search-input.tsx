'use client'

import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
  autoFocus?: boolean
  className?: string
  showClear?: boolean
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar...',
  debounceMs = 300,
  autoFocus = false,
  className,
  showClear = true,
}: Props) {
  const [internal, setInternal] = useState(value)

  // Sincroniza estado interno com o valor externo
  useEffect(() => {
    setInternal(value)
  }, [value])

  // Aplica debounce e notifica o pai
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (internal !== value) onChange(internal)
    }, debounceMs)

    return () => clearTimeout(timeout)
  }, [internal, debounceMs, onChange, value]) // ✅ dependências completas

  const handleClear = () => {
    setInternal('')
    onChange('')
  }

  return (
    <div className={`relative w-full max-w-xs ${className ?? ''}`}>
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
      <Input
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-6"
        autoFocus={autoFocus}
      />
      {showClear && internal && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
          aria-label="Limpar busca"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
