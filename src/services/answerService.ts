import apiClient from './api';

export interface Answer {
  id: number;
  text: string;
  question_id: number;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
}

export const getAnswers = async () => {
  const response = await apiClient.get('/answers');
  return response.data;
};

export const getAnswer = async (id: number | string) => {
  const response = await apiClient.get(`/answers/${id}`);
  return response.data;
};

export const createAnswer = async (answerData: Partial<Answer>) => {
  const response = await apiClient.post('/answers', answerData);
  return response.data;
};

export const updateAnswer = async (id: number, answerData: Partial<Answer>) => {
  const response = await apiClient.put(`/answers/${id}`, answerData);
  return response.data;
};

export const deleteAnswer = async (id: number) => {
  const response = await apiClient.delete(`/answers/${id}`);
  return response.data;
}; 