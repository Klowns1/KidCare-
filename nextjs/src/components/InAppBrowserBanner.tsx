'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const DISMISS_KEY = 'kidcare_inapp_banner_dismissed';

function isInAppBrowser(): boolean {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    return /FBAN|FBAV|FB_IAB|FB4A|FBIOS|Messenger|Line\/|Instagram/i.test(ua);
}

export default function InAppBrowserBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!sessionStorage.getItem(DISMISS_KEY) && isInAppBrowser()) {
            setVisible(true);
        }
    }, []);

    if (!visible) return null;

    function dismiss() {
        sessionStorage.setItem(DISMISS_KEY, '1');
        setVisible(false);
    }

    return (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-3">
            <div className="flex items-start gap-3 max-w-lg mx-auto">
                <p className="flex-1 text-sm text-amber-900 leading-relaxed">
                    เปิดจากแอปอื่นอยู่ค่ะ หากเข้าเมนูไม่ได้ ให้กดปุ่ม{' '}
                    <span className="font-bold">⋯</span>
                    {' '}มุมบนขวา แล้วเลือก{' '}
                    <span className="font-bold">เปิดใน Chrome หรือ Safari</span>
                </p>
                <button
                    type="button"
                    onClick={dismiss}
                    className="p-1 rounded-full hover:bg-amber-100 flex-shrink-0"
                    aria-label="ปิดคำแนะนำ"
                >
                    <X className="w-4 h-4 text-amber-700" />
                </button>
            </div>
        </div>
    );
}
