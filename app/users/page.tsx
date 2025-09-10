// app/users/page.tsx
'use client'

import { useEffect, useRef } from 'react'
import UsersService from '@/service/users'

export default function UsersPage() {
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    // Chama o service (forma “achatada”)
    UsersService.list({ page: 1, per_page: 10 })
      .then(({ users, meta }) => {
        // apenas para depuração; pode remover
        console.log('GET /users OK:', { users, meta })
      })
      .catch((err) => {
        console.error('GET /users erro:', err)
      })

    // Se preferir a resposta bruta JSON:API:
    // UsersService.listRaw({ page: 1, per_page: 10 }).then(console.log).catch(console.error)
  }, [])

  // Página em branco
  return null
}
