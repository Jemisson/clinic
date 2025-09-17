"use client"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export default function TagsPage() {
  return (
      <DataTable columns={columns} />
  )
}
