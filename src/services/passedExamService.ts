import apiClient from './api';

export interface PassedExam {
  id?: number;
  user_id?: number;
  exam_id: number;
  score: number;
  passed_at: string;
  created_at?: string;
  updated_at?: string;
  exam?: {
    id: number;
    title: string;
    description: string;
    duration: number;
    course?: {
      id: number;
      name: string;
      required_score: number;
    };
  };
}

export const passedExamService = {
  // Get all passed exams
  getPassedExams: async (): Promise<PassedExam[]> => {
    const response = await apiClient.get('/passed-exams');
    return response.data;
  },

  // Get a specific passed exam
  getPassedExam: async (id: number): Promise<PassedExam> => {
    const response = await apiClient.get(`/passed-exams/${id}`);
    return response.data;
  },

  // Create a new passed exam
  createPassedExam: async (examData: Partial<PassedExam>): Promise<PassedExam> => {
    const response = await apiClient.post('/passed-exams', examData);
    return response.data;
  },

  // Update a passed exam
  updatePassedExam: async (id: number, examData: Partial<PassedExam>): Promise<PassedExam> => {
    const response = await apiClient.put(`/passed-exams/${id}`, examData);
    return response.data;
  },

  // Delete a passed exam
  deletePassedExam: async (id: number): Promise<void> => {
    await apiClient.delete(`/passed-exams/${id}`);
  },

  // Get passed exams for a specific user
  getUserPassedExams: async (userId: number): Promise<PassedExam[]> => {
    const response = await apiClient.get(`/users/${userId}/passed-exams`);
    return response.data;
  },

  // Get passed exams for a specific exam
  getExamPassedExams: async (examId: number): Promise<PassedExam[]> => {
    const response = await apiClient.get(`/exams/${examId}/passed-exams`);
    return response.data;
  }
};

// Export individual functions for convenience
export const getPassedExams = passedExamService.getPassedExams;
export const getPassedExam = passedExamService.getPassedExam;
export const createPassedExam = passedExamService.createPassedExam;
export const updatePassedExam = passedExamService.updatePassedExam;
export const deletePassedExam = passedExamService.deletePassedExam;
export const getUserPassedExams = passedExamService.getUserPassedExams;
export const getExamPassedExams = passedExamService.getExamPassedExams; 