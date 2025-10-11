import api from "./api"

export type ConfidentialNote = {
  id: string | number
  attributes: {
    title?: string | null
    content: string
    created_at: string
    updated_at?: string
  }
}

export type ConfidentialNotesResponse = { data: ConfidentialNote[] }

export const ConfidentialNotesService = {
  list: async (patientId: string | number) => {
    const { data } = await api.get<ConfidentialNotesResponse>(
      `/patients/${patientId}/confidential_notes`
    )
    return data.data
  },
}
