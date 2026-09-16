'use server'

export async function getChatUsers() {
    return [] as string[];
}

export async function getMessagesForUser(_userId: string) {
    return [] as unknown[];
}

export async function sendExpertMessage(_userId: string, _message: string) {
    throw new Error('โหมดผู้เชี่ยวชาญยังไม่รองรับเมื่อปิด Supabase');
}

export async function getAllAppointments() {
    return [] as unknown[];
}

export async function updateAppointmentStatus(_id: string, _status: string) {
    throw new Error('โหมดผู้เชี่ยวชาญยังไม่รองรับเมื่อปิด Supabase');
}

export async function getAllArticles() {
    return [] as unknown[];
}

export async function createArticle(
    _title: string,
    _content: string,
    _category: string,
    _imageUrl: string
) {
    throw new Error('โหมดผู้เชี่ยวชาญยังไม่รองรับเมื่อปิด Supabase');
}

export async function updateArticle(
    _id: string,
    _title: string,
    _content: string,
    _category: string,
    _imageUrl: string
) {
    throw new Error('โหมดผู้เชี่ยวชาญยังไม่รองรับเมื่อปิด Supabase');
}

export async function deleteArticle(_id: string) {
    throw new Error('โหมดผู้เชี่ยวชาญยังไม่รองรับเมื่อปิด Supabase');
}
