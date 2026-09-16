'use server';

export async function createSSRSassClient(): Promise<never> {
    throw new Error('Supabase ถูกปิดใช้งานแล้ว');
}

export async function createSSRSassClientAuthenticated(): Promise<never> {
    throw new Error('Supabase ถูกปิดใช้งานแล้ว');
}
