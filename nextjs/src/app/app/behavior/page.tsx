"use client";
import React, { useState, useEffect } from 'react';
import { Activity, Save, Calendar, CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface BehaviorEntry {
    date: string;
    meals_3_per_day: boolean;
    fruits_vegetables: boolean;
    breakfast: boolean;
    processed_food: boolean;
    brushed_teeth: boolean;
    dental_checkup: boolean;
    bottle_before_bed: boolean;
    read_stories: boolean;
    played_with_child: boolean;
    self_help_training: boolean;
    praised_child: boolean;
    notes: string;
}

const defaultEntry: BehaviorEntry = {
    date: new Date().toISOString().split('T')[0],
    meals_3_per_day: false, fruits_vegetables: false, breakfast: false, processed_food: false,
    brushed_teeth: false, dental_checkup: false, bottle_before_bed: false,
    read_stories: false, played_with_child: false, self_help_training: false, praised_child: false,
    notes: '',
};

const sections = [
    {
        title: 'ด้านโภชนาการ',
        color: 'border-orange-100',
        bgColor: 'bg-orange-50/50',
        headerColor: 'text-orange-800',
        activeBg: 'bg-orange-50 border-orange-500',
        items: [
            { key: 'meals_3_per_day', label: 'เด็กกินอาหารครบ 3 มื้อ' },
            { key: 'fruits_vegetables', label: 'เด็กกินผักผลไม้ร่วมด้วย' },
            { key: 'breakfast', label: 'เด็กกินอาหารเช้า' },
            { key: 'processed_food', label: 'ลดการกินอาหารสำเร็จรูป/ขนมถุง' },
        ]
    },
    {
        title: 'ด้านสุขภาพฟัน',
        color: 'border-blue-100',
        bgColor: 'bg-blue-50/50',
        headerColor: 'text-blue-800',
        activeBg: 'bg-blue-50 border-blue-500',
        items: [
            { key: 'brushed_teeth', label: 'แปรงฟันให้เด็กอย่างน้อย 2 ครั้ง/วัน' },
            { key: 'dental_checkup', label: 'พาเด็กไปตรวจฟัน (ถ้าถึงกำหนด)' },
            { key: 'bottle_before_bed', label: 'งดดูดขวดนมก่อนนอน (หรือบ้วนปากหลังดื่ม)' },
        ]
    },
    {
        title: 'ด้านพัฒนาการและจิตใจ',
        color: 'border-purple-100',
        bgColor: 'bg-purple-50/50',
        headerColor: 'text-purple-800',
        activeBg: 'bg-purple-50 border-purple-500',
        items: [
            { key: 'read_stories', label: 'อ่านนิทานให้เด็กฟัง' },
            { key: 'played_with_child', label: 'เล่นดินทราย/ของเล่นกับเด็ก' },
            { key: 'self_help_training', label: 'ฝึกให้เด็กช่วยเหลือตนเอง (แต่งตัว/กินข้าว)' },
            { key: 'praised_child', label: 'ชมเชยเมื่อเด็กทำดี/กอดให้กำลังใจ' },
        ]
    }
];

export default function BehaviorPage() {
    const { user, selectedChildId } = useGlobal();
    const [entry, setEntry] = useState<BehaviorEntry>(defaultEntry);
    const [logs, setLogs] = useState<BehaviorEntry[]>([]);
    const [saved, setSaved] = useState(false);
    const [childId, setChildId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) return;
        
        async function loadData() {
            setLoading(true);
            try {
                const supabaseWrapper = await createSPASassClient();
                const supabase = supabaseWrapper.getSupabaseClient();
                
                // Fetch parent profile id first
                const { data: parentData } = await supabase
                    .from('parent_profiles')
                    .select('id')
                    .eq('user_id', user!.id)
                    .limit(1)
                    .maybeSingle();
                    
                if (!parentData) {
                    setLoading(false);
                    return;
                }
                if (!selectedChildId) {
                    setChildId(null);
                    setLoading(false);
                    return;
                }

                const { data: childData, error: childError } = await supabase
                    .from('children')
                    .select('id')
                    .eq('id', selectedChildId)
                    .maybeSingle();
                
                if (childError) throw childError;
                
                if (childData) {
                    setChildId(childData.id);
                    // Fetch logs
                    const { data: logData, error: logError } = await supabase
                        .from('behavior_logs')
                        .select('*')
                        .eq('child_id', childData.id)
                        .order('log_date', { ascending: false });
                        
                    if (logError) throw logError;
                    
                    if (logData && logData.length > 0) {
                        const loadedLogs = logData.map(d => ({
                            date: d.log_date,
                            meals_3_per_day: d.meals_3_per_day,
                            fruits_vegetables: d.fruits_vegetables,
                            breakfast: d.breakfast,
                            processed_food: d.processed_food,
                            brushed_teeth: d.brushed_teeth,
                            dental_checkup: d.dental_checkup,
                            bottle_before_bed: d.bottle_before_bed,
                            read_stories: d.read_stories,
                            played_with_child: d.played_with_child,
                            self_help_training: d.self_help_training,
                            praised_child: d.praised_child,
                            notes: d.notes || ''
                        }));
                        setLogs(loadedLogs);
                        
                        // Check if today's log exists
                        const today = new Date().toISOString().split('T')[0];
                        const todayLog = loadedLogs.find(l => l.date === today);
                        if (todayLog) setEntry(todayLog);
                    }
                }
            } catch (err: unknown) {
                console.error(err);
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            } finally {
                setLoading(false);
            }
        }
        
        loadData();
    }, [user, selectedChildId]);

    const toggleItem = (key: keyof BehaviorEntry) => {
        setEntry({ ...entry, [key]: !entry[key] });
    };

    const handleSave = async () => {
        if (!user || !childId) {
            setError("ไม่พบข้อมูลลูกน้อย กรุณาเพิ่มประวัติลูกในหน้าโปรไฟล์ก่อนคะ/ครับ");
            return;
        }
        setSaving(true);
        setError('');
        try {
            const supabaseWrapper = await createSPASassClient();
            const supabase = supabaseWrapper.getSupabaseClient();
            
            const payload = {
                child_id: childId,
                log_date: entry.date,
                meals_3_per_day: entry.meals_3_per_day,
                fruits_vegetables: entry.fruits_vegetables,
                breakfast: entry.breakfast,
                processed_food: entry.processed_food,
                brushed_teeth: entry.brushed_teeth,
                dental_checkup: entry.dental_checkup,
                bottle_before_bed: entry.bottle_before_bed,
                read_stories: entry.read_stories,
                played_with_child: entry.played_with_child,
                self_help_training: entry.self_help_training,
                praised_child: entry.praised_child,
                notes: entry.notes || null
            };

            const { data: existing, error: findError } = await supabase
                .from('behavior_logs')
                .select('id')
                .eq('child_id', childId)
                .eq('log_date', entry.date)
                .maybeSingle();
                
            if (findError) throw findError;
            
            if (existing) {
                const { error: updateError } = await supabase
                    .from('behavior_logs')
                    .update(payload)
                    .eq('id', existing.id);
                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('behavior_logs')
                    .insert([payload]);
                if (insertError) throw insertError;
            }
            
            const filteredLogs = logs.filter(l => l.date !== entry.date);
            setLogs([entry, ...filteredLogs].sort((a,b) => b.date.localeCompare(a.date)));
            
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: unknown) {
            console.error(err);
            setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setSaving(false);
        }
    };

    const completedCount = sections.reduce((sum, s) =>
        sum + s.items.filter(i => entry[i.key as keyof BehaviorEntry] === true).length, 0);
    const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);

    if (loading) {
        return (
            <div className="flex flex-col h-[50vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-green-600 mb-3" />
                <p className="text-gray-500 font-medium">กำลังโหลดแบบบันทึก...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-3">
                    <Activity className="h-7 w-7 text-green-700" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">บันทึกพฤติกรรม</h1>
                <p className="text-gray-500 text-sm mt-1">เช็คพฤติกรรมการดูแลลูกประจำวัน</p>
            </div>

            {/* Notifications */}
            {!childId && !loading && (
                <div className="p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-2xl flex items-start gap-3 shadow-sm">
                    <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-base">ยังไม่ได้เลือกข้อมูลเด็ก</p>
                        <p className="text-sm mt-1 leading-relaxed">กรุณาไปที่เมนู <Link href="/app/profile" className="font-bold underline text-orange-900 hover:text-orange-700">&quot;โปรไฟล์&quot;</Link> เพื่อเลือกหรือเพิ่มประวัติลูกน้อยก่อนเริ่มใช้งานหน้านี้คะ/ครับ</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 text-sm text-red-700 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-2 shadow-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {saved && (
                <div className="p-4 text-sm text-green-800 bg-green-50 rounded-2xl border border-green-200 flex items-start gap-2 shadow-sm animate-fade-in">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="font-bold">บันทึกข้อมูลประจำวันสำเร็จแล้ว เยี่ยมมาก!</span>
                </div>
            )}

            {/* Date Picker Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" /> ระบุวันที่ที่บันทึก
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">แตะที่รายการด้านล่างเพื่อยืนยันพฤติกรรมที่เกิดขึ้น</p>
                </div>
                <input 
                    type="date" 
                    value={entry.date}
                    onChange={e => setEntry({ ...entry, date: e.target.value })}
                    className="w-full sm:w-auto px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-700 outline-none focus:border-green-500 shadow-inner text-center" 
                />
            </div>

            {/* Progress */}
            <div className="bg-green-50 p-5 rounded-3xl border border-green-100">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-green-800 font-bold">ความสำเร็จวันนี้</span>
                    <span className="text-green-700 font-bold text-lg bg-white px-3 py-1 rounded-xl shadow-sm">{completedCount} / {totalItems}</span>
                </div>
                <div className="w-full bg-green-200/50 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${(completedCount / totalItems) * 100}%` }} 
                    />
                </div>
            </div>

            {/* Form Sections */}
            <div className="space-y-6">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className={`rounded-3xl border overflow-hidden bg-white shadow-sm ${section.color}`}>
                        <div className={`px-6 py-4 border-b ${section.color} ${section.bgColor}`}>
                            <h3 className={`font-bold text-lg flex items-center gap-2 ${section.headerColor}`}>
                                {section.title}
                            </h3>
                        </div>
                        <div className="p-3 sm:p-5 space-y-3 bg-white">
                            {section.items.map(item => {
                                const checked = entry[item.key as keyof BehaviorEntry] === true;
                                return (
                                    <button 
                                        key={item.key} 
                                        onClick={() => toggleItem(item.key as keyof BehaviorEntry)}
                                        className={`w-full group flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left active:scale-[0.98]
                                            ${checked ? section.activeBg : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <div className="mt-0.5 flex-shrink-0">
                                            {checked ? (
                                                <CheckCircle2 className={`h-6 w-6 fill-current ${section.headerColor.replace('text-', 'text-')}`} />
                                            ) : (
                                                <Circle className="h-6 w-6 text-gray-300 group-hover:text-gray-400" />
                                            )}
                                        </div>
                                        <span className={`text-base leading-snug font-medium pt-0.5 ${checked ? section.headerColor : 'text-gray-700'}`}>
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Notes Section */}
            <div className="bg-white p-5 sm:p-6 text-sm text-red-700 bg-red-50 rounded-3xl border border-gray-100 shadow-sm">
                <label className="block text-base font-bold text-gray-800 mb-3">รายละเอียดเพิ่มเติม / หมายเหตุ</label>
                <textarea 
                    value={entry.notes} 
                    onChange={e => setEntry({ ...entry, notes: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none h-28 resize-none shadow-inner"
                    placeholder="วันนี้ลูกน้อยทำอะไรดีๆ เป็นพิเศษ หรือมีเรื่องอะไรอยากบันทึกไว้ไหมคะ?" 
                />
            </div>

            {/* Save Button */}
            <div className="pt-4 pb-8">
                <button 
                    onClick={handleSave} 
                    disabled={saving || !childId}
                    className="flex w-full justify-center items-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg shadow-xl shadow-green-500/25 hover:shadow-green-500/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <Loader2 className="h-6 w-6 animate-spin"/> 
                    ) : (
                        <Save className="h-6 w-6" />
                    )} 
                    {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลของวันนี้'}
                </button>
            </div>

            {/* History Card */}
            {logs.length > 0 && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-10">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 text-lg">📋 ประวัติการบันทึกย้อนหลัง</h3>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                        {logs.map((log, idx) => {
                            const done = sections.reduce((s, sec) => s + sec.items.filter(i => log[i.key as keyof BehaviorEntry] === true).length, 0);
                            return (
                                <div key={idx} className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <span className="font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-lg">
                                        🗓️ {new Date(log.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                    <div className="flex items-center gap-2 font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                                        ⭐️ {done}/{totalItems}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
