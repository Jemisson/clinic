// service/tags.ts
import { TagResponse } from '@/types/tags'
import api from './api'

const RESOURCE = '/tags'

export const TagsService = {
  list: async (params?: { page?: number; per_page?: number }) => {
    const { data } = await api.get<TagResponse>(RESOURCE, { params })
    return data
  },
}
export default TagsService
