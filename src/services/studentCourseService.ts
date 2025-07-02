import apiClient from './api';

export interface StudentCourse {
  id: number;
  name: string;
  description?: string;
  image?: string;
  cours_url?: string;
  price?: number;
  discount?: number;
  speciality?: {
    id: number;
    name: string;
  };
  creator?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  enrollment_type: 'direct' | 'group';
  enrolled_at: string;
  progress: number;
  status: 'active' | 'completed' | 'dropped';
  completed_at?: string;
  group_id?: number;
  group_name?: string;
}

export interface EnrollmentStats {
  total_enrolled: number;
  active_courses: number;
  completed_courses: number;
  direct_enrollments: number;
  group_enrollments: number;
  average_progress: number;
}

export const getMyCourses = async (): Promise<StudentCourse[]> => {
  const response = await apiClient.get('/student/courses');
  return response.data;
};

export const getEnrollmentStats = async (): Promise<EnrollmentStats> => {
  const response = await apiClient.get('/student/courses/stats');
  return response.data;
};

export const enrollInCourse = async (courseId: number): Promise<any> => {
  const response = await apiClient.post('/student/courses/enroll', {
    course_id: courseId
  });
  return response.data;
};

export const updateCourseProgress = async (courseId: number, progress: number): Promise<any> => {
  const response = await apiClient.patch(`/student/courses/${courseId}/progress`, {
    progress: progress
  });
  return response.data;
};

export const markCourseAsCompleted = async (courseId: number): Promise<any> => {
  const response = await apiClient.patch(`/student/courses/${courseId}/complete`);
  return response.data;
};

export const dropCourse = async (courseId: number): Promise<any> => {
  const response = await apiClient.delete(`/student/courses/${courseId}/drop`);
  return response.data;
};

export const completeLesson = async (courseId: number): Promise<{ message: string; progress: number }> => {
  const response = await apiClient.post(`/student/courses/${courseId}/complete-lesson`);
  return response.data;
};

export const getStudentCourses = async (studentId: number): Promise<StudentCourse[]> => {
  const response = await apiClient.get(`/students/${studentId}/courses`);
  return response.data;
}; 