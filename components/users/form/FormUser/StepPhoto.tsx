"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import AvatarUploader from "@/components/users/form/FormUser/avatar-uploader"

export interface StepPhotoProps {
  initialPhotoUrl?: string
}

interface FormValues {
  photo?: File | null
}

export default function StepPhoto({ initialPhotoUrl }: StepPhotoProps) {
  const { control } = useFormContext<FormValues>()

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
                onChange={(file) => field.onChange(file)}
                initialUrl={initialPhotoUrl}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  )
}
