'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper'
import StepFiliation from '@/components/users/form/FormUser/StepFiliation'
import StepPersonal from '@/components/users/form/FormUser/StepPersonal'
import StepPhoto from '@/components/users/form/FormUser/StepPhoto'
import StepUser from '@/components/users/form/FormUser/StepUser'
import UsersService from '@/service/users'
import { type ProfileUserData, type ProfileUserFormInput } from '@/types/users'
import {
  ZGender,
  ZUserFunction,
  ZUserRole,
  ZUserSector,
  isGender,
  isUserFunction,
  isUserRole,
  isUserSector,
} from '@/types/users.enums'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Baby,
  Camera,
  Check,
  ContactRound,
  UserRound,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  FieldPath,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const ChildSchema = z
  .object({
    id: z.number().optional(),
    _destroy: z.boolean().optional().default(false),

    name: z.string().optional(),
    education: z.enum(['fundamental', 'medio', 'superior']).optional(),
    birthDate: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val._destroy) {
      if (!val.name || !val.name.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['name'],
          message: 'Informe o nome',
        })
      }
      if (!val.education) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['education'],
          message: 'Escolaridade inválida',
        })
      }
      if (!val.birthDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['birthDate'],
          message: 'Informe a data de nascimento',
        })
      }
    }
  })

const UserSchema = z
  .object({
    email: z.string().email(),
    password: z.string().optional().or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
    role: ZUserRole,

    name: z.string().min(1),
    gender: ZGender,
    birthDate: z.string().min(1, 'Informe a data de nascimento'),
    rg: z.string().min(1),
    cpf: z.string().min(1),
    address: z.string().min(1),
    phone: z.string().min(1),

    sector: ZUserSector,
    function: ZUserFunction,

    children: z.array(ChildSchema).default([]),

    photo: z
      .instanceof(File)
      .optional()
      .or(z.any().refine((v) => v == null, 'Arquivo inválido')),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Senhas não conferem',
  })

export type UserFormInput = z.input<typeof UserSchema>
export type UserFormValues = z.output<typeof UserSchema>

function buildPayload(values: UserFormInput): ProfileUserFormInput {
  type ChildValue = NonNullable<UserFormInput['children']>[number]

  const isComplete = (
    c: ChildValue,
  ): c is ChildValue & {
    name: string
    education: 'fundamental' | 'medio' | 'superior'
    birthDate: string
  } => !c._destroy && !!c.name && !!c.education && !!c.birthDate

  const toUpsert = (values.children ?? []).filter(isComplete).map(
    (c) =>
      ({
        ...(c.id != null ? { id: c.id } : {}),
        name: c.name,
        degree: c.education,
        birth: dayjs(c.birthDate).format('YYYY-MM-DD'),
      } as const),
  )

  const toDestroy = (values.children ?? [])
    .filter(
      (c): c is ChildValue & { id: number; _destroy: true } =>
        !!c.id && c._destroy === true,
    )
    .map((c) => ({ id: c.id, _destroy: true as const }))

  const children = [...toUpsert, ...toDestroy]

  return {
    name: values.name,
    cpf: values.cpf,
    rg: values.rg,
    gender: values.gender,
    birthdate: dayjs(values.birthDate).format('YYYY-MM-DD'),
    address: values.address,
    mobile_phone: values.phone,
    sector: values.sector,
    job_function: values.function!,
    user: {
      email: values.email,
      role: values.role,
      ...(values.password ? { password: values.password } : {}),
    },
    profile_children: children,
    photo: values.photo ?? undefined,
  }
}

interface DialogFormUserProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: 'create' | 'edit'
  userId?: string | number
  initialData?: ProfileUserData
  onSuccess?: () => void
  initialPhotoUrl?: string
}

