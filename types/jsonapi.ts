export interface JsonApiResource<TType extends string, TAttr> {
  id: string
  type: TType
  attributes: TAttr
}

export interface JsonApiMeta {
  total_count: number
  total_pages: number
  current_page: number
  per_page: number
}
