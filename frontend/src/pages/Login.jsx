import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
import { handleApiResponse, handleApiError } from '@/utils/formatters';
import { validateEmail, validateRequired } from '@/utils/validators';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setAuth } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    const passwordValidation = validateRequired(formData.password, 'Password');
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/login', {
        email: formData.email,
        password: formData.password
      });
      
      const result = handleApiResponse(response);
      
      if (result.success && result.data.token) {
        setAuth(result.data.token, null);
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      const result = handleApiError(error);
      toast.error(result.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    
    try {
      const response = await api.post('/auth/google', {
        credential: credentialResponse.credential
      });
      
      const result = handleApiResponse(response);
      
      if (result.success && result.data.token) {
        setAuth(result.data.token, result.data.user);
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Google login failed');
      }
    } catch (error) {
      const result = handleApiError(error);
      toast.error(result.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-600 to-purple-600 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your professional network account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
