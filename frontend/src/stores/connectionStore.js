import { create } from 'zustand';
import api from '@/services/api';
import { handleApiResponse, handleApiError } from '@/utils/formatters';

export const useConnectionStore = create((set, get) => ({
  sentRequests: [],
  receivedRequests: [],
  allUsers: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 50,
    totalPages: 1,
    totalCount: 0
  },
  
  // Search/Get all users
  searchUsers: async (keyword = '', page = 1, pageSize = 50) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/user/get_all_users', {
        params: { page, pageSize, keyword }
      });
      const result = handleApiResponse(response);
      
      if (result.success) {
        const { metadata, data } = result.data.profiles;
        set({ 
          allUsers: data,
          pagination: {
            page: metadata.page,
            pageSize: metadata.pageSize,
            totalPages: metadata.lastPage,
            totalCount: metadata.totalCount
          },
          loading: false 
        });
        return { success: true, data };
      } else {
        set({ error: result.message, loading: false, allUsers: [] });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const result = handleApiError(error);
      set({ error: result.message, loading: false, allUsers: [] });
      return result;
    }
  },
  
  // Send connection request
  sendConnectionRequest: async (connectionId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/user/send_connection_request', { connectionId });
      const result = handleApiResponse(response);
      
      if (result.success) {
        set({ loading: false });
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
  
  // Get sent connection requests
  fetchSentRequests: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/user/get_connection_requests');
      const result = handleApiResponse(response);
      
      if (result.success) {
        set({ sentRequests: result.data, loading: false });
        return { success: true, data: result.data };
      } else {
        set({ sentRequests: [], loading: false });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const result = handleApiError(error);
      set({ error: result.message, loading: false, sentRequests: [] });
      return result;
    }
  },
  
  // Get received connection requests
  fetchReceivedRequests: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/user/myConnection');
      const result = handleApiResponse(response);
      
      if (result.success) {
        set({ receivedRequests: result.data, loading: false });
        return { success: true, data: result.data };
      } else {
        set({ receivedRequests: [], loading: false });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const result = handleApiError(error);
      set({ error: result.message, loading: false, receivedRequests: [] });
      return result;
    }
  },
  
  // Accept or reject connection request
  respondToRequest: async (requestId, acceptType) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/user/accept_connection_request', {
        requestId,
        accept_type: acceptType // 'accept' or 'reject'
      });
      const result = handleApiResponse(response);
      
      if (result.success) {
        // Refresh received requests
        await get().fetchReceivedRequests();
        set({ loading: false });
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
  
  // Download user resume
  downloadResume: async (userId) => {
    try {
      const response = await api.get('/user/download_resume', {
        params: { id: userId }
      });
      const result = handleApiResponse(response);
      
      if (result.success) {
        return { success: true, filename: result.data };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      const result = handleApiError(error);
      return result;
    }
  },
  
  // Clear connections data
  clearConnections: () => {
    set({ 
      sentRequests: [], 
      receivedRequests: [], 
      allUsers: [],
      loading: false, 
      error: null 
    });
  },
}));
