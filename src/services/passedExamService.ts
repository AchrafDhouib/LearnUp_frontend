import apiClient from './api';

export interface PassedExam {
  id: number;
  user_id: number;
  exam_id: number;
  score?: number;
  created_at: string;
  updated_at: string;
}

export const getPassedExams = async () => {
  const response = await apiClient.get('/passed-exams');
  return response.data;
};

export const getPassedExam = async (id: number | string) => {
  const response = await apiClient.get(`/passed-exams/${id}`);
  return response.data;
};

export const createPassedExam = async (userId: number, examId: number) => {
  const response = await apiClient.post(`/passed-exams/${userId}/${examId}`);
  return response.data;
};

export const updatePassedExam = async (id: number, score: number) => {
  const response = await apiClient.put(`/passed-exams/${id}/${score}`);
  return response.data;
};

export const deletePassedExam = async (id: number) => {
  const response = await apiClient.delete(`/passed-exams/${id}`);
  return response.data;
}; 