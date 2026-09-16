'use server'

const disabled = (detail: string) => {
    throw new Error(`โหมดผู้เชี่ยวชาญยังไม่รองรับเมื่อปิด Supabase (${detail})`);
};

export async function getChatUsers() {
    return [] as string[];
}

export async function getMessagesForUser(userId: string) {
    if (!userId) return [];
    return [] as Array<{ id: string; user_id: string; message: string; sender_type: string }>;
}

export async function sendExpertMessage(userId: string, message: string) {
    disabled(`${userId}:${message.length}`);
}

export async function getAllAppointments() {
    return [] as unknown[];
}

export async function updateAppointmentStatus(id: string, status: string) {
    disabled(`${id}:${status}`);
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
    disabled([title, content.length, category, imageUrl].join(':'));
}

export async function updateArticle(
    id: string,
    title: string,
    content: string,
    category: string,
    imageUrl: string
) {
    disabled([id, title, content.length, category, imageUrl].join(':'));
}

export async function deleteArticle(id: string) {
    disabled(id);
}
