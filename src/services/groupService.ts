import apiClient from './api';

export interface Group {
  id: number;
  name: string;
  cour_id: number;
  start_date?: string;
  end_date?: string;
  creator_id: number;
  description?: string;
  image?: string;
  max_students?: number;
  created_at: string;
  updated_at: string;
  course?: {
    id: number;
    title: string;
    description?: string;
    price?: number;
    discount?: number;
  };
  creator?: {
    id: number;
    name: string;
    email: string;
  };
  students?: Array<{
    id: number;
    name: string;
    first_name?: string;
    last_name?: string;
    email: string;
    avatar?: string;
  }>;
}

export const getGroups = async () => {
  const response = await apiClient.get('/groups');
  return response.data;
};

export const getGroup = async (id: number | string) => {
  const response = await apiClient.get(`/groups/${id}`);
  return response.data;
};

export const createGroup = async (groupData: Partial<Group>) => {
  const response = await apiClient.post('/groups', groupData);
  return response.data;
};

export const updateGroup = async (id: number, groupData: Partial<Group>) => {
  const response = await apiClient.put(`/groups/${id}`, groupData);
  return response.data;
};

export const deleteGroup = async (id: number) => {
  const response = await apiClient.delete(`/groups/${id}`);
  return response.data;
};

export const addUserToGroup = async (groupId: number, userId: number) => {
  const response = await apiClient.post(`/groups/${groupId}/add-user`, { user_id: userId });
  return response.data;
};

export const removeUserFromGroup = async (groupId: number, userId: number) => {
  const response = await apiClient.post(`/groups/${groupId}/remove-user`, { user_id: userId });
  return response.data;
};

export const getGroupsByCreator = async (creatorId: number) => {
  const response = await apiClient.get(`/groups/creator/${creatorId}`);
  return response.data;
}; 