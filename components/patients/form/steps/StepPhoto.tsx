"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import AvatarUploader from "@/components/users/form/FormUser/avatar-uploader"
import type { PatientFormValues } from "../schema"

export interface StepPhotoProps {
  initialPhotoUrl?: string
}

export function StepPhoto({ initialPhotoUrl }: StepPhotoProps) {
  const { control, setValue } = useFormContext<PatientFormValues>()

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
                onClear={(source) => {
                  field.onChange(null)
                  setValue("person.remove_photo", source === "initial", { shouldDirty: true })
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  )
}
