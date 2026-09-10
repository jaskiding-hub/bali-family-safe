import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function AdminLogin() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isAutofilled, setIsAutofilled] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    const handleAutofill = () => {
        setData({
            ...data,
            email: 'admin@bfs.test',
            password: 'password123',
        });
        setIsAutofilled(true);
        setTimeout(() => setIsAutofilled(false), 600);
    };

    return (
        <div className="min-h-screen min-h-dvh bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 font-['Inter'] selection:bg-[#00AEEF] selection:text-white">
            <Head title="Login Admin — Bali Family Safe" />

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="px-8 pt-8 pb-6 text-center border-b border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-[#00AEEF] flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                            <circle cx="7" cy="17" r="2" />
                            <path d="M9 17h6" />
                            <circle cx="17" cy="17" r="2" />
                        </svg>
                    </div>

                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                        Bali Family Safe
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Portal Administrasi & Operasional Wisata
                    </p>
                </div>

                {/* Form Body */}
                <div className="p-8 space-y-5">
                    {errors.email && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium">
                            {errors.email}
                        </div>
                    )}

                    {flash?.success && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
                            {flash.success}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-700">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                autoFocus
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="admin@bfs.test"
                                className={`w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition ${
                                    isAutofilled ? 'ring-2 ring-[#00AEEF] bg-sky-50/40' : ''
                                }`}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition ${
                                        isAutofilled ? 'ring-2 ring-[#00AEEF] bg-sky-50/40' : ''
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                            <line x1="2" y1="2" x2="22" y2="22" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF] border-slate-300"
                                />
                                <span className="text-xs text-slate-600">Ingat sesi</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#00AEEF] hover:bg-[#009cd7] text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <span>Memproses...</span>
                            ) : (
                                <span>Masuk ke Akun</span>
                            )}
                        </button>
                    </form>

                    {/* Demo Account Box */}
                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-700">Akun Demo Administrator</span>
                            <button
                                type="button"
                                onClick={handleAutofill}
                                className="text-xs font-semibold text-[#00AEEF] hover:text-[#008dbf] cursor-pointer"
                            >
                                Isi Otomatis
                            </button>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                            <div>Email: <span className="text-slate-800 font-semibold">admin@bfs.test</span></div>
                            <div>Password: <span className="text-slate-800 font-semibold">password123</span></div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-3.5 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} Bali Family Safe Tours
                </div>
            </div>
        </div>
    );
}
