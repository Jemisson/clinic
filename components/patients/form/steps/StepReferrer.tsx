"use client"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function StepReferrer() {
  const { register } = useFormContext()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>ID do Indicador (referrer_person_id)</Label>
        <Input type="number" {...register("referrer_person_id")} placeholder="Ex.: 123" />
      </div>
    </div>
  )
}
