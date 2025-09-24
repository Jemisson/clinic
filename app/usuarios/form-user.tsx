"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";
import AvatarUploader from "./avatar-uploader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
        toast(`Enviando para API ${data}`)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <ScrollArea className="max-h-[75vh]">
                    <DialogHeader>
                        <DialogTitle className="text-center">Adicionar Usuário</DialogTitle>
                        <DialogDescription className="pt-4 pb-2">
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
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

function StepUser() {
    return (
        <section className="flex flex-col gap-4">
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
                                <SelectItem value="user">Usuário</SelectItem>
                                <SelectItem value="manager">Gerente</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

        </section>
    );
}

function StepPersonal() {
    return (
        <section className="flex flex-col gap-4">
            <FormField
                control={useFormContext().control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                            <Input placeholder="Nome Completo" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="flex flex-col gap-4 lg:flex-row">
                <FormField
                    control={useFormContext().control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gênero</FormLabel>
                            <FormControl className="flex w-fit">
                                <RadioGroup onValueChange={field.onChange} value={field.value}>
                                    <FormItem className="flex items-center">
                                        <FormControl>
                                            <RadioGroupItem value="female" />
                                        </FormControl>
                                        <FormLabel>Feminino</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center">
                                        <FormControl>
                                            <RadioGroupItem value="male" />
                                        </FormControl>
                                        <FormLabel>Masculino</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center">
                                        <FormControl>
                                            <RadioGroupItem value="other" />
                                        </FormControl>
                                        <FormLabel>Outro</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={useFormContext().control}
                    name="birthDate"
                    render={({ field }) => (
                        <FormItem className="w-full">
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
                                            {field.value ? (
                                                dayjs(field.value).format("DD/MM/YYYY")
                                            ) : (
                                                <span>Selecione a Data</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        captionLayout="dropdown"
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="flex flex-col gap-4 lg:flex-row">
                <FormField
                    control={useFormContext().control}
                    name="rg"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>RG</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={useFormContext().control}
                    name="cpf"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={useFormContext().control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <FormField
                    control={useFormContext().control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={useFormContext().control}
                    name="sector"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Setor</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o setor" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="administrative">Administrativo</SelectItem>
                                    <SelectItem value="comercial">Comercial</SelectItem>
                                    <SelectItem value="clinical">Clínico</SelectItem>
                                    <SelectItem value="finance">Financeiro</SelectItem>
                                    <SelectItem value="it">TI</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={useFormContext().control}
                    name="function"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Função</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione a função" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="analyst">Analista</SelectItem>
                                    <SelectItem value="technique">Técnico</SelectItem>
                                    <SelectItem value="coordinator">Coordenador</SelectItem>
                                    <SelectItem value="assistant">Assistente</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </section>
    );
}

function StepFiliation() {
    return (
        <section className="flex flex-col gap-4">
            <FormField
                control={useFormContext().control}
                name="childName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome do Filho</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="flex flex-col gap-4 md:flex-row">
                <FormField
                    control={useFormContext().control}
                    name="childEducation"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Escolaridade</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                                    <SelectItem value="medio">Ensino Médio</SelectItem>
                                    <SelectItem value="superior">Ensino Superior</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={useFormContext().control}
                    name="childBirthDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data de Nascimento</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                dayjs(field.value).format("DD/MM/YYYY")
                                            ) : (
                                                <span>Selecione a Data</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        captionLayout="dropdown"
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </section>
    );
}

function StepPhoto() {
    return (
        <section className="flex flex-col gap-4">
            <AvatarUploader />
        </section>
    );
}
