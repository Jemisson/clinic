// app/tags/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { columns } from './columns'
import { DataTable } from './data-table'
import TagsService from '@/service/tags'
import type { TagResponse } from '@/types/tag'

export default function TagsPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res: TagResponse = await TagsService.list({ page: 1, per_page: 10 })
        console.log('TagsPage -> res', res);

        const parsed = res.data.map((r) => ({ id: r.id, ...r.attributes }))
        if (mounted) setRows(parsed)
      } catch (e) {
        console.error('GET /tags erro:', e)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <section>
      <h1 className="text-xl font-semibold mb-4">Tags</h1>
      <DataTable columns={columns} data={rows} />
    </section>
  )
}
