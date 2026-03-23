'use server'
import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.PRIVATE_SUPABASE_SERVICE_KEY) {
    console.error("Missing Supabase Service Role Key");
}

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.PRIVATE_SUPABASE_SERVICE_KEY || ''
);

export async function getChatUsers() {
    try {
        const { data: messages, error } = await supabaseAdmin
            .from('chat_messages')
            .select('user_id')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        if (!messages) return [];
        
        // Get unique user_ids
        const uniqueUserIds = Array.from(new Set(messages.map(m => m.user_id)));
        return uniqueUserIds;
    } catch (err: unknown) {
        console.error("Error getChatUsers", err);
        return [];
    }
}

export async function getMessagesForUser(userId: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('chat_messages')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });
            
        if (error) throw error;
        return data || [];
    } catch (err: unknown) {
        console.error("Error getMessagesForUser", err);
        return [];
    }
}

export async function sendExpertMessage(userId: string, message: string) {
    try {
        const { error } = await supabaseAdmin
            .from('chat_messages')
            .insert({
                user_id: userId,
                sender_type: 'expert',
                message: message
            });
            
        if (error) throw error;
        return true;
    } catch (err: unknown) {
        console.error("Error sendExpertMessage", err);
        throw err;
    }
}

export async function getAllAppointments() {
    try {
        const { data, error } = await supabaseAdmin
            .from('appointments')
            .select('*')
            .order('appointment_date', { ascending: true })
            .order('appointment_time', { ascending: true });
            
        if (error) throw error;
        return data || [];
    } catch (err: unknown) {
        console.error("Error getAllAppointments", err);
        return [];
    }
}

export async function updateAppointmentStatus(id: string, status: string) {
    try {
        const { error } = await supabaseAdmin
            .from('appointments')
            .update({ status })
            .eq('id', id);
            
        if (error) throw error;
        return true;
    } catch (err: unknown) {
        console.error("Error updateAppointmentStatus", err);
        throw err;
    }
}

export async function getAllArticles() {
    try {
        const { data, error } = await supabaseAdmin
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return data || [];
    } catch (err: unknown) {
        console.error("Error getAllArticles", err);
        return [];
    }
}

export async function createArticle(title: string, content: string, category: string, imageUrl: string) {
    try {
        const { error } = await supabaseAdmin
            .from('articles')
            .insert({
                title,
                content,
                category: category || null,
                image_url: imageUrl || null
            });
            
        if (error) throw error;
        return true;
    } catch (err: unknown) {
        console.error("Error createArticle", err);
        throw err;
    }
}

export async function updateArticle(id: string, title: string, content: string, category: string, imageUrl: string) {
    try {
        const { error } = await supabaseAdmin
            .from('articles')
            .update({
                title,
                content,
                category: category || null,
                image_url: imageUrl || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);
            
        if (error) throw error;
        return true;
    } catch (err: unknown) {
        console.error("Error updateArticle", err);
        throw err;
    }
}

export async function deleteArticle(id: string) {
    try {
        const { error } = await supabaseAdmin
            .from('articles')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        return true;
    } catch (err: unknown) {
        console.error("Error deleteArticle", err);
        throw err;
    }
}
