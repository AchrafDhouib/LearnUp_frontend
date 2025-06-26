
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "sonner";

// Types
interface User {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  role: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, userType: string) => Promise<boolean>;
  register: (userData: any, userType: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string | string[]) => boolean;
  updateUser: (userData: Partial<User>) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');
      
      if (storedUser && token) {
        try {
          // You can validate the token with your backend here
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string, userType: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const apiBaseUrl = "http://localhost:8000/api";
      let endpoint;
      
      if (userType === "student") {
        endpoint = `${apiBaseUrl}/auth/student/login`;
      } else if (userType === "teacher") {
        endpoint = `${apiBaseUrl}/auth/teacher/login`;
      } else {
        endpoint = `${apiBaseUrl}/auth/admin/login`;
      }
      
      const response = await axios.post(endpoint, { email, password });
      
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Erreur d'authentification. Veuillez vérifier vos identifiants.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any, userType: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const apiBaseUrl = "http://localhost:8000/api";
      let endpoint;
      
      if (userType === "student") {
        endpoint = `${apiBaseUrl}/auth/student/register`;
      } else {
        endpoint = `${apiBaseUrl}/auth/teacher/register`;
      }
      
      const response = await axios.post(endpoint, userData);
      
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.success("Vous avez été déconnecté avec succès.");
    navigate('/login');
  };
  
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user || !user.role) return false;
    
    if (Array.isArray(role)) {
      return role.some(r => user.role.includes(r));
    }
    
    return user.role.includes(role);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user, 
      hasRole,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protect routes based on authentication
export const ProtectedRoute = ({ 
  children,
  requiredRole
}: { 
  children: ReactNode, 
  requiredRole?: string | string[]
}) => {
  const { isAuthenticated, hasRole, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (requiredRole && !hasRole(requiredRole)) {
        navigate('/unauthorized');
      }
    }
  }, [isAuthenticated, hasRole, isLoading, navigate, requiredRole]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};