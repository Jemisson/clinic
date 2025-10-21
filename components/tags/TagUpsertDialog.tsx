"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as LucideIcons from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { TagSchema } from "@/lib/schemas/tag";
import TagsService from "@/service/tags";
import type { TagData, TagFormInput } from "@/types/tags";
import { tagIcons } from "@/utils/tagIcons";
import type { LucideIcon } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (saved: TagData) => void;
  tag?: TagData | null;
};

type TagSaveResult = TagData | { data: TagData };
function extractTag(x: TagSaveResult): TagData {
  return (x as { data?: TagData })?.data ?? (x as TagData);
}

export default function TagUpsertDialog({
  open,
  onOpenChange,
  onSuccess,
  tag,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const lucideIcons = LucideIcons as unknown as Record<string, LucideIcon>;

  const isEdit = Boolean(tag?.id);

  const defaultValues = useMemo(
    () => ({
      name: tag?.attributes.name ?? "",
      icon: tag?.attributes.icon ?? "",
    }),
    [tag]
  );

  const form = useForm<z.infer<typeof TagSchema>>({
    resolver: zodResolver(TagSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open, defaultValues, form]);

  async function onSubmit(values: z.infer<typeof TagSchema>) {
    const payload: TagFormInput = { tag: { ...values } };
    try {
      setSubmitting(true);
      let saved: TagSaveResult;
      if (isEdit && tag) {
        saved = await TagsService.update(tag.id, payload);
      } else {
        saved = await TagsService.create(payload);
      }
      form.reset();
      onSuccess?.(extractTag(saved));
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">
            <LucideIcons.Bookmark />
            {isEdit ? "Editar Tag" : "Adicionar Tag"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4 mt-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da Tag" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícone</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um ícone" />
                      </SelectTrigger>
                      <SelectContent>
                        {tagIcons.map((iconName) => {
                          const IconComponent = lucideIcons[iconName];
                          return (
                            <SelectItem key={iconName} value={iconName}>
                              {IconComponent && (
                                <Button size="icon" type="button">
                                  <IconComponent className="text-background" />
                                </Button>
                              )}{" "}
                              {iconName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? isEdit
                    ? "Salvando..."
                    : "Adicionando..."
                  : isEdit
                  ? "Salvar"
                  : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
