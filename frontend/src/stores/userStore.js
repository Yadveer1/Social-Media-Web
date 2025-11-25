import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/api';
import { handleApiResponse, handleApiError } from '@/utils/formatters';
import { useAuthStore } from './authStore';

export const useUserStore = create(
  persist(
    (set, get) => ({
      profile: null,
      loading: false,
      error: null,
  
  // Fetch current user profile
  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/get_user_and_profile');
      const result = handleApiResponse(response);
      
      if (result.success) {
        set({ profile: result.data, loading: false });
        
        // Also update the user in authStore to keep them in sync
        if (result.data?.userId) {
          useAuthStore.getState().updateUser(result.data.userId);
        }
        
        return { success: true, data: result.data };
      } else {
        set({ error: result.message, loading: false });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const result = handleApiError(error);
      set({ error: result.message, loading: false });
      return result;
    }
  },
  
  // Update user information
  updateUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/user_update', userData);
      const result = handleApiResponse(response);
      
      if (result.success) {
        // Refresh profile after update
        await get().fetchProfile();
        return { success: true, message: result.message };
      } else {
        set({ error: result.message, loading: false });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const result = handleApiError(error);
      set({ error: result.message, loading: false });
      return result;
    }
  },
  
  // Update profile data
  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/update_profile_data', profileData);
      const result = handleApiResponse(response);
      
      if (result.success) {
        // Refresh profile after update
        await get().fetchProfile();
        return { success: true, message: result.message };
      } else {
        set({ error: result.message, loading: false });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const result = handleApiError(error);
      set({ error: result.message, loading: false });
      return result;
    }
  },
  
  // Upload profile picture
  uploadProfilePicture: async (file) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      
      const response = await api.post('/upload_profile_picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const result = handleApiResponse(response);
      
      if (result.success) {
        // Refresh profile after upload
        await get().fetchProfile();
        return { success: true, message: result.message };
      } else {
        set({ error: result.message, loading: false });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const result = handleApiError(error);
      set({ error: result.message, loading: false });
      return result;
    }
  },
  
  // Clear profile data
  clearProfile: () => {
    set({ profile: null, loading: false, error: null });
  },
    }),
    {
      name: 'user-storage',
    }
  )
);
