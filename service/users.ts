import api from './api'
import {
  UsersIndexResponse,
  UsersShowResponse,
  User,
  toUser,
  JsonApiMeta,
} from '@/types'

const RESOURCE = '/profile_users'

export const UsersService = {
  list: async (params?: { page?: number; per_page?: number }) => {
    const { data } = await api.get<UsersIndexResponse>(RESOURCE, { params })
    const users: User[] = data.data.map(toUser)
    const meta: JsonApiMeta = data.meta
    return { users, meta }
  },

  find: async (id: string | number) => {
    const { data } = await api.get<UsersShowResponse>(`${RESOURCE}/${id}`)
    return toUser(data.data)
  },

  create: async (payload: Partial<User>) => {
    const { data } = await api.post<UsersShowResponse>(RESOURCE, {
      data: { type: 'profile_user', attributes: payload },
    })
    return toUser(data.data)
  },

  update: async (id: string | number, payload: Partial<User>) => {
    const { data } = await api.put<UsersShowResponse>(`${RESOURCE}/${id}`, {
      data: { type: 'profile_user', attributes: payload },
    })
    return toUser(data.data)
  },

  destroy: async (id: string | number) => {
    await api.delete(`${RESOURCE}/${id}`)
  },
}
export default UsersService
