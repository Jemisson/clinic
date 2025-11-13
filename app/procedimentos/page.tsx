'use client'

import { columns } from './columns'
import { DataTable } from './data-table'

export default function ClinicalProceduresPage() {
  return <DataTable columns={columns} />
}
