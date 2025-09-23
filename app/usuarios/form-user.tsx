"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from "@/components/ui/stepper";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    FormProvider,
    useForm,
    useFormContext,
    SubmitHandler,
} from "react-hook-form";
import { UserSchema } from "@/lib/schemas/user";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type UserFormValues = z.infer<typeof UserSchema>;

interface DialogFormUserProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function FormUser({ open, onOpenChange }: DialogFormUserProps) {
    const [currentStep, setCurrentStep] = useState(1)

    const steps = [
        {
            step: 1,
            title: "Usuário",
        },
        {
            step: 2,
            title: "Dados Pessoais",
        },
        {
            step: 3,
            title: "Filiação",
        },
        {
            step: 4,
            title: "Foto",
        },
    ]

    const methods = useForm<UserFormValues>({
        resolver: zodResolver(UserSchema),
        mode: "onBlur",
    })

    const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
        console.log("Enviando para API", data)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Adicionar Usuário</DialogTitle>
                    <DialogDescription>
                        <Stepper defaultValue={1} value={currentStep} onValueChange={setCurrentStep}>
                            {steps.map(({ step, title }) => (
                                <StepperItem key={step} step={step} className="relative flex-1 flex-col!">
                                    <StepperTrigger className="flex-col gap-3 rounded">
                                        <StepperIndicator />
                                        <StepperTitle>{title}</StepperTitle>
                                    </StepperTrigger>
                                    {step < steps.length && (
                                        <StepperSeparator className="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
                                    )}
                                </StepperItem>
                            ))}
                        </Stepper>
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                        {currentStep === 1 && <StepUser />}
                        {currentStep === 2 && <StepPersonal />}
                        {currentStep === 3 && <StepFiliation />}
                        {currentStep === 4 && <StepPhoto />}

                        <DialogFooter className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCurrentStep((step) => step - 1)}
                                disabled={currentStep === 1}
                            >
                                Prev step
                            </Button>

                            {currentStep < steps.length ? (
                                <Button
                                    type="button"
                                    onClick={async () => {
                                        let fieldsToValidate: (keyof UserFormValues)[] = []

                                        if (currentStep === 1) {
                                            fieldsToValidate = ["email", "password", "confirmPassword"]
                                        } else if (currentStep === 2) {
                                            fieldsToValidate = ["name", "cpf", "rg", "birthDate", "address", "phone", "sector", "function"]
                                        } else if (currentStep === 3) {
                                            fieldsToValidate = ["childName", "childEducation", "childBirthDate"]
                                        } else if (currentStep === 4) {
                                            fieldsToValidate = ["photoUrl"]
                                        }

                                        const isValid = await methods.trigger(fieldsToValidate)
                                        if (isValid) setCurrentStep((step) => step + 1)
                                    }}
                                >
                                    Next step
                                </Button>
                            ) : (
                                <Button type="submit">Finalizar</Button>
                            )}
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}

function StepUser() {
    return (
        <div className="flex flex-col gap-4">
            <FormField
                control={useFormContext().control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Digite o email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={useFormContext().control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Digite a senha" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={useFormContext().control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirme a Senha</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Confirme a senha" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={useFormContext().control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

        </div>
    );
}

function StepPersonal() {
    const { register, formState } = useFormContext<UserFormValues>();
    const { errors } = formState;
    return (
        <div className="space-y-4">
            <Label>Nome</Label>
            <Input {...register("name")} placeholder="Digite o nome" />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

            <Label>CPF</Label>
            <Input {...register("cpf")} placeholder="Digite o CPF" />
            {errors.cpf && <p className="text-red-500">{errors.cpf.message}</p>}
        </div>
    );
}

function StepFiliation() {
    const { register, formState } = useFormContext<UserFormValues>();
    const { errors } = formState;
    return (
        <div className="space-y-4">
            <Label>Nome do filho</Label>
            <Input {...register("childName")} placeholder="Nome do filho" />
            {errors.childName && (
                <p className="text-red-500">{errors.childName.message}</p>
            )}
        </div>
    );
}

function StepPhoto() {
    const { register, formState } = useFormContext<UserFormValues>();
    const { errors } = formState;
    return (
        <div className="space-y-4">
            <Label>Foto (URL)</Label>
            <Input {...register("photoUrl")} placeholder="https://..." />
            {errors.photoUrl && (
                <p className="text-red-500">{errors.photoUrl.message}</p>
            )}
        </div>
    );
}
