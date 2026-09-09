import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

export function useDriverProfile() {
    return {
        openProfile: () => {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-driver-profile'));
            }
        },
        closeProfile: () => {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('close-driver-profile'));
            }
        },
    };
}

export default function DriverLayout({ children, hideBottomNav = false }) {
    const { url, props } = usePage();
    const authDriver = props.auth?.driver || {
        id: 1,
        full_name: 'Wayan Arta',
        username: 'driver_bali',
        email: 'driver@transport.com',
        whatsapp_number: '08123456789',
        profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    };

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const openProfile = () => setIsProfileOpen(true);
    const closeProfile = () => setIsProfileOpen(false);

    useEffect(() => {
        const handleOpen = () => setIsProfileOpen(true);
        const handleClose = () => setIsProfileOpen(false);

        window.addEventListener('open-driver-profile', handleOpen);
        window.addEventListener('close-driver-profile', handleClose);

        const handleClick = (e) => {
            if (e.target.closest('.btn-open-driver-profile')) {
                setIsProfileOpen(true);
            }
        };
        document.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('open-driver-profile', handleOpen);
            window.removeEventListener('close-driver-profile', handleClose);
            document.removeEventListener('click', handleClick);
        };
    }, []);

    const isHome = url === '/driver' || url === '/driver/home' || url.startsWith('/driver/home');
    const isSchedule = url.startsWith('/driver/schedule');
    const isTripRoute = url.includes('/driver/trips') || url.includes('/driver/expense');
    const shouldShowBottomNav = !hideBottomNav && !isTripRoute;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/driver/logout');
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-start relative font-['Inter'] text-slate-800 selection:bg-[#00AEEF] selection:text-white">
            <Head title="Driver Bali Family Safe Tours" />
                
                {/* Main Content Slot */}
                <main className="flex-1 w-full flex flex-col">
                    {children}
                </main>

                {/* Bottom Navigation Bar */}
                {shouldShowBottomNav && (
                    <nav className="fixed z-50 transition-all duration-200 bottom-0 left-0 right-0 w-full sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl md:max-w-2xl sm:rounded-2xl sm:border sm:border-slate-200/80 sm:shadow-[0_10px_30px_rgba(0,0,0,0.08)] h-[64px] bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-8 flex items-center justify-around">
                        {/* Tab Beranda */}
                        <Link 
                            href="/driver/home" 
                            className="group relative flex flex-col items-center justify-center w-24 h-full transition-transform duration-200 ease-out active:scale-95"
                        >
                            {isHome ? (
                                <>
                                    <span className="absolute top-0 h-[2.5px] w-12 rounded-b-full bg-[#00AEEF] transition-all duration-300 ease-out"></span>
                                    <svg className="w-6 h-6 text-[#00AEEF] transition-transform duration-200 group-active:scale-95" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    <span className="text-[11px] font-semibold text-[#00658D] mt-0.5 tracking-tight">Beranda</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors duration-200 group-active:scale-95" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-600 mt-0.5 tracking-tight">Beranda</span>
                                </>
                            )}
                        </Link>

                        {/* Tab Schedule */}
                        <Link 
                            href="/driver/schedule" 
                            className="group relative flex flex-col items-center justify-center w-24 h-full transition-transform duration-200 ease-out active:scale-95"
                        >
                            {isSchedule ? (
                                <>
                                    <span className="absolute top-0 h-[2.5px] w-12 rounded-b-full bg-[#00AEEF] transition-all duration-300 ease-out"></span>
                                    <svg className="w-6 h-6 text-[#00AEEF] transition-transform duration-200 group-active:scale-95" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-[11px] font-semibold text-[#00658D] mt-0.5 tracking-tight">Schedule</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors duration-200 group-active:scale-95" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-600 mt-0.5 tracking-tight">Schedule</span>
                                </>
                            )}
                        </Link>
                    </nav>
                )}

                {/* Driver Profile Modal / Bottom Sheet Popup (Global) */}
                <div 
                    onClick={closeProfile}
                    className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99] transition-opacity duration-300 ${
                        isProfileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                />

                <div 
                    className={`fixed bottom-0 sm:bottom-auto sm:top-1/2 left-1/2 -translate-x-1/2 w-full max-w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl z-[100] transition-all duration-300 ease-out ${
                        isProfileOpen 
                            ? 'translate-y-0 sm:-translate-y-1/2 opacity-100 pointer-events-auto' 
                            : 'translate-y-full sm:translate-y-[-40%] opacity-0 pointer-events-none'
                    }`}
                >
                    {/* Top Drag Handle (Mobile) */}
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden"></div>

                    {/* Header Modal: Profile Avatar, Name, Driver ID & Close Button */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3.5">
                            <img 
                                src={authDriver.profile_photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'} 
                                alt={authDriver.full_name || 'Driver'} 
                                className="w-14 h-14 rounded-full object-cover border-2 border-[#00AEEF] shadow-sm shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                                <h3 className="text-base font-bold text-[#171C20] leading-tight truncate">
                                    {authDriver.full_name || 'Wayan Arta'}
                                </h3>
                                <span className="text-xs text-slate-500 mt-1">
                                    ID: <strong className="text-slate-700 font-semibold">DRV-00{authDriver.id || 1}</strong>
                                </span>
                            </div>
                        </div>

                        {/* Close Button (X) */}
                        <button 
                            type="button" 
                            onClick={closeProfile} 
                            className="p-2 -mr-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer" 
                            aria-label="Close modal"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Account Info Box */}
                    <div className="bg-[#EFF4FA] border border-[#DEE3E8] rounded-xl p-3.5 mb-5 flex flex-col gap-2.5 text-xs">
                        <div className="flex justify-between items-center text-slate-600">
                            <span className="font-medium text-slate-400">Email:</span>
                            <span className="font-bold text-slate-800">{authDriver.email || 'driver@transport.com'}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                            <span className="font-medium text-slate-400">Username:</span>
                            <span className="font-bold text-slate-800">{authDriver.username || 'driver_bali'}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                            <span className="font-medium text-slate-400">WhatsApp:</span>
                            <span className="font-bold text-slate-800">{authDriver.whatsapp_number || '08123456789'}</span>
                        </div>
                    </div>

                    {/* Logout Action Button */}
                    <form onSubmit={handleLogout} className="w-full">
                        <button 
                            type="submit" 
                            className="w-full h-11 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 active:scale-[0.985] text-rose-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                        >
                            <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Keluar / Sign Out</span>
                        </button>
                    </form>
                </div>
            </div>
    );
}
