"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Baby, Save } from 'lucide-react';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<'parent' | 'child'>('parent');

    const [parent, setParent] = useState({
        gender: '', age: '', education_level: '', occupation: '',
        family_income: '', marital_status: '', family_type: '', relationship_to_child: ''
    });

    const [child, setChild] = useState({
        gender: '', birth_date: '', birth_order: '', weight: '', height: '',
        decayed_teeth: '', dentist_visit_history: '',
        dspm_gross_motor: '', dspm_fine_motor: '',
        dspm_language_comprehension: '', dspm_language_use: '', dspm_self_help: ''
    });

    const handleParentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setParent({ ...parent, [e.target.name]: e.target.value });
    };
    const handleChildChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setChild({ ...child, [e.target.name]: e.target.value });
    };

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all";
    const selectClass = inputClass;
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="space-y-6 p-6">
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
                        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary-600" /> โปรไฟล์ผู้ปกครอง / ผู้ดูแลเด็ก</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>เพศ</label>
                                <select name="gender" value={parent.gender} onChange={handleParentChange} className={selectClass}>
                                    <option value="">-- เลือก --</option>
                                    <option value="male">ชาย</option>
                                    <option value="female">หญิง</option>
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
                        <button className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                            <Save className="h-4 w-4" /> บันทึกข้อมูล
                        </button>
                    </CardContent>
                </Card>
            )}

            {/* Child Form */}
            {activeTab === 'child' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Baby className="h-5 w-5 text-primary-600" /> ข้อมูลเด็กวัยก่อนเรียน</CardTitle>
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
                                <input type="date" name="birth_date" value={child.birth_date} onChange={handleChildChange} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>ลำดับบุตร</label>
                                <input type="number" name="birth_order" value={child.birth_order} onChange={handleChildChange} className={inputClass} placeholder="เช่น 1" />
                            </div>
                            <div>
                                <label className={labelClass}>น้ำหนัก (กก.)</label>
                                <input type="number" step="0.1" name="weight" value={child.weight} onChange={handleChildChange} className={inputClass} placeholder="เช่น 15.5" />
                            </div>
                            <div>
                                <label className={labelClass}>ส่วนสูง (ซม.)</label>
                                <input type="number" step="0.1" name="height" value={child.height} onChange={handleChildChange} className={inputClass} placeholder="เช่น 100" />
                            </div>
                            <div>
                                <label className={labelClass}>จำนวนฟันผุ (ซี่)</label>
                                <input type="number" name="decayed_teeth" value={child.decayed_teeth} onChange={handleChildChange} className={inputClass} placeholder="0" />
                            </div>
                        </div>

                        {/* DSPM Section */}
                        <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800">พัฒนาการ (DSPM)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'dspm_gross_motor', label: 'กล้ามเนื้อมัดใหญ่' },
                                { name: 'dspm_fine_motor', label: 'กล้ามเนื้อมัดเล็ก / สติปัญญา' },
                                { name: 'dspm_language_comprehension', label: 'การเข้าใจภาษา' },
                                { name: 'dspm_language_use', label: 'การใช้ภาษา' },
                                { name: 'dspm_self_help', label: 'การช่วยเหลือตนเองและสังคม' },
                            ].map(field => (
                                <div key={field.name}>
                                    <label className={labelClass}>{field.label}</label>
                                    <select name={field.name} value={(child as Record<string, string>)[field.name]} onChange={handleChildChange} className={selectClass}>
                                        <option value="">-- เลือก --</option>
                                        <option value="normal">ปกติ</option>
                                        <option value="delayed">ล่าช้า</option>
                                        <option value="suspected">สงสัยล่าช้า</option>
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4">
                            <label className={labelClass}>ประวัติการพบทันตแพทย์</label>
                            <textarea name="dentist_visit_history" value={child.dentist_visit_history} onChange={handleChildChange}
                                className={inputClass + " h-20"} placeholder="รายละเอียด..." />
                        </div>

                        <button className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                            <Save className="h-4 w-4" /> บันทึกข้อมูลเด็ก
                        </button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
