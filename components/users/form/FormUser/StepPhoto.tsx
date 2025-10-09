"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import AvatarUploader from "@/components/users/form/FormUser/avatar-uploader"

export interface StepPhotoProps {
  initialPhotoUrl?: string
}

interface FormValues {
  photo?: File | null
  remove_photo?: boolean
}

export default function StepPhoto({ initialPhotoUrl }: StepPhotoProps) {
  const { control, setValue } = useFormContext<FormValues>()

  return (
    <section className="flex flex-col gap-4">
      <FormField
        control={control}
        name="photo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Foto</FormLabel>
            <FormControl>
              <AvatarUploader
                value={field.value ?? null}
                initialUrl={initialPhotoUrl}
                onChange={(file) => {
                  field.onChange(file)
                  if (file) setValue("remove_photo", false, { shouldDirty: true })
                }}
                onClear={(source) => {
                  field.onChange(null)
                  setValue("remove_photo", source === "initial", { shouldDirty: true })
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
