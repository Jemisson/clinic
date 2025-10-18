import { patientColumns } from "./columns"
import { PatientsDataTable } from "./data-table"

export default async function PatientsPage() {
  return (
    <PatientsDataTable columns={patientColumns} />
  )
}
