
import apiClient from './api';
import { Course } from '@/types/course';

export const getCourses = async () => {
  const response = await apiClient.get('/courses');
  return response.data;
};

export const getCourse = async (id: number | string) => {
  const response = await apiClient.get(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (data: Partial<Course>) => {
  const response = await apiClient.post('/courses', data);
  return response.data;
};

export const updateCourse = async (id: number, data: Partial<Course>) => {
  const response = await apiClient.put(`/courses/${id}`, data);
  return response.data;
};

export const deleteCourse = async (id: number) => {
  const response = await apiClient.delete(`/courses/${id}`);
  return response.data;
};

export const getCoursesByDiscipline = async (disciplineId: number | string) => {
  const response = await apiClient.get(`/courses/discipline/${disciplineId}`);
  return response.data;
};

export const getCoursesBySpecialty = async (specialtyId: number | string) => {
  const response = await apiClient.get(`/courses/speciality/${specialtyId}`);
  return response.data;
};

// Lesson management
export const createLesson = async (courseId: number, lessonData: any) => {
  const response = await apiClient.post(`/courses/${courseId}/lessons`, lessonData);
  return response.data;
};

export const updateLesson = async (courseId: number, lessonId: number, lessonData: any) => {
  const response = await apiClient.put(`/courses/${courseId}/lessons/${lessonId}`, lessonData);
  return response.data;
};

export const deleteLesson = async (courseId: number, lessonId: number) => {
  const response = await apiClient.delete(`/courses/${courseId}/lessons/${lessonId}`);
  return response.data;
};

export const getLessons = async (courseId: number) => {
  const response = await apiClient.get(`/courses/${courseId}/lessons`);
  return response.data;
};
