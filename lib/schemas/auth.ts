import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido')
    .transform((v) => v.trim().toLowerCase()),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const loginBodySchema = z.object({ user: loginSchema });
export type LoginBody = z.infer<typeof loginBodySchema>;
