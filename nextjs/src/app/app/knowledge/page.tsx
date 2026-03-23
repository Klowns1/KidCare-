"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Apple, Smile, Brain, Search, ChevronDown, ChevronUp, PlayCircle, Loader2 } from 'lucide-react';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';

interface Article {
    id: string;
    title: string;
    content: string;
    category: string;
    image_url: string;
    created_at: string;
}

const faqs = [
    { q: 'เด็ก 2–5 ปี ควรกินอาหารอะไรบ้าง?', a: 'ควรกินอาหารหลัก 5 หมู่ครบทุกมื้อ เน้นโปรตีน ผัก ผลไม้ และนมจืด' },
    { q: 'ควรแปรงฟันให้เด็กวันละกี่ครั้ง?', a: 'อย่างน้อยวันละ 2 ครั้ง คือเช้าและก่อนนอน ด้วยยาสีฟันฟลูออไรด์' },
    { q: 'เด็กใช้มือถือได้วันละกี่ชั่วโมง?', a: 'ไม่ควรเกิน 1 ชั่วโมงต่อวัน และควรเลือกเนื้อหาที่เหมาะสม' },
    { q: 'ควรพาเด็กไปพบทันตแพทย์กี่เดือนครั้ง?', a: 'ทุก 6 เดือน หรือเมื่อพบปัญหาในช่องปาก' },
];

export default function KnowledgePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [openCategory, setOpenCategory] = useState<string | null>(null);
    const [openArticle, setOpenArticle] = useState<string | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchArticles() {
            try {
                const supabaseWrapper = await createSPASassClient();
                const supabase = supabaseWrapper.getSupabaseClient();
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .order('created_at', { ascending: false });
                    
                if (error) throw error;
                setArticles(data || []);
            } catch (err) {
                console.error("Error fetching articles:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchArticles();
    }, []);

    // Group articles by category
    const groupedArticles = articles.reduce((acc, article) => {
        const cat = article.category || 'ทั่วไป';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(article);
        return acc;
    }, {} as Record<string, Article[]>);

    const categoriesList = Object.keys(groupedArticles).map(catName => {
        let icon = BookOpen;
        let color = 'text-gray-600';
        let bgColor = 'bg-gray-50';
        let borderColor = 'border-gray-200';
        
        // mapping common categories based on previous mock data
        if (catName.includes('โภชนาการ') || catName.includes('อาหาร')) {
            icon = Apple; color = 'text-orange-600'; bgColor = 'bg-orange-50'; borderColor = 'border-orange-200';
        } else if (catName.includes('ฟัน') || catName.includes('สุขภาพ')) {
            icon = Smile; color = 'text-blue-600'; bgColor = 'bg-blue-50'; borderColor = 'border-blue-200';
        } else if (catName.includes('พัฒนาการ') || catName.includes('สมอง')) {
            icon = Brain; color = 'text-purple-600'; bgColor = 'bg-purple-50'; borderColor = 'border-purple-200';
        }

        return {
            id: catName,
            title: catName,
            icon,
            color, bgColor, borderColor,
            articles: groupedArticles[catName]
        };
    });

    const filteredCategories = categoriesList.map(cat => ({
        ...cat,
        articles: cat.articles.filter(a =>
            a.title.includes(searchTerm) || a.content.includes(searchTerm)
        )
    })).filter(cat => cat.articles.length > 0 || searchTerm === '');

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-3">
                <BookOpen className="h-7 w-7 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">คลังความรู้</h1>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="ค้นหาความรู้... เช่น อาหารเด็ก, แปรงฟัน, พัฒนาการ" />
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="text-center p-12 text-gray-500 bg-gray-50 rounded-lg">
                    {searchTerm ? 'ไม่พบบทความที่ค้นหา' : 'ยังไม่มีบทความในคลังความรู้'}
                </div>
            ) : (
                /* Categories */
                filteredCategories.map(cat => {
                    const Icon = cat.icon;
                    const isOpen = openCategory === cat.id;
                    return (
                        <Card key={cat.id} className={`border ${cat.borderColor}`}>
                            <CardHeader className={`cursor-pointer ${cat.bgColor} rounded-t-lg`} onClick={() => setOpenCategory(isOpen ? null : cat.id)}>
                                <CardTitle className="flex items-center justify-between">
                                    <span className={`flex items-center gap-2 ${cat.color}`}>
                                        <Icon className="h-5 w-5" /> {cat.title}
                                        <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-500">{cat.articles.length} บทความ</span>
                                    </span>
                                    {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                                </CardTitle>
                            </CardHeader>
                            {isOpen && (
                                <CardContent className="pt-4 space-y-2">
                                    {cat.articles.map((article) => {
                                        const key = article.id;
                                        const isArticleOpen = openArticle === key;
                                        return (
                                            <div key={article.id} className="border rounded-lg overflow-hidden">
                                                <button onClick={() => setOpenArticle(isArticleOpen ? null : key)}
                                                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 text-left">
                                                    <div className="flex items-center gap-3">
                                                        {article.image_url && (
                                                            <div className="w-12 h-12 rounded overflow-hidden shrink-0 bg-gray-100 hidden sm:block">
                                                                <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
                                                        <span className="font-medium text-gray-800">{article.title}</span>
                                                    </div>
                                                    {isArticleOpen ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                                                </button>
                                                {isArticleOpen && (
                                                    <div className="px-3 pb-3 text-gray-600 text-sm leading-relaxed border-t bg-gray-50 pt-3 flex flex-col gap-3">
                                                        {article.image_url && (
                                                            <div className="w-full max-w-sm rounded-lg overflow-hidden sm:hidden">
                                                                <img src={article.image_url} alt={article.title} className="w-full h-auto object-cover" />
                                                            </div>
                                                        )}
                                                        <div className="whitespace-pre-wrap">{article.content}</div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            )}
                        </Card>
                    );
                })
            )}

            {/* Video Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-red-500" /> วิดีโอสอน
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500 text-sm">เร็วๆ นี้จะมีวิดีโอความรู้ด้านสุขภาพเด็กให้รับชม</p>
                </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
                <CardHeader>
                    <CardTitle>❓ คำถามที่พบบ่อย (FAQ)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border rounded-lg">
                            <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 text-left">
                                <span className="font-medium text-gray-800 text-sm">{faq.q}</span>
                                {openFaq === idx ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                            {openFaq === idx && (
                                <div className="px-3 pb-3 text-gray-600 text-sm border-t bg-gray-50 pt-2">{faq.a}</div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
