import { JsonApiResource, JsonApiMeta } from '@/types/jsonapi'

export interface ProfileChild {
  id: number
  profile_user_id: number
  name: string
  degree: string
  birth: string
  created_at: string
  updated_at: string
}

export interface ProfileUserAttributes {
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
  photo_url: string,
  photo_thumb_url: string
}

export interface ProfileUserResource extends JsonApiResource<'profile_user', ProfileUserAttributes> {}

export interface UsersIndexResponse {
  data: ProfileUserResource[]
  meta: JsonApiMeta
}

export interface UsersShowResponse {
  data: ProfileUserResource
}

export interface User {
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
  photo_url: string,
  photo_thumb_url: string
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
    photo_url: a.photo_url,
    photo_thumb_url: a.photo_thumb_url,
    children: a.profile_children ?? [],
  }
}

export interface ProfileChildInput {
  name: string
  degree: string
  birth: string
}

export interface ProfileUserFormInput {
  user: { email: string; role: string; password?: string }

  name: string
  cpf: string
  rg: string
  birthdate: string
  address: string
  mobile_phone: string
  sector: string
  job_function: string

  profile_children: ProfileChildInput[]

  photo?: File | null
}
