"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ClipboardList, CheckCircle, ArrowRight } from 'lucide-react';

const domains = [
    {
        id: 'access_info',
        title: '1. การเข้าถึงข้อมูล',
        questions: [
            'ท่านสามารถค้นหาข้อมูลสุขภาพเด็กจากแหล่งต่างๆ ได้',
            'ท่านรู้ว่าจะหาข้อมูลเกี่ยวกับอาหารเด็กได้จากที่ไหน',
            'ท่านสามารถเข้าถึงบริการสุขภาพสำหรับเด็กได้สะดวก',
        ]
    },
    {
        id: 'knowledge',
        title: '2. ความรู้ความเข้าใจ',
        questions: [
            'ท่านเข้าใจข้อมูลเกี่ยวกับโภชนาการที่เหมาะสมสำหรับเด็ก 2–5 ปี',
            'ท่านเข้าใจวิธีการดูแลสุขภาพฟันของเด็ก',
            'ท่านเข้าใจพัฒนาการตามวัยของเด็ก',
        ]
    },
    {
        id: 'communication',
        title: '3. ทักษะการสื่อสาร',
        questions: [
            'ท่านสามารถสื่อสารกับบุคลากรสุขภาพเกี่ยวกับปัญหาสุขภาพเด็กได้',
            'ท่านสามารถอธิบายอาการเจ็บป่วยของเด็กให้แพทย์ฟังได้',
            'ท่านสามารถสอบถามข้อสงสัยเกี่ยวกับสุขภาพเด็กจากเจ้าหน้าที่ได้',
        ]
    },
    {
        id: 'media_literacy',
        title: '4. การรู้เท่าทันสื่อ',
        questions: [
            'ท่านสามารถแยกแยะข้อมูลสุขภาพที่ถูกต้องจากอินเทอร์เน็ตได้',
            'ท่านสามารถประเมินความน่าเชื่อถือของข้อมูลสุขภาพได้',
            'ท่านไม่หลงเชื่อข้อมูลสุขภาพที่ไม่มีแหล่งอ้างอิง',
        ]
    },
    {
        id: 'decision_making',
        title: '5. การตัดสินใจ',
        questions: [
            'ท่านสามารถตัดสินใจเลือกอาหารที่เหมาะสมสำหรับเด็กได้',
            'ท่านสามารถตัดสินใจพาเด็กไปพบแพทย์เมื่อจำเป็น',
            'ท่านสามารถเลือกกิจกรรมที่ส่งเสริมพัฒนาการเด็กได้',
        ]
    },
    {
        id: 'care_management',
        title: '6. การจัดการการเลี้ยงดู',
        questions: [
            'ท่านสามารถจัดอาหาร 3 มื้อที่มีคุณค่าให้เด็กได้',
            'ท่านสามารถดูแลสุขภาพฟันเด็กได้อย่างเหมาะสม',
            'ท่านสามารถจัดกิจกรรมส่งเสริมพัฒนาการเด็กได้',
        ]
    },
];

const scoreLabels = ['น้อยที่สุด', 'น้อย', 'ปานกลาง', 'มาก', 'มากที่สุด'];

function getLiteracyLevel(total: number, max: number) {
    const pct = (total / max) * 100;
    if (pct >= 80) return { level: 'ดีมาก', color: 'text-green-600', bg: 'bg-green-100', rec: 'ท่านมีความรอบรู้ด้านสุขภาพดีมาก ให้คงพฤติกรรมนี้ต่อไป' };
    if (pct >= 60) return { level: 'ดี', color: 'text-blue-600', bg: 'bg-blue-100', rec: 'ท่านมีความรอบรู้ดี แต่ยังมีบางด้านที่ควรเพิ่มเติม' };
    if (pct >= 40) return { level: 'ปานกลาง', color: 'text-yellow-600', bg: 'bg-yellow-100', rec: 'ควรศึกษาข้อมูลเพิ่มเติมในคลังความรู้ เพื่อเพิ่มความรอบรู้ด้านสุขภาพ' };
    return { level: 'ควรปรับปรุง', color: 'text-red-600', bg: 'bg-red-100', rec: 'แนะนำให้ศึกษาเนื้อหาในคลังความรู้ทั้ง 3 หมวด และปรึกษาเจ้าหน้าที่สาธารณสุข' };
}

export default function AssessmentsPage() {
    const [testType, setTestType] = useState<'pre' | 'post'>('pre');
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);

    const totalQuestions = domains.reduce((sum, d) => sum + d.questions.length, 0);
    const maxScore = totalQuestions * 5;

    const handleAnswer = (domainId: string, qIdx: number, score: number) => {
        setAnswers({ ...answers, [`${domainId}_${qIdx}`]: score });
    };

    const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
    const result = getLiteracyLevel(totalScore, maxScore);

    const domainScores = domains.map(d => {
        let sum = 0;
        d.questions.forEach((_, i) => { sum += answers[`${d.id}_${i}`] || 0; });
        return { title: d.title, score: sum, max: d.questions.length * 5 };
    });

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const handleReset = () => {
        setAnswers({});
        setSubmitted(false);
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-3">
                <ClipboardList className="h-7 w-7 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">แบบประเมินความรอบรู้ด้านสุขภาพ</h1>
            </div>

            {/* Test Type Selector */}
            <div className="flex gap-2">
                <button onClick={() => { setTestType('pre'); handleReset(); }}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all ${testType === 'pre' ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
                    Pre-test (ก่อนใช้แอป)
                </button>
                <button onClick={() => { setTestType('post'); handleReset(); }}
                    className={`px-5 py-2.5 rounded-lg font-medium transition-all ${testType === 'post' ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
                    Post-test (หลังใช้แอป)
                </button>
            </div>

            {!submitted ? (
                <>
                    {domains.map(domain => (
                        <Card key={domain.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{domain.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {domain.questions.map((q, qIdx) => (
                                    <div key={qIdx} className="space-y-2">
                                        <p className="text-sm text-gray-800">{q}</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {scoreLabels.map((label, sIdx) => {
                                                const score = sIdx + 1;
                                                const isSelected = answers[`${domain.id}_${qIdx}`] === score;
                                                return (
                                                    <button key={sIdx}
                                                        onClick={() => handleAnswer(domain.id, qIdx, score)}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                                                            ${isSelected ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'}`}>
                                                        {score} - {label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}

                    <button onClick={handleSubmit}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                        <CheckCircle className="h-5 w-5" /> ส่งแบบประเมิน
                    </button>
                </>
            ) : (
                <Card className="border-2 border-primary-200">
                    <CardHeader className="bg-primary-50">
                        <CardTitle className="text-xl">📊 ผลการประเมิน ({testType === 'pre' ? 'Pre-test' : 'Post-test'})</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary-600">{totalScore} / {maxScore}</p>
                            <p className={`text-lg font-semibold mt-2 ${result.color}`}>ระดับ: {result.level}</p>
                            <div className={`mt-3 p-3 rounded-lg ${result.bg}`}>
                                <p className="text-sm">{result.rec}</p>
                            </div>
                        </div>

                        <h3 className="font-semibold text-gray-800 mt-4">คะแนนรายด้าน</h3>
                        {domainScores.map((ds, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">{ds.title}</span>
                                <span className="font-medium">{ds.score} / {ds.max}</span>
                            </div>
                        ))}

                        <div className="flex gap-2 mt-4">
                            <button onClick={handleReset}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                ทำแบบประเมินใหม่
                            </button>
                            <button className="flex items-center gap-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
                                ไปคลังความรู้ <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
