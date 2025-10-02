import { ProfileUserStatus, ProfileUserStatusUpdateInput, UserResponse, ProfileUserFormInput } from '@/types/users';
import api from './api';
import { UserShowResponse } from '@/types/users';

const RESOURCE = '/profile_users';

function buildFormData(values: ProfileUserFormInput) {
  const fd = new FormData();

  fd.append('profile_user[name]', values.name);
  fd.append('profile_user[cpf]', values.cpf);
  fd.append('profile_user[rg]', values.rg);
  fd.append('profile_user[gender]', values.gender);
  fd.append('profile_user[birthdate]', values.birthdate);
  fd.append('profile_user[address]', values.address);
  fd.append('profile_user[mobile_phone]', values.mobile_phone);
  fd.append('profile_user[sector]', values.sector);
  fd.append('profile_user[job_function]', values.job_function);

  fd.append('profile_user[user_attributes][email]', values.user.email);
  fd.append('profile_user[user_attributes][role]', values.user.role);
  if (values.user.password) {
    fd.append('profile_user[user_attributes][password]', values.user.password);
  }

  (values.profile_children ?? []).forEach((c, i) => {
    if (c.id != null) {
      fd.append(`profile_user[profile_children_attributes][${i}][id]`, String(c.id))
    }
    if (c._destroy) {
      fd.append(`profile_user[profile_children_attributes][${i}][_destroy]`, "1");
      return;
    }
    fd.append(`profile_user[profile_children_attributes][${i}][name]`, c.name);
    fd.append(`profile_user[profile_children_attributes][${i}][degree]`, c.degree);
    fd.append(`profile_user[profile_children_attributes][${i}][birth]`, c.birth);
  });

  if (values.photo instanceof File) {
    fd.append('photo', values.photo);
  }

  return fd;
}

function buildFormDataForUpdate(values: ProfileUserFormInput) {
  const fd = buildFormData(values);

  // Remoção de foto (mantém a convenção atual: flag "remove_photo" na raiz)
  if (values.photo === null) {
    fd.append('remove_photo', '1');
  }

  return fd;
}

export const UsersService = {
  list: async (
    params: { page?: number; per_page?: number; q?: string; t?: string } = {}
  ) => {
    const { data } = await api.get<UserResponse>(RESOURCE, { params });
    return { data: data.data, meta: data.meta };
  },

  show: async (id: string | number) => {
    const response = await api.get<UserShowResponse>(`${RESOURCE}/${id}`);
    return response.data.data;
  },

  create: async (values: ProfileUserFormInput) => {
    const formData = buildFormData(values);
    const { data } = await api.post(RESOURCE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  update: async (id: string | number, values: ProfileUserFormInput) => {
    const formData = buildFormDataForUpdate(values);
    const { data } = await api.put(`${RESOURCE}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  setStatus: async (id: string | number, status: ProfileUserStatus) => {
    const payload: ProfileUserStatusUpdateInput = { profile_user: { status } };
    const { data } = await api.patch(`${RESOURCE}/${id}`, payload);
    return data;
  },

  destroy: async (id: string | number) => {
    await api.delete(`${RESOURCE}/${id}`);
  },
};

export default UsersService;
