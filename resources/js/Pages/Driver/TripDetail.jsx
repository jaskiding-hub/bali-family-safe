import React, { useState, useRef, useEffect } from 'react';
import { Link, router, usePage, useForm } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';

export default function TripDetail({ trip, authDriver }) {
    const { flash } = usePage().props;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { post } = useForm();

    // Query params for Back button
    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get('from') || 'home';
    const backDate = searchParams.get('date');
    const backMonth = searchParams.get('month');

    let backUrl = '/driver/home';
    if (from === 'schedule') {
        const params = new URLSearchParams();
        if (backDate) {
            params.set('date', backDate);
            params.set('month', backMonth || backDate.substring(0, 7));
        } else if (backMonth) {
            params.set('month', backMonth);
        }
        backUrl = `/driver/schedule?${params.toString()}`;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const isTripToday = trip?.trip_date ? trip.trip_date.startsWith(todayStr) || trip.trip_date === todayStr : false;
    const canAddExpense = isTripToday && (trip?.status !== 'completed');

    const getDetailBadgeStyle = (type) => {
        switch (type) {
            case 'Airport Drop-Off':
                return 'bg-[#FFDCC0] border border-[#FFB876] text-[#6B3B00]';
            case 'Hotel Transfers':
                return 'bg-[#D1F2E0] border border-[#A3E5C2] text-[#0A5A36]';
            case 'Day Tour':
                return 'bg-[#E5DEFF] border border-[#C7B8FF] text-[#372773]';
            default:
                return 'bg-[#D7E8FF] border border-[#ABC7FF] text-[#004C6B]';
        }
    };

    const cleanPhone = (trip?.guest_phone || '6281234567890').replace(/[^0-9]/g, '');

    // Interactive Slider Logic for Slide to Complete Trip
    const [sliderPos, setSliderPos] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const trackRef = useRef(null);
    const startXRef = useRef(0);

    const getMaxDrag = () => {
        if (!trackRef.current) return 200;
        return Math.max(0, trackRef.current.clientWidth - 52);
    };

    const handleTouchStart = (e) => {
        if (isCompleted) return;
        setIsDragging(true);
        startXRef.current = e.touches ? e.touches[0].clientX : e.clientX;
    };

    const handleTouchMove = (e) => {
        if (!isDragging || isCompleted) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const deltaX = clientX - startXRef.current;
        const maxDrag = getMaxDrag();
        const newPos = Math.max(0, Math.min(deltaX, maxDrag));
        setSliderPos(newPos);

        if (newPos >= maxDrag * 0.88) {
            setIsCompleted(true);
            setIsDragging(false);
            setSliderPos(maxDrag);
            // Complete trip via Inertia POST
            router.post(`/driver/trips/${trip.id}/complete`);
        }
    };

    const handleTouchEnd = () => {
        if (!isDragging || isCompleted) return;
        setIsDragging(false);
        const maxDrag = getMaxDrag();
        if (sliderPos < maxDrag * 0.88) {
            setSliderPos(0);
        }
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleTouchMove);
            window.addEventListener('mouseup', handleTouchEnd);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleTouchMove);
            window.removeEventListener('mouseup', handleTouchEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, sliderPos]);

    const totalExpenseAmount = trip?.expenses ? trip.expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) : 0;

    const handleLogout = (e) => {
        e.preventDefault();
        post('/driver/logout');
    };

    return (
        <DriverLayout hideBottomNav={true}>
            {/* Top App Bar Header */}
            <header className="w-full bg-white border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sticky top-0 z-30 anim-ease-up">
                <div className="max-w-6xl mx-auto h-[60px] px-4 sm:px-8 lg:px-12 flex items-center justify-between">
                    <Link 
                        href={backUrl} 
                        id="btn-back-nav" 
                        className="inline-flex items-center gap-1.5 p-2 -ml-2 rounded-xl hover:bg-slate-100 text-[#00658D] transition-all duration-200 ease-out active:scale-95 cursor-pointer" 
                        aria-label="Back"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-xs font-semibold">Back</span>
                    </Link>

                    <h1 className="text-[#171C20] text-base sm:text-lg font-bold tracking-tight">Trip Details</h1>

                    <button 
                        type="button" 
                        onClick={() => setIsProfileOpen(true)}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition active:scale-95 cursor-pointer" 
                        title="Driver Profile"
                    >
                        <img 
                            src={authDriver?.profile_photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"} 
                            alt="Driver Profile" 
                            className="w-8 h-8 rounded-full border border-[#00AEEF] object-cover"
                        />
                    </button>
                </div>
            </header>

            {/* Main Container Content */}
            <div className={`max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 w-full py-4 flex flex-col gap-4 font-['Inter'] ${
                (trip?.status === 'active' || trip?.status === 'up_next') ? 'pb-48 sm:pb-52' : 'pb-28 sm:pb-32'
            }`}>

                {flash?.success && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 anim-ease-up shadow-2xs">
                        <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Card 1: Route & Timeline */}
                <div className="p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 anim-ease-up delay-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap shadow-2xs ${getDetailBadgeStyle(trip?.trip_type)}`}>
                            {trip?.trip_type}
                        </span>
                        {trip?.flight_number && (
                            <span className="px-3 py-1 rounded-full bg-[#C6E7FF] text-[#00658D] text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                                </svg> 
                                {trip.flight_number}
                            </span>
                        )}
                    </div>

                    <div className="border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-xs font-medium block">
                            {trip?.trip_date || 'Today'}
                        </span>
                        <h2 className="text-[#171C20] text-2xl sm:text-3xl font-bold mt-0.5 tracking-tight">{trip?.trip_time}</h2>
                    </div>

                    <div className="flex items-stretch gap-3.5 my-1">
                        <div className="flex flex-col items-center w-4 shrink-0 py-1">
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00AEEF] bg-white shadow-xs shrink-0 animate-[softBreathing_2.8s_ease-in-out_infinite]"></div>
                            <div className="w-[2px] grow my-1 border-l-2 border-dashed border-[#00AEEF]/70"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-[#00AEEF] shadow-xs shrink-0"></div>
                        </div>

                        <div className="flex flex-col justify-between grow gap-5">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                                    Pickup Point
                                </span>
                                <span className="text-sm sm:text-base font-bold text-[#171C20] leading-snug block mt-0.5">
                                    {trip?.pickup_location}
                                </span>
                            </div>

                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                                    Drop-off Point / Route
                                </span>
                                <span className="text-sm sm:text-base font-bold text-[#171C20] leading-snug block mt-0.5">
                                    {trip?.dropoff_location}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Guest Details & Special Requests */}
                <div className="p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 anim-ease-up delay-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#EAEEF4] rounded-xl flex items-center justify-center text-[#00658D] shadow-2xs">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Guest Information</span>
                                <h2 className="text-base sm:text-lg font-bold text-[#171C20]">{trip?.guest_name}</h2>
                            </div>
                        </div>
                        {trip?.guest_type && (
                            <span className="bg-slate-100 text-[#00658D] text-xs font-semibold px-2.5 py-1 rounded-full">
                                {trip.guest_type}
                            </span>
                        )}
                    </div>

                    <div className="border-b border-slate-100"></div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                            <a href={`tel:${trip?.guest_phone || '+6281234567890'}`} className="flex items-center gap-2.5 text-slate-700 hover:text-[#00658D] text-xs sm:text-sm font-medium transition-all duration-200 ease-out active:scale-95">
                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{trip?.guest_phone || '+62 812-3456-7890'}</span>
                            </a>

                            <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-all duration-200 ease-out active:scale-95 flex items-center gap-1.5 text-xs font-bold shadow-2xs">
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                <span>WhatsApp</span>
                            </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#00658D] flex items-center justify-center shrink-0">
                                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Passengers</span>
                                    <span className="text-xs sm:text-sm font-bold text-[#171C20] block mt-0.5">{trip?.pax_description || `${trip?.pax} Pax`}</span>
                                </div>
                            </div>

                            {trip?.vehicle_type && (
                                <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#00658D] flex items-center justify-center shrink-0">
                                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4zM3 9l2-4h10l2 4M3 9h18v7a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Vehicle</span>
                                        <span className="text-xs sm:text-sm font-bold text-[#171C20] block mt-0.5">{trip.vehicle_type}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {trip?.special_requirements && (
                            <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-amber-900 text-xs sm:text-sm font-semibold shadow-2xs">
                                <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <div>
                                    <span className="font-bold block text-amber-950 uppercase text-[10px] tracking-wider mb-0.5">Special Request</span>
                                    <span>{trip.special_requirements}</span>
                                </div>
                            </div>
                        )}

                        {trip?.notes && (
                            <div className="bg-[#EFF4FA] rounded-xl p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed border border-[#DEE3E8]/60 shadow-2xs">
                                <div className="w-4 h-4 min-w-[16px] rounded-full bg-[#00658D] text-white flex items-center justify-center text-[9px] font-bold mt-0.5 shadow-xs">
                                    i
                                </div>
                                <div>
                                    <span className="font-bold text-[#171C20] block mb-0.5 uppercase tracking-wider text-[10px]">Important Note</span>
                                    <span>"{trip.notes}"</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card 3: Logged Expenses Summary */}
                <div className="p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3 anim-ease-up delay-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-sky-50 text-[#00658D] flex items-center justify-center">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Logged Expenses</h3>
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold text-[#00658D] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                            Rp {totalExpenseAmount.toLocaleString('id-ID')}
                        </span>
                    </div>
                    
                    {trip?.expenses && trip.expenses.length > 0 ? (
                        <div className="flex flex-col divide-y divide-slate-50 text-xs sm:text-sm">
                            {trip.expenses.map((exp) => (
                                <div key={exp.id} className="py-2.5 flex items-center justify-between">
                                    <span className="text-slate-700 font-medium">{exp.expense_type || exp.expense_name}</span>
                                    <span className="font-bold text-slate-900">Rp {Number(exp.amount).toLocaleString('id-ID')}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs sm:text-sm text-slate-400 italic py-1">No expenses recorded for this trip yet.</p>
                    )}
                </div>

                {/* Fixed Bottom Action Panel */}
                <div className="fixed z-40 transition-all duration-200 bottom-0 left-0 right-0 w-full sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl md:max-w-2xl sm:rounded-2xl sm:border sm:border-slate-200/80 sm:shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-4 anim-ease-up delay-4">
                    {(trip?.status === 'active' || trip?.status === 'up_next') ? (
                        <div className="w-full flex flex-col gap-3">
                            {/* Tombol '+ Add Expenses' (Only if trip is today & not completed) */}
                            {canAddExpense && (
                                <Link 
                                    href={`/driver/trips/${trip.id}/expense?from=${from}`} 
                                    className="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl border border-[#BDC8D1] bg-white hover:bg-slate-50 active:scale-[0.985] text-[#00658D] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                                    title="Add Expenses"
                                >
                                    <svg className="w-4 h-4 text-[#00658D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Add Expenses</span>
                                </Link>
                            )}

                            {/* Slider Bar 'Slide to Complete Trip' */}
                            <div 
                                ref={trackRef}
                                onMouseDown={handleTouchStart}
                                touchstart={handleTouchStart}
                                className="w-full h-13 bg-[#EAEEF4] rounded-full relative flex items-center p-1 shadow-inner select-none overflow-hidden touch-none cursor-pointer"
                            >
                                <div 
                                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#00AEEF]/20 to-[#00AEEF]/40 rounded-full pointer-events-none transition-all duration-75"
                                    style={{ width: `${sliderPos + 48}px` }}
                                />

                                <span 
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 font-semibold text-xs sm:text-sm tracking-wide pl-6 transition-opacity duration-150"
                                    style={{ opacity: Math.max(0, 1 - (sliderPos / getMaxDrag() * 1.5)) }}
                                >
                                    Slide to Complete Trip
                                </span>

                                <div 
                                    className="h-11 w-11 aspect-square rounded-full bg-[#00AEEF] text-white flex items-center justify-center shadow-md shrink-0 z-10 cursor-grab active:cursor-grabbing select-none touch-none will-change-transform transition-colors duration-300"
                                    style={{ transform: `translate3d(${sliderPos}px, 0, 0)` }}
                                >
                                    {isCompleted ? (
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : trip?.status === 'completed' ? (
                        <div className="w-full flex flex-col gap-2">
                            <Link 
                                href={`/driver/trips/${trip.id}/expense?from=${from}`} 
                                className="w-full h-11 rounded-xl border border-[#BDC8D1] bg-white hover:bg-slate-50 active:scale-[0.985] text-[#00658D] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                            >
                                <svg className="w-4 h-4 text-[#00658D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Add Expenses</span>
                            </Link>
                            <div className="w-full py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs">
                                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                    </svg>
                                </div>
                                <span>Trip Completed • All tasks finished</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full py-3 px-4 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-600 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>Scheduled Trip • Actions available on departure</span>
                        </div>
                    )}
                </div>

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
                                    src={authDriver?.profile_photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"} 
                                    alt={authDriver?.full_name || "Driver"} 
                                    className="w-14 h-14 rounded-full object-cover border-2 border-[#00AEEF] shadow-sm shrink-0"
                                />
                                <div className="flex flex-col min-w-0">
                                    <h3 className="text-base font-bold text-[#171C20] leading-tight truncate">{authDriver?.full_name || 'Wayan Arta'}</h3>
                                    <span className="text-xs text-slate-500 mt-1">ID: <strong className="text-slate-700 font-semibold">DRV-00{authDriver?.id || 1}</strong></span>
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
                                <span className="font-bold text-slate-800">{authDriver?.email || 'driver@transport.com'}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="font-medium text-slate-400">Username:</span>
                                <span className="font-bold text-slate-800">{authDriver?.username || 'driver_bali'}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="font-medium text-slate-400">WhatsApp:</span>
                                <span className="font-bold text-slate-800">{authDriver?.whatsapp_number || '08123456789'}</span>
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
