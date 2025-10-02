import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
}

interface AdminContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      try {
        const parsed = JSON.parse(adminSession);
        setAdminUser(parsed);
      } catch (error) {
        localStorage.removeItem('admin_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // For demo purposes, using simple authentication
      // In production, this should use proper password hashing
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Simple password check (in production, use bcrypt)
      if (password !== 'admin123') {
        return { success: false, error: 'Invalid credentials' };
      }

      const adminUserData = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
      };

      setAdminUser(adminUserData);
      localStorage.setItem('admin_session', JSON.stringify(adminUserData));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('admin_session');
  };

  const value = {
    adminUser,
    loading,
    login,
    logout,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};