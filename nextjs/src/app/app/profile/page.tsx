"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Baby, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createSPASassClientAuthenticated as createSPASassClient } from '@/lib/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProfilePage() {
    const { user } = useGlobal();
    const [activeTab, setActiveTab] = useState<'parent' | 'child'>('parent');

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
                    .eq('id', user!.id)
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
                }

                // Fetch child
                const { data: childData, error: childError } = await supabase
                    .from('children')
                    .select('*')
                    .eq('parent_id', user!.id)
                    .maybeSingle();

                if (childError) throw childError;

                if (childData) {
                    setChild({
                        id: childData.id,
                        gender: childData.gender || '',
                        birth_date: childData.birth_date || '',
                        birth_order: childData.birth_order?.toString() || '',
                        weight: childData.weight?.toString() || '',
                        height: childData.height?.toString() || '',
                        decayed_teeth: childData.decayed_teeth?.toString() || '',
                        dentist_visit_history: childData.dentist_visit_history || '',
                        dspm_gross_motor: childData.dspm_gross_motor || '',
                        dspm_fine_motor: childData.dspm_fine_motor || '',
                        dspm_language_comprehension: childData.dspm_language_comprehension || '',
                        dspm_language_use: childData.dspm_language_use || '',
                        dspm_self_help: childData.dspm_self_help || ''
                    });
                }

            } catch (err: unknown) {
                console.error("Error loading profile:", err);
                setError("ไม่สามารถโหลดข้อมูลได้");
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
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
                id: user.id,
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
                .upsert(parentPayload);

            if (upsertError) throw upsertError;

            setSuccess('บันทึกข้อมูลผู้ปกครองเรียบร้อยแล้ว');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
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

            const childPayload = {
                parent_id: user.id,
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
            if (upsertError) throw upsertError;
            
            if (data && data.id) {
                setChild({ ...child, id: data.id });
            }

            setSuccess('บันทึกข้อมูลเด็กเรียบร้อยแล้ว');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:bg-gray-100 disabled:opacity-70";
    const selectClass = inputClass;
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold text-gray-900">โปรไฟล์ผู้ปกครองและเด็ก</h1>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            {/* Tab Switcher */}
            <div className="flex gap-2">
                <button onClick={() => setActiveTab('parent')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'parent' ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
                    <Users className="h-4 w-4" /> ข้อมูลผู้ปกครอง
                </button>
                <button onClick={() => setActiveTab('child')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'child' ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
                    <Baby className="h-4 w-4" /> ข้อมูลเด็ก
                </button>
            </div>

            {/* Parent Form */}
            {activeTab === 'parent' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary-600" /> ข้อมูลผู้ปกครอง / ผู้ดูแลเด็ก</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>เพศ</label>
                                <select name="gender" value={parent.gender} onChange={handleParentChange} className={selectClass}>
                                    <option value="">-- เลือก --</option>
                                    <option value="male">ชาย</option>
                                    <option value="female">หญิง</option>
                                    <option value="other">อื่นๆ</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>อายุ (ปี)</label>
                                <input type="number" name="age" value={parent.age} onChange={handleParentChange} className={inputClass} placeholder="เช่น 35" />
                            </div>
                            <div>
                                <label className={labelClass}>ระดับการศึกษา</label>
                                <select name="education_level" value={parent.education_level} onChange={handleParentChange} className={selectClass}>
                                    <option value="">-- เลือก --</option>
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
                                <label className={labelClass}>อาชีพ</label>
                                <input type="text" name="occupation" value={parent.occupation} onChange={handleParentChange} className={inputClass} placeholder="เช่น รับจ้างทั่วไป" />
                            </div>
                            <div>
                                <label className={labelClass}>รายได้ครอบครัว (บาท/เดือน)</label>
                                <select name="family_income" value={parent.family_income} onChange={handleParentChange} className={selectClass}>
                                    <option value="">-- เลือก --</option>
                                    <option value="below_10000">ต่ำกว่า 10,000</option>
                                    <option value="10000_20000">10,000 - 20,000</option>
                                    <option value="20000_30000">20,000 - 30,000</option>
                                    <option value="above_30000">มากกว่า 30,000</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>สถานภาพสมรส</label>
                                <select name="marital_status" value={parent.marital_status} onChange={handleParentChange} className={selectClass}>
                                    <option value="">-- เลือก --</option>
                                    <option value="single">โสด</option>
                                    <option value="married">สมรส</option>
                                    <option value="divorced">หย่าร้าง</option>
                                    <option value="widowed">หม้าย</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>ลักษณะครอบครัว</label>
                                <select name="family_type" value={parent.family_type} onChange={handleParentChange} className={selectClass}>
                                    <option value="">-- เลือก --</option>
                                    <option value="nuclear">ครอบครัวเดี่ยว</option>
                                    <option value="extended">ครอบครัวขยาย</option>
                                    <option value="other">อื่นๆ</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>ความสัมพันธ์กับเด็ก</label>
                                <select name="relationship_to_child" value={parent.relationship_to_child} onChange={handleParentChange} className={selectClass}>
                                    <option value="">-- เลือก --</option>
                                    <option value="father">พ่อ</option>
                                    <option value="mother">แม่</option>
                                    <option value="grandfather">ปู่ / ตา</option>
                                    <option value="grandmother">ย่า / ยาย</option>
                                    <option value="other">อื่น ๆ</option>
                                </select>
                            </div>
                        </div>
                        <button 
                            onClick={saveParent}
                            disabled={saving}
                            className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} 
                            บันทึกข้อมูลผู้ปกครอง
                        </button>
                    </CardContent>
                </Card>
            )}

            {/* Child Form */}
            {activeTab === 'child' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Baby className="h-5 w-5 text-primary-600" /> ข้อมูลเด็กวัยก่อนเรียน (2-5 ปี)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>เพศเด็ก</label>
                                <select name="gender" value={child.gender} onChange={handleChildChange} className={selectClass}>
                                    <option value="">-- เลือก --</option>
                                    <option value="male">ชาย</option>
                                    <option value="female">หญิง</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>วันเกิด</label>
                                <input type="date" name="birth_date" value={child.birth_date} onChange={handleChildChange} className={inputClass} max={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div>
                                <label className={labelClass}>ลำดับบุตร</label>
                                <input type="number" name="birth_order" value={child.birth_order} onChange={handleChildChange} className={inputClass} placeholder="เช่น 1" min="1" />
                            </div>
                            <div>
                                <label className={labelClass}>น้ำหนัก (กก.)</label>
                                <input type="number" step="0.1" name="weight" value={child.weight} onChange={handleChildChange} className={inputClass} placeholder="เช่น 15.5" min="0" />
                            </div>
                            <div>
                                <label className={labelClass}>ส่วนสูง (ซม.)</label>
                                <input type="number" step="0.1" name="height" value={child.height} onChange={handleChildChange} className={inputClass} placeholder="เช่น 100" min="0" />
                            </div>
                            <div>
                                <label className={labelClass}>จำนวนฟันผุ (ซี่)</label>
                                <input type="number" name="decayed_teeth" value={child.decayed_teeth} onChange={handleChildChange} className={inputClass} placeholder="0" min="0" />
                            </div>
                        </div>

                        {/* DSPM Section */}
                        <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800 border-b pb-2">คะแนนการประเมินพัฒนาการ (DSPM)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'dspm_gross_motor', label: '1. เคลื่อนไหว (กล้ามเนื้อมัดใหญ่)' },
                                { name: 'dspm_fine_motor', label: '2. กล้ามเนื้อมัดเล็ก / สติปัญญา' },
                                { name: 'dspm_language_comprehension', label: '3. การเข้าใจภาษา' },
                                { name: 'dspm_language_use', label: '4. การใช้ภาษา' },
                                { name: 'dspm_self_help', label: '5. การช่วยเหลือตนเองและสังคม' },
                            ].map(field => (
                                <div key={field.name}>
                                    <label className={labelClass}>{field.label}</label>
                                    <select name={field.name} value={(child as Record<string, string>)[field.name]} onChange={handleChildChange} className={selectClass}>
                                        <option value="">-- เลือกผลประเมิน --</option>
                                        <option value="normal">สมวัย (ปกติ)</option>
                                        <option value="suspected">สงสัยล่าช้า</option>
                                        <option value="delayed">ล่าช้า</option>
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4">
                            <label className={labelClass}>ประวัติการพบทันตแพทย์ / การรับวัคซีนเพิ่มเติม</label>
                            <textarea name="dentist_visit_history" value={child.dentist_visit_history} onChange={handleChildChange}
                                className={inputClass + " h-20 resize-none"} placeholder="รายละเอียด..." />
                        </div>

                        <button 
                            onClick={saveChild}
                            disabled={saving}
                            className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} 
                            บันทึกข้อมูลเด็ก
                        </button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

