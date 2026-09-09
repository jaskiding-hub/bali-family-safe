import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function WebsiteContent({
    stats = {},
}) {
    const { flash = {} } = usePage().props;
    const [activeTab, setActiveTab] = useState('overview');

    const {
        packages_count = 0,
        faqs_count = 0,
        testimonials_count = 0,
        site_features_count = 0,
    } = stats;

    return (
        <AdminLayout title="Website Content CMS">
            <div className="space-y-6 max-w-[1280px]">
                {/* Flash Message */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-in fade-in duration-200">
                        <svg className="w-5 h-5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Header & Tabs */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-[#00AEEF] bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                                    CMS Module
                                </span>
                                <span className="text-xs font-medium text-slate-400">&bull;</span>
                                <span className="text-xs font-medium text-slate-500">Website Content</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                                Website Content Management
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Kelola konten promosi, paket tur, FAQ, dan testimoni untuk landing page website.
                            </p>
                        </div>
                    </div>

                    {/* CMS Navigation Tabs */}
                    <div className="flex items-center gap-2 pt-4 overflow-x-auto no-scrollbar">
                        <button
                            type="button"
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                                activeTab === 'overview'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <span>Overview CMS</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('packages')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                                activeTab === 'packages'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <span>Tour Packages</span>
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                activeTab === 'packages' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                                {packages_count}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('faqs')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                                activeTab === 'faqs'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <span>FAQs</span>
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                activeTab === 'faqs' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                                {faqs_count}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('testimonials')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                                activeTab === 'testimonials'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <span>Testimonials</span>
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                activeTab === 'testimonials' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                                {testimonials_count}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 sm:p-5 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Packages</span>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                                {packages_count}
                            </h3>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">Tour Packages</span>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-sky-50 text-[#00AEEF] flex items-center justify-center shrink-0 border border-sky-100">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 sm:p-5 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">FAQs</span>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                                {faqs_count}
                            </h3>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">Pertanyaan Umum</span>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 sm:p-5 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Testimonials</span>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                                {testimonials_count}
                            </h3>
                            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Review Pelanggan</span>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 sm:p-5 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">Site Features</span>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                                {site_features_count}
                            </h3>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">Fitur & Layanan</span>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Content Section Placeholder */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-8 sm:p-12 text-center text-slate-500">
                    <div className="max-w-md mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#00AEEF] flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect width="18" height="18" x="3" y="3" rx="2" />
                                <path d="M3 9h18" />
                                <path d="M9 21V9" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">CMS Content Module</h4>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                            Modul pengelolaan konten website (Hero Banner, Tour Packages, Testimonials, FAQs). Armada kendaraan dan master data kini dikelola secara terpusat di halaman <strong>Master Data</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
