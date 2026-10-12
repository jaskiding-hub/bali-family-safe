import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import DriverLayout, { useDriverProfile } from '../../Layouts/DriverLayout';

function formatRupiah(amount) {
    const num = Math.round(Number(amount) || 0);
    return 'Rp ' + num.toLocaleString('id-ID');
}

function formatDate(dateStr) {
    if (!dateStr) return 'Monday, 24 August 2026';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function isTripDepartureReached(trip) {
    const status = (trip?.status || '').toLowerCase();
    if (status === 'on going' || status === 'in_progress') return true;

    const tripDate = trip?.booking_date || trip?.trip_date;
    const tripTime = trip?.pickup_time || trip?.trip_time;
    if (!tripDate) return true;

    try {
        const timePart = tripTime ? tripTime.substring(0, 5) : '00:00';
        const [year, month, day] = tripDate.split('-').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);

        // Current time in Bali (Asia/Makassar, UTC+8)
        const now = new Date();
        const baliTimeString = now.toLocaleString('en-US', { timeZone: 'Asia/Makassar' });
        const nowInBali = new Date(baliTimeString);

        const scheduledTime = new Date(year, month - 1, day, hour, minute, 0);

        return nowInBali >= scheduledTime;
    } catch (e) {
        const timePart = tripTime ? tripTime.substring(0, 5) : '00:00';
        const scheduled = new Date(`${tripDate}T${timePart}:00`);
        return new Date() >= scheduled;
    }
}

