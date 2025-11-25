import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useAuth = () => {
  const { token, user, isAuthenticated, setAuth, logout, updateUser } = useAuthStore();
  
  return {
    token,
    user,
    isAuthenticated,
    setAuth,
    logout,
    updateUser,
  };
};

export const useRequireAuth = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  return { isAuthenticated };
};
