
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user data in localStorage
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would validate credentials against a backend
      // For demo purposes, we'll accept any well-formed email with a password over 5 chars
      if (!email.includes('@') || password.length < 5) {
        throw new Error('Invalid credentials');
      }
      
      // Create a demo user
      const newUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
        avatar: null
      };
      
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      setUser(newUser);
      toast.success('Signed in successfully');
    } catch (error) {
      toast.error('Invalid credentials');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Validate inputs
      if (!name || !email.includes('@') || password.length < 5) {
        throw new Error('Invalid registration data');
      }
      
      // Create a new user
      const newUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        avatar: null
      };
      
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      setUser(newUser);
      toast.success('Account created successfully');
    } catch (error) {
      toast.error('Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
    toast.success('Signed out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
