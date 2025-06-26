
import apiClient from './api';
import { Specialty } from '@/types/specialty';

export const getSpecialties = async () => {
  const response = await apiClient.get('/specialities');
  return response.data;
};

export const getSpecialty = async (id: number) => {
  const response = await apiClient.get(`/specialities/${id}`);
  return response.data;
};

export const createSpecialty = async (data: Partial<Specialty>) => {
  const response = await apiClient.post('/specialities', data);
  return response.data;
};

export const updateSpecialty = async (id: number, data: Partial<Specialty>) => {
  const response = await apiClient.put(`/specialities/${id}`, data);
  return response.data;
};

export const deleteSpecialty = async (id: number) => {
  const response = await apiClient.delete(`/specialities/${id}`);
  return response.data;
};
