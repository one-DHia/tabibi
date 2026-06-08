import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Admin email list from environment — centralized, not hardcoded
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAIL || '')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean);

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signup = async (email, password, profileData) => {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: profileData.name,
                    role: 'user', // SECURITY: Always forced to 'user' — never trust client
                    lang: profileData.lang || 'fr',
                },
            },
        });

        if (error) {
            setLoading(false);
            throw error;
        }

        // Direct navigation to profile/home
        navigate('/doctor/profile');
        return data;
    };

    const verifyOtp = async (email, token) => {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'signup'
        });

        if (error) throw error;

        // If successful, update user state
        setUser(data.user);
        navigate('/doctor/profile'); // Or success page
        return data;
    };

    const login = async (email, password) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setLoading(false);
            throw error;
        }

        // Navigation is handled by the component or automatically by state change if protected route
        // But let's redirect to dashboard/admin if successful and explicitly called for
        if (data.user?.user_metadata?.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/doctor/profile'); // Or wherever for doctors
        }
        return data;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const updateUser = async (updates) => {
        // Update user metadata
        const { data, error } = await supabase.auth.updateUser({
            data: updates
        });
        if (error) throw error;
        setUser(data.user);
    };

    const value = {
        user,
        signup,
        login,
        logout,
        updateUser,
        verifyOtp,
        isAuthenticated: !!user,
        isVerified: user?.user_metadata?.isVerified ?? false,
        isAdmin: ADMIN_EMAILS.includes(user?.email)
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white gap-4">
                    <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-zinc-500 text-sm font-medium animate-pulse">Chargement de Tabibi...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
