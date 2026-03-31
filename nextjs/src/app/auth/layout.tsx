import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const productName = process.env.NEXT_PUBLIC_PRODUCTNAME || 'KidCare';
    const testimonials = [
        {
            quote: "แอพนี้ช่วยให้ผมดูแลลูกง่ายขึ้นมาก ฟีเจอร์ติดตามพัฒนาการและการแจ้งเตือนเป็นสิ่งที่ดีมากจริงๆ",
            author: "สมชาย ม.",
            role: "คุณพ่อของน้องก้อง (3 ขวบ)",
            avatar: "สม"
        },
        {
            quote: "คลังความรู้ที่รวมถึงการดูแลสุขภาพฟันและโภชนาการช่วยให้แม่มีความมั่นใจมากขึ้น ขอบคุณมากค่ะ",
            author: "วิริยา ส.",
            role: "คุณแม่ของน้องน้ำใส (2 ขวบ)",
            avatar: "วิ"
        },
        {
            quote: "กราฟติดตามการเจริญเติบโตทำให้เห็นพัฒนาการของลูกได้ชัดเจน ใช้งานง่ายและมีประโยชน์มากสำหรับคนเป็นแม่",
            author: "มะลิวรรณ จ.",
            role: "คุณแม่ของน้องต้นไม้ (4 ขวบ)",
            avatar: "มะ"
        }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Side — Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-12 bg-white relative">
                {/* Back Link */}
                <Link
                    href="/"
                    className="absolute left-4 sm:left-8 top-4 sm:top-8 flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors p-2 -ml-2 rounded-xl hover:bg-gray-100 active:bg-gray-200"
                >
                    <ArrowLeft className="w-5 h-5 mr-1.5" />
                    กลับหน้าหลัก
                </Link>

                {/* Brand */}
                <div className="mx-auto w-full max-w-sm">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                            <Heart className="h-6 w-6 text-white" fill="white" />
                        </div>
                    </div>
                    <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-3">
                        {productName}
                    </h2>
                    <p className="text-center text-gray-500 text-sm mt-1.5">
                        ระบบดูแลสุขภาพเด็กปฐมวัย
                    </p>
                </div>

                {/* Form Content */}
                <div className="mt-6 sm:mt-8 mx-auto w-full max-w-sm">
                    {children}
                </div>
            </div>

            {/* Right Side — Testimonials (desktop only) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-800">
                <div className="w-full flex items-center justify-center p-12">
                    <div className="space-y-6 max-w-lg">
                        <h3 className="text-white text-2xl font-bold mb-8">
                            ได้รับความไว้วางใจจากคุณพ่อคุณแม่ 💚
                        </h3>
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base">
                                            {testimonial.avatar}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white/90 mb-2 font-light leading-relaxed">
                                            &quot;{testimonial.quote}&quot;
                                        </p>
                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-white">
                                                {testimonial.author}
                                            </p>
                                            <p className="text-sm text-green-200">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="mt-8 text-center">
                            <p className="text-green-100 text-sm">
                                ร่วมดูแลสุขภาพเด็กให้แข็งแรงสมวัยไปกับ {productName}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}