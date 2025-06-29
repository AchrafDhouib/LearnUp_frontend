import apiClient from './api';

export interface UserGroup {
  id: number;
  user_id: number;
  group_id: number;
  created_at: string;
  updated_at: string;
}

export const getUserGroups = async () => {
  const response = await apiClient.get('/user-groups');
  return response.data;
};

export const getUserGroup = async (userId: number | string) => {
  const response = await apiClient.get(`/user-groups/${userId}`);
  return response.data;
};

export const addUserToGroup = async (userId: number, groupId: number) => {
  const response = await apiClient.post('/user-group/add', { user_id: userId, group_id: groupId });
  return response.data;
};

export const removeUserFromGroup = async (userId: number, groupId: number) => {
  const response = await apiClient.post('/user-group/remove', { user_id: userId, group_id: groupId });
  return response.data;
}; 