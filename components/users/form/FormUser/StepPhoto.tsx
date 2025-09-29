"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { UserFormInput } from "./index"
import AvatarUploader from "@/components/users/form/FormUser/avatar-uploader"

export default function StepPhoto() {
  const { control } = useFormContext<UserFormInput>()

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
                value={field.value as File | null}
                onChange={(file) => field.onChange(file)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  )
}
