'use client'

import { useRouter } from 'next/navigation'
import { UserForm } from '@/components/users/user-form'

export default function NewUserPage() {
  const router = useRouter()
  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <UserForm
            mode="create"
            onSuccess={() => router.replace('/users')}
          />
        </div>

        <div className="hidden lg:block lg:col-span-7" />
      </div>
    </div>
  )
}
