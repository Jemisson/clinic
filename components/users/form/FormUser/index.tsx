"use client"

import {
  useEffect,
  useState
} from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  FormProvider,
  useForm,
  SubmitHandler,
} from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger
} from "@/components/ui/stepper"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Baby,
  Camera,
  Check,
  ContactRound,
  UserRound
} from "lucide-react"
import dayjs from "dayjs"
import { toast } from "sonner"
import UsersService from "@/service/users"
import {
  type ProfileUserData,
  type ProfileUserFormInput
} from "@/types/users"
import StepUser from "@/components/users/form/FormUser/StepUser"
import StepPersonal from "@/components/users/form/FormUser/StepPersonal"
import StepFiliation from "@/components/users/form/FormUser/StepFiliation"
import StepPhoto from "@/components/users/form/FormUser/StepPhoto"
import {
  ZGender,
  ZUserFunction,
  ZUserRole,
  ZUserSector,
  isUserRole,
  isUserSector,
  isUserFunction,
  isGender
} from "@/types/users.enums"

const ChildSchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  education: z.enum(["fundamental", "medio", "superior"], {
    message: "Escolaridade inválida",
  }),
  birthDate: z.string().min(1, "Informe a data de nascimento"),
})

const UserSchema = z.object({
  // StepUser
  email: z.string().email(),
  password: z.string().optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
  role: ZUserRole,

  // StepPersonal
  name: z.string().min(1),
  gender: ZGender.optional(),
  birthDate: z.string().min(1, "Informe a data de nascimento"),
  rg: z.string().min(1),
  cpf: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),

  // StepPersonal (selects)
  sector: ZUserSector,
  function: ZUserFunction,

  // StepFiliation
  children: z.array(ChildSchema).default([]),

  // StepPhoto
  photo: z
    .instanceof(File)
    .optional()
    .or(z.any().refine((v) => v == null, "Arquivo inválido")),
}).refine(d => d.password === d.confirmPassword, {
  path: ["confirmPassword"],
  message: "Senhas não conferem",
})

export type UserFormInput  = z.input<typeof UserSchema>;
export type UserFormValues = z.output<typeof UserSchema>;

function buildPayload(values: UserFormInput): ProfileUserFormInput {
  const children = (values.children ?? []).map((c) => ({
    name: c.name,
    degree: c.education,
    birth: dayjs(c.birthDate).format("YYYY-MM-DD"),
  }))

  return {
    name: values.name,
    cpf: values.cpf,
    rg: values.rg,
    birthdate: dayjs(values.birthDate).format("YYYY-MM-DD"),
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
  userId?: string | number;
  initialData?: ProfileUserData;
  onSuccess?: () => void;
  initialPhotoUrl?: string;
}

export default function FormUser({
  open, onOpenChange, mode = 'create', userId, initialData, onSuccess, initialPhotoUrl
}: DialogFormUserProps) {
  const isEdit = mode === 'edit'
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    { step: 1, title: "Usuário",      icon: <UserRound className="size-4" /> },
    { step: 2, title: "Informações",  icon: <ContactRound className="size-4" /> },
    { step: 3, title: "Filiação",     icon: <Baby className="size-4" /> },
    { step: 4, title: "Foto",         icon: <Camera className="size-4" /> },
  ]

  const defaultValues: UserFormInput = {
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",

    name: "",
    gender: undefined,
    birthDate: "",
    rg: "",
    cpf: "",
    address: "",
    phone: "",
    sector: undefined as unknown as UserFormInput["sector"],
    function: undefined as unknown as UserFormInput["function"],

    children: [],
    photo: null,
  }

  const methods = useForm<UserFormInput>({
    resolver: zodResolver(
      UserSchema.superRefine((val, ctx) => {
        const pass = val.password ?? ""
        const confirm = val.confirmPassword ?? ""

        if (!isEdit) {
          if (!pass) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["password"], message: "Obrigatório" })
          if (!confirm) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["confirmPassword"], message: "Confirme a senha" })
        }

        if (pass || confirm) {
          if (pass.length > 0 && pass.length < 6) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["password"], message: "Mínimo 6 caracteres" })
          }
          if (!isEdit && confirm.length > 0 && confirm.length < 6) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["confirmPassword"], message: "Mínimo 6 caracteres" })
          }
          if (pass !== confirm) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["confirmPassword"], message: "Senhas não conferem" })
          }
        }
      })
    ),
    mode: "onBlur",
    defaultValues,
  })

  useEffect(() => {
    if (!open) return
    ;(async () => {
      if (!isEdit) return

      const record = initialData ?? (userId ? await UsersService.show(userId) : null)
      if (!record) return

      const a = record.attributes
      methods.reset({
        email: a.email ?? "",
        password: "",
        confirmPassword: "",
        role: isUserRole(a.role) ? a.role : "user",

        name: a.name ?? "",
        gender: isGender(a.gender) ? a.gender : undefined,
        birthDate: a.birthdate ?? "",
        rg: a.rg ?? "",
        cpf: a.cpf ?? "",
        address: a.address ?? "",
        phone: a.mobile_phone ?? "",

        sector: isUserSector(a.sector) ? a.sector : "administrative",
        function: isUserFunction(a.job_function) ? a.job_function : "analyst",

        children: (a.profile_children ?? []).map((c: any) => ({
          name: c.name,
          education: c.degree,
          birthDate: c.birth,
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
  }, [open])

  const onSubmit: SubmitHandler<UserFormInput> = async (values) => {
    try {
      const payload = buildPayload(values)

      if (isEdit) {
        const id = userId ?? initialData?.id
        if (!id) throw new Error("ID do usuário ausente")
        await UsersService.update(id, payload)
        toast.success("Usuário atualizado com sucesso!")
      } else {
        await UsersService.create(payload)
        toast.success("Usuário cadastrado com sucesso!")
      }

      methods.reset(defaultValues)
      onOpenChange(false)
      onSuccess?.()
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || err?.message || "Falha ao salvar usuário.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full">
        <ScrollArea className="max-h-[75vh]">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isEdit ? "Editar Usuário" : "Adicionar Usuário"}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="pt-4 pb-2">
                <Stepper value={currentStep} onValueChange={setCurrentStep} defaultValue={1}>
                  {steps.map(({ step, title, icon }) => (
                    <StepperItem key={step} step={step} className="relative flex-1 flex-col!">
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
                if (e.key === "Enter" && currentStep < steps.length) {
                  e.preventDefault()
                }
              }}
              className="space-y-6"
            >
              {currentStep === 1 && <StepUser />}
              {currentStep === 2 && <StepPersonal />}
              {currentStep === 3 && <StepFiliation />}
              {currentStep === 4 && <StepPhoto initialPhotoUrl={initialPhotoUrl} />}

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

                      const stepFields: Record<number, (keyof UserFormValues)[]> = {
                        1: ["email", "password", "confirmPassword", "role"],
                        2: ["name", "birthDate", "rg", "cpf", "address", "phone", "sector", "function"],
                        3: ["children"],
                      }
                      const ok = await methods.trigger(stepFields[currentStep] ?? [])
                      if (ok) setCurrentStep((s) => s + 1)
                    }}
                  >
                    {steps[currentStep]?.title}
                    <ArrowRightIcon className="-ms-1 opacity-60" />
                  </Button>
                ) : (
                  <Button type="submit"><Check />Finalizar</Button>
                )}
              </DialogFooter>
            </form>
          </FormProvider>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
