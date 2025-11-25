import { create } from 'zustand';
import api from '@/services/api';
import { handleApiResponse, handleApiError } from '@/utils/formatters';

export const usePostStore = create((set, get) => ({
  posts: [],
  myPosts: [],
  loading: false,
  error: null,
  
  // Fetch all posts
  fetchAllPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/get_all_posts');
      const result = handleApiResponse(response);
      
      if (result.success) {
        set({ posts: result.data, loading: false });
        return { success: true, data: result.data };
      } else {
        set({ error: result.message, loading: false, posts: [] });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const result = handleApiError(error);
      set({ error: result.message, loading: false, posts: [] });
      return result;
    }
  },
  
  // Fetch current user's posts
  fetchMyPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/get_my_posts');
      const result = handleApiResponse(response);
      
      if (result.success) {
        set({ myPosts: result.data, loading: false });
        return { success: true, data: result.data };
      } else {
        set({ error: result.message, loading: false, myPosts: [] });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const result = handleApiError(error);
      set({ error: result.message, loading: false, myPosts: [] });
      return result;
    }
  },
  
  // Create new post
  createPost: async (body, media = null) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('body', body);
      if (media) {
        formData.append('media', media);
      }
      
      const response = await api.post('/create_post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const result = handleApiResponse(response);
      
      if (result.success) {
        // Refresh posts after creation
        await get().fetchAllPosts();
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
  
  // Delete post
  deletePost: async (postId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete('/delete_post', {
        data: { post_id: postId }
      });
      const result = handleApiResponse(response);
      
      if (result.success) {
        // Remove post from local state
        set(state => ({
          posts: state.posts.filter(post => post._id !== postId),
          myPosts: state.myPosts.filter(post => post._id !== postId),
          loading: false
        }));
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
  
  // Like/Unlike post
  toggleLike: async (postId, action) => {
    try {
      const response = await api.post('/like_post', {
        post_id: postId,
        msg: action // 'like' or 'unlike'
      });
      const result = handleApiResponse(response);
      
      if (result.success) {
        // Update post likes in local state
        set(state => ({
          posts: state.posts.map(post => 
            post._id === postId 
              ? { ...post, likes: action === 'like' ? post.likes + 1 : post.likes - 1 }
              : post
          ),
          myPosts: state.myPosts.map(post => 
            post._id === postId 
              ? { ...post, likes: action === 'like' ? post.likes + 1 : post.likes - 1 }
              : post
          )
        }));
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      const result = handleApiError(error);
      return result;
    }
  },
  
  // Clear posts
  clearPosts: () => {
    set({ posts: [], myPosts: [], loading: false, error: null });
  },
}));