export default function TripDetail({ trip, authDriver }) {
    const { flash, csrf_token } = usePage().props;
    const { openProfile } = useDriverProfile();

    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const from = searchParams.get('from') || 'home';
    const backDate = searchParams.get('date');
    const backMonth = searchParams.get('month');

    let backUrl = '/driver/home';
    if (from === 'schedule') {
        const params = new URLSearchParams();
        if (backDate) params.set('date', backDate);
        if (backMonth) params.set('month', backMonth);
        backUrl = `/driver/schedule${params.toString() ? '?' + params.toString() : ''}`;
    } else if (from === 'history') {
        backUrl = '/driver/history';
    }

    const expenseUrlParams = new URLSearchParams();
    if (from) expenseUrlParams.set('from', from);
    if (backDate) expenseUrlParams.set('date', backDate);
    if (backMonth) expenseUrlParams.set('month', backMonth);
    const expenseUrl = `/driver/trips/${trip.id}/expense${expenseUrlParams.toString() ? '?' + expenseUrlParams.toString() : ''}`;

    // Badge styling
    let detailBadgeStyle = 'bg-[#D7E8FF] border border-[#ABC7FF] text-[#004C6B]';
    if (trip.trip_type === 'Airport Drop-Off' || (trip.booking_type === 'Airport Transfer' && trip.trip_type?.includes('Drop-Off'))) {
        detailBadgeStyle = 'bg-[#FFDCC0] border border-[#FFB876] text-[#6B3B00]';
    } else if (trip.trip_type === 'Hotel Transfers' || trip.booking_type === 'Hotel Transfer') {
        detailBadgeStyle = 'bg-[#D1F2E0] border border-[#A3E5C2] text-[#0A5A36]';
    } else if (trip.trip_type === 'Day Tour' || trip.booking_type === 'Day Tour') {
        detailBadgeStyle = 'bg-[#E5DEFF] border border-[#C7B8FF] text-[#372773]';
    }

    const cleanPhone = (trip.guest_phone || '6281234567890').replace(/[^0-9]/g, '');

    // Slider state
    const trackRef = useRef(null);
    const thumbRef = useRef(null);
    const progressRef = useRef(null);
    const textRef = useRef(null);

    const [isDragging, setIsDragging] = useState(false);
    const [sliderCompleted, setSliderCompleted] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const currentXRef = useRef(0);

    const getMaxDrag = () => {
        if (!trackRef.current || !thumbRef.current) return 0;
        const trackPadding = 8;
        return Math.max(0, trackRef.current.clientWidth - thumbRef.current.offsetWidth - trackPadding);
    };

    const handleStart = (clientX) => {
        if (sliderCompleted) return;
        isDraggingRef.current = true;
        setIsDragging(true);
        startXRef.current = clientX;

        if (thumbRef.current) thumbRef.current.style.transition = 'none';
        if (progressRef.current) progressRef.current.style.transition = 'none';
        if (textRef.current) textRef.current.style.transition = 'none';
    };

    const handleMove = (clientX) => {
        if (!isDraggingRef.current || sliderCompleted) return;

        const deltaX = clientX - startXRef.current;
        const maxDrag = getMaxDrag();

        const curX = Math.max(0, Math.min(deltaX, maxDrag));
        currentXRef.current = curX;
        const ratio = maxDrag > 0 ? curX / maxDrag : 0;

        if (thumbRef.current) {
            thumbRef.current.style.transform = `translate3d(${curX}px, 0, 0)`;
        }
        if (progressRef.current && thumbRef.current) {
            progressRef.current.style.width = `${curX + thumbRef.current.offsetWidth + 4}px`;
        }
        if (textRef.current) {
            textRef.current.style.opacity = Math.max(0, 1 - ratio * 1.5);
        }
    };

    const handleEnd = () => {
        if (!isDraggingRef.current || sliderCompleted) return;
        isDraggingRef.current = false;
        setIsDragging(false);

        const maxDrag = getMaxDrag();
        const ratio = maxDrag > 0 ? currentXRef.current / maxDrag : 0;

        if (ratio >= 0.82) {
            triggerCompletion(maxDrag);
        } else {
            snapBack();
        }
    };

    const snapBack = () => {
        currentXRef.current = 0;
        if (thumbRef.current) {
            thumbRef.current.style.transition = 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            thumbRef.current.style.transform = 'translate3d(0px, 0, 0)';
        }
        if (progressRef.current) {
            progressRef.current.style.transition = 'width 0.35s ease-out';
            progressRef.current.style.width = '0px';
        }
        if (textRef.current) {
            textRef.current.style.transition = 'opacity 0.25s ease-out';
            textRef.current.style.opacity = '1';
        }
    };

    const triggerCompletion = (maxDrag) => {
        setSliderCompleted(true);
        currentXRef.current = maxDrag;

        if (thumbRef.current) {
            thumbRef.current.style.transition = 'transform 0.2s ease-out, background-color 0.3s ease';
            thumbRef.current.style.transform = `translate3d(${maxDrag}px, 0, 0)`;
            thumbRef.current.classList.remove('bg-[#00AEEF]');
            thumbRef.current.classList.add('bg-emerald-500');
        }

        if (progressRef.current) {
            progressRef.current.style.transition = 'all 0.3s ease';
            progressRef.current.style.width = '100%';
            progressRef.current.classList.remove('from-[#00AEEF]/20', 'to-[#00AEEF]/40');
            progressRef.current.classList.add('bg-emerald-100');
        }

        if (trackRef.current) {
            trackRef.current.classList.add('border', 'border-emerald-200');
        }

        if (textRef.current) {
            textRef.current.style.transition = 'opacity 0.2s ease';
            textRef.current.style.opacity = '0';
        }

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([40, 60, 120]);
        }

        setShowOverlay(true);

        setTimeout(() => {
            router.post(`/driver/trips/${trip.id}/complete`, {}, {
                preserveScroll: false,
                onSuccess: () => {
                    // Redirect is automatically followed by Inertia
                },
                onError: () => {
                    setShowOverlay(false);
                    setSliderCompleted(false);
                    snapBack();
                }
            });
        }, 500);
    };

    // Global event listeners for drag
    useEffect(() => {
        const onTouchMove = (e) => {
            if (isDraggingRef.current) {
                handleMove(e.touches[0].clientX);
            }
        };
        const onTouchEnd = () => {
            if (isDraggingRef.current) {
                handleEnd();
            }
        };
        const onMouseMove = (e) => {
            if (isDraggingRef.current) {
                handleMove(e.clientX);
            }
        };
        const onMouseUp = () => {
            if (isDraggingRef.current) {
                handleEnd();
            }
        };

        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [sliderCompleted]);

    const totalExpenses = (trip.expenses || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const statusLower = (trip.status || '').toLowerCase();
    const isCompleted = statusLower === 'completed';
    const isCancelled = statusLower === 'cancelled';
    const isDepartureTime = isTripDepartureReached(trip);
    const isActionable = !isCompleted && !isCancelled && isDepartureTime;

    return (
        <DriverLayout hideBottomNav={true}>
            {/* Top App Bar Header (Full-Width Edge-to-Edge) */}
            <header className="w-full bg-white border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sticky top-0 z-30 anim-ease-up">
                <div className="max-w-6xl mx-auto h-[60px] px-4 sm:px-8 lg:px-12 flex items-center justify-between">
                    {/* Left: Back Button */}
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

                    {/* Center: Title */}
                    <h1 className="text-[#171C20] text-base sm:text-lg font-bold tracking-tight">Trip Details</h1>

                    {/* Right: Profile Avatar Button */}
                    <button 
                        type="button" 
                        onClick={openProfile}
                        className="btn-open-driver-profile p-1 rounded-full text-slate-400 hover:text-slate-600 transition active:scale-95 cursor-pointer" 
                        title="Driver Profile"
                    >
                        <img 
                            src={authDriver?.profile_photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'} 
                            alt="Driver Profile" 
                            className="w-8 h-8 rounded-full border border-[#00AEEF] object-cover"
                        />
                    </button>
                </div>
            </header>

            {/* Main Container Content */}
            <div className={`max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 w-full py-4 flex flex-col gap-4 font-['Inter'] ${isActionable ? 'pb-48 sm:pb-52' : 'pb-28 sm:pb-32'}`}>
                
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
                    {/* Baris Atas Badges */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap shadow-2xs ${detailBadgeStyle}`}>
                            {trip.trip_type}
                        </span>
                        {trip.flight_number && (
                            <span className="px-3 py-1 rounded-full bg-[#C6E7FF] text-[#00658D] text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg> 
                                {trip.flight_number}
                            </span>
                        )}
                    </div>

                    {/* Tanggal & Waktu */}
                    <div className="border-b border-slate-100 pb-3">
                        <span className="text-slate-500 text-xs font-medium block">
                            {formatDate(trip.trip_date)}
                        </span>
                        <h2 className="text-[#171C20] text-2xl sm:text-3xl font-bold mt-0.5 tracking-tight">{trip.trip_time}</h2>
                    </div>

                    {/* Route Timeline Component (Khusus Day Tour hanya menampilkan Pickup Point) */}
                    {(trip.booking_type === 'Day Tour' || trip.trip_type?.toLowerCase().includes('day tour')) ? (
                        <div className="flex items-center gap-3.5 my-1">
                            {/* Kolom Kiri: Indikator Titik */}
                            <div className="flex flex-col items-center w-4 shrink-0 py-1">
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00AEEF] bg-white shadow-xs shrink-0 animate-[softBreathing_2.8s_ease-in-out_infinite]"></div>
                            </div>

                            {/* Kolom Kanan: Detail Teks Lokasi */}
                            <div className="flex flex-col justify-center grow">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                                    Pickup Point
                                </span>
                                <span className="text-sm sm:text-base font-bold text-[#171C20] leading-snug block mt-0.5">
                                    {trip.pickup_location}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-stretch gap-3.5 my-1">
                            {/* Kolom Kiri: Indikator Titik & Garis */}
                            <div className="flex flex-col items-center w-4 shrink-0 py-1">
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00AEEF] bg-white shadow-xs shrink-0 animate-[softBreathing_2.8s_ease-in-out_infinite]"></div>
                                <div className="w-[2px] grow my-1 border-l-2 border-dashed border-[#00AEEF]/70"></div>
                                <div className="w-3.5 h-3.5 rounded-full bg-[#00AEEF] shadow-xs shrink-0"></div>
                            </div>

                            {/* Kolom Kanan: Detail Teks Lokasi */}
                            <div className="flex flex-col justify-between grow gap-5">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                                        Pickup Point
                                    </span>
                                    <span className="text-sm sm:text-base font-bold text-[#171C20] leading-snug block mt-0.5">
                                        {trip.pickup_location}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                                        Drop-off Point / Route
                                    </span>
                                    <span className="text-sm sm:text-base font-bold text-[#171C20] leading-snug block mt-0.5">
                                        {trip.dropoff_location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Card 2: Detail Tamu & Catatan Khusus */}
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
                                <h2 className="text-base sm:text-lg font-bold text-[#171C20]">{trip.guest_name}</h2>
                            </div>
                        </div>
                        {trip.guest_type && (
                            <span className="bg-slate-100 text-[#00658D] text-xs font-semibold px-2.5 py-1 rounded-full">
                                {trip.guest_type}
                            </span>
                        )}
                    </div>

                    <div className="border-b border-slate-100"></div>

                    <div className="flex flex-col gap-3">
                        {/* Baris Nomor Telepon (Interaktif + WhatsApp Action) */}
                        <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                            <a 
                                href={`tel:${trip.guest_phone || '+6281234567890'}`} 
                                className="flex items-center gap-2.5 text-slate-700 hover:text-[#00658D] text-xs sm:text-sm font-medium transition-all duration-200 ease-out active:scale-95"
                            >
                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{trip.guest_phone || '+62 812-3456-7890'}</span>
                            </a>

                            {/* Quick Action: WhatsApp Button */}
                            <a 
                                href={`https://wa.me/${cleanPhone}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-all duration-200 ease-out active:scale-95 flex items-center gap-1.5 text-xs font-bold shadow-2xs"
                            >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                <span>WhatsApp</span>
                            </a>
                        </div>

                        {/* Info Grid: Vehicle Type & Passengers */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#00658D] flex items-center justify-center shrink-0">
                                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Passengers</span>
                                    <span className="text-xs sm:text-sm font-bold text-[#171C20] block mt-0.5">
                                        {trip.pax_description || `${trip.pax} Pax`}
                                    </span>
                                </div>
                            </div>

                            {trip.vehicle_type && (
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

                        {/* Child Car Seats Card */}
                        {trip.child_seats && trip.child_seats.length > 0 && (
                            <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-amber-900 text-xs sm:text-sm shadow-2xs">
                                <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <div className="grow">
                                    <span className="font-bold block text-amber-950 uppercase text-[10px] tracking-wider mb-1">Child Car Seats</span>
                                    <div className="space-y-1">
                                        {trip.child_seats.map((cs, idx) => (
                                            <div key={idx} className="font-semibold text-amber-900 text-xs sm:text-sm">
                                                {cs.quantity}x {cs.name} {cs.age_range ? `(${cs.age_range})` : ''}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[11px] text-amber-700 block mt-1.5 font-normal">
                                        Siapkan sebelum penjemputan
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Guest Notes Box */}
                        {trip.notes && (
                            <div className="bg-[#EFF4FA] rounded-xl p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed border border-[#DEE3E8]/60 shadow-2xs">
                                <div className="w-4 h-4 min-w-[16px] rounded-full bg-[#00658D] text-white flex items-center justify-center text-[9px] font-bold mt-0.5 shadow-xs">
                                    i
                                </div>
                                <div>
                                    <span className="font-bold text-[#171C20] block mb-0.5 uppercase tracking-wider text-[10px]">Guest Notes</span>
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
                            {formatRupiah(totalExpenses)}
                        </span>
                    </div>
                    
                    {trip.expenses && trip.expenses.length > 0 ? (
                        <div className="flex flex-col divide-y divide-slate-50 text-xs sm:text-sm">
                            {trip.expenses.map((exp, idx) => (
                                <div key={exp.id || idx} className="py-2.5 flex items-center justify-between">
                                    <span className="text-slate-700 font-medium">{exp.expense_type || exp.expense_name}</span>
                                    <span className="font-bold text-slate-900">{formatRupiah(exp.amount)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs sm:text-sm text-slate-400 italic py-1">No expenses recorded for this trip yet.</p>
                    )}
                </div>

                {/* Fixed Bottom Action Panel */}
                <div className="fixed z-40 transition-all duration-200 bottom-0 left-0 right-0 w-full sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl md:max-w-2xl sm:rounded-2xl sm:border sm:border-slate-200/80 sm:shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-4 anim-ease-up delay-4">
                    {isActionable ? (
                        <div className="w-full flex flex-col gap-3">
                            {/* '+ Add Expenses' Button */}
                            <Link 
                                href={expenseUrl} 
                                className="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl border border-[#BDC8D1] bg-white hover:bg-slate-50 active:scale-[0.985] text-[#00658D] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer" 
                                title="Add Expenses"
                            >
                                <svg className="w-4 h-4 text-[#00658D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Add Expenses</span>
                            </Link>

                            {/* Slider Bar 'Slide to Complete Trip' */}
                            <div 
                                ref={trackRef} 
                                id="slider-track" 
                                className="w-full h-13 bg-[#EAEEF4] rounded-full relative flex items-center p-1 shadow-inner select-none overflow-hidden touch-none"
                            >
                                {/* Dynamic Progress Fill Track */}
                                <div 
                                    ref={progressRef} 
                                    id="slider-progress" 
                                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#00AEEF]/20 to-[#00AEEF]/40 rounded-full w-0 pointer-events-none transition-all duration-75"
                                />

                                {/* Center Text Label */}
                                <span 
                                    ref={textRef} 
                                    id="slider-text" 
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 font-semibold text-xs sm:text-sm tracking-wide pl-6 transition-opacity duration-150"
                                >
                                    Slide to Complete Trip
                                </span>

                                {/* Slider Thumb */}
                                <div 
                                    ref={thumbRef} 
                                    id="slider-thumb" 
                                    onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                                    onMouseDown={(e) => handleStart(e.clientX)}
                                    className="h-11 w-11 aspect-square rounded-full bg-[#00AEEF] text-white flex items-center justify-center shadow-md shrink-0 z-10 cursor-grab active:cursor-grabbing select-none touch-none will-change-transform transition-colors duration-300"
                                >
                                    {sliderCompleted ? (
                                        <svg className="w-5 h-5 text-white animate-[scaleUp_0.25s_ease-out]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-white transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : isCompleted ? (
                        <div className="w-full py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs">
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                            <span>Trip Completed • All tasks finished</span>
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

            {/* Success Toast / Overlay Notification */}
            <div 
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-6 transition-opacity duration-300 ${showOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <div 
                    className={`bg-white rounded-2xl p-6 shadow-2xl max-w-xs w-full text-center flex flex-col items-center gap-3 transform transition-transform duration-300 ${showOverlay ? 'scale-100' : 'scale-90'}`}
                >
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h4 className="text-base font-bold text-[#171C20]">Trip Completed!</h4>
                    <p className="text-xs text-slate-500">Redirecting to driver portal...</p>
                </div>
            </div>
        </DriverLayout>
    );
}
