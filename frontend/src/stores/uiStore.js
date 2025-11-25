import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // Modal states
  isCreatePostModalOpen: false,
  isEditProfileModalOpen: false,
  
  // Toast notifications
  toasts: [],
  
  // Modal controls
  openCreatePostModal: () => set({ isCreatePostModalOpen: true }),
  closeCreatePostModal: () => set({ isCreatePostModalOpen: false }),
  
  openEditProfileModal: () => set({ isEditProfileModalOpen: true }),
  closeEditProfileModal: () => set({ isEditProfileModalOpen: false }),
  
  // Toast controls
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: Date.now() }]
  })),
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
  
  clearToasts: () => set({ toasts: [] }),
}));
