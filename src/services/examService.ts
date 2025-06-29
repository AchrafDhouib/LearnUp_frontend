import apiClient from './api';

export interface Exam {
  id: number;
  description: string;
  cours_id: number;
  created_at: string;
  updated_at: string;
}

export const getExams = async () => {
  const response = await apiClient.get('/exams');
  return response.data;
};

export const getExam = async (id: number | string) => {
  const response = await apiClient.get(`/exams/${id}`);
  return response.data;
};

export const createExam = async (examData: Partial<Exam>) => {
  const response = await apiClient.post('/exams', examData);
  return response.data;
};

export const updateExam = async (id: number, examData: Partial<Exam>) => {
  const response = await apiClient.put(`/exams/${id}`, examData);
  return response.data;
};

export const deleteExam = async (id: number) => {
  const response = await apiClient.delete(`/exams/${id}`);
  return response.data;
}; 