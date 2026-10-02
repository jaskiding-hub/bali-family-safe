import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function DriverLogin() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
    });

    // Clear any previous remember login from storage
    useEffect(() => {
        try {
            localStorage.removeItem('bfs_driver_remember_login');
        } catch (e) {}
    }, []);

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post('/driver/login');
    };

    const errorList = Object.values(errors);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            <Head title="Driver Login — Bali Family Safe" />

            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 mb-4">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="9" />
                            <circle cx="12" cy="12" r="3" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v6m0 6v6M3 12h6m6 0h6" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900 mb-1">Driver Portal</h1>
                    <p className="text-sm text-slate-500">Bali Family Safe Tours</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    {/* Error/Success Messages */}
                    {errorList.length > 0 && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {errorList.map((err, i) => (
                                <p key={i}>{err}</p>
                            ))}
                        </div>
                    )}

                    {flash?.success && (
                        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email/Username */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email or Username
                            </label>
                            <input
                                type="text"
                                required
                                autoFocus
                                value={data.login}
                                onChange={(e) => setData('login', e.target.value)}
                                placeholder="driver@example.com"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter password"
                                    className="w-full px-4 py-2.5 pr-11 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                            <line x1="2" y1="2" x2="22" y2="22" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium py-2.5 rounded-lg transition"
                        >
                            {processing ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs font-medium text-slate-700 mb-2">Demo Account</p>
                        <div className="text-xs text-slate-600 space-y-1 font-mono">
                            <div>Email: <span className="text-slate-900">driver@transport.com</span></div>
                            <div>Password: <span className="text-slate-900">password123</span></div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} Bali Family Safe Tours
                </p>
            </div>
        </div>
    );
}
