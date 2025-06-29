import apiClient from './api';

export interface Certification {
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export const getCertifications = async () => {
  const response = await apiClient.get('/certifications');
  return response.data;
};

export const getCertification = async (id: number | string) => {
  const response = await apiClient.get(`/certifications/${id}`);
  return response.data;
};

export const createCertification = async (certificationData: Partial<Certification>) => {
  const response = await apiClient.post('/certifications', certificationData);
  return response.data;
};

export const updateCertification = async (id: number, certificationData: Partial<Certification>) => {
  const response = await apiClient.put(`/certifications/${id}`, certificationData);
  return response.data;
};

export const deleteCertification = async (id: number) => {
  const response = await apiClient.delete(`/certifications/${id}`);
  return response.data;
}; 