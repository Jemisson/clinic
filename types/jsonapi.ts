export type JsonApiResource<TType extends string, TAttr> = {
  id: string
  type: TType
  attributes: TAttr
}

export type JsonApiMeta = {
  total_count: number
  total_pages: number
  current_page: number
  per_page: number
}
