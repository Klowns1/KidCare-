'use client';

export type LocalUser = {
    id: string;
    email: string;
    created_at: string;
};

type StoredUser = LocalUser & {
    password_hash: string;
};

const USERS_KEY = 'kidcare_users';
const SESSION_KEY = 'kidcare_session';

function readUsers(): StoredUser[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as StoredUser[];
    } catch {
        return [];
    }
}

function writeUsers(users: StoredUser[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublicUser({ id, email, created_at }: StoredUser | LocalUser): LocalUser {
    return { id, email, created_at };
}

async function hashPassword(password: string, salt: string): Promise<string> {
    const data = new TextEncoder().encode(`${salt}:${password}`);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

export function getSessionUser(): LocalUser | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as LocalUser;
    } catch {
        return null;
    }
}

function setSession(user: LocalUser) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

export function logoutUser() {
    clearSession();
}

export async function registerUser(email: string, password: string): Promise<LocalUser> {
    const normalized = email.trim().toLowerCase();
    if (!normalized || password.length < 6) {
        throw new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    }

    const users = readUsers();
    if (users.some((u) => u.email === normalized)) {
        throw new Error('อีเมลนี้มีผู้ใช้งานแล้ว');
    }

    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const stored: StoredUser = {
        id,
        email: normalized,
        password_hash: await hashPassword(password, id),
        created_at,
    };
    users.push(stored);
    writeUsers(users);

    const sessionUser = toPublicUser(stored);
    setSession(sessionUser);
    return sessionUser;
}

export async function loginUser(email: string, password: string): Promise<LocalUser> {
    const normalized = email.trim().toLowerCase();
    const found = readUsers().find((u) => u.email === normalized);
    if (!found) {
        throw new Error('Invalid login credentials');
    }

    const password_hash = await hashPassword(password, found.id);
    if (password_hash !== found.password_hash) {
        throw new Error('Invalid login credentials');
    }

    const sessionUser = toPublicUser(found);
    setSession(sessionUser);
    return sessionUser;
}

export async function changePassword(userId: string, newPassword: string): Promise<void> {
    if (newPassword.length < 6) {
        throw new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    }
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx < 0) throw new Error('ไม่พบผู้ใช้');
    users[idx].password_hash = await hashPassword(newPassword, users[idx].id);
    writeUsers(users);
}

export async function resetPasswordByEmail(email: string, newPassword: string): Promise<void> {
    const normalized = email.trim().toLowerCase();
    const users = readUsers();
    const found = users.find((u) => u.email === normalized);
    if (!found) {
        throw new Error('ไม่พบอีเมลนี้ในระบบ');
    }
    await changePassword(found.id, newPassword);
}

export function userExists(email: string): boolean {
    const normalized = email.trim().toLowerCase();
    return readUsers().some((u) => u.email === normalized);
}
