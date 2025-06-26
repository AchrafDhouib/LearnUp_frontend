
import apiClient from './api';

export const getUsers = async () => {
  const response = await apiClient.get('/users');
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
  const users = await getUsers();
  return users.filter(user => user.role?.includes('teacher'));
};

export const getStudents = async () => {
  const users = await getUsers();
  return users.filter(user => user.role?.includes('student'));
};
