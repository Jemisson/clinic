'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from "sonner"
import UsersService from '@/service/users'
import type { ProfileUserFormInput } from '@/types/user'
import { cn } from '@/lib/utils'

const childSchema = z.object({
  name: z.string().min(1, 'Informe o nome'),
  degree: z.string().min(1, 'Informe a escolaridade'),
  birth: z.string().min(1, 'Informe a data'),
})

const baseSchema = z.object({
  user: z.object({
    email: z.string().email('Email inválido'),
    role: z.string().min(1, 'Obrigatório'),
    password: z.string().optional(),
    password_confirm: z.string().optional(),
  }),
  name: z.string().min(1, 'Obrigatório'),
  cpf: z.string().min(1, 'Obrigatório'),
  rg: z.string().min(1, 'Obrigatório'),
  birthdate: z.string().min(1, 'Obrigatório'),
  address: z.string().min(1, 'Obrigatório'),
  mobile_phone: z.string().min(1, 'Obrigatório'),
  sector: z.string().min(1, 'Obrigatório'),
  job_function: z.string().min(1, 'Obrigatório'),
  profile_children: z.array(childSchema),
  photo: z.instanceof(File).optional().or(z.null()).optional(),
})

export type UserFormValues = z.infer<typeof baseSchema>

type Props = {
  mode: 'create' | 'edit'
  defaultValues?: Partial<UserFormValues>
  idForEdit?: string | number
  onSuccess?: () => void
  initialPhotoUrl?: string
}

