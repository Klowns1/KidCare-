import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageCircle, Phone, Calendar, AlertTriangle } from 'lucide-react';

export default function ContactPage() {
    const contacts = [
        {
            icon: MessageCircle,
            title: 'แชทถามผู้เชี่ยวชาญ',
            description: 'สอบถามปัญหาสุขภาพเด็กกับผู้เชี่ยวชาญด้านสุขภาพ',
            action: 'เริ่มแชท',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            icon: Phone,
            title: 'ติดต่อเจ้าหน้าที่สาธารณสุข',
            description: 'ติดต่อเจ้าหน้าที่สาธารณสุขในพื้นที่จังหวัดร้อยเอ็ด',
            action: 'โทรติดต่อ',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            icon: AlertTriangle,
            title: 'เบอร์ฉุกเฉิน',
            description: 'สายด่วนกรณีฉุกเฉิน',
            action: '1669',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
        {
            icon: Calendar,
            title: 'นัดหมาย',
            description: 'นัดหมายพบแพทย์หรือทันตแพทย์',
            action: 'นัดหมาย',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Phone className="h-6 w-6 text-primary-600" /> ติดต่อบุคลากรสุขภาพ
            </h1>
            <p className="text-gray-600">ช่องทางการสื่อสารกับบุคลากรสุขภาพและผู้เชี่ยวชาญ</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className={item.bgColor + " rounded-t-lg"}>
                                <CardTitle className={`flex items-center gap-2 text-lg ${item.color}`}>
                                    <Icon className="h-5 w-5" /> {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                                <button className={`px-4 py-2 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors`}>
                                    {item.action}
                                </button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
