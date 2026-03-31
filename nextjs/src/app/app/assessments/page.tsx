"use client";
import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle2, Loader2, AlertCircle, ArrowRight, RefreshCcw, Star } from 'lucide-react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';

const domains = [
    {
        id: 'access_info',
        title: '1. การเข้าถึงข้อมูล',
        questions: [
            'ค้นหาข้อมูลสุขภาพเด็กจากแหล่งต่างๆ ได้',
            'รู้ว่าจะหาข้อมูลอาหารเด็กได้จากที่ไหน',
            'เข้าถึงบริการสุขภาพเด็กได้สะดวก',
        ]
    },
    {
        id: 'knowledge',
        title: '2. ความรู้ความเข้าใจ',
        questions: [
            'เข้าใจข้อมูลโภชนาการสำหรับเด็ก 2–5 ปี',
            'เข้าใจวิธีดูแลสุขภาพฟันของเด็ก',
            'เข้าใจพัฒนาการตามวัยของเด็ก',
        ]
    },
    {
        id: 'communication',
        title: '3. ทักษะการสื่อสาร',
        questions: [
            'สื่อสารกับหมอ/พยาบาลเรื่องลูกได้',
            'อธิบายอาการเจ็บป่วยของลูกให้หมอฟังได้',
            'กล้าสอบถามข้อสงสัยจากเจ้าหน้าที่',
        ]
    },
    {
        id: 'media_literacy',
        title: '4. การรู้เท่าทันสื่อ',
        questions: [
            'แยกแยะข้อมูลสุขภาพที่ถูกต้องจากเน็ตได้',
            'ประเมินความน่าเชือถือของข้อมูลได้',
            'ไม่หลงเชื่อข้อมูลที่ไม่มีแหล่งอ้างอิงชัดเจน',
        ]
    },
    {
        id: 'decision_making',
        title: '5. การตัดสินใจ',
        questions: [
            'ตัดสินใจเลือกอาหารที่เหมาะสมให้ลูกได้',
            'รู้ว่าตอนไหนควรตัดสินใจพาลูกไปหาหมอ',
            'เลือกกิจกรรมที่ช่วยส่งเสริมพัฒนาการลูกได้',
        ]
    },
    {
        id: 'care_management',
        title: '6. การจัดการการเลี้ยงดู',
        questions: [
            'จัดอาหาร 3 มื้อที่มีประโยชน์ให้ลูกได้',
            'ดูแลการแปรงฟันลูกได้อย่างถูกต้อง',
            'มีเวลาจัดกิจกรรมส่งเสริมพัฒนาการลูก',
        ]
    },
];

const scoreLabels = [
    { label: 'น้อยที่สุด', emoji: '😥', score: 1 },
    { label: 'น้อย', emoji: '😟', score: 2 },
    { label: 'ปานกลาง', emoji: '😐', score: 3 },
    { label: 'มาก', emoji: '🙂', score: 4 },
    { label: 'มากที่สุด', emoji: '😁', score: 5 },
];

function getLiteracyLevel(total: number, max: number) {
    const pct = (total / max) * 100;
    if (pct >= 80) return { level: 'ดีมาก', color: 'text-green-600', bg: 'bg-green-100', rec: 'คุณมีความรอบรู้ด้านสุขภาพดีเยี่ยม! ข้อมูลนี้จะช่วยให้ลูกน้อยเติบโตอย่างสมบูรณ์ รักษามาตรฐานนี้ต่อไปนะคะ' };
    if (pct >= 60) return { level: 'ดี', color: 'text-blue-600', bg: 'bg-blue-100', rec: 'คุณทำได้ดีมากค่ะ! แต่ยังมีบางเรื่องที่สามารถเข้าไปศึกษาเพิ่มเติมใน "คลังความรู้" ได้' };
    if (pct >= 40) return { level: 'ปานกลาง', color: 'text-orange-600', bg: 'bg-orange-100', rec: 'แนะนำให้เข้าไปศึกษาบทความใน "คลังความรู้" เพิ่มเติม เพื่อความมั่นใจในการดูแลลูกยิ่งขึ้นค่ะ' };
    return { level: 'ควรปรับปรุง', color: 'text-red-600', bg: 'bg-red-100', rec: 'ไม่ต้องกังวลนะคะ แนะนำให้อ่านบทความในแอปอย่างสม่ำเสมอ หรือสอบถามเจ้าหน้าที่เพื่อรับคำแนะนำได้เลยค่ะ' };
}

