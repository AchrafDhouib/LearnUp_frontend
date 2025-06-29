import apiClient from './api';

export interface Question {
  id: number;
  text: string;
  exam_id: number;
  created_at: string;
  updated_at: string;
}

export const getQuestions = async () => {
  const response = await apiClient.get('/questions');
  return response.data;
};

export const getQuestion = async (id: number | string) => {
  const response = await apiClient.get(`/questions/${id}`);
  return response.data;
};

export const createQuestion = async (questionData: Partial<Question>) => {
  const response = await apiClient.post('/questions', questionData);
  return response.data;
};

export const updateQuestion = async (id: number, questionData: Partial<Question>) => {
  const response = await apiClient.put(`/questions/${id}`, questionData);
  return response.data;
};

export const deleteQuestion = async (id: number) => {
  const response = await apiClient.delete(`/questions/${id}`);
  return response.data;
}; 