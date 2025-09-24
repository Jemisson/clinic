import { z } from 'zod';

export const UserSchema = z.object({
  email: z
    .string({ message: 'O email é obrigatório' })
    .email({ message: 'Formato de email inválido' })
    .trim(),
  password: z
    .string({ message: 'A senha é obrigatória' })
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    .max(100, { message: 'A senha deve ter no máximo 100 caracteres' })
    .trim(),
  confirmPassword: z
    .string({ message: 'A confirmação de senha é obrigatória' })
    .min(6, {
      message: 'A confirmação de senha deve ter no mínimo 6 caracteres',
    })
    .max(100, {
      message: 'A confirmação de senha deve ter no máximo 100 caracteres',
    })
    .trim(),
  role: z.enum(['user', 'manager', 'admin'], {
    message: 'O papel do usuário é obrigatório',
  }),
  name: z
    .string({ message: 'O nome é obrigatório' })
    .min(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres' })
    .trim(),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'O gênero é obrigatório',
  }),
  rg: z
    .string({ message: 'O RG é obrigatório' })
    .min(5, { message: 'O RG deve ter no mínimo 5 caracteres' })
    .max(20, { message: 'O RG deve ter no máximo 20 caracteres' })
    .trim(),
  cpf: z
    .string({ message: 'O CPF é obrigatório' })
    .min(11, { message: 'O CPF deve ter no mínimo 11 caracteres' })
    .max(14, { message: 'O CPF deve ter no máximo 14 caracteres' })
    .trim(),
  birthDate: z.string({ message: 'A data de nascimento é obrigatória' }).refine(
    (date) => {
      return !isNaN(Date.parse(date));
    },
    { message: 'Data de nascimento inválida' }
  ),
  address: z
    .string({ message: 'O endereço é obrigatório' })
    .min(5, { message: 'O endereço deve ter no mínimo 5 caracteres' })
    .max(200, { message: 'O endereço deve ter no máximo 200 caracteres' })
    .trim(),
  phone: z
    .string({ message: 'O telefone é obrigatório' })
    .min(10, { message: 'O telefone deve ter no mínimo 10 caracteres' })
    .max(15, { message: 'O telefone deve ter no máximo 15 caracteres' })
    .trim(),
  sector: z.enum(['administrative', 'comercial', 'clinical', 'finance', 'it'], {
    message: 'O setor é obrigatório',
  }),
  function: z.enum(['analyst', 'technique', 'coordinator', 'assistant'], {
    message: 'A função é obrigatória',
  }),
  childName: z
    .string({ message: 'O nome do filho é obrigatório' })
    .min(3, { message: 'O nome do filho deve ter no mínimo 3 caracteres' })
    .max(100, { message: 'O nome do filho deve ter no máximo 100 caracteres' })
    .trim(),
  childBirthDate: z
    .string({ message: 'A data de nascimento do filho é obrigatória' })
    .refine(
      (date) => {
        return !isNaN(Date.parse(date));
      },
      { message: 'Data de nascimento do filho inválida' }
    ),
  childEducation: z.enum(['fundamental', 'medio', 'superior'], {
    message: 'O nível de escolaridade é obrigatório',
  }),
  photoUrl: z
    .string({ message: 'A URL da foto é obrigatória' })
    .url({ message: 'Formato de URL inválido' })
    .trim(),
});
