import { create } from 'zustand';
import api from '@/services/api';
import { handleApiResponse, handleApiError } from '@/utils/formatters';

export const useCommentStore = create((set, get) => ({
  comments: {},
  loading: false,
  error: null,
  
  // Fetch comments for a post
  fetchComments: async (postId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/get_comments', { post_id: postId });
      const result = handleApiResponse(response);
      
      if (result.success) {
        set(state => ({
          comments: { ...state.comments, [postId]: result.data },
          loading: false
        }));
        return { success: true, data: result.data };
      } else {
        set(state => ({
          comments: { ...state.comments, [postId]: [] },
          loading: false
        }));
        return { success: false, message: result.message };
      }
    } catch (error) {
      const result = handleApiError(error);
      set({ error: result.message, loading: false });
      return result;
    }
  },
  
  // Add comment to post
  addComment: async (postId, comment) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/comment_post', {
        post_id: postId,
        comment: comment
      });
      const result = handleApiResponse(response);
      
      if (result.success) {
        // Refresh comments for this post
        await get().fetchComments(postId);
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
  
  // Delete comment
  deleteComment: async (commentId, postId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete('/delete_comment', {
        data: { comment_id: commentId }
      });
      const result = handleApiResponse(response);
      
      if (result.success) {
        // Remove comment from local state
        set(state => ({
          comments: {
            ...state.comments,
            [postId]: state.comments[postId]?.filter(c => c._id !== commentId) || []
          },
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
  
  // Clear comments
  clearComments: () => {
    set({ comments: {}, loading: false, error: null });
  },
}));
