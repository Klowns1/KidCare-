"use client";
import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ChevronDown, PlayCircle, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
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
    { q: 'เด็ก 2–5 ปี ควรกินอาหารอะไรบ้าง?', a: 'ควรกินอาหารหลัก 5 หมู่ครบทุกมื้อ เน้นโปรตีน ผัก ผลไม้ และนมจืดหลีกเลี่ยงขนมหวานและน้ำอัดลม' },
    { q: 'ควรแปรงฟันให้เด็กวันละกี่ครั้ง?', a: 'อย่างน้อยวันละ 2 ครั้ง คือเช้าและก่อนนอน ด้วยยาสีฟันที่มีฟลูออไรด์ 1000 ppm และควรแปรงซ้ำให้เด็กจนถึงอายุ 8 ขวบ' },
    { q: 'เด็กช่วงนี้หนูควรใช้มือถือได้วันละกี่ชั่วโมง?', a: 'ไม่ควรเกิน 1 ชั่วโมงต่อวัน และควรเลือกเนื้อหาที่เหมาะสม พ่อแม่ควรดูร่วมกับลูกเพื่อสอนด้วย' },
    { q: 'ควรพาเด็กไปพบทันตแพทย์กี่เดือนครั้ง?', a: 'ทุก 6 เดือน หรือเมื่อพบรอยขาวขุ่นหรือสเตนบนฟัน ซึ่งเป็นสัญญาณแรกของฟันผุ' },
];

