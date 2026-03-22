"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageCircle, Send, Loader2, AlertCircle } from 'lucide-react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';

export default function ChatPage() {
    const { user } = useGlobal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [supabaseClient, setSupabaseClient] = useState<any>(null);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!user) return;
        
        let channel: { unsubscribe: () => void; } | undefined;

        async function initChat() {
            try {
                const supabaseWrapper = await createSPASassClient();
                const supabase = supabaseWrapper.getSupabaseClient();
                setSupabaseClient(supabase);
                
                // Fetch initial messages
                const { data, error: fetchError } = await supabase
                    .from('chat_messages')
                    .select('*')
                    .eq('user_id', user!.id)
                    .order('created_at', { ascending: true });
                
                if (fetchError) {
                    console.error("Supabase Fetch Error (Chat):", JSON.stringify(fetchError));
                    throw new Error(fetchError.message || "Failed to fetch");
                }
                setMessages(data || []);

                // Subscribe to realtime changes
                channel = supabase
                    .channel('public:chat_messages')
                    .on('postgres_changes', { 
                        event: 'INSERT', 
                        schema: 'public', 
                        table: 'chat_messages',
                        filter: `user_id=eq.${user!.id}`
                    }, (payload) => {
                        setMessages(prev => [...prev, payload.new]);
                    })
                    .subscribe();

            } catch (err: unknown) {
                console.error(err);
                setError('ไม่สามารถเชื่อมต่อระบบแชทได้');
            } finally {
                setLoading(false);
            }
        }

        initChat();

        return () => {
            if (channel) {
                channel.unsubscribe();
            }
        };
    }, [user]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !user || !supabaseClient) return;

        setSending(true);
        const msgText = inputText;
        setInputText(''); // optimistic clear
        
        try {
            const { error: insertError } = await supabaseClient
                .from('chat_messages')
                .insert([{
                    user_id: user.id,
                    sender_type: 'parent',
                    message: msgText
                }]);
                
            if (insertError) {
                setInputText(msgText); // rollback
                console.error("Supabase Insert Error (Chat):", JSON.stringify(insertError));
                throw new Error(insertError.message || "Failed to insert");
            }
        } catch (err) {
            console.error(err);
            setError('ส่งข้อความไม่สำเร็จ');
            setInputText(msgText); // rollback
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-100px)] max-h-[800px] p-4 max-w-4xl mx-auto flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-6 w-6 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">แชทถามผู้เชี่ยวชาญ</h1>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg flex gap-3 text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border border-gray-200 bg-white">
                <CardHeader className="bg-primary-50 py-3 px-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            👩‍⚕️
                        </div>
                        <div>
                            <CardTitle className="text-base text-gray-900">เจ้าหน้าที่สาธารณสุข / ผู้เชี่ยวชาญ</CardTitle>
                            <p className="text-xs text-green-600 font-medium">พร้อมให้คำปรึกษา</p>
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                            <MessageCircle className="w-12 h-12 opacity-20" />
                            <p>ยังไม่มีข้อความ เริ่มต้นสอบถามได้เลยครับ/ค่ะ</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isParent = msg.sender_type === 'parent';
                            return (
                                <div key={msg.id || idx} className={`flex ${isParent ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                                        isParent 
                                            ? 'bg-primary-600 text-white rounded-tr-none' 
                                            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                                    }`}>
                                        <div className="text-sm whitespace-pre-wrap word-break" style={{ wordBreak: 'break-word' }}>
                                            {msg.message}
                                        </div>
                                        <div className={`text-[10px] mt-1 text-right ${isParent ? 'text-primary-100' : 'text-gray-400'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>

                <div className="p-3 bg-white border-t border-gray-200 shrink-0">
                    <form onSubmit={handleSendMessage} className="flex gap-2 relative text-black">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="พิมพ์ข้อความสอบถามที่นี่..."
                            className="flex-1 border border-gray-300 rounded-full pl-4 pr-12 py-2.5 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm "
                        />
                        <button 
                            type="submit" 
                            disabled={sending || !inputText.trim()}
                            className="absolute right-1.5 top-1.5 bottom-1.5 w-10 flex items-center justify-center bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 transition-colors"
                        >
                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                        </button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
