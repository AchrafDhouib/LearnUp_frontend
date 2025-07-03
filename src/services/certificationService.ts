import apiClient from './api';

export interface Certification {
  id: number;
  certificate_number: string;
  student_name: string;
  course_name: string;
  instructor_name: string;
  score: number;
  required_score: number;
  issued_date: string;
  validity_period: string;
  achievement_description: string;
  passed_exam: {
    id: number;
    exam: {
      id: number;
      title: string;
      course: {
        id: number;
        name: string;
        description: string;
        creator: {
          id: number;
          name: string;
          email: string;
        };
      };
    };
  };
  created_at: string;
  updated_at: string;
}

export const getCertifications = async (): Promise<Certification[]> => {
  const response = await apiClient.get('/certifications');
  return response.data;
};

export const getCertification = async (id: number | string): Promise<Certification> => {
  const response = await apiClient.get(`/certifications/${id}`);
  return response.data;
};

export const createCertification = async (certificationData: Partial<Certification>): Promise<Certification> => {
  const response = await apiClient.post('/certifications', certificationData);
  return response.data;
};

export const updateCertification = async (id: number, certificationData: Partial<Certification>): Promise<Certification> => {
  const response = await apiClient.put(`/certifications/${id}`, certificationData);
  return response.data;
};

export const deleteCertification = async (id: number): Promise<void> => {
  await apiClient.delete(`/certifications/${id}`);
};

// Get certifications for a specific user
export const getUserCertifications = async (userId: number): Promise<Certification[]> => {
  const response = await apiClient.get(`/users/${userId}/certifications`);
  return response.data;
}; 