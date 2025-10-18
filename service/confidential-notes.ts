import api from "./api"

export type RoleString = "admin" | "manager" | "doctor" | "user"

export interface ConfidentialNote {
  id: string | number
  attributes: {
    title?: string | null
    content: string
    created_at: string
    updated_at?: string
  }
}

export interface ConfidentialNotesResponse {
  data: ConfidentialNote[]
}

export interface ConfidentialNoteCreatePayload {
  title?: string
  content: string
  visibility_roles?: RoleString[]
  crud_roles?: RoleString[]
}

export const ConfidentialNotesService = {
  list: async (patientId: string | number) => {
    const { data } = await api.get<ConfidentialNotesResponse>(
      `/patients/${patientId}/confidential_notes`
    )
    return data.data
  },

  create: async (patientId: string | number, payload: ConfidentialNoteCreatePayload) => {
    const { data } = await api.post<ConfidentialNotesResponse>(
      `/patients/${patientId}/confidential_notes`,
      { confidential_note: payload }
    )
    return data.data
  },
}
