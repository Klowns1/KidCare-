"use client";
import React, { useState, useEffect } from 'react';
import { Loader2, Users, Baby, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';

export default function ProfilePage() {
    const { user, selectedChildId, setSelectedChildId } = useGlobal();
    const [activeTab, setActiveTab] = useState<'parent' | 'child'>('parent');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [childList, setChildList] = useState<any[]>([]);

    const [parent, setParent] = useState({
        gender: '', age: '', education_level: '', occupation: '',
        family_income: '', marital_status: '', family_type: '', relationship_to_child: ''
    });

    const [child, setChild] = useState({
        id: '', gender: '', birth_date: '', birth_order: '', weight: '', height: '',
        decayed_teeth: '', dentist_visit_history: '',
        dspm_gross_motor: '', dspm_fine_motor: '',
        dspm_language_comprehension: '', dspm_language_use: '', dspm_self_help: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;
        
        async function loadProfile() {
            setLoading(true);
            try {
                const supabaseWrapper = await createSPASassClient();
                const supabase = supabaseWrapper.getSupabaseClient();

                // Fetch parent
                const { data: parentData, error: parentError } = await supabase
                    .from('parent_profiles')
                    .select('*')
                    .eq('user_id', user!.id)
                    .limit(1)
                    .maybeSingle();

                if (parentError) throw parentError;
                
                if (parentData) {
                    setParent({
                        gender: parentData.gender || '',
                        age: parentData.age?.toString() || '',
                        education_level: parentData.education_level || '',
                        occupation: parentData.occupation || '',
                        family_income: parentData.family_income || '',
                        marital_status: parentData.marital_status || '',
                        family_type: parentData.family_type || '',
                        relationship_to_child: parentData.relationship_to_child || ''
                    });

                    // Fetch children list to display
                    const { data: childrenData, error: childrenError } = await supabase
                        .from('children')
                        .select('*')
                        .eq('parent_id', parentData.id)
                        .order('created_at', { ascending: false });

                    if (childrenError) throw childrenError;

                    if (childrenData) {
                        setChildList(childrenData);
                        // If no child is selected and we have children, select the first one automatically
                        if (!selectedChildId && childrenData.length > 0) {
                            setSelectedChildId(childrenData[0].id);
                        }
                    }
                }

            } catch (err: unknown) {
                console.error("Error loading profile:", err);
                setError("ไม่สามารถโหลดข้อมูลได้");
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleParentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setParent({ ...parent, [e.target.name]: e.target.value });
    };
    
    const handleChildChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setChild({ ...child, [e.target.name]: e.target.value });
    };

    const saveParent = async () => {
        if (!user) return;
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const supabaseWrapper = await createSPASassClient();
            const supabase = supabaseWrapper.getSupabaseClient();

            const parentPayload = {
                user_id: user.id,
                gender: parent.gender || null,
                age: parent.age ? parseInt(parent.age) : null,
                education_level: parent.education_level || null,
                occupation: parent.occupation || null,
                family_income: parent.family_income || null,
                marital_status: parent.marital_status || null,
                family_type: parent.family_type || null,
                relationship_to_child: parent.relationship_to_child || null,
                updated_at: new Date().toISOString()
            };

            const { error: upsertError } = await supabase
                .from('parent_profiles')
                .upsert(parentPayload, { onConflict: 'user_id' });

            if (upsertError) {
                console.error("Supabase Save Parent Error:", JSON.stringify(upsertError));
                throw new Error("Failed to save parent");
            }

            setSuccess('บันทึกข้อมูลผู้ปกครองเรียบร้อยแล้ว ✅');
            setTimeout(() => setSuccess(''), 3000);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: unknown) {
            console.error(err);
            setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setSaving(false);
        }
    };

    const saveChild = async () => {
        if (!user) return;
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const supabaseWrapper = await createSPASassClient();
            const supabase = supabaseWrapper.getSupabaseClient();

            if (!child.gender || !child.birth_date) {
                setError("กรุณาระบุเพศและวันเกิดของลูกน้อย");
                setSaving(false);
                return;
            }

            // Fetch the actual parent_profiles.id first (FK references parent_profiles.id, not auth.users.id)
            const { data: parentData, error: parentFetchError } = await supabase
                .from('parent_profiles')
                .select('id')
                .eq('user_id', user.id)
                .limit(1)
                .maybeSingle();

            let parentRow = parentData;

            if (parentFetchError || !parentRow) {
                // Silently create an empty parent profile
                const { data: newParent, error: upsertError } = await supabase
                    .from('parent_profiles')
                    .upsert({ user_id: user.id }, { onConflict: 'user_id' })
                    .select('id')
                    .single();
                
                if (upsertError || !newParent) throw new Error("Failed to auto-create parent profile");
                parentRow = newParent;
            }


            const childPayload = {
                parent_id: parentRow.id,
                gender: child.gender || null,
                birth_date: child.birth_date || null,
                birth_order: child.birth_order ? parseInt(child.birth_order) : null,
                weight: child.weight ? parseFloat(child.weight) : null,
                height: child.height ? parseFloat(child.height) : null,
                decayed_teeth: child.decayed_teeth ? parseInt(child.decayed_teeth) : null,
                dentist_visit_history: child.dentist_visit_history || null,
                dspm_gross_motor: child.dspm_gross_motor || null,
                dspm_fine_motor: child.dspm_fine_motor || null,
                dspm_language_comprehension: child.dspm_language_comprehension || null,
                dspm_language_use: child.dspm_language_use || null,
                dspm_self_help: child.dspm_self_help || null,
                updated_at: new Date().toISOString()
            };

            let q;
            if (child.id) {
                // Update
                q = supabase.from('children').update(childPayload).eq('id', child.id);
            } else {
                // Insert
                q = supabase.from('children').insert([childPayload]).select('id').single();
            }

            const { data, error: upsertError } = await q;
            if (upsertError) {
                console.error("Supabase Save Child Error:", JSON.stringify(upsertError));
                if (upsertError.code === '23503') {
                    throw new Error("กรุณาบันทึก 'ข้อมูลผู้ปกครอง' ก่อนทำการบันทึกข้อมูลเด็กคะ/ครับ");
                }
                throw new Error("Failed to save child");
            }
            
            if (data && data.id) {
                // Prepend to childList
                setChildList([{ ...childPayload, id: data.id }, ...childList]);
                setSelectedChildId(data.id);
            }
            
            // Clear the form
            setChild({
                id: '', gender: '', birth_date: '', birth_order: '', weight: '', height: '',
                decayed_teeth: '', dentist_visit_history: '',
                dspm_gross_motor: '', dspm_fine_motor: '',
                dspm_language_comprehension: '', dspm_language_use: '', dspm_self_help: ''
            });

            setSuccess('บันทึกข้อมูลลูกน้อยเรียบร้อยแล้ว ✅');
            setTimeout(() => setSuccess(''), 3000);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-3" />
                <span className="text-gray-500 font-medium">กำลังโหลดโปรไฟล์...</span>
            </div>
        );
    }

    // New large input styles
    const inputClass = "block w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-base shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all";
    const labelClass = "block text-sm font-bold text-gray-700 mb-2";

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-3 text-2xl">
                    ครอบครัว
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">โปรไฟล์ครอบครัว</h1>
                <p className="text-gray-500 text-sm mt-1">อัปเดตข้อมูลของคุณและลูกน้อย</p>
            </div>

            {/* Notifications */}
            {error && (
                <div className="p-4 text-sm text-red-700 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="p-4 text-sm text-green-800 bg-green-50 rounded-2xl border border-green-200 flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            {/* Big Friendly Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-2xl">
                <button 
                    onClick={() => setActiveTab('parent')}
                    className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl font-bold transition-all ${
                        activeTab === 'parent' 
                        ? 'bg-white shadow-sm text-green-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Users className="w-5 h-5" /> ข้อมูลผู้ปกครอง
                </button>
                <button 
                    onClick={() => setActiveTab('child')}
                    className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl font-bold transition-all relative ${
                        activeTab === 'child' 
                        ? 'bg-white shadow-sm text-green-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Baby className="w-5 h-5" /> ข้อมูลลูกน้อย
                    {(!child.gender || !child.birth_date) && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                </button>
            </div>

            {/* Parent Form Content */}
            {activeTab === 'parent' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-6 animate-fade-in">
                    
                    <div>
                        <label className={labelClass}>ความสัมพันธ์กับเด็ก</label>
                        <select name="relationship_to_child" value={parent.relationship_to_child} onChange={handleParentChange} className={inputClass}>
                            <option value="">-- เลือก --</option>
                            <option value="mother">แม่</option>
                            <option value="father">พ่อ</option>
                            <option value="grandmother">ย่า / ยาย</option>
                            <option value="grandfather">ปู่ / ตา</option>
                            <option value="other">อื่น ๆ</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>เพศ <span className="text-gray-400 font-normal text-xs">(ไม่บังคับ)</span></label>
                        <div className="grid grid-cols-2 gap-3">
                            {['female', 'male'].map((g) => (
                                <label key={g} className={`flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                    parent.gender === g ? 'border-green-500 bg-green-50 text-green-700 font-bold' : 'border-gray-100 bg-gray-50 text-gray-600'
                                }`}>
                                    <input type="radio" name="gender" value={g} checked={parent.gender === g} onChange={handleParentChange} className="hidden" />
                                    {g === 'female' ? 'หญิง' : 'ชาย'}
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <label className={labelClass}>อายุ (ปี) <span className="text-gray-400 font-normal text-xs">(ไม่บังคับ)</span></label>
                        <input type="number" name="age" value={parent.age} onChange={handleParentChange} className={inputClass} placeholder="เช่น 30" />
                    </div>

                    <div>
                        <label className={labelClass}>ระดับการศึกษา <span className="text-gray-400 font-normal text-xs">(ไม่บังคับ)</span></label>
                        <select name="education_level" value={parent.education_level} onChange={handleParentChange} className={inputClass}>
                            <option value="">-- ข้ามได้ --</option>
                            <option value="primary">ประถมศึกษา</option>
                            <option value="secondary">มัธยมศึกษา</option>
                            <option value="vocational">อาชีวศึกษา</option>
                            <option value="bachelor">ปริญญาตรี</option>
                            <option value="master">ปริญญาโท</option>
                            <option value="doctorate">ปริญญาเอก</option>
                            <option value="other">อื่น ๆ</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>อาชีพ <span className="text-gray-400 font-normal text-xs">(ไม่บังคับ)</span></label>
                        <input type="text" name="occupation" value={parent.occupation} onChange={handleParentChange} className={inputClass} placeholder="ตัวอย่าง: ค้าขาย, ข้าราชการ" />
                    </div>

                    <button 
                        onClick={saveParent}
                        disabled={saving}
                        className="w-full mt-8 flex justify-center items-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/50 active:scale-[0.98] transition-all"
                    >
                        {saving ? (
                            <><Loader2 className="h-6 w-6 animate-spin" /> กำลังบันทึก...</>
                        ) : (
                            <>บันทึกข้อมูลผู้ปกครอง</>
                        )}
                    </button>
                </div>
            )}

            {/* Child Form Content */}
            {activeTab === 'child' && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-6 animate-fade-in">
                    
                    <div>
                        <label className={labelClass}>เพศของลูก <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-2 gap-3">
                            {['male', 'female'].map((g) => (
                                <label key={g} className={`flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                    child.gender === g ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-100 bg-gray-50 text-gray-600'
                                }`}>
                                    <input type="radio" name="gender" value={g} checked={child.gender === g} onChange={handleChildChange} className="hidden" />
                                    {g === 'male' ? 'เด็กชาย' : 'เด็กหญิง'}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>วันเกิดลูก (พ.ศ. / ค.ศ. ตามปฏิทิน) <span className="text-red-500">*</span></label>
                        <input type="date" name="birth_date" value={child.birth_date} onChange={handleChildChange} className={inputClass} max={new Date().toISOString().split('T')[0]} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>น้ำหนัก (กก.)</label>
                            <input type="number" step="0.1" name="weight" value={child.weight} onChange={handleChildChange} className={inputClass} placeholder="เช่น 12.5" />
                        </div>
                        <div>
                            <label className={labelClass}>ส่วนสูง (ซม.)</label>
                            <input type="number" step="0.1" name="height" value={child.height} onChange={handleChildChange} className={inputClass} placeholder="เช่น 90" />
                        </div>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                        <label className="block text-sm font-bold text-orange-800 mb-2">จำนวนฟันผุ (ซี่)</label>
                        <input type="number" name="decayed_teeth" value={child.decayed_teeth} onChange={handleChildChange} className="block w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-base outline-none focus:border-orange-500" placeholder="0" min="0" />
                    </div>

                    {/* Quick DSPM Section */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            ประเมินพัฒนาการ (DSPM) คร่าวๆ
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'dspm_gross_motor', label: '1. เคลื่อนไหวร่างกาย' },
                                { name: 'dspm_fine_motor', label: '2. ใช้มือและตา' },
                                { name: 'dspm_language_comprehension', label: '3. เข้าใจภาษาที่พูดด้วย' },
                                { name: 'dspm_language_use', label: '4. ใช้ภาษาพูดสื่อสาร' },
                                { name: 'dspm_self_help', label: '5. ช่วยเหลือตนเองและเข้าสังคม' },
                            ].map(field => (
                                <div key={field.name} className="bg-gray-50 p-4 rounded-2xl">
                                    <label className="block text-sm font-bold text-gray-800 mb-2">{field.label}</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button type="button" 
                                            onClick={() => setChild({...child, [field.name]: 'normal'})}
                                            className={`py-3 rounded-xl border font-medium text-sm transition-all flex justify-center items-center gap-2 ${
                                                (child as Record<string, string>)[field.name] === 'normal' ? 'bg-green-500 text-white border-green-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> ปกติสมวัย
                                        </button>
                                        <button type="button" 
                                            onClick={() => setChild({...child, [field.name]: 'suspected'})}
                                            className={`py-3 rounded-xl border font-medium text-sm transition-all flex justify-center items-center gap-2 ${
                                                (child as Record<string, string>)[field.name] === 'suspected' ? 'bg-orange-500 text-white border-orange-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            <AlertCircle className="w-4 h-4" /> น่าจะล่าช้า
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={saveChild}
                        disabled={saving}
                        className="w-full mt-8 flex justify-center items-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98] transition-all"
                    >
                        {saving ? (
                            <><Loader2 className="h-6 w-6 animate-spin" /> กำลังบันทึก...</>
                        ) : (
                            <>บันทึกข้อมูลลูกน้อย</>
                        )}
                    </button>
                </div>
            )}
            
            {/* Child List Section */}
            {childList.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-4 animate-fade-in mt-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">รายชื่อเด็กที่ดึงข้อมูลไว้แล้ว</h2>
                    <div className="space-y-3">
                        {childList.map((c, idx) => {
                            const isSelected = selectedChildId === c.id;
                            return (
                                <div key={c.id || idx} 
                                    onClick={() => setSelectedChildId(c.id)}
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                        isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-primary-200'
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${c.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                            <Baby className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">
                                                {c.gender === 'male' ? 'เด็กชาย' : c.gender === 'female' ? 'เด็กหญิง' : 'ไม่ระบุเพศ'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                เกิด: {c.birth_date ? new Date(c.birth_date).toLocaleDateString('th-TH') : '-'}
                                                {c.weight && ` | หนัก: ${c.weight} กก.`}
                                            </p>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                            ดึงข้อมูลกำลังใช้งาน
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
