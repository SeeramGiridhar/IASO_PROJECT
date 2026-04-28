import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type UserRole = 'patient' | 'doctor';

interface User { id: string; name: string; email: string; role: UserRole; }
interface AuthContextType { user: User | null; isAuthenticated: boolean; isLoading: boolean; logout: () => Promise<void>; }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mapUser = async (supabaseUser: SupabaseUser | any) => {
    const fallback = { id: supabaseUser.id, name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User', email: supabaseUser.email || '', role: ((supabaseUser.user_metadata?.role as UserRole) || 'patient') };
    const { data: profile } = await supabase.from('profiles').select('id, full_name, email, role').eq('id', supabaseUser.id).single();
    setUser({ id: supabaseUser.id, name: profile?.full_name || fallback.name, email: profile?.email || fallback.email, role: (profile?.role as UserRole) || fallback.role });
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: any) => { if (data.session?.user) await mapUser(data.session.user); setIsLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => { if (session?.user) await mapUser(session.user); else setUser(null); setIsLoading(false); });
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => { await supabase.auth.signOut(); setUser(null); };

  return <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isLoading, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
