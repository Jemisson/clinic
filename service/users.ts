import { UserResponse } from '@/types/users';
import api from './api';
import { UsersShowResponse, toUser, ProfileUserFormInput } from '@/types';

const RESOURCE = '/profile_users';

function buildFormData(values: ProfileUserFormInput) {
  const fd = new FormData();

  fd.append('profile_user[name]', values.name);
  fd.append('profile_user[cpf]', values.cpf);
  fd.append('profile_user[rg]', values.rg);
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

  values.profile_children.forEach((c, i) => {
    fd.append(`profile_user[profile_children_attributes][${i}][name]`, c.name);
    fd.append(
      `profile_user[profile_children_attributes][${i}][degree]`,
      c.degree
    );
    fd.append(
      `profile_user[profile_children_attributes][${i}][birth]`,
      c.birth
    );
  });

  if (values.photo) {
    fd.append('photo', values.photo);
  }

  return fd;
}

export const UsersService = {
  list: async (
    params: { page?: number; per_page?: number; q?: string } = {}
  ) => {
    const { data } = await api.get<UserResponse>(RESOURCE, { params });
    return {
      data: data.data,
      meta: data.meta,
    };
  },

  show: async (id: string | number) => {
    const { data } = await api.get<UsersShowResponse>(`${RESOURCE}/${id}`);
    return toUser(data.data);
  },

  create: async (values: ProfileUserFormInput) => {
    const formData = buildFormData(values);
    const { data } = await api.post(RESOURCE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  update: async (id: string | number, values: ProfileUserFormInput) => {
    const formData = buildFormData(values);
    const { data } = await api.put(`${RESOURCE}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  destroy: async (id: string | number) => {
    await api.delete(`${RESOURCE}/${id}`);
  },
};
export default UsersService;
