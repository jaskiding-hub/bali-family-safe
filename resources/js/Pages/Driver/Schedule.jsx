import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';

export default function Schedule({
    calendarDays,
    tripsByDate,
    monthName,
    prevMonth,
    nextMonth,
    monthParam,
    selectedDate,
    driver,
    trips,
}) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { post } = useForm();

    const getTripTypeStyles = (type) => {
        switch (type) {
            case 'Airport Drop-Off':
                return {
                    accent_bar: 'bg-[#EA8C21]',
                    badge: 'bg-[#FFDCC0] border border-[#FFB876] text-[#6B3B00]',
                    icon_bg: 'bg-[#FFF4E8]',
                    icon_color: 'text-[#8D4F00]',
                    box_bg: 'bg-[#FFF9F2]',
                    box_border: 'border-[#FFE6D0]',
                    btn_border: 'border-[#8D4F00]',
                    btn_text: 'text-[#8D4F00]',
                    btn_hover: 'hover:bg-amber-50',
                };
            case 'Hotel Transfers':
                return {
                    accent_bar: 'bg-[#10B981]',
                    badge: 'bg-[#D1F2E0] border border-[#A3E5C2] text-[#0A5A36]',
                    icon_bg: 'bg-[#EBFBF3]',
                    icon_color: 'text-[#0A5A36]',
                    box_bg: 'bg-[#F2FCF7]',
                    box_border: 'border-[#D1F2E0]',
                    btn_border: 'border-[#0A5A36]',
                    btn_text: 'text-[#0A5A36]',
                    btn_hover: 'hover:bg-emerald-50',
                };
            case 'Day Tour':
                return {
                    accent_bar: 'bg-[#6366F1]',
                    badge: 'bg-[#E5DEFF] border border-[#C7B8FF] text-[#372773]',
                    icon_bg: 'bg-[#F3EFFF]',
                    icon_color: 'text-[#4338CA]',
                    box_bg: 'bg-[#F8F6FF]',
                    box_border: 'border-[#E5DEFF]',
                    btn_border: 'border-[#4338CA]',
                    btn_text: 'text-[#4338CA]',
                    btn_hover: 'hover:bg-indigo-50',
                };
            default: // Airport Pick-Up
                return {
                    accent_bar: 'bg-[#00AEEF]',
                    badge: 'bg-[#D7E8FF] border border-[#ABC7FF] text-[#004C6B]',
                    icon_bg: 'bg-[#E4E9EE]',
                    icon_color: 'text-[#00658D]',
                    box_bg: 'bg-[#F5FAFF]',
                    box_border: 'border-[#DEE3E8]',
                    btn_border: 'border-[#00658D]',
                    btn_text: 'text-[#00658D]',
                    btn_hover: 'hover:bg-sky-50',
                };
        }
    };

    const handleSelectDate = (date) => {
        router.get('/driver/schedule', { month: monthParam, date }, { preserveState: true, preserveScroll: true });
    };

    const handleLogout = (e) => {
        e.preventDefault();
        post('/driver/logout');
    };

    return (
        <DriverLayout>
            {/* Top App Bar Header */}
            <header className="w-full bg-[#3E5E95] border-b border-white/10 shadow-sm sticky top-0 z-30 anim-ease-up">
                <div className="max-w-6xl mx-auto h-[64px] px-4 sm:px-8 lg:px-12 flex items-center justify-between">
                    <button 
                        type="button" 
                        onClick={() => setIsProfileOpen(true)}
                        className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
                    >
                        <img 
                            src={driver?.profile_photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"} 
                            alt="Driver Profile Avatar" 
                            className="w-[40px] h-[40px] border-2 border-white rounded-full object-cover shadow-sm transition-transform duration-200 group-hover:scale-105 active:scale-95 shrink-0"
                        />
                        <h1 className="text-white text-lg font-bold group-hover:text-sky-200 transition-colors">Driver Portal</h1>
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setIsProfileOpen(true)}
                        className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer" 
                        title="View Profile"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Main Container Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 w-full py-5 pb-28 sm:pb-32 flex flex-col gap-5 font-['Inter'] selection:bg-[#00AEEF] selection:text-white">
                {/* Screen Title */}
                <div className="anim-ease-up delay-1">
                    <h2 className="text-[#171C20] text-2xl font-bold tracking-tight">My Schedule</h2>
                </div>

                {/* Month Navigation Header & Calendar Card */}
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 anim-ease-up delay-1">
                    {/* Month Navigation Header */}
                    <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-slate-100">
                        <Link 
                            href={`/driver/schedule?month=${prevMonth}`}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-90 text-slate-600 transition cursor-pointer border border-slate-200/60"
                            title="Bulan Sebelumnya"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>

                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#00658D]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">{monthName}</span>
                        </div>

                        <Link 
                            href={`/driver/schedule?month=${nextMonth}`}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-90 text-slate-600 transition cursor-pointer border border-slate-200/60"
                            title="Bulan Berikutnya"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Day Names Row */}
                    <div className="grid grid-cols-7 text-center mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                            <span key={idx} className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                {day}
                            </span>
                        ))}
                    </div>

                    {/* 7-Column Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                        {calendarDays?.map((dayItem, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelectDate(dayItem.date)}
                                className={`relative aspect-square flex flex-col items-center justify-center rounded-xl p-1 transition cursor-pointer ${
                                    dayItem.is_selected
                                        ? 'bg-[#00AEEF] text-white font-bold shadow-md shadow-sky-500/20'
                                        : dayItem.is_today
                                        ? 'bg-sky-50 text-[#00658D] font-bold border border-sky-300'
                                        : dayItem.is_current_month
                                        ? 'text-slate-800 hover:bg-slate-100 font-semibold'
                                        : 'text-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                <span className="text-xs sm:text-sm">{dayItem.day_number}</span>
                                {dayItem.trip_count > 0 && (
                                    <span className={`w-1.5 h-1.5 rounded-full mt-1 ${
                                        dayItem.is_selected ? 'bg-white' : 'bg-[#00AEEF]'
                                    }`} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Date Header */}
                <div className="flex items-center justify-between px-1 anim-ease-up delay-2">
                    <h3 className="text-slate-900 text-lg font-bold tracking-tight">
                        Trips for {selectedDate}
                    </h3>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-[#00658D] border border-sky-200/80">
                        {trips?.length || 0} {trips?.length === 1 ? 'Trip' : 'Trips'}
                    </span>
                </div>

                {/* Trips List */}
                {trips && trips.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {trips.map((tripItem) => {
                            const styles = getTripTypeStyles(tripItem.trip_type);
                            return (
                                <div 
                                    key={tripItem.id}
                                    className={`bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col gap-4 anim-ease-up relative overflow-hidden`}
                                >
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${styles.accent_bar}`} />
                                    
                                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles.badge}`}>
                                            {tripItem.trip_type}
                                        </span>
                                        <span className="text-xs font-bold text-slate-500">
                                            ⏰ {tripItem.trip_time}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <h4 className="text-base sm:text-lg font-bold text-slate-900">{tripItem.guest_name}</h4>
                                        <div className="text-xs text-slate-500 flex items-start gap-1">
                                            <span>📍 Pickup:</span>
                                            <strong className="text-slate-800">{tripItem.pickup_location}</strong>
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-start gap-1">
                                            <span>🏁 Dropoff:</span>
                                            <strong className="text-slate-800">{tripItem.dropoff_location}</strong>
                                        </div>
                                    </div>

                                    <Link 
                                        href={`/driver/trips/${tripItem.id}?from=schedule`}
                                        className={`w-full h-11 rounded-xl border ${styles.btn_border} ${styles.btn_text} ${styles.btn_hover} font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer mt-1`}
                                    >
                                        <span>View Trip Details</span>
                                        <span>&rarr;</span>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200/60 shadow-xs">
                        Tidak ada jadwal perjalanan untuk tanggal ini.
                    </div>
                )}

            </div>

            {/* Profile Sheet Modal */}
            {isProfileOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99] transition-opacity duration-300 cursor-pointer"
                        onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="fixed bottom-0 sm:bottom-auto sm:top-1/2 left-1/2 -translate-x-1/2 w-full max-w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl z-[100] transition-all duration-300 ease-out translate-y-0 sm:-translate-y-1/2 opacity-100">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden"></div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3.5">
                                <img 
                                    src={driver?.profile_photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"} 
                                    alt={driver?.full_name || "Driver"} 
                                    className="w-14 h-14 rounded-full object-cover border-2 border-[#00AEEF] shadow-sm shrink-0"
                                />
                                <div className="flex flex-col min-w-0">
                                    <h3 className="text-base font-bold text-[#171C20] leading-tight truncate">{driver?.full_name || 'Wayan Arta'}</h3>
                                    <span className="text-xs text-slate-500 mt-1">ID: <strong className="text-slate-700 font-semibold">DRV-00{driver?.id || 1}</strong></span>
                                </div>
                            </div>
                            <button type="button" onClick={() => setIsProfileOpen(false)} className="p-2 -mr-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="bg-[#EFF4FA] border border-[#DEE3E8] rounded-xl p-3.5 mb-5 flex flex-col gap-2.5 text-xs">
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="font-medium text-slate-400">Email:</span>
                                <span className="font-bold text-slate-800">{driver?.email || 'driver@transport.com'}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="font-medium text-slate-400">Username:</span>
                                <span className="font-bold text-slate-800">{driver?.username || 'driver_bali'}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="font-medium text-slate-400">WhatsApp:</span>
                                <span className="font-bold text-slate-800">{driver?.whatsapp_number || '08123456789'}</span>
                            </div>
                        </div>
                        <form onSubmit={handleLogout} className="w-full">
                            <button type="submit" className="w-full h-11 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 active:scale-[0.985] text-rose-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs">
                                <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Keluar / Sign Out</span>
                            </button>
                        </form>
                    </div>
                </>
            )}
        </DriverLayout>
    );
}
