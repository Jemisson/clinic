import { JsonApiResource, JsonApiMeta } from '@/types/jsonapi'

export type ProfileChild = {
  id: number
  profile_user_id: number
  name: string
  degree: string
  birth: string
  created_at: string
  updated_at: string
}

export type ProfileUserAttributes = {
  name: string
  cpf: string
  rg: string
  birthdate: string
  address: string
  mobile_phone: string
  sector: string
  job_function: string
  profile_children: ProfileChild[]
  email: string
  role: string
}

export type ProfileUserResource =
  JsonApiResource<'profile_user', ProfileUserAttributes>

export type UsersIndexResponse = {
  data: ProfileUserResource[]
  meta: JsonApiMeta
}

export type UsersShowResponse = {
  data: ProfileUserResource
}

export type User = {
  id: string
  name: string
  cpf: string
  rg: string
  birthdate: string
  address: string
  mobile_phone: string
  sector: string
  job_function: string
  email: string
  role: string
  children: ProfileChild[]
}

export function toUser(r: ProfileUserResource): User {
  const a = r.attributes
  return {
    id: r.id,
    name: a.name,
    cpf: a.cpf,
    rg: a.rg,
    birthdate: a.birthdate,
    address: a.address,
    mobile_phone: a.mobile_phone,
    sector: a.sector,
    job_function: a.job_function,
    email: a.email,
    role: a.role,
    children: a.profile_children ?? [],
  }
}
