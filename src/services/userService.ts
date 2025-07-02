import apiClient from './api';

export const getUsers = async () => {
  const response = await apiClient.get('/auth/users');
  return response.data;
};

export const getUsersByRole = async (role: string) => {
  const response = await apiClient.get(`/auth/users?role=${role}`);
  return response.data;
};

export const getUser = async (id: number) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await apiClient.post('/users', userData);
  return response.data;
};

export const activateUser = async (id: number) => {
  const response = await apiClient.patch(`/users/${id}/activate`);
  return response.data;
};

export const deactivateUser = async (id: number) => {
  const response = await apiClient.patch(`/users/${id}/deactivate`);
  return response.data;
};

export const updateUser = async (id: number, userData: any) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export const getTeachers = async () => {
  const response = await apiClient.get('/auth/users?role=teacher');
  return response.data;
};

export const getActiveTeachers = async () => {
  const response = await apiClient.get('/auth/users?role=teacher');
  return response.data.filter((teacher: any) => teacher.is_active === 1);
};

export const getStudents = async () => {
  const response = await apiClient.get('/auth/users?role=student');
  return response.data;
};

export const changePassword = async (passwordData: {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}) => {
  const response = await apiClient.patch('/auth/change-password', passwordData);
  return response.data;
};
