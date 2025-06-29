import apiClient from './api';

export interface UserAnswer {
  id: number;
  user_id: number;
  question_id: number;
  answer_id: number;
  created_at: string;
  updated_at: string;
}

export const getUserAnswers = async () => {
  const response = await apiClient.get('/user-answers');
  return response.data;
};

export const getUserAnswer = async (id: number | string) => {
  const response = await apiClient.get(`/user-answers/${id}`);
  return response.data;
};

export const createUserAnswer = async (userAnswerData: Partial<UserAnswer>) => {
  const response = await apiClient.post('/user-answers', userAnswerData);
  return response.data;
};

export const updateUserAnswer = async (id: number, userAnswerData: Partial<UserAnswer>) => {
  const response = await apiClient.put(`/user-answers/${id}`, userAnswerData);
  return response.data;
};

export const deleteUserAnswer = async (id: number) => {
  const response = await apiClient.delete(`/user-answers/${id}`);
  return response.data;
}; 