import { columns } from "./columns"
import { DataTable } from "./data-table"

export default async function UsersPage() {
  return (
    <DataTable columns={columns} />
  )
}