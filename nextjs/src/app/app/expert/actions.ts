'use server'

export async function getChatUsers() {
    return [] as string[];
}

export async function getMessagesForUser(userId: string) {
    return [] as Array<{ id: string; user_id: string; message: string; sender_type: string }>;
}

export async function sendExpertMessage(userId: string, message: string) {
    throw new Error(`โหมดผู้เชี่ยวชาญยังไม่รองรับเมื่อปิด Supabase (${userId}, ${message.length})`);
}

export async function getAllAppointments() {
    return [] as unknown[];
}

export async function updateAppointmentStatus(id: string, status: string) {
    throw new Error(`โหมดผู้เชี่ยวชาญยังไม่รองรับเมื่อปิด Supabase (${id}, ${status})`);
}

export async function getAllArticles() {
    return [] as unknown[];
}

export async function createArticle(
    title: string,
    content: string,
    category: string,
    imageUrl: string
) {
    throw new Error(
        `โหมดผู้เชี่ยวชาญยังไม่รองรับเมื่อปิด Supabase (${title}, ${content.length}, ${category}, ${imageUrl})`
    );
}

export async function updateArticle(
    id: string,
    title: string,
    content: string,
    category: string,
    imageUrl: string
) {
    throw new Error(
        `โหมดผู้เชี่ยวชาญยังไม่รองรับเมื่อปิด Supabase (${id}, ${title}, ${content.length}, ${category}, ${imageUrl})`
    );
}

export async function deleteArticle(id: string) {
    throw new Error(`โหมดผู้เชี่ยวชาญยังไม่รองรับเมื่อปิด Supabase (${id})`);
}