export default function AssessmentsPage() {
    const { user } = useGlobal();
    const [testType, setTestType] = useState<'pre' | 'post'>('pre');
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);
    
    // UI State
    const [activeDomainIdx, setActiveDomainIdx] = useState(0); 

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [pastResult, setPastResult] = useState<any>(null);

    const totalQuestions = domains.reduce((sum, d) => sum + d.questions.length, 0);
    const maxScore = totalQuestions * 5;

    useEffect(() => {
        if (!user) return;
        
        async function checkPastTest() {
            setLoading(true);
            setPastResult(null);
            setError('');
            setActiveDomainIdx(0);
            try {
                const supabaseWrapper = await createSPASassClient();
                const supabase = supabaseWrapper.getSupabaseClient();
                
                const { data, error: fetchError } = await supabase
                    .from('assessment_results')
                    .select('*')
                    .eq('user_id', user!.id)
                    .eq('test_type', testType)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();
                    
                if (fetchError) throw fetchError;
                
                if (data) {
                    setPastResult(data);
                    setSubmitted(true);
                } else {
                    setSubmitted(false);
                }
            } catch (err: unknown) {
                console.error(err);
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูลแบบประเมิน");
            } finally {
                setLoading(false);
            }
        }
        
        checkPastTest();
    }, [user, testType]);

    const handleAnswer = (domainId: string, qIdx: number, score: number) => {
        setAnswers({ ...answers, [`${domainId}_${qIdx}`]: score });
    };

    const currentTotalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
    const displayScore = pastResult ? pastResult.total_score : currentTotalScore;
    const displayMaxScore = maxScore;
    const result = getLiteracyLevel(displayScore, displayMaxScore);

    const isAllAnswered = Object.keys(answers).length === totalQuestions;
    const currentDomain = domains[activeDomainIdx];
    
    // Check if current domain is fully answered
    const isCurrentDomainComplete = currentDomain.questions.every((_, qIdx) => answers[`${currentDomain.id}_${qIdx}`] !== undefined);

    const handleNextDomain = () => {
        if (activeDomainIdx < domains.length - 1) {
            setActiveDomainIdx(activeDomainIdx + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevDomain = () => {
        if (activeDomainIdx > 0) {
            setActiveDomainIdx(activeDomainIdx - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async () => {
        if (!user || !isAllAnswered) return;
        
        setSaving(true);
        setError('');
        
        try {
            const supabaseWrapper = await createSPASassClient();
            const supabase = supabaseWrapper.getSupabaseClient();
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const payload: any = {
                user_id: user.id,
                test_type: testType,
                total_score: currentTotalScore,
                literacy_level: result.level,
                recommendations: result.rec,
            };
            
            domains.forEach(d => {
                let sum = 0;
                d.questions.forEach((_, i) => { sum += answers[`${d.id}_${i}`] || 0; });
                payload[`score_${d.id}`] = sum;
            });
            
            const { data, error: insertError } = await supabase
                .from('assessment_results')
                .insert([payload])
                .select()
                .maybeSingle();
                
            if (insertError) throw insertError;
            
            setPastResult(data);
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: unknown) {
            console.error(err);
            setError("เกิดข้อผิดพลาดในการส่งแบบประเมิน");
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setAnswers({});
        setPastResult(null);
        setSubmitted(false);
        setActiveDomainIdx(0);
    };

    if (loading) {
        return (
            <div className="flex flex-col h-[50vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-3" />
                <p className="text-gray-500 font-medium">กำลังโหลดแบบประเมิน...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-3">
                    <ClipboardList className="h-7 w-7 text-purple-700" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">แบบประเมินความรอบรู้</h1>
                <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">ช่วยให้เรารู้ว่าคุณเข้าใจการดูแลลูกมากน้อยแค่ไหน เพื่อแนะนำข้อมูลได้ตรงจุด</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-3 shadow-sm">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Test Type Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-2xl">
                <button 
                    onClick={() => { setTestType('pre'); handleReset(); }}
                    className={`flex-1 flex justify-center items-center py-3.5 rounded-xl font-bold transition-all ${
                        testType === 'pre' 
                        ? 'bg-white shadow-sm text-purple-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    📝 ทำก่อนเริ่มใช้แอป
                </button>
                <button 
                    onClick={() => { setTestType('post'); handleReset(); }}
                    className={`flex-1 flex justify-center items-center py-3.5 rounded-xl font-bold transition-all ${
                        testType === 'post' 
                        ? 'bg-white shadow-sm text-purple-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    🏆 ทบทวนหลังใช้แอป
                </button>
            </div>

            {!submitted ? (
                /* ---------------- ASSESSMENT WIZARD ---------------- */
                <div className="animate-fade-in">
                    
                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-sm font-bold text-gray-500">ส่วนที่ {activeDomainIdx + 1} จาก {domains.length}</span>
                            <span className="text-sm font-bold text-purple-600 border border-purple-200 bg-purple-50 px-2 py-1 rounded-lg">
                                ความคืบหน้า {Math.round((Object.keys(answers).length / totalQuestions) * 100)}%
                            </span>
                        </div>
                        <div className="flex gap-1 h-2">
                            {domains.map((_, idx) => (
                                <div key={idx} className={`flex-1 rounded-full transition-all duration-300 ${
                                    idx < activeDomainIdx ? 'bg-purple-500' : 
                                    idx === activeDomainIdx ? 'bg-purple-400' : 'bg-gray-200'
                                }`} />
                            ))}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                        <div className="bg-purple-50 px-6 py-5 border-b border-purple-100">
                            <h2 className="text-xl font-bold text-purple-900">{currentDomain.title}</h2>
                        </div>
                        
                        <div className="p-4 sm:p-6 space-y-6">
                            {currentDomain.questions.map((q, qIdx) => (
                                <div key={qIdx} className="bg-gray-50/50 rounded-2xl p-4 sm:p-5 border border-gray-100">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
                                        ข้อ {qIdx + 1}. {q}
                                    </h3>
                                    
                                    <div className="grid grid-cols-5 gap-1 sm:gap-2">
                                        {scoreLabels.map((item) => {
                                            const isSelected = answers[`${currentDomain.id}_${qIdx}`] === item.score;
                                            return (
                                                <button 
                                                    key={item.score}
                                                    onClick={() => handleAnswer(currentDomain.id, qIdx, item.score)}
                                                    className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all active:scale-[0.95] ${
                                                        isSelected 
                                                        ? 'bg-purple-50 border-purple-500 shadow-sm' 
                                                        : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
                                                    }`}
                                                >
                                                    <span className={`text-2xl sm:text-3xl mb-1 ${isSelected ? 'scale-110' : 'grayscale-[50%] opacity-70'} transition-transform`}>
                                                        {item.emoji}
                                                    </span>
                                                    <span className={`text-[10px] sm:text-xs font-semibold text-center leading-tight ${
                                                        isSelected ? 'text-purple-700' : 'text-gray-500'
                                                    }`}>
                                                        {item.label}
                                                    </span>
                                                    
                                                    {isSelected && (
                                                        <div className="absolute -top-1.5 -right-1.5 bg-purple-500 rounded-full">
                                                            <CheckCircle2 className="h-4 w-4 text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        {activeDomainIdx > 0 && (
                            <button 
                                onClick={handlePrevDomain}
                                className="flex-1 py-4 px-6 rounded-2xl font-bold text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all"
                            >
                                ย้อนกลับ
                            </button>
                        )}
                        
                        {activeDomainIdx < domains.length - 1 ? (
                            <button 
                                onClick={handleNextDomain}
                                disabled={!isCurrentDomainComplete}
                                className="flex-[2] flex justify-center items-center py-4 px-6 rounded-2xl font-bold text-white bg-purple-600 border-2 border-purple-600 hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ถัดไป (ส่วนที่ {activeDomainIdx + 2}) <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        ) : (
                            <button 
                                onClick={handleSubmit}
                                disabled={saving || !isAllAnswered}
                                className="flex-[2] flex justify-center items-center py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 border-none shadow-lg shadow-green-500/30 hover:shadow-green-500/50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 className="h-6 w-6 animate-spin"/> : 'ส่งแบบประเมิน'}
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                /* ---------------- RESULTS DASHBOARD ---------------- */
                <div className="space-y-6 animate-fade-in">
                    
                    {/* Main Score Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-emerald-500" />
                        
                        <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-purple-50 border-4 border-purple-100 mb-4">
                            <Star className="h-10 w-10 text-purple-500 fill-purple-500" />
                        </div>
                        
                        <h2 className="text-xl font-bold text-gray-500 mb-2">สรุปผลการประเมินของคุณ</h2>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-5xl font-extrabold text-gray-900">{displayScore}</span>
                            <span className="text-xl font-medium text-gray-400">/ {displayMaxScore}</span>
                        </div>
                        
                        <div className={`inline-flex items-center px-4 py-2 rounded-xl mb-6 font-bold text-lg ${result.bg} ${result.color}`}>
                            ระดับความรอบรู้: {result.level}
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed max-w-lg mx-auto bg-gray-50 p-4 rounded-2xl">
                            {result.rec}
                        </p>
                    </div>

                    <button 
                        onClick={handleReset}
                        className="w-full flex justify-center items-center gap-2 py-4 rounded-2xl font-bold text-purple-700 bg-purple-50 border border-purple-100 hover:bg-purple-100 active:scale-[0.98] transition-all"
                    >
                        <RefreshCcw className="h-5 w-5" /> ประเมินใหม่อีกครั้ง
                    </button>
                </div>
            )}
            
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
