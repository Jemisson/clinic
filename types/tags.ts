export interface TagResponse {
  data: TagData[];
  meta: Meta;
}

export interface TagData {
  id: string;
  type: 'tag';
  attributes: TagAttributes;
}

export interface TagAttributes {
  name: string;
  icon: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Meta {
  total_count: number;
  total_pages: number;
  current_page: number;
  per_page: number;
}

export interface TagFormInput {
  tag: {
    name: string;
    icon: string;
  };
}