export default function KnowledgePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('ทั้งหมด');
    
    // For reading full article
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    // FAQ state
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

    // Get unique categories for the horizontal filter chips
    const categoriesSet = new Set<string>();
    articles.forEach(a => {
        if (a.category) categoriesSet.add(a.category);
    });
    
    // Default categories that should always be visible
    const predefinedCategories = ['ทั้งหมด', 'โภชนาการ', 'สุขภาพฟัน', 'พัฒนาการ', 'ทั่วไป'];
    // Merge DB categories with predefined (deduplicating)
    predefinedCategories.forEach(c => categoriesSet.delete(c));
    const categories = [...predefinedCategories, ...Array.from(categoriesSet)];

    // Apply filters
    const filteredArticles = articles.filter(a => {
        const matchesCategory = activeCategory === 'ทั้งหมด' || (a.category || 'ทั่วไป') === activeCategory;
        const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              a.content.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });



    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
            
            {/* Header */}
            <div className="text-center mb-6 pt-4">
                <div className="inline-flex items-center justify-center p-4 bg-amber-100 rounded-full mb-3">
                    <BookOpen className="h-7 w-7 text-amber-600" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">คลังความรู้คุณแม่</h1>
                <p className="text-gray-500 text-sm mt-2 flex items-center justify-center gap-1">
                    เคล็ดลับดีๆ เพื่อลูกรัก
                </p>
            </div>

            {/* Smart Search */}
            <div className="relative sticky top-4 z-10 transition-all shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 sm:py-5 border-0 rounded-2xl bg-white focus:ring-4 focus:ring-amber-500/20 text-gray-900 text-base sm:text-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] outline-none font-medium transition-all"
                    placeholder="หาเรื่องอะไรอยู่คะ? (เช่น อาหาร, แปรงฟัน)" 
                />
            </div>

            {/* Category Chips Scroll */}
            {!loading && (
                <div className="flex gap-2 overflow-x-auto pb-4 pt-2 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm sm:text-base border-2 transition-all active:scale-[0.95] ${
                                activeCategory === cat 
                                ? 'bg-amber-100 border-amber-500 text-amber-800 shadow-sm' 
                                : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Main Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-amber-500 mb-4" />
                    <p className="text-gray-500 font-medium">รอสักครู่ กำลังดึงข้อมูลดีๆ มาให้ค่ะ...</p>
                </div>
            ) : filteredArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-bold mb-1">ไม่พบบทความที่ค้นหา</p>
                    <p className="text-sm text-gray-400">ลองเปลี่ยนคำค้นหาดูนะคะ</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {filteredArticles.map(article => (
                        <div key={article.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                            
                            {/* Rich Image Header */}
                            {article.image_url ? (
                                <div className="h-48 sm:h-56 w-full relative bg-gray-100">
                                    <Image 
                                        src={article.image_url} 
                                        alt={article.title} 
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover" 
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-700 shadow-sm flex items-center gap-1">
                                        {article.category || 'ทั่วไป'}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-2 w-full bg-gradient-to-r from-amber-300 to-orange-400" />
                            )}

                            {/* Card Body */}
                            <div className="p-5 sm:p-7">
                                {!article.image_url && (
                                    <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-3">
                                        {article.category || 'ทั่วไป'}
                                    </span>
                                )}
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 leading-snug">
                                    {article.title}
                                </h3>
                                
                                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-5">
                                    {article.content}
                                </p>

                                <button 
                                    onClick={() => setSelectedArticle(article)}
                                    className="w-full py-3.5 sm:py-4 bg-gray-50 text-amber-700 font-bold rounded-2xl border border-gray-100 hover:bg-amber-50 active:scale-[0.98] transition-all"
                                >
                                    อ่านเนื้อหาเต็ม
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Video Placeholder */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-[2rem] p-6 border border-red-100 flex items-center gap-5 mt-10">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm relative">
                    <PlayCircle className="h-8 w-8 text-red-500" />
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse border-2 border-white">
                        NEW
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl">วิดีโอสอนการเลี้ยงดู</h3>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">เร็วๆ นี้ จะมีวิดีโอเคล็ดลับเด็ดๆ มาให้ชมค่ะ</p>
                </div>
            </div>

            {/* FAQ Accordion */}
            <div className="mt-10 mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-900 px-2">
                    คุณแม่มักจะถามว่า... (FAQ)
                </h3>
                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <button 
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                            >
                                <span className={`font-bold text-base pr-4 leading-snug ${openFaq === idx ? 'text-amber-700' : 'text-gray-800'}`}>
                                    {faq.q}
                                </span>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform ${openFaq === idx ? 'bg-amber-100 text-amber-700 rotate-180' : 'bg-gray-50 text-gray-400'}`}>
                                    <ChevronDown className="h-5 w-5" />
                                </div>
                            </button>
                            {openFaq === idx && (
                                <div className="p-5 pt-0 border-t border-gray-50 bg-amber-50/30">
                                    <p className="text-gray-700 leading-relaxed pt-4 text-sm sm:text-base">
                                        {faq.a}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Full Article Modal */}
            {selectedArticle && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
                    <div 
                        className="bg-white w-full max-w-2xl sm:rounded-3xl rounded-t-3xl h-[90vh] sm:h-[85vh] flex flex-col overflow-hidden animate-slide-up"
                    >
                        {/* Header Image if exists */}
                        <div className="relative flex-shrink-0">
                            {selectedArticle.image_url ? (
                                <div className="w-full h-48 sm:h-64 relative">
                                    <Image src={selectedArticle.image_url} fill sizes="(max-width: 768px) 100vw, 80vw" className="object-cover" alt={selectedArticle.title} />
                                </div>
                            ) : (
                                <div className="w-full h-24 bg-gradient-to-r from-amber-400 to-orange-500" />
                            )}
                            <button 
                                onClick={() => setSelectedArticle(null)}
                                className="absolute top-4 right-4 h-10 w-10 bg-black/30 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-black/50 transition-colors border border-white/20"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {/* Content Scrollable area */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-bold mb-4">
                                {selectedArticle.category || 'ทั่วไป'}
                            </span>
                            
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 leading-tight">
                                {selectedArticle.title}
                            </h2>
                            
                            <div className="prose prose-amber max-w-none prose-p:leading-loose prose-p:text-gray-700 prose-img:rounded-2xl whitespace-pre-wrap text-base sm:text-lg">
                                {selectedArticle.content}
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
                            <button 
                                onClick={() => setSelectedArticle(null)}
                                className="w-full py-4 bg-gray-100 text-gray-800 font-bold rounded-2xl hover:bg-gray-200 active:scale-[0.98] transition-all"
                            >
                                ปิดหน้าต่างนี้
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
