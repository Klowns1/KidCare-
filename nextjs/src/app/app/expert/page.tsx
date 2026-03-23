"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageCircle, Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, Send, Loader2, FileText, User, BookOpen, Plus, Trash2, Edit, Save } from 'lucide-react';
import { getChatUsers, getMessagesForUser, sendExpertMessage, getAllAppointments, updateAppointmentStatus, getAllArticles, createArticle, updateArticle, deleteArticle } from './actions';

export default function ExpertPortalPage() {
    const [activeTab, setActiveTab] = useState<'chats' | 'appointments' | 'knowledge'>('chats');

    // Chat states
    const [chatUsers, setChatUsers] = useState<string[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Appointment states
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [appointments, setAppointments] = useState<any[]>([]);

    // Knowledge Base states
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [articles, setArticles] = useState<any[]>([]);
    const [showArticleForm, setShowArticleForm] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingArticle, setEditingArticle] = useState<any>(null);
    const [articleForm, setArticleForm] = useState({ title: '', content: '', category: '', imageUrl: '' });

    const [loading, setLoading] = useState(true);

    // Initial load
    useEffect(() => {
        refreshData();
        // Simple polling every 5 seconds for real-time feel without WebSockets
        const interval = setInterval(() => {
            refreshData(false);
        }, 5000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUserId, activeTab]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function refreshData(showLoader = true) {
        if (showLoader) setLoading(true);
        try {
            if (activeTab === 'chats') {
                const users = await getChatUsers();
                setChatUsers(users);
                if (selectedUserId) {
                    const msgs = await getMessagesForUser(selectedUserId);
                    setMessages(msgs);
                }
            } else if (activeTab === 'appointments') {
                const apps = await getAllAppointments();
                setAppointments(apps);
            } else if (activeTab === 'knowledge') {
                const arts = await getAllArticles();
                setArticles(arts);
            }
        } catch (err) {
            console.error(err);
        } finally {
            if (showLoader) setLoading(false);
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedUserId) return;

        setSending(true);
        const msgText = inputText;
        setInputText('');

        try {
            await sendExpertMessage(selectedUserId, msgText);
            // manually append to avoid waiting for polling
            setMessages(prev => [...prev, {
                id: Date.now(),
                user_id: selectedUserId,
                sender_type: 'expert',
                message: msgText,
                created_at: new Date().toISOString()
            }]);
        } catch (err) {
            console.error(err);
            setInputText(msgText);
        } finally {
            setSending(false);
        }
    };

    const handleUpdateAppointment = async (id: string, status: string) => {
        try {
            await updateAppointmentStatus(id, status);
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            if (editingArticle) {
                await updateArticle(editingArticle.id, articleForm.title, articleForm.content, articleForm.category, articleForm.imageUrl);
            } else {
                await createArticle(articleForm.title, articleForm.content, articleForm.category, articleForm.imageUrl);
            }
            setShowArticleForm(false);
            setEditingArticle(null);
            setArticleForm({ title: '', content: '', category: '', imageUrl: '' });
            refreshData(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    const handleDeleteArticle = async (id: string) => {
        if (!confirm('ยืนยันการลบบทความนี้?')) return;
        try {
            await deleteArticle(id);
            refreshData(false);
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1"><Clock className="w-3 h-3"/> รอการยืนยัน</span>;
            case 'confirmed': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> ยืนยันแล้ว</span>;
            case 'cancelled': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1"><XCircle className="w-3 h-3"/> ยกเลิก</span>;
            case 'completed': return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> เสร็จสิ้น</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6 p-6 max-w-6xl mx-auto h-[100vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-600 text-white p-2 rounded-lg">
                        👩‍⚕️
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">KidCare Backoffice (หน้าของเจ้าหน้าที่)</h1>
                </div>
            </div>

            <div className="flex gap-2 shrink-0 border-b border-gray-200 pb-2">
                <button 
                    onClick={() => setActiveTab('chats')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'chats' ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <MessageCircle className="w-5 h-5 inline mr-2" />
                    ตอบแชทผู้ปกครอง
                </button>
                <button 
                    onClick={() => setActiveTab('appointments')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'appointments' ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <CalendarIcon className="w-5 h-5 inline mr-2" />
                    ดูรายการนัดหมาย
                </button>
                <button 
                    onClick={() => setActiveTab('knowledge')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'knowledge' ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <BookOpen className="w-5 h-5 inline mr-2" />
                    คลังความรู้
                </button>
            </div>

            {loading && !chatUsers.length && !appointments.length ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            ) : activeTab === 'chats' ? (
                <div className="flex-1 flex gap-4 min-h-0">
                    {/* User List */}
                    <Card className="w-1/3 flex flex-col overflow-hidden">
                        <CardHeader className="bg-gray-50 py-3 px-4 border-b shrink-0">
                            <CardTitle className="text-sm">ผู้ปกครองที่รอพูดคุย</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-0">
                            {chatUsers.length === 0 ? (
                                <div className="p-4 text-center text-sm text-gray-500">ไม่มีผู้ใช้ติดต่อมา</div>
                            ) : (
                                chatUsers.map(uid => (
                                    <button 
                                        key={uid}
                                        onClick={() => setSelectedUserId(uid)}
                                        className={`w-full text-left p-4 border-b transition-colors flex items-center gap-3 ${selectedUserId === uid ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="font-medium text-gray-900 truncate">User: {uid.slice(0, 8)}...</div>
                                            <div className="text-xs text-gray-500 truncate mt-0.5">คลิกเพื่อดูแชท</div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Chat Area */}
                    <Card className="flex-1 flex flex-col overflow-hidden">
                        {selectedUserId ? (
                            <>
                                <CardHeader className="bg-white py-3 px-4 border-b shrink-0 shadow-sm z-10">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <User className="w-5 h-5 text-gray-400" />
                                        สนทนากับ User: {selectedUserId.slice(0, 8)}...
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
                                    {messages.map((msg, idx) => {
                                        const isExpert = msg.sender_type === 'expert';
                                        return (
                                            <div key={msg.id || idx} className={`flex ${isExpert ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                                                    isExpert 
                                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                                                }`}>
                                                    <div className="text-sm whitespace-pre-wrap word-break" style={{ wordBreak: 'break-word' }}>
                                                        {msg.message}
                                                    </div>
                                                    <div className={`text-[10px] mt-1 text-right ${isExpert ? 'text-blue-100' : 'text-gray-400'}`}>
                                                        {new Date(msg.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div ref={messagesEndRef} />
                                </CardContent>
                                <div className="p-3 bg-white border-t border-gray-200 shrink-0">
                                    <form onSubmit={handleSendMessage} className="flex gap-2 relative text-black">
                                        <input
                                            type="text"
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder="พิมพ์ข้อความตอบกลับที่นี่..."
                                            className="flex-1 border border-gray-300 rounded-full pl-4 pr-12 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm "
                                        />
                                        <button 
                                            type="submit" 
                                            disabled={sending || !inputText.trim()}
                                            className="absolute right-1.5 top-1.5 bottom-1.5 w-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                        >
                                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <MessageCircle className="w-16 h-16 opacity-20 mb-4" />
                                <p>เลือกผู้ใช้งานทางด้านซ้ายเพื่อดูข้อความและตอบกลับ</p>
                            </div>
                        )}
                    </Card>
                </div>
            ) : activeTab === 'appointments' ? (
                <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pb-12">
                     {appointments.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-gray-500 flex flex-col items-center">
                                <CalendarIcon className="w-12 h-12 text-gray-300 mb-3" />
                                ยังไม่มีคิวนัดหมายจากผู้ปกครอง
                            </CardContent>
                        </Card>
                    ) : (
                        appointments.map(app => (
                            <Card key={app.id} className="overflow-hidden">
                                <div className={`border-l-4 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${app.status === 'pending' ? 'border-l-yellow-400 bg-yellow-50/20' : app.status === 'confirmed' ? 'border-l-green-400' : 'border-l-gray-300'}`}>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium text-gray-900">
                                                {new Date(app.appointment_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                            <Clock className="w-4 h-4 text-gray-500 md:ml-2" />
                                            <span className="text-sm font-medium text-gray-700">{app.appointment_time.slice(0,5)} น.</span>
                                            <span className="md:ml-4 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">User: {app.user_id.slice(0, 8)}...</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-sm text-gray-800 bg-white p-2 rounded border border-gray-100 shadow-sm w-fit min-w-[300px]">
                                            <FileText className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                                            <p><span className="font-semibold mr-1">เหตุผล:</span> {app.reason}</p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex flex-col md:items-end justify-center w-full md:w-auto h-full gap-3">
                                        <div className="self-start md:self-end">
                                            {getStatusBadge(app.status)}
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                                            {app.status === 'pending' && (
                                                <button onClick={() => handleUpdateAppointment(app.id, 'confirmed')} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition">
                                                    ยืนยันคิว
                                                </button>
                                            )}
                                            {app.status !== 'cancelled' && app.status !== 'completed' && (
                                                <button onClick={() => handleUpdateAppointment(app.id, 'cancelled')} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs rounded-md hover:bg-red-200 transition">
                                                    ยกเลิกคิว
                                                </button>
                                            )}
                                            {app.status === 'confirmed' && (
                                                <button onClick={() => handleUpdateAppointment(app.id, 'completed')} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition">
                                                    นัดหมายเสร็จสิ้นแล้ว
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto min-h-0 pb-12 pr-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">จัดการบทความคลังความรู้</h2>
                        <button 
                            onClick={() => {
                                setEditingArticle(null);
                                setArticleForm({ title: '', content: '', category: '', imageUrl: '' });
                                setShowArticleForm(true);
                            }}
                            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                        >
                            <Plus className="w-4 h-4" /> เพิ่มบทความใหม่
                        </button>
                    </div>

                    {showArticleForm && (
                        <Card className="mb-6 border-primary-200 shadow-md">
                            <form onSubmit={handleSaveArticle}>
                                <CardHeader className="bg-primary-50 py-3 border-b">
                                    <CardTitle className="text-base text-primary-800">
                                        {editingArticle ? 'แก้ไขบทความ' : 'เพิ่มบทความใหม่'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4 text-black">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้อบทความ <span className="text-red-500">*</span></label>
                                        <input required type="text" value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                                            <input type="text" value={articleForm.category} onChange={e => setArticleForm({...articleForm, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 bg-white" placeholder="เช่น โภชนาการ, พัฒนาการ" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพหน้าปก (ถ้ามี)</label>
                                            <input type="url" value={articleForm.imageUrl} onChange={e => setArticleForm({...articleForm, imageUrl: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 bg-white" placeholder="https://..." />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">เนื้อหา <span className="text-red-500">*</span></label>
                                        <textarea required rows={8} value={articleForm.content} onChange={e => setArticleForm({...articleForm, content: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-white p-3 leading-relaxed"></textarea>
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button type="button" onClick={() => setShowArticleForm(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">ยกเลิก</button>
                                        <button type="submit" disabled={sending} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-70">
                                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            บันทึก
                                        </button>
                                    </div>
                                </CardContent>
                            </form>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((art) => (
                            <Card key={art.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 group bg-white border-0 shadow-sm ring-1 ring-gray-200">
                                {art.image_url ? (
                                    <div className="h-48 w-full overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                        <img src={art.image_url} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        {art.category && (
                                            <span className="absolute top-3 right-3 bg-white/95 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                                                {art.category}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    art.category && (
                                        <div className="px-5 pt-5 pb-0">
                                            <span className="inline-block bg-primary-50 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-primary-100">
                                                {art.category}
                                            </span>
                                        </div>
                                    )
                                )}
                                
                                <CardContent className="p-5 flex-1 flex flex-col pt-4">
                                    <div className="flex items-center text-xs text-gray-400 mb-3">
                                        <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
                                        {new Date(art.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
                                        {art.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-3 flex-1 leading-relaxed">
                                        {art.content}
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-5 pt-4 border-t border-gray-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => {
                                            setEditingArticle(art);
                                            setArticleForm({ title: art.title, content: art.content, category: art.category || '', imageUrl: art.image_url || '' });
                                            setShowArticleForm(true);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                                            <Edit className="w-3.5 h-3.5" /> แก้ไข
                                        </button>
                                        <button onClick={() => handleDeleteArticle(art.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" /> ลบ
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {articles.length === 0 && !showArticleForm && (
                        <div className="py-20 flex flex-col items-center justify-center text-gray-500 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                            <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">ยังไม่มีบทความในคลังความรู้</h3>
                            <p className="text-sm text-gray-500 mb-6">เริ่มเพิ่มบทความใหม่เพื่อให้ความรู้แก่ผู้ปกครอง</p>
                            <button 
                                onClick={() => setShowArticleForm(true)}
                                className="flex items-center gap-2 bg-white text-primary-600 border border-primary-200 shadow-sm px-5 py-2.5 rounded-lg hover:bg-primary-50 transition font-medium"
                            >
                                <Plus className="w-4 h-4" /> สร้างบทความแรก
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
