// service/tags.ts
import { TagFormInput, TagResponse } from '@/types/tags';
import api from './api';

const RESOURCE = '/tags';

function buildFormData(values: TagFormInput) {
  const formData = new FormData();
  formData.append('tag[name]', values.tag.name);
  formData.append('tag[icon]', values.tag.icon);

  return formData;
}

export const TagsService = {
  list: async (params?: { page?: number; per_page?: number, q?: string, t?: string }) => {
    const { data } = await api.get<TagResponse>(RESOURCE, { params });
    console.log(params)
    return data;
  },
  create: async (values: TagFormInput) => {
    const formData = buildFormData(values);
    const { data } = await api.post(RESOURCE, formData, {
      headers: { 'Content-Type': 'application/json' },
    });

    return data;
  },

  update: async (id: string | number, values: TagFormInput) => {
    const formData = buildFormData(values);
    const { data } = await api.put(`${RESOURCE}/${id}`, formData, {
      headers: { 'Content-Type': 'application/json' },
    });

    return data;
  },
};

export default TagsService;
