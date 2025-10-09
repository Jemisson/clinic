"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import AvatarUploader from "@/components/users/form/FormUser/avatar-uploader"
import { Button } from "@/components/ui/button"
import type { PatientFormValues } from "../schema"

export interface StepPhotoProps {
  initialPhotoUrl?: string
}

export function StepPhoto({ initialPhotoUrl }: StepPhotoProps) {
  const { control, setValue, getValues } = useFormContext<PatientFormValues>()

  const handleRemove = () => {
    setValue("person.photo", null, { shouldDirty: true })
    setValue("person.remove_photo", true, { shouldDirty: true })
  }

  return (
    <section className="flex flex-col gap-4">
      <FormField
        control={control}
        name="person.photo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Foto do paciente</FormLabel>
            <FormControl>
              <AvatarUploader
                value={field.value ?? null}
                initialUrl={initialPhotoUrl}
                onChange={(file) => {
                  field.onChange(file)
                  if (file) setValue("person.remove_photo", false, { shouldDirty: true })
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {initialPhotoUrl && !getValues("person.photo") && (
        <Button type="button" variant="outline" onClick={handleRemove}>
          Remover foto atual
        </Button>
      )}
    </section>
  )
}
