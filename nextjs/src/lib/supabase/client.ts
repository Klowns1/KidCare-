/**
 * Legacy Supabase client stubs.
 * The KidCare app now uses local-auth / local-db. These exports remain only so
 * leftover template pages do not break the build if imported accidentally.
 */

export function createSPAClient(): never {
    throw new Error('Supabase ถูกปิดใช้งานแล้ว กรุณาใช้ระบบล็อกอินในตัวแอป');
}

export async function createSPASassClient(): Promise<never> {
    throw new Error('Supabase ถูกปิดใช้งานแล้ว กรุณาใช้ระบบล็อกอินในตัวแอป');
}

export async function createSPASassClientAuthenticated(): Promise<never> {
    throw new Error('Supabase ถูกปิดใช้งานแล้ว กรุณาใช้ระบบล็อกอินในตัวแอป');
}
