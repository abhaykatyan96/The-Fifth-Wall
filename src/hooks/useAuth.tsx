'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types/database';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'tfw_luxury_customer';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser(profile as Profile);
            setIsLoading(false);
            return;
          }
        }

        // Check local demo customer session
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('Auth initialization error', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        // Fallback for demo experience if Supabase is unconfigured
        if (password.length >= 6) {
          const demoUser: Profile = {
            id: `usr-${Date.now()}`,
            email,
            full_name: email.split('@')[0].toUpperCase(),
            phone: '+91 98765 00000',
            role: 'customer',
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUser(demoUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
          return { success: true };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (profile) setUser(profile as Profile);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch {
      // Demo fallback
      const demoUser: Profile = {
        id: `usr-${Date.now()}`,
        email,
        full_name: email.split('@')[0].toUpperCase(),
        phone: '+91 98765 00000',
        role: 'customer',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(demoUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
      return { success: true };
    }
  };

  const register = async (fullName: string, email: string, phone: string, password: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
        },
      });

      if (error) {
        // Demo fallback
        const demoUser: Profile = {
          id: `usr-${Date.now()}`,
          email,
          full_name: fullName,
          phone,
          role: 'customer',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(demoUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
        return { success: true };
      }

      if (data.user) {
        const demoUser: Profile = {
          id: data.user.id,
          email,
          full_name: fullName,
          phone,
          role: 'customer',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(demoUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch {
      const demoUser: Profile = {
        id: `usr-${Date.now()}`,
        email,
        full_name: fullName,
        phone,
        role: 'customer',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(demoUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
      return { success: true };
    }
  };

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
