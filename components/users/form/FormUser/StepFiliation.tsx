"use client"

import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import type { UserFormInput } from "./index";

export default function StepFiliation() {
  const { control } = useFormContext<UserFormInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "children",
  });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
          Nenhum filho adicionado.
          <div className="mt-3">
            <Button
              type="button"
              onClick={() =>
                append({ name: "", education: undefined, birthDate: "" } as any)
              }
            >
              <Plus className="mr-2" /> Adicionar filho
            </Button>
          </div>
        </div>
      ) : null}

      {fields.map((field, index) => (
        <Card key={field.id} className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filho #{index + 1}</h4>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2 />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <FormField
              control={control}
              name={`children.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`children.${index}.education`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Escolaridade</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fundamental">Fundamental</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="superior">Superior</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Controller
              control={control}
              name={`children.${index}.birthDate`}
              render={({ field }) => {
                const selectedDate = field.value
                  ? dayjs(field.value, "YYYY-MM-DD").toDate()
                  : undefined;

                return (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? dayjs(field.value).format("DD/MM/YYYY")
                              : <span>Selecione a Data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) =>
                            field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : "")
                          }
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </Card>
      ))}

      {fields.length > 0 ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              append({ name: "", education: undefined, birthDate: "" } as any)
            }
          >
            <Plus className="mr-2" /> Adicionar mais um
          </Button>
        </div>
      ) : null}
    </div>
  );
}
