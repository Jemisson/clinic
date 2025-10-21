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
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import {
  FormProvider,
  Resolver,
  useForm,
  type FieldPath,
} from 'react-hook-form'

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Bookmark,
  Camera,
  Check,
  ContactRound,
  MapPin,
  Phone,
  UserRound,
} from 'lucide-react'

import PatientsService from '@/service/patients'
import { Addresses, Contacts, PatientData } from '@/types/patients'

import { buildPatientPayload } from './mappers'
import { defaultValues, PatientSchema, type PatientFormValues } from './schema'

import { StepAddress } from './steps/StepAddress'
import { StepContact } from './steps/StepContact'
import { StepInterests } from './steps/StepInterests'
import { StepPersonal } from './steps/StepPersonal'
import { StepPhoto } from './steps/StepPhoto'
import { StepReferrer } from './steps/StepReferrer'
import { TagLike } from '@/types/tags'

type Mode = 'create' | 'edit'

interface FormPatientProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: Mode
  patientId?: string
  initialData?: PatientData
  onSuccess?: () => Promise<void> | void
  initialPhotoUrl?: string
}

export default function FormPatient({
  open,
  onOpenChange,
  mode = 'create',
  patientId,
  initialData,
  onSuccess,
  initialPhotoUrl,
}: FormPatientProps) {
  const isEdit = mode === 'edit'
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    {
      step: 1,
      title: 'Dados pessoais',
      icon: <UserRound className="size-4" />,
    },
    { step: 2, title: 'Indicação', icon: <ContactRound className="size-4" /> },
    { step: 3, title: 'Endereço', icon: <MapPin className="size-4" /> },
    { step: 4, title: 'Contato', icon: <Phone className="size-4" /> },
    { step: 5, title: 'Foto', icon: <Camera className="size-4" /> },
    { step: 6, title: 'Interesses', icon: <Bookmark className="size-4" /> },
  ] as const

  const methods = useForm<PatientFormValues>({
    resolver: zodResolver(PatientSchema) as Resolver<PatientFormValues>,
    defaultValues,
    mode: 'onBlur',
  })

  function getStepFields(step: number): FieldPath<PatientFormValues>[] {
    if (step === 1) {
      return ['person.name', 'naturalness', 'birthdate', 'cpf']
    }
    if (step === 3) {
      const paths: FieldPath<PatientFormValues>[] = []
      const addrs = methods.getValues('person.addresses_attributes') ?? []
      addrs.forEach((a, i) => {
        if (!a?._destroy) {
          paths.push(
            `person.addresses_attributes.${i}.zip_code` as FieldPath<PatientFormValues>,
            `person.addresses_attributes.${i}.street` as FieldPath<PatientFormValues>,
            `person.addresses_attributes.${i}.number` as FieldPath<PatientFormValues>,
            `person.addresses_attributes.${i}.neighborhood` as FieldPath<PatientFormValues>,
            `person.addresses_attributes.${i}.city` as FieldPath<PatientFormValues>,
            `person.addresses_attributes.${i}.state` as FieldPath<PatientFormValues>,
          )
        }
      })
      return paths
    }
    return []
  }

  async function validateCurrentStep(): Promise<boolean> {
    const fields = getStepFields(currentStep)
    if (!fields.length) return true
    return methods.trigger(fields, { shouldFocus: true })
  }

  async function handleStepperChange(nextStep: number) {
    if (nextStep === currentStep) return
    if (nextStep < currentStep) {
      setCurrentStep(nextStep)
      return
    }
    const ok = await validateCurrentStep()
    if (ok) setCurrentStep(nextStep)
  }

  useEffect(() => {
    if (!open) return
    if (isEdit && initialData) {
      const a = initialData.attributes
      methods.reset({
        naturalness: a.naturalness || '',
        birthdate: a.birthdate || '',
        rg: a.rg || '',
        cpf: a.cpf || '',
        no_cpf: false,
        blood_type: (a.blood_type as PatientFormValues["blood_type"]) ?? null,
        spouse_name: a.spouse_name || '',
        gender: (a.gender as PatientFormValues["gender"]) ?? null,
        civil_status: (a.civil_status as PatientFormValues["civil_status"]) ?? null,
        death_date: a.death_date || null,
        occupation: a.occupation || '',
        referrer_person_id: (a.referrer_person_id ?? null) as PatientFormValues["referrer_person_id"],
        person: {
          id: a.person?.id,
          name: a.person?.name || '',
          tag_ids: (a.person?.tags ?? []).map((t: TagLike) =>
            Number(typeof t === "object" && t !== null && "id" in t ? (t).id : t)
          ),
          addresses_attributes: (a.person?.addresses ?? []).map((addr: Addresses) => ({
              id: addr.id,
              street: addr.street ?? '',
              number: addr.number ?? '',
              neighborhood: addr.neighborhood ?? '',
              city: addr.city ?? '',
              state: addr.state ?? '',
              country: addr.country ?? 'Brasil',
              zip_code: addr.zip_code ?? '',
              observation: addr.observation ?? '',
              _destroy: false,
            }),
          ),
          contacts_attributes: (a.person?.contacts ?? []).map((c: Contacts) => ({
            id: c.id,
            phone: c.phone ?? '',
            cellphone: c.cellphone ?? '',
            send_sms: Boolean(c.send_sms),
            send_wpp_confirmation: Boolean(c.send_wpp_confirmation),
            send_wpp_marketing: Boolean(c.send_wpp_marketing),
            send_wpp_congrats: Boolean(c.send_wpp_congrats),
            send_email_appointment: Boolean(c.send_email_appointment),
            send_email_marketing: Boolean(c.send_email_marketing),
            _destroy: false,
          })),
          photo: null,
        },
      })
    } else {
      methods.reset(defaultValues)
    }
    setCurrentStep(1)
  }, [open, isEdit, initialData, methods])

  useEffect(() => {
    if (!open) {
      methods.reset(defaultValues)
      setCurrentStep(1)
    }
  }, [open, methods])

  async function onSubmit(values: PatientFormValues) {
    const payload = buildPatientPayload(
      values,
      isEdit ? initialData : undefined,
    )
    const extra = {
      photo: values.person.photo ?? null,
      remove_photo: values.person.remove_photo || undefined,
    }

    if (isEdit) {
      const id = patientId ?? initialData?.id
      if (!id) throw new Error('ID do paciente ausente')
      await PatientsService.update(String(id), payload, extra)
    } else {
      await PatientsService.create(payload, extra)
    }
    await onSuccess?.()
    methods.reset(defaultValues)
    onOpenChange(false)
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
              {isEdit ? 'Editar Paciente' : 'Adicionar Paciente'}
            </DialogTitle>

            <DialogDescription asChild>
              <div className="pt-4 pb-8">
                <Stepper
                  value={currentStep}
                  onValueChange={handleStepperChange}
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
              onSubmit={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault()
              }}
              className="space-y-6"
              noValidate
            >
              {currentStep === 1 && <StepPersonal />}
              {currentStep === 2 && (
                <StepReferrer
                  initialReferrerName={
                    initialData?.attributes?.referrer || undefined
                  }
                />
              )}
              {currentStep === 3 && <StepAddress />}
              {currentStep === 4 && <StepContact />}
              {currentStep === 5 && (
                <StepPhoto initialPhotoUrl={initialPhotoUrl} />
              )}
              {currentStep === 6 && <StepInterests />}

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
                      const ok = await validateCurrentStep()
                      if (ok) setCurrentStep((s) => s + 1)
                    }}
                  >
                    {steps[currentStep]?.title}
                    <ArrowRightIcon className="-ms-1 opacity-60" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      methods.handleSubmit(onSubmit)()
                    }}
                  >
                    <Check /> Finalizar
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
