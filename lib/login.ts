import { loginSchema } from '@/lib/schemas/auth';
import { API_URL } from '@/utils/constants';

export async function loginUser(email: string, password: string) {
  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    const fieldErrors: Partial<Record<'email' | 'password', string>> = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0] as 'email' | 'password';
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { success: false, errors: fieldErrors };
  }

  try {
    const res = await fetch(`${API_URL}login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { email, password } }),
    });

    if (!res.ok) {
      let msg = 'Falha ao fazer login';
      try {
        const j = await res.json();
        msg = j?.error || j?.message || msg;
      } catch {}
      return { success: false, apiError: msg };
    }

    const data = await res.json();
    return { success: true, data };
  } catch {
    return {
      success: false,
      apiError: 'Não foi possível conectar. Tente novamente.',
    };
  }
}
