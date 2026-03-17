"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Apple, Smile, Brain, Search, ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';

const categories = [
    {
        id: 'nutrition',
        title: 'โภชนาการเด็ก',
        icon: Apple,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        articles: [
            { title: 'อาหารเด็ก 2–5 ปี', content: 'เด็กวัย 2–5 ปี ควรได้รับอาหารหลัก 5 หมู่ครบถ้วน โดยเน้นอาหารที่มีโปรตีน แคลเซียม และธาตุเหล็กสูง เพื่อช่วยในการเจริญเติบโตและพัฒนาการที่ดี' },
            { title: 'เมนูอาหารตามวัย', content: 'เด็กแต่ละช่วงวัยต้องการสารอาหารที่แตกต่างกัน ควรเลือกเมนูที่เหมาะสม เช่น ข้าวต้มผสมไข่ ข้าวสวยกับแกงจืด ผัดผักรวม' },
            { title: 'ภาวะโภชนาการ', content: 'การประเมินภาวะโภชนาการสามารถทำได้โดยการชั่งน้ำหนักและวัดส่วนสูง แล้วนำมาเปรียบเทียบกับเกณฑ์มาตรฐาน' },
            { title: 'ภาวะอ้วน / ภาวะเตี้ย', content: 'ภาวะอ้วนในเด็กเกิดจากการกินอาหารที่มีพลังงานสูงเกินไป ส่วนภาวะเตี้ยอาจเกิดจากการขาดสารอาหารเรื้อรัง' },
            { title: 'อาหารว่างที่เหมาะสม', content: 'ควรเลือกอาหารว่างที่มีคุณค่าทางโภชนาการ เช่น ผลไม้สด นมจืด ถั่ว หลีกเลี่ยงขนมกรุบกรอบและน้ำอัดลม' },
            { title: 'ไอโอดีนในอาหาร', content: 'ไอโอดีนมีความสำคัญต่อพัฒนาการทางสมองของเด็ก ควรใช้เกลือเสริมไอโอดีนในการปรุงอาหาร' },
        ]
    },
    {
        id: 'dental',
        title: 'สุขภาพฟัน',
        icon: Smile,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        articles: [
            { title: 'การแปรงฟันเด็ก', content: 'ควรแปรงฟันให้เด็กวันละ 2 ครั้ง เช้าและก่อนนอน โดยใช้แปรงสีฟันขนาดเล็กที่เหมาะกับเด็ก' },
            { title: 'การใช้ยาสีฟันฟลูออไรด์', content: 'สำหรับเด็กอายุ 2–5 ปี ควรใช้ยาสีฟันที่มีฟลูออไรด์ปริมาณเท่าเมล็ดถั่วเขียว' },
            { title: 'การป้องกันฟันผุ', content: 'ป้องกันฟันผุได้ด้วยการแปรงฟันอย่างถูกวิธี ลดอาหารหวาน และพาเด็กไปพบทันตแพทย์ทุก 6 เดือน' },
            { title: 'การเลิกขวดนม', content: 'ควรหัดให้เด็กเลิกดูดนมจากขวดตั้งแต่อายุ 1 ปีขึ้นไป เพื่อป้องกันฟันผุจากการดูดนมก่อนนอน' },
            { title: 'การพบทันตแพทย์', content: 'ควรพาเด็กไปพบทันตแพทย์ครั้งแรกเมื่อฟันซี่แรกขึ้น และติดตามทุก 6 เดือน' },
        ]
    },
    {
        id: 'development',
        title: 'พัฒนาการเด็ก',
        icon: Brain,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        articles: [
            { title: 'พัฒนาการตามวัย', content: 'เด็กวัย 2–5 ปี ควรมีพัฒนาการครบทั้ง 5 ด้าน ได้แก่ กล้ามเนื้อมัดใหญ่ กล้ามเนื้อมัดเล็ก ภาษา สติปัญญา และสังคม' },
            { title: 'การเล่นเพื่อพัฒนาเด็ก', content: 'การเล่นช่วยส่งเสริมพัฒนาการทุกด้าน ควรจัดกิจกรรมการเล่นที่เหมาะสมกับวัย เช่น ต่อบล็อก ระบายสี วิ่งเล่น' },
            { title: 'การเล่านิทาน', content: 'การอ่านนิทานให้เด็กฟังช่วยพัฒนาทักษะภาษา จินตนาการ และสร้างสายสัมพันธ์ระหว่างพ่อแม่กับลูก' },
            { title: 'การฝึกวินัย', content: 'การฝึกวินัยควรเริ่มตั้งแต่เล็ก โดยใช้วิธีที่เหมาะสม เช่น การตั้งกฎง่ายๆ การชมเชยเมื่อทำดี' },
            { title: 'การจัดการพฤติกรรมเด็ก', content: 'ใช้การเสริมแรงทางบวก เช่น ชมเชย กอด ให้รางวัล แทนการลงโทษที่รุนแรง' },
            { title: 'การใช้สื่อ / โทรศัพท์มือถือ', content: 'เด็กอายุ 2–5 ปี ไม่ควรใช้หน้าจอเกินวันละ 1 ชั่วโมง ควรเลือกเนื้อหาที่เหมาะสมและมีผู้ปกครองดูแล' },
        ]
    }
];

const faqs = [
    { q: 'เด็ก 2–5 ปี ควรกินอาหารอะไรบ้าง?', a: 'ควรกินอาหารหลัก 5 หมู่ครบทุกมื้อ เน้นโปรตีน ผัก ผลไม้ และนมจืด' },
    { q: 'ควรแปรงฟันให้เด็กวันละกี่ครั้ง?', a: 'อย่างน้อยวันละ 2 ครั้ง คือเช้าและก่อนนอน ด้วยยาสีฟันฟลูออไรด์' },
    { q: 'เด็กใช้มือถือได้วันละกี่ชั่วโมง?', a: 'ไม่ควรเกิน 1 ชั่วโมงต่อวัน และควรเลือกเนื้อหาที่เหมาะสม' },
    { q: 'ควรพาเด็กไปพบทันตแพทย์กี่เดือนครั้ง?', a: 'ทุก 6 เดือน หรือเมื่อพบปัญหาในช่องปาก' },
];

export default function KnowledgePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [openCategory, setOpenCategory] = useState<string | null>('nutrition');
    const [openArticle, setOpenArticle] = useState<string | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const filteredCategories = categories.map(cat => ({
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

            {/* Categories */}
            {filteredCategories.map(cat => {
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
                                {cat.articles.map((article, idx) => {
                                    const key = `${cat.id}-${idx}`;
                                    const isArticleOpen = openArticle === key;
                                    return (
                                        <div key={idx} className="border rounded-lg overflow-hidden">
                                            <button onClick={() => setOpenArticle(isArticleOpen ? null : key)}
                                                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 text-left">
                                                <span className="font-medium text-gray-800">{article.title}</span>
                                                {isArticleOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                                            </button>
                                            {isArticleOpen && (
                                                <div className="px-3 pb-3 text-gray-600 text-sm leading-relaxed border-t bg-gray-50 pt-3">
                                                    {article.content}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </CardContent>
                        )}
                    </Card>
                );
            })}

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
