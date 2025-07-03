import apiClient from './api';

export interface UserAnswer {
  id?: number;
  user_id?: number;
  question_id: number;
  answer_id: number;
  passed_exam_id: number;
  created_at?: string;
  updated_at?: string;
  question?: {
    id: number;
    question: string;
    type: 'multiple_choice' | 'unique_choice';
    answers: {
      id: number;
      answer: string;
      is_correct: boolean;
    }[];
  };
  answer?: {
    id: number;
    answer: string;
    is_correct: boolean;
  };
}

export const userAnswerService = {
  // Get all user answers
  getUserAnswers: async (): Promise<UserAnswer[]> => {
    const response = await apiClient.get('/user-answers');
    return response.data;
  },

  // Get a specific user answer
  getUserAnswer: async (id: number): Promise<UserAnswer> => {
    const response = await apiClient.get(`/user-answers/${id}`);
    return response.data;
  },

  // Create a new user answer
  createUserAnswer: async (answerData: Partial<UserAnswer>): Promise<UserAnswer> => {
    const response = await apiClient.post('/user-answers', answerData);
    return response.data;
  },

  // Update a user answer
  updateUserAnswer: async (id: number, answerData: Partial<UserAnswer>): Promise<UserAnswer> => {
    const response = await apiClient.put(`/user-answers/${id}`, answerData);
    return response.data;
  },

  // Delete a user answer
  deleteUserAnswer: async (id: number): Promise<void> => {
    await apiClient.delete(`/user-answers/${id}`);
  },

  // Get user answers for a specific passed exam
  getUserAnswersByPassedExam: async (passedExamId: number): Promise<UserAnswer[]> => {
    const response = await apiClient.get(`/passed-exams/${passedExamId}/user-answers`);
    return response.data;
  },

  // Get user answers for a specific passed exam (alias for getUserAnswersByPassedExam)
  getUserAnswers: async (passedExamId: number): Promise<UserAnswer[]> => {
    const response = await apiClient.get(`/passed-exams/${passedExamId}/user-answers`);
    return response.data;
  }
};

// Export individual functions for convenience
export const getUserAnswers = userAnswerService.getUserAnswers;
export const getUserAnswer = userAnswerService.getUserAnswer;
export const createUserAnswer = userAnswerService.createUserAnswer;
export const updateUserAnswer = userAnswerService.updateUserAnswer;
export const deleteUserAnswer = userAnswerService.deleteUserAnswer;
export const getUserAnswersByPassedExam = userAnswerService.getUserAnswersByPassedExam; 