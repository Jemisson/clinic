'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { SITE_NAME } from '@/utils/constants'
import { loginUser } from '@/lib/login'
import type { LoginInput } from '@/lib/schemas/auth'
import { useRouter, useSearchParams } from 'next/navigation'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  const from = searchParams.get('from') || '/'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    setApiError(null)
    setLoading(true)

    const result = await loginUser(email, password)

    if (!result.success) {
      setErrors(result.errors || {})
      setApiError(result.apiError || null)
      setLoading(false)
      console.log(result)
      return
    }

    router.replace(from)
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col items-center gap-10">
        <div className="size-20 relative">
          <Image
            src="/logo.svg"
            alt={`Logo ${SITE_NAME}`}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-2 text-center">
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription>
            Digite seu e-mail abaixo para acessar sua conta
          </CardDescription>
        </div>

        <CardContent className="w-full">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
            noValidate
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {apiError && <div className="text-sm text-red-600">{apiError}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Login'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2 w-full">
          <Button variant="link" className="w-full" disabled={loading}>
            Esqueceu sua senha?
          </Button>
        </CardFooter>
      </CardHeader>
    </Card>
  )
}
