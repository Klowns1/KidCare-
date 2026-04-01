// src/lib/context/GlobalContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';


type User = {
    email: string | null;
    id: string;
    registered_at: Date;
    is_anonymous: boolean;
};

interface GlobalContextType {
    loading: boolean;
    user: User | null;
    selectedChildId: string | null;
    setSelectedChildId: (id: string | null) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [selectedChildId, _setSelectedChildId] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('kidcare_selectedChildId');
        }
        return null;
    });

    // Wrapper to persist to localStorage
    const setSelectedChildId = (id: string | null) => {
        _setSelectedChildId(id);
        if (typeof window !== 'undefined') {
            if (id) {
                localStorage.setItem('kidcare_selectedChildId', id);
            } else {
                localStorage.removeItem('kidcare_selectedChildId');
            }
        }
    };

    useEffect(() => {
        async function loadData() {
            try {
                const supabase = await createSPASassClient();
                const client = supabase.getSupabaseClient();

                // Get user data
                const { data: { user }, error } = await client.auth.getUser();
                if (error) {
                    console.warn('Auth user fetch warning:', error.message);
                }
                
                if (user) {
                    setUser({
                        email: user.email ?? null,
                        id: user.id,
                        registered_at: new Date(user.created_at),
                        is_anonymous: user.is_anonymous ?? false
                    });
                } else {
                    setUser(null);
                }

                // Auto-select first child if none selected yet
                if (user && !selectedChildId) {
                    try {
                        const { data: parentData } = await client
                            .from('parent_profiles')
                            .select('id')
                            .eq('user_id', user.id)
                            .limit(1)
                            .maybeSingle();

                        if (parentData) {
                            const { data: firstChild } = await client
                                .from('children')
                                .select('id')
                                .eq('parent_id', parentData.id)
                                .order('created_at', { ascending: false })
                                .limit(1)
                                .maybeSingle();

                            if (firstChild) {
                                setSelectedChildId(firstChild.id);
                            }
                        }
                    } catch (e) {
                        console.warn('Auto-select child failed:', e);
                    }
                }

            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <GlobalContext.Provider value={{ loading, user, selectedChildId, setSelectedChildId }}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
};