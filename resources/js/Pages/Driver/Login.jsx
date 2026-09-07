import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';

export default function Login() {
    const { errors, flash } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [isAutofilled, setIsAutofilled] = useState(false);

    const { data, setData, post, processing } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/driver/login');
    };

    const handleAutofill = () => {
        setData((prev) => ({
            ...prev,
            login: 'driver@transport.com',
            password: 'password123',
        }));
        setIsAutofilled(true);
        setTimeout(() => setIsAutofilled(false), 600);
    };

    return (
        <div className="min-h-screen min-h-dvh bg-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 selection:bg-[#00AEEF] selection:text-white font-['Inter']">
            {/* Responsive Outer Container: Adapts from single column on mobile to split 2-column card on desktop */}
            <div className="w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-slate-200/80 overflow-hidden anim-ease-up">

                <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
                    
                    {/* Left Side Pane (Desktop & Tablet Hero Section / Mobile Top Banner) */}
                    <div className="md:col-span-5 bg-gradient-to-br from-[#2B436D] via-[#3E5E95] to-[#243A61] p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden flex flex-col justify-between items-center text-center">
                        
                        {/* Decorative Ambient Glow Circles */}
                        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
                        <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-[#00AEEF]/20 blur-2xl pointer-events-none"></div>

                        {/* Centered Brand & Header Section */}
                        <div className="relative z-10 flex flex-col items-center text-center my-auto py-4">
                            {/* Steering Wheel / Driver Icon Badge */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-4 sm:mb-5 shadow-lg transition-transform duration-300 hover:scale-105 mx-auto">
                                <svg className="w-8 h-8 sm:w-9 sm:h-9 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="9" strokeWidth="2" />
                                    <circle cx="12" cy="12" r="3" strokeWidth="2" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v6m0 6v6M3 12h6m6 0h6" />
                                </svg>
                            </div>

                            {/* Portal Titles */}
                            <span className="text-sky-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1 block">Bali Family Safe</span>
                            <h1 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">Driver Portal</h1>
                            <p className="text-white/80 text-xs sm:text-sm font-normal max-w-xs leading-relaxed mx-auto">
                                Log in with the credentials provided by admin to manage your daily trip schedules & expenses.
                            </p>
                        </div>

                        {/* Footer Copyright Note (Desktop Pane Left) */}
                        <div className="relative z-10 text-[11px] text-white/60 font-medium hidden md:block text-center w-full">
                            &copy; {new Date().getFullYear()} Bali Family Safe • Transport Division
                        </div>
                    </div>

                    {/* Right Side Form Pane */}
                    <div className="md:col-span-7 p-6 sm:p-8 bg-white flex flex-col justify-between">
                        <div className="flex flex-col gap-4">
                            
                            {/* Success Flash Alert */}
                            {flash?.success && (
                                <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-800 text-xs flex items-center gap-2.5 anim-ease-up shadow-2xs">
                                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium leading-relaxed">{flash.success}</span>
                                </div>
                            )}

                            {/* Error Flash / Validation Alert */}
                            {Object.keys(errors).length > 0 && (
                                <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-800 text-xs flex items-start gap-2.5 anim-ease-up shadow-2xs">
                                    <svg className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div className="flex-1 font-medium leading-relaxed">
                                        {Object.values(errors).map((err, idx) => (
                                            <p key={idx}>{err}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Login Form */}
                            <form onSubmit={handleSubmit} id="driver-login-form" className="flex flex-col gap-3.5">
                                {/* Input 1: Email / Username */}
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="login-input" className="text-[11px] font-bold text-[#3E4850] uppercase tracking-wider">
                                        Email or Username
                                    </label>
                                    <div className="relative w-full flex items-center">
                                        <div className="absolute left-3.5 text-[#6E7881] pointer-events-none">
                                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input 
                                            type="text" 
                                            name="login" 
                                            id="login-input" 
                                            value={data.login} 
                                            onChange={(e) => setData('login', e.target.value)}
                                            placeholder="driver@transport.com or driver_bali" 
                                            required
                                            autoComplete="username"
                                            className={`w-full h-11 pl-10 pr-4 rounded-xl border border-[#BDC8D1] bg-white text-xs sm:text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] outline-none transition ${
                                                isAutofilled ? 'ring-2 ring-[#00AEEF]' : ''
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* Input 2: Password with Show/Hide Toggle */}
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="password-input" className="text-[11px] font-bold text-[#3E4850] uppercase tracking-wider">
                                        Password
                                    </label>
                                    <div className="relative w-full flex items-center">
                                        <div className="absolute left-3.5 text-[#6E7881] pointer-events-none">
                                            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input 
                                            type={showPassword ? 'text' : 'password'} 
                                            name="password" 
                                            id="password-input" 
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Enter your password" 
                                            required
                                            autoComplete="current-password"
                                            className={`w-full h-11 pl-10 pr-12 rounded-xl border border-[#BDC8D1] bg-white text-xs sm:text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] outline-none transition ${
                                                isAutofilled ? 'ring-2 ring-[#00AEEF]' : ''
                                            }`}
                                        />
                                        {/* Show/Hide Password Toggle Button */}
                                        <button 
                                            type="button" 
                                            id="toggle-password-btn" 
                                            aria-label="Toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 p-1.5 rounded-lg text-[#6E7881] hover:text-[#00658D] hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
                                        >
                                            {showPassword ? (
                                                /* Eye Open Icon */
                                                <svg id="eye-open-icon" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            ) : (
                                                /* Eye Closed Icon */
                                                <svg id="eye-closed-icon" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me Checkbox */}
                                <div className="flex items-center justify-between pt-0.5">
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input 
                                            type="checkbox" 
                                            name="remember" 
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF] border-slate-300"
                                        />
                                        <span className="text-xs text-[#3E4850] font-medium">Remember me</span>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full h-11 bg-[#00AEEF] hover:bg-[#009cd7] active:scale-[0.985] text-[#003E58] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/20 cursor-pointer disabled:opacity-70"
                                >
                                    <span>Sign In to Portal</span>
                                </button>
                            </form>

                            {/* Demo Hint Card (Kredensial Dummy Admin) */}
                            <div className="bg-[#EFF4FA] border border-[#DEE3E8] rounded-2xl p-3.5 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#00658D] animate-ping"></span>
                                        <span className="text-[11px] font-bold text-[#00658D] uppercase tracking-wider">Demo Credentials</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        id="btn-autofill" 
                                        onClick={handleAutofill}
                                        className="text-[10px] font-bold text-[#00AEEF] hover:text-[#008dbf] active:scale-95 transition cursor-pointer bg-white px-2 py-1 rounded-lg border border-sky-200 shadow-2xs"
                                    >
                                        ⚡ Quick Autofill
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-white/80 p-2 sm:p-2.5 rounded-xl border border-slate-200/60 font-mono">
                                    <div className="min-w-0">
                                        <span className="text-[9px] uppercase font-sans text-slate-400 block font-semibold">Username / Email</span>
                                        <span className="text-slate-800 font-bold truncate block text-[11px]">driver@transport.com</span>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[9px] uppercase font-sans text-slate-400 block font-semibold">Password</span>
                                        <span className="text-slate-800 font-bold truncate block text-[11px]">password123</span>
                                    </div>
                                </div>
                                
                                <span className="text-[10px] text-slate-500 font-medium text-center sm:text-left">
                                    Driver account assigned: <strong className="text-slate-700">Wayan Arta</strong> (Role: Driver)
                                </span>
                            </div>

                            {/* Footer Copyright Note (Mobile View Only) */}
                            <div className="text-center text-[10px] text-slate-400 font-medium pt-1 md:hidden">
                                &copy; {new Date().getFullYear()} Bali Family Safe • Transport Division
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
