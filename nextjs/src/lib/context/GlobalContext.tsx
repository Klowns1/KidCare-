'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSessionUser, logoutUser, type LocalUser } from '@/lib/local-auth';
import { getParentByUserId, listChildren } from '@/lib/local-db';

const SELECTED_CHILD_KEY = 'kidcare_selectedChildId';

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
    refreshUser: () => void;
    signOut: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

function toUser(session: LocalUser): User {
    return {
        email: session.email,
        id: session.id,
        registered_at: new Date(session.created_at),
        is_anonymous: false,
    };
}

function readSelectedChildId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(SELECTED_CHILD_KEY);
}

function persistSelectedChildId(id: string | null) {
    if (typeof window === 'undefined') return;
    if (id) localStorage.setItem(SELECTED_CHILD_KEY, id);
    else localStorage.removeItem(SELECTED_CHILD_KEY);
}

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [selectedChildId, setSelectedChildIdState] = useState<string | null>(() =>
        readSelectedChildId()
    );

    function setSelectedChildId(id: string | null) {
        setSelectedChildIdState(id);
        persistSelectedChildId(id);
    }

    function refreshUser() {
        const session = getSessionUser();
        if (!session) {
            setUser(null);
            return;
        }

        setUser(toUser(session));

        if (selectedChildId) return;

        const parent = getParentByUserId(session.id);
        const firstChild = parent ? listChildren(parent.id)[0] : undefined;
        if (firstChild) setSelectedChildId(firstChild.id);
    }

    function signOut() {
        logoutUser();
        setUser(null);
        setSelectedChildId(null);
        window.location.href = '/auth/login';
    }

    useEffect(() => {
        try {
            refreshUser();
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <GlobalContext.Provider
            value={{ loading, user, selectedChildId, setSelectedChildId, refreshUser, signOut }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
}