export default function FormUser({
  open,
  onOpenChange,
  mode = 'create',
  userId,
  initialData,
  onSuccess,
  initialPhotoUrl,
}: DialogFormUserProps) {
  const isEdit = mode === 'edit'
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    { step: 1, title: 'Usuário', icon: <UserRound className="size-4" /> },
    {
      step: 2,
      title: 'Informações',
      icon: <ContactRound className="size-4" />,
    },
    { step: 3, title: 'Filiação', icon: <Baby className="size-4" /> },
    { step: 4, title: 'Foto', icon: <Camera className="size-4" /> },
  ]

  const defaultValues = useMemo<UserFormInput>(() => ({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',

    name: '',
    gender: undefined as unknown as UserFormInput['gender'],
    birthDate: '',
    rg: '',
    cpf: '',
    address: '',
    phone: '',
    sector: undefined as unknown as UserFormInput['sector'],
    function: undefined as unknown as UserFormInput['function'],

    children: [],
    photo: null,
  }), [])

  const methods = useForm<UserFormInput>({
    resolver: zodResolver(
      UserSchema.superRefine((val, ctx) => {
        const pass = val.password ?? ''
        const confirm = val.confirmPassword ?? ''

        if (!isEdit) {
          if (!pass)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['password'],
              message: 'Obrigatório',
            })
          if (!confirm)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['confirmPassword'],
              message: 'Confirme a senha',
            })
        }

        if (pass || confirm) {
          if (pass.length > 0 && pass.length < 6) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['password'],
              message: 'Mínimo 6 caracteres',
            })
          }
          if (!isEdit && confirm.length > 0 && confirm.length < 6) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['confirmPassword'],
              message: 'Mínimo 6 caracteres',
            })
          }
          if (pass !== confirm) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['confirmPassword'],
              message: 'Senhas não conferem',
            })
          }
        }
      }),
    ),
    mode: 'onBlur',
    defaultValues,
  })

  useEffect(() => {
    if (!open) return
    ;(async () => {
      if (!isEdit) return

      const record =
        initialData ?? (userId ? await UsersService.show(userId) : null)
      if (!record) return

      const a = record.attributes

      type ProfileChild = NonNullable<
        ProfileUserData['attributes']['profile_children']
      >[number]

      methods.reset({
        email: a.email ?? '',
        password: '',
        confirmPassword: '',
        role: isUserRole(a.role) ? a.role : 'user',

        name: a.name ?? '',
        gender: isGender(a.gender) ? a.gender : 'male',
        birthDate: a.birthdate ?? '',
        rg: a.rg ?? '',
        cpf: a.cpf ?? '',
        address: a.address ?? '',
        phone: a.mobile_phone ?? '',

        sector: isUserSector(a.sector) ? a.sector : 'administrative',
        function: isUserFunction(a.job_function) ? a.job_function : 'analyst',

        children: (a.profile_children ?? []).map((c: ProfileChild) => ({
          id: c.id,
          name: c.name,
          education: (['fundamental', 'medio', 'superior'].includes(c.degree) ? c.degree : undefined) as 'fundamental' | 'medio' | 'superior' | undefined,
          birthDate: c.birth,
          _destroy: false,
        })),
        photo: null,
      })
    })()
  }, [open, isEdit, userId, initialData, methods])

  useEffect(() => {
    if (!open) {
      methods.reset(defaultValues)
      setCurrentStep(1)
    }
  }, [open, defaultValues, methods])

  const onSubmit: SubmitHandler<UserFormInput> = async (values) => {
    try {
      const payload = buildPayload(values)

      if (isEdit) {
        const id = userId ?? initialData?.id
        if (!id) throw new Error('ID do usuário ausente')
        await UsersService.update(id, payload)
        toast.success('Usuário atualizado com sucesso!')
      } else {
        await UsersService.create(payload)
        toast.success('Usuário cadastrado com sucesso!')
      }

      methods.reset(defaultValues)
      onOpenChange(false)
      onSuccess?.()
    } catch (err: unknown) {
      console.error(err)
      const apiMsg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message
      const fallback = err instanceof Error ? err.message : undefined
      toast.error(apiMsg ?? fallback ?? 'Falha ao salvar usuário.')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-6xl w-full">
        <ScrollArea className="max-h-[75vh]">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isEdit ? 'Editar Usuário' : 'Adicionar Usuário'}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="pt-4 pb-2">
                <Stepper
                  value={currentStep}
                  onValueChange={setCurrentStep}
                  defaultValue={1}
                >
                  {steps.map(({ step, title, icon }) => (
                    <StepperItem
                      key={step}
                      step={step}
                      className="relative flex-1 flex-col!"
                    >
                      <StepperTrigger className="flex-col gap-3 rounded">
                        <StepperIndicator asChild>{icon}</StepperIndicator>
                        <StepperTitle>{title}</StepperTitle>
                      </StepperTrigger>

                      {step < steps.length && (
                        <StepperSeparator className="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
                      )}
                    </StepperItem>
                  ))}
                </Stepper>
              </div>
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && currentStep < steps.length) {
                  e.preventDefault()
                }
              }}
              className="space-y-6"
            >
              {currentStep === 1 && <StepUser />}
              {currentStep === 2 && <StepPersonal />}
              {currentStep === 3 && <StepFiliation />}
              {currentStep === 4 && (
                <StepPhoto initialPhotoUrl={initialPhotoUrl} />
              )}

              <DialogFooter className="flex gap-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep((s) => s - 1)}
                  >
                    <ArrowLeftIcon className="-ms-1 opacity-60" />
                    {steps[currentStep - 2]?.title}
                  </Button>
                )}

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault()
                      e.stopPropagation()

                      const stepFields: Record<
                        number,
                        (keyof UserFormValues)[]
                      > = {
                        1: ['email', 'password', 'confirmPassword', 'role'],
                        2: [
                          'name',
                          'birthDate',
                          'rg',
                          'cpf',
                          'address',
                          'phone',
                          'sector',
                          'function',
                        ],
                      }

                      if (currentStep === 3) {
                        const children = methods.getValues('children') ?? []
                        const childPaths = children
                          .map((c, i) =>
                            c?._destroy
                              ? []
                              : [
                                  `children.${i}.name`,
                                  `children.${i}.education`,
                                  `children.${i}.birthDate`,
                                ],
                          )
                          .flat()

                        const ok = await methods.trigger(
                          childPaths as FieldPath<UserFormInput>[],
                          { shouldFocus: true },
                        )
                        if (ok) setCurrentStep((s) => s + 1)
                        return
                      }

                      const ok = await methods.trigger(
                        stepFields[currentStep] ?? [],
                        { shouldFocus: true },
                      )
                      if (ok) setCurrentStep((s) => s + 1)
                    }}
                  >
                    {steps[currentStep]?.title}
                    <ArrowRightIcon className="-ms-1 opacity-60" />
                  </Button>
                ) : (
                  <Button type="submit">
                    <Check />
                    Finalizar
                  </Button>
                )}
              </DialogFooter>
            </form>
          </FormProvider>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
