'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import UsersService from '@/service/users'
import type { User } from '@/types'
import { UserForm } from '@/components/users/user-form'
import { Skeleton } from '@/components/ui/skeleton'

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const u = await UsersService.show(id)
        if (!active) return
        setUser(u)
      } catch (e: any) {
        if (!active) return
        setError(e?.message ?? 'Falha ao carregar usuário')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [id])

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-56 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !user) {
    return <div className="p-6 text-red-600">{error || 'Usuário não encontrado'}</div>
  }

  const defaults = {
    user: { email: user.email, role: user.role, password: '', password_confirm: '' },
    name: user.name,
    cpf: user.cpf,
    rg: user.rg,
    birthdate: user.birthdate,
    address: user.address,
    mobile_phone: user.mobile_phone,
    sector: user.sector,
    job_function: user.job_function,
    profile_children: user.children?.map(c => ({
      name: c.name,
      degree: c.degree,
      birth: c.birth,
    })) ?? [],
    photo: undefined,
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Editar usuário</h1>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <UserForm
            mode="edit"
            idForEdit={user.id}
            defaultValues={defaults}
            initialPhotoUrl={user.photo_thumb_url || user.photo_url}
            onSuccess={() => router.replace('/users')}
          />
        </div>
        <div className="hidden lg:block lg:col-span-4" />
      </div>
    </div>
  )
}
