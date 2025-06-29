import apiClient from './api';

export interface Lesson {
  id: number;
  cour_id: number;
  title: string;
  description: string;
  duration: number;
  url_video?: string;
  url_pdf?: string;
  created_at: string;
  updated_at: string;
}

export const getLessons = async () => {
  const response = await apiClient.get('/lessons');
  return response.data;
};

export const getLesson = async (id: number | string) => {
  const response = await apiClient.get(`/lessons/${id}`);
  return response.data;
};

export const createLesson = async (courseId: number, lessonData: Partial<Lesson>) => {
  const response = await apiClient.post(`/courses/${courseId}/lessons`, lessonData);
  return response.data;
};

export const updateLesson = async (courseId: number, lessonId: number, lessonData: Partial<Lesson>) => {
  const response = await apiClient.put(`/courses/${courseId}/lessons/${lessonId}`, lessonData);
  return response.data;
};

export const deleteLesson = async (courseId: number, lessonId: number) => {
  const response = await apiClient.delete(`/courses/${courseId}/lessons/${lessonId}`);
  return response.data;
};

export const getLessonsByCourse = async (courseId: number | string) => {
  const response = await apiClient.get(`/courses/${courseId}/lessons`);
  return response.data;
}; 