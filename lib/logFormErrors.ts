// src/lib/logFormErrors.ts
import type { FieldErrors } from "react-hook-form"

type FlatErr = { path: string; message: string }

function isLeafError(e: any): e is { message?: string } {
  return e && typeof e === "object" && "message" in e
}

export function flattenFieldErrors(
  errors: FieldErrors,
  parent: string[] = [],
  out: FlatErr[] = []
): FlatErr[] {
  for (const [key, val] of Object.entries(errors)) {
    if (!val) continue
    const path = [...parent, key]

    // Se for um erro "folha", loga e não desce
    if (isLeafError(val) && val.message) {
      out.push({ path: path.join("."), message: String(val.message) })
      continue
    }

    // Caso seja um objeto/array de erros, desce recursivamente
    if (typeof val === "object") {
      for (const [k, v] of Object.entries(val as any)) {
        if (["type", "message", "ref", "types"].includes(k)) continue
        if (v && typeof v === "object") {
          flattenFieldErrors(v as FieldErrors, path.concat(k), out)
        }
      }
    }
  }
  return out
}

export function logAllFormErrors(errors: FieldErrors, label = "[Form] validation errors") {
  const flat = flattenFieldErrors(errors)
  if (!flat.length) return
  // escolha seu formato favorito:
  console.groupCollapsed(label)
  console.table(flat)
  flat.forEach((e) => console.error(`${e.path}: ${e.message}`))
  console.groupEnd()
}
