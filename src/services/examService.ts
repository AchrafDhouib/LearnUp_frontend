import apiClient from './api';

export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  cours_id: number;
  questions: Question[];
}

export interface Question {
  id: number;
  question: string;
  type: 'multiple_choice' | 'unique_choice';
  exam_id: number;
  answers: Answer[];
}

export interface Answer {
  id: number;
  answer: string;
  is_correct: boolean;
  question_id: number;
}

export const examService = {
  // Get all exams
  getExams: async (): Promise<Exam[]> => {
    const response = await apiClient.get('/exams');
    return response.data;
  },

  // Get a specific exam with questions and answers
  getExam: async (examId: string | number): Promise<Exam> => {
    const response = await apiClient.get(`/exams/${examId}`);
    return response.data;
  },

  // Create a new exam
  createExam: async (examData: Partial<Exam>): Promise<Exam> => {
    const response = await apiClient.post('/exams', examData);
    return response.data;
  },

  // Update an exam
  updateExam: async (examId: number, examData: Partial<Exam>): Promise<Exam> => {
    const response = await apiClient.put(`/exams/${examId}`, examData);
    return response.data;
  },

  // Delete an exam
  deleteExam: async (examId: number): Promise<void> => {
    await apiClient.delete(`/exams/${examId}`);
  },

  // Get exams by course
  getExamsByCourse: async (courseId: number): Promise<Exam[]> => {
    const response = await apiClient.get(`/courses/${courseId}/exams`);
    return response.data;
  }
};

// Export individual functions for convenience
export const getExams = examService.getExams;
export const getExam = examService.getExam;
export const createExam = examService.createExam;
export const updateExam = examService.updateExam;
export const deleteExam = examService.deleteExam;
export const getExamsByCourse = examService.getExamsByCourse; 