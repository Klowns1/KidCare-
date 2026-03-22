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
            href: '/app/chat',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            icon: Phone,
            title: 'ติดต่อเจ้าหน้าที่สาธารณสุข',
            description: 'ติดต่อเจ้าหน้าที่สาธารณสุขในพื้นที่จังหวัดร้อยเอ็ด',
            action: 'โทรติดต่อ',
            href: 'tel:0828899994',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            icon: AlertTriangle,
            title: 'เบอร์ฉุกเฉิน',
            description: 'สายด่วนกรณีฉุกเฉิน',
            action: '1669',
            href: 'tel:1669',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
        {
            icon: Calendar,
            title: 'นัดหมาย',
            description: 'นัดหมายพบแพทย์หรือทันตแพทย์',
            action: 'นัดหมาย',
            href: '/app/appointments',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];

    return (
        <div className="space-y-6 p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Phone className="h-6 w-6 text-primary-600" /> ติดต่อบุคลากรสุขภาพ
            </h1>
            <p className="text-gray-600">ช่องทางการสื่อสารกับบุคลากรสุขภาพและผู้เชี่ยวชาญ</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {contacts.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <Card key={idx} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-opacity-50">
                            <CardHeader className={item.bgColor + " rounded-t-lg border-b border-white/50"}>
                                <CardTitle className={`flex items-center gap-3 text-lg ${item.color}`}>
                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                        <Icon className="h-5 w-5" /> 
                                    </div>
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-5 pb-5">
                                <p className="text-gray-600 text-sm mb-5 min-h-[40px] leading-relaxed">{item.description}</p>
                                <a 
                                    href={item.href} 
                                    className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-white bg-primary-600 hover:bg-primary-700 hover:shadow-md transition-all active:scale-95 w-fit`}
                                >
                                    {item.action}
                                </a>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
