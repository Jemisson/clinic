import { loginSchema } from '@/lib/schemas/auth'
import { API_URL } from '@/utils/constants'
import Cookies from 'js-cookie'

type LoginResponse = {
  status: {
    code: number
    message: string
    data?: {
      user?: { id: number; email: string }
      token?: string
    }
  }
}

type LoginResult =
  | { success: true; data: LoginResponse; token: string; user?: { id: number; email: string } }
  | { success: false; errors?: Partial<Record<'email' | 'password', string>>; apiError?: string }

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  const result = loginSchema.safeParse({ email, password })
  if (!result.success) {
    const fieldErrors: Partial<Record<'email' | 'password', string>> = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as 'email' | 'password'
      if (!fieldErrors[field]) fieldErrors[field] = issue.message
    }
    return { success: false, errors: fieldErrors }
  }

  try {
    const res = await fetch(`${API_URL}login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { email, password } }),
    })

    let json: LoginResponse | null = null
    try {
      json = (await res.json()) as LoginResponse
    } catch {
      /* ignore */
    }

    const apiCode = json?.status?.code
    const apiMsg = json?.status?.message

    if (!res.ok || (typeof apiCode === 'number' && apiCode >= 400)) {
      return { success: false, apiError: apiMsg || 'Falha ao fazer login' }
    }

    const token = json?.status?.data?.token
    const user = json?.status?.data?.user
    if (!token) {
      return { success: false, apiError: 'Token não encontrado na resposta.' }
    }

    Cookies.set('clinic_token', token, {
      expires: 7,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return { success: true, data: json!, token, user }
  } catch {
    return { success: false, apiError: 'Não foi possível conectar. Tente novamente.' }
  }
}
