
import apiClient from './api';
import { Discipline } from '@/types/discipline';

export const getDisciplines = async () => {
  const response = await apiClient.get('/desciplines');
  return response.data;
};

export const getDiscipline = async (id: number) => {
  const response = await apiClient.get(`/desciplines/${id}`);
  return response.data;
};

export const createDiscipline = async (data: Partial<Discipline>) => {
  const response = await apiClient.post('/desciplines', data);
  return response.data;
};

export const updateDiscipline = async (id: number, data: Partial<Discipline>) => {
  const response = await apiClient.put(`/desciplines/${id}`, data);
  return response.data;
};

export const deleteDiscipline = async (id: number) => {
  const response = await apiClient.delete(`/desciplines/${id}`);
  return response.data;
};