function Stepper({
  steps,
  current,
}: {
  steps: string[]
  current: number
}) {
  const pct = Math.round(((current + 1) / steps.length) * 100)
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border text-xs',
                i <= current ? 'bg-foreground text-background border-foreground' : 'bg-transparent'
              )}
            >
              {i + 1}
            </div>
            <span className={cn(i === current && 'font-medium text-foreground')}>{label}</span>
            {i < steps.length - 1 && <span className="mx-2 opacity-40">—</span>}
          </div>
        ))}
      </div>
      <div className="mt-3 h-1 w-full rounded bg-muted">
        <div
          className="h-1 rounded bg-foreground transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function UserForm({ mode, defaultValues, idForEdit, onSuccess, initialPhotoUrl }: Props) {
  const [removePhoto, setRemovePhoto] = useState(false)
  const schema = useMemo(() => {
    return baseSchema.superRefine((val, ctx) => {
      const pass = val.user.password ?? ''
      const confirm = val.user.password_confirm ?? ''

      if (mode === 'create') {
        if (!pass) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Obrigatório',
            path: ['user', 'password'],
          })
        }
        if (!confirm) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Confirme a senha',
            path: ['user', 'password_confirm'],
          })
        }
      }

      if (pass || confirm) {
        if (pass.length > 0 && pass.length < 6) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Mínimo 6 caracteres',
            path: ['user', 'password'],
          })
        }
        if (confirm.length > 0 && confirm.length < 6 && mode === 'create') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Mínimo 6 caracteres',
            path: ['user', 'password_confirm'],
          })
        }
        if (pass !== confirm) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'As senhas não coincidem',
            path: ['user', 'password_confirm'],
          })
        }
      }
    })
  }, [mode])

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      user: { email: '', role: 'user', password: '', password_confirm: '' },
      name: '',
      cpf: '',
      rg: '',
      birthdate: '',
      address: '',
      mobile_phone: '',
      sector: '',
      job_function: '',
      profile_children: [],
      photo: undefined,
      ...defaultValues,
    },
    mode: 'onBlur',
  })

  const { control, register, handleSubmit, setValue, watch, formState } = form
  const { errors, isSubmitting } = formState
  const { fields, append, remove } = useFieldArray({ control, name: 'profile_children' })

  const [step, setStep] = useState(0)
  const steps = ['Usuário', 'Informações Gerais', 'Filiação', 'Foto']
  const isLastStep = step === steps.length - 1

  function blurActive() {
    const el = document.activeElement as HTMLElement | null
    if (el && typeof el.blur === 'function') el.blur()
  }
  const next = () => {
    blurActive()
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }
  const prev = () => {
    blurActive()
    setStep((s) => Math.max(s - 1, 0))
  }
  function handleFormKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement
      const isFileInput = target && target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'file'
      if (!isFileInput) e.preventDefault()
    }
  }

  const photo = watch('photo')
  const [preview, setPreview] = useState<string | null>(null)
  const dropRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (photo instanceof File) {
      const url = URL.createObjectURL(photo)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreview(initialPhotoUrl || null)
  }, [photo, initialPhotoUrl])

  const onDropFile = (file?: File) => {
    if (!file) return
    setValue('photo', file, { shouldDirty: true })
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onDropFile(e.dataTransfer.files[0])
    }
    dropRef.current?.classList.remove('ring-2', 'ring-primary')
  }
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    dropRef.current?.classList.add('ring-2', 'ring-primary')
  }
  const onDragLeave = () => {
    dropRef.current?.classList.remove('ring-2', 'ring-primary')
  }

  async function onSubmit(values: UserFormValues) {
    const payload: ProfileUserFormInput = {
      ...values,
      user: {
        email: values.user.email,
        role: values.user.role,
        ...(values.user.password ? { password: values.user.password } : {}),
      },
      profile_children: values.profile_children ?? [],
      photo: values.photo ?? undefined,
    }

    try {
      if (mode === 'create') {
        await UsersService.create(payload)
        toast('Usuário criado')
      } else {
        if (!idForEdit) throw new Error('idForEdit ausente')
        await UsersService.update(idForEdit, payload)
        toast.success('Usuário atualizado')
      }
      onSuccess?.()
    } catch (e: any) {
      toast(e?.response?.data?.message || 'Falha ao salvar usuário')
    }
  }
  const submit = handleSubmit(onSubmit)

  return (
    <div className="w-full">
      <div className="mb-2">
        <h1 className="text-xl font-semibold">{mode === 'create' ? 'Novo usuário' : 'Editar usuário'}</h1>
      </div>

      <Stepper steps={steps} current={step} />

      <form
        noValidate
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={handleFormKeyDown}
        className="space-y-8"
      >
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <Label>Email</Label>
              <Input type="email" {...register('user.email')} disabled={isSubmitting} />
              {errors.user?.email && <p className="text-sm text-red-600">{errors.user.email.message}</p>}
            </div>

            <div>
              <Label>Função (nível de acesso)</Label>
              <Input placeholder="user | admin | manager" {...register('user.role')} disabled={isSubmitting} />
              {errors.user?.role && <p className="text-sm text-red-600">{errors.user.role.message}</p>}
            </div>

            <div>
              <Label>Senha</Label>
              <Input type="password" {...register('user.password')} disabled={isSubmitting} />
              {errors.user?.password && <p className="text-sm text-red-600">{errors.user.password.message}</p>}
              {mode === 'edit' && (
                <p className="text-xs text-muted-foreground mt-1">Deixe em branco para manter a senha atual.</p>
              )}
            </div>

            <div>
              <Label>Confirmar senha</Label>
              <Input type="password" {...register('user.password_confirm')} disabled={isSubmitting} />
              {errors.user?.password_confirm && (
                <p className="text-sm text-red-600">{errors.user.password_confirm.message}</p>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <Label>Nome</Label>
              <Input {...register('name')} disabled={isSubmitting} />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <Label>CPF</Label>
              <Input {...register('cpf')} disabled={isSubmitting} />
              {errors.cpf && <p className="text-sm text-red-600">{errors.cpf.message}</p>}
            </div>

            <div>
              <Label>RG</Label>
              <Input {...register('rg')} disabled={isSubmitting} />
              {errors.rg && <p className="text-sm text-red-600">{errors.rg.message}</p>}
            </div>

            <div>
              <Label>Data Nascimento</Label>
              <Input type="date" {...register('birthdate')} disabled={isSubmitting} />
              {errors.birthdate && <p className="text-sm text-red-600">{errors.birthdate.message}</p>}
            </div>

            <div className="md:col-span-3">
              <Label>Endereço</Label>
              <Input {...register('address')} disabled={isSubmitting} />
              {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
            </div>

            <div>
              <Label>Celular</Label>
              <Input {...register('mobile_phone')} disabled={isSubmitting} />
              {errors.mobile_phone && <p className="text-sm text-red-600">{errors.mobile_phone.message}</p>}
            </div>
            <div>
              <Label>Setor</Label>
              <Input {...register('sector')} disabled={isSubmitting} />
              {errors.sector && <p className="text-sm text-red-600">{errors.sector.message}</p>}
            </div>
            <div>
              <Label>Função</Label>
              <Input {...register('job_function')} disabled={isSubmitting} />
              {errors.job_function && <p className="text-sm text-red-600">{errors.job_function.message}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filhos</h4>
              <Button type="button" variant="outline" onClick={() => append({ name: '', degree: '', birth: '' })}>
                Adicionar filho
              </Button>
            </div>
            <Separator />
            {fields.length === 0 && <p className="text-sm text-muted-foreground">Nenhum filho adicionado.</p>}
            <div className="space-y-4">
              {fields.map((f, idx) => (
                <div key={f.id} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label>Nome</Label>
                    <Input {...register(`profile_children.${idx}.name` as const)} disabled={isSubmitting} />
                    {errors.profile_children?.[idx]?.name && (
                      <p className="text-sm text-red-600">{errors.profile_children[idx]!.name!.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Escolaridade</Label>
                    <Input {...register(`profile_children.${idx}.degree` as const)} disabled={isSubmitting} />
                    {errors.profile_children?.[idx]?.degree && (
                      <p className="text-sm text-red-600">{errors.profile_children[idx]!.degree!.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Nascimento</Label>
                    <Input type="date" {...register(`profile_children.${idx}.birth` as const)} disabled={isSubmitting} />
                    {errors.profile_children?.[idx]?.birth && (
                      <p className="text-sm text-red-600">{errors.profile_children[idx]!.birth!.message}</p>
                    )}
                  </div>
                  <div className="md:col-span-4 flex justify-end">
                    <Button type="button" variant="destructive" onClick={() => remove(idx)} disabled={isSubmitting}>
                      Remover
                    </Button>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="h-28 w-28 overflow-hidden rounded-full border bg-muted">
                <img src={preview || '/user.jpg'} alt="Pré-visualização" className="h-full w-full object-cover" />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
              >
                Escolher arquivo
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setRemovePhoto(false)
                  setValue('photo', e.target.files?.[0] ?? null, { shouldDirty: true })
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
                disabled={isSubmitting}
              />

              {mode === 'edit' && (initialPhotoUrl || preview) && (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={removePhoto}
                    onChange={(e) => {
                      setRemovePhoto(e.target.checked)
                      if (e.target.checked) {
                        setValue('photo', null, { shouldDirty: true })
                        setPreview(null)
                      } else {
                        setPreview(initialPhotoUrl || null)
                      }
                    }}
                  />
                  Remover foto atual
                </label>
              )}
            </div>

            <div
              ref={dropRef}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={(e) => {
                onDrop(e)
                setRemovePhoto(false)
              }}
              className="md:col-span-2 flex h-40 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed bg-muted/50 p-4 text-center hover:bg-muted"
              onClick={() => fileInputRef.current?.click()}
            >
              <div>
                <p className="text-sm font-medium">Arraste e solte a foto aqui</p>
                <p className="text-xs text-muted-foreground">ou clique para selecionar</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={prev} disabled={isSubmitting || step === 0}>
            Voltar
          </Button>
          {!isLastStep ? (
            <Button type="button" onClick={next} disabled={isSubmitting}>
              Próximo
            </Button>
          ) : (
            <Button type="button" onClick={submit} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
