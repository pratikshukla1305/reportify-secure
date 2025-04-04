
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  getProfile: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast: uiToast } = useToast();

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Got existing session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Sign-in error:', error.message);
        throw error;
      }
      
      console.log('Sign-in successful:', data.user?.email);
      toast.success('Signed in successfully');
      return { error: null };
    } catch (error: any) {
      console.error('Sign-in caught error:', error.message);
      uiToast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      toast.error(`Error signing in: ${error.message}`);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Signing up with:', email, fullName);
      
      // Using signUp method
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: 'http://localhost:3000/dashboard',
        },
      });
      
      if (error) {
        console.error('Sign-up error:', error.message);
        throw error;
      }
      
      console.log('Sign-up successful, user:', data.user?.id);
      
      // Create profile entry manually if needed
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: email,
              full_name: fullName,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
            
          if (profileError) {
            console.error('Error creating profile:', profileError.message);
          }
        } catch (profileErr) {
          console.error('Profile creation error:', profileErr);
        }
      }
      
      uiToast({
        title: "Success!",
        description: "Account created successfully. Please verify your email and sign in.",
      });
      toast.success("Account created successfully. Please verify your email and sign in.");
      return { error: null };
    } catch (error: any) {
      console.error('Sign-up caught error:', error.message);
      uiToast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
      toast.error(`Error signing up: ${error.message}`);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Signed out successfully");
    } catch (error: any) {
      console.error('Sign-out error:', error.message);
      uiToast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  const getProfile = async () => {
    try {
      if (!user) {
        console.error('No user logged in');
        throw new Error("No user logged in");
      }
      
      console.log('Getting profile for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error.message);
        throw error;
      }
      console.log('Got profile:', data);
      return data;
    } catch (error: any) {
      console.error('Get profile caught error:', error.message);
      uiToast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive",
      });
      toast.error(`Error fetching profile: ${error.message}`);
      return null;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    getProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
