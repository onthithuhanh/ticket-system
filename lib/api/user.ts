import api from './config';

export interface User {
  id: string;
  userName: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export const userApi = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/Users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserData) => {
    const response = await api.put(`/Users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/Users/${id}`);
    return response.data;
  },

  updateProfile: async (data: UpdateUserData) => {
    const response = await api.put('/Users/profile', data);
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.put('/Users/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
}; 