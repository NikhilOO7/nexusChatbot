import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');

        if (storedUser && token) {
          try {
            // Verify token with backend
            const response = await authApi.verify();
            
            if (response.valid) {
              setUser(JSON.parse(storedUser));
            } else {
              // Token invalid, log out
              localStorage.removeItem('user');
              localStorage.removeItem('authToken');
            }
          } catch (error) {
            console.error('Authentication error:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try up to 3 times if network issues occur
      let attempts = 0;
      let success = false;
      let response;
      
      while (attempts < 3 && !success) {
        try {
          response = await authApi.login(email, password);
          success = true;
        } catch (err) {
          attempts++;
          if (attempts >= 3) throw err;
          // Wait before retrying (exponential backoff)
          await new Promise(r => setTimeout(r, 1000 * attempts));
        }
      }
      
      if (response) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
    } catch (error) {
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (error instanceof Error) {
        // Handle specific error messages from API
        if (error.message.includes('Invalid credentials')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.message.includes('User not found')) {
          errorMessage = 'Account not found. Please check your email or create an account.';
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.register(name, email, password);
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error instanceof Error) {
        // Handle specific error messages
        if (error.message.includes('already exists')) {
          errorMessage = 'An account with this email already exists.';
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};