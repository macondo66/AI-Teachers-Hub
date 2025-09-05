
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Profile } from '../types';
import { supabase } from '../services/supabase';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface AuthContextType {
  user: Profile | null;
  login: (email: string, pass: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => void;
  loading: boolean;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock session check
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
        setUser(JSON.parse(sessionUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data?.user) {
        const {data: profileData, error: profileError} = await supabase.from('profiles').select().eq('id', data.user.id).single();
        setUser(profileData);
        sessionStorage.setItem('user', JSON.stringify(profileData));
    }
    setLoading(false);
    return { data, error };
  };

  const register = async (registerData: any) => {
     setLoading(true);
     const { data, error } = await supabase.auth.signUp({
         email: registerData.email,
         password: registerData.password,
         options: {
             data: {
                 full_name: registerData.full_name,
                 school_name: registerData.school_name,
                 experience_years: registerData.experience_years,
             }
         }
     });
     if (data?.user) {
        setUser(data.user as Profile);
        sessionStorage.setItem('user', JSON.stringify(data.user));
     }
     setLoading(false);
     return { data, error };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    supabase.auth.signOut();
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.from('profiles').update(profileData).eq('id', user.id);
    if (!error && data) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
    setLoading(false);
  };
  
  if (loading && !user) {
    return <div className="h-screen w-full flex items-center justify-center"><LoadingSpinner /></div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
