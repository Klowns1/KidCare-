"use client";
import React from 'react';
import { AlertTriangle, Headset, ArrowRight, HeartPulse, Phone, Building2, Smartphone, MessageCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    return (
        <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6">
            
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-4 bg-teal-100 rounded-full mb-4">
                    <Headset className="h-8 w-8 text-teal-700" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">ศูนย์ช่วยเหลือ</h1>
                <p className="text-gray-500 text-sm flex items-center justify-center gap-1 mt-2">
                    เราพร้อมดูแลคุณและลูกน้อย <HeartPulse className="h-4 w-4 text-pink-500" />
                </p>
            </div>

            {/* Emergency Call - Big Button */}
            <div className="bg-red-50 rounded-3xl p-6 border-2 border-red-100 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10">
                    <AlertTriangle className="w-40 h-40 text-red-600" />
                </div>
                
                <h2 className="text-red-800 font-bold flex items-center gap-2 text-xl mb-1 relative z-10">
                    <AlertTriangle className="h-6 w-6" /> เกิดเหตุฉุกเฉิน
                </h2>
                <p className="text-red-700/80 text-sm mb-6 relative z-10">
                    เจ็บป่วยฉุกเฉิน อุบัติเหตุ โทรสายด่วนการแพทย์ฉุกเฉิน
                </p>
                
                <a href="tel:1669" className="relative z-10 flex w-full justify-center items-center gap-2 py-5 px-6 rounded-2xl bg-red-600 text-white font-black text-2xl shadow-lg shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    <Phone className="h-6 w-6" /> โทร 1669
                </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Local Health Center Call */}
                <a href="tel:0828899994" className="block bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:border-green-300 hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="h-12 w-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 relative z-10">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 relative z-10">สายตรง รพ.สต.</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 relative z-10 h-10">
                        ปรึกษาเจ้าหน้าที่สาธารณสุขในพื้นที่ร้อยเอ็ด
                    </p>
                    <div className="flex items-center text-green-600 font-bold text-sm bg-green-50 w-fit px-3 py-1.5 rounded-lg gap-2">
                        <Smartphone className="w-4 h-4" /> 082-889-9994
                    </div>
                </a>

                {/* Chat */}
                <Link href="/app/chat" className="block bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 relative z-10">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 relative z-10">แชทปรึกษา</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 relative z-10 h-10">
                        พิมพ์ข้อความทิ้งไว้ เดี๋ยวหมอตอบกลับให้ค่ะ
                    </p>
                    <div className="flex items-center text-blue-600 font-bold text-sm group-hover:gap-2 transition-all">
                        เปิดช่องแชท <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                </Link>

                {/* Appointments */}
                <Link href="/app/appointments" className="block sm:col-span-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] group flex items-center gap-4">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 bg-white text-purple-600 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                        <Calendar className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-0.5">นัดหมายออนไลน์</h3>
                        <p className="text-gray-600 text-sm sm:text-base leading-snug">
                            จองคิวฉีดวัคซีน พบหมอฟัน ไม่ต้องรอคิวนาน
                        </p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
                
            </div>
        </div>
    );
}
