import { JsonApiResource, JsonApiMeta } from '@/types/jsonapi'

export type TagAttributes = {
  name: string
}

export type TagResource =
  JsonApiResource<'tags', TagAttributes>

export type TagResponse = {
  data: TagResource[]
  meta: JsonApiMeta
}
