import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getUserData, initializeUserData, UserData } from '@/lib/storage';
import { setGlobalRefreshCallback } from '@/lib/storageUtils';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const refreshUserData = async () => {
    if (user) {
      const data = await getUserData(user.id);
      setUserData(data);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer data fetching to avoid deadlock
          setTimeout(async () => {
            let data = await getUserData(session.user.id);
            if (!data) {
              data = await initializeUserData(session.user.id, session.user.user_metadata?.name || session.user.email!, session.user.email!);
            }
            setUserData(data);
          }, 0);
        } else {
          setUserData(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          let data = await getUserData(session.user.id);
          if (!data) {
            data = await initializeUserData(session.user.id, session.user.user_metadata?.name || session.user.email!, session.user.email!);
          }
          setUserData(data);
        }, 0);
      }
      setLoading(false);
    });

    // Set up global refresh callback for automatic updates
    setGlobalRefreshCallback(refreshUserData);

    return () => {
      subscription.unsubscribe();
      setGlobalRefreshCallback(null);
    };
  }, []);

  // Auto-refresh user data every 5 seconds for live tracking
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      refreshUserData();
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserData(null);
    setSession(null);
  };

  const value = {
    user,
    userData,
    loading,
    session,
    login,
    logout,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};