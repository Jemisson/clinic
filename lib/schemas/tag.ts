import { z } from 'zod';

export const TagSchema = z.object({
  name: z
    .string({ message: 'O nome da tag é obrigatório' })
    .min(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
    .max(50, { message: 'O nome deve ter no máximo 50 caracteres' })
    .trim(),
  icon: z
    .string({ message: 'Você precisa selecionar um ícone' })
    .min(1, { message: 'Você precisa selecionar um ícone' })
    .trim(),
});
