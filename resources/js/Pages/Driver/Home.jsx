import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import DriverLayout, { useDriverProfile } from '../../Layouts/DriverLayout';

function getBadgeColor(tripType, bookingType) {
    if (tripType === 'Day Tour' || bookingType === 'Day Tour') {
        return 'bg-[#E5DEFF] text-[#372773] border border-[#C7B8FF]';
    }
    switch (tripType) {
        case 'Hotel Transfers':
            return 'bg-[#D1F2E0] text-[#0A5A36] border border-[#A3E5C2]';
        case 'Airport Pick-Up':
            return 'bg-[#D7E8FF] text-[#004C6B] border border-[#ABC7FF]';
        case 'Airport Drop-Off':
            return 'bg-[#FFDCC0] text-[#6B3B00] border border-[#FFB876]';
        default:
            return 'bg-[#E5DEFF] text-[#372773] border border-[#C7B8FF]';
    }
}

function formatCompactDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Home({ driver, activeTrip, laterTodayTrips = [] }) {
    const { flash } = usePage().props;
    const { openProfile } = useDriverProfile();

    const driverFirstName = driver?.full_name ? driver.full_name.split(' ')[0] : 'Wayan';

    return (
        <DriverLayout>
            {/* Layer 1: Top App Bar Header (Full-Width Edge-to-Edge) */}
            <header className="w-full bg-[#3E5E95] border-b border-white/10 shadow-sm sticky top-0 z-30 anim-ease-up">
                <div className="max-w-6xl mx-auto h-[64px] px-4 sm:px-8 lg:px-12 flex items-center justify-between">
                    <button 
                        type="button" 
                        onClick={openProfile}
                        className="btn-open-driver-profile flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
                    >
                        <img 
                            src={driver?.profile_photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'} 
                            alt={`${driverFirstName} Profile Avatar`} 
                            className="w-[40px] h-[40px] border-2 border-white rounded-full object-cover shadow-sm transition-transform duration-200 group-hover:scale-105 active:scale-95 shrink-0"
                        />
                        <h1 className="text-white text-lg font-bold group-hover:text-sky-200 transition-colors">Driver Portal</h1>
                    </button>
                    <button 
                        type="button" 
                        onClick={openProfile}
                        className="btn-open-driver-profile p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer" 
                        title="View Profile"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Layer 2: Contextual Greeting Panel Melengkung (Full-Width Edge-to-Edge) */}
            <div className="w-full bg-[#3E5E95] rounded-b-[32px] sm:rounded-b-[40px] shadow-sm relative anim-ease-up delay-1">
                <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 pt-5 sm:pt-7 pb-24 sm:pb-28 flex flex-col gap-3">
                    <div>
                        <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                            Hi, {driverFirstName}!
                        </h2>
                        <p className="text-white/85 text-sm sm:text-base font-normal">
                            Ready for today's journeys.
                        </p>
                    </div>

                    {flash?.success && (
                        <div className="p-3 bg-emerald-500/20 border border-emerald-300/40 rounded-xl text-emerald-100 text-xs font-semibold flex items-center gap-2 backdrop-blur-xs">
                            <svg className="w-4 h-4 text-emerald-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{flash.success}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Container Content (Centered Max-w-6xl) */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 w-full pb-28 sm:pb-32 flex flex-col font-['Inter']">
                {activeTrip ? (
                    <div className="-mt-16 sm:-mt-20 relative z-20 flex flex-col gap-6">
                        {/* Up Next Card */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col gap-5 anim-ease-up delay-2">
                            
                            {/* Tag Header Baris Atas */}
                            <div className="flex flex-row border-b border-[#DEE3E8] pb-3.5 gap-2 items-center justify-between flex-wrap">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#00AEEF] animate-[softBreathing_2.8s_ease-in-out_infinite]"></span>
                                    <span className="text-[#00AEEF] text-xs sm:text-[13px] font-bold tracking-[1.2px] uppercase">
                                        UP NEXT • {activeTrip.trip_time}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap shadow-2xs ${getBadgeColor(activeTrip.trip_type, activeTrip.booking_type)}`}>
                                        {activeTrip.trip_type}
                                    </span>
                                    {activeTrip.flight_number && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#00658D] border border-sky-200/80 text-[11px] font-semibold flex items-center gap-1 shadow-2xs">
                                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                            </svg> 
                                            {activeTrip.flight_number}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* 4 Information Items with Circular Icon Badges */}
                            <div className="flex flex-col gap-4">
                                {/* Item 1: Trip Type */}
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 min-w-[40px] bg-[#EAEEF4] rounded-full flex items-center justify-center text-[#00658D] transition-transform duration-300 hover:scale-105 shrink-0">
                                        {activeTrip.trip_type?.toLowerCase().includes('drop-off') ? (
                                            <svg className="w-5 h-5 text-[#EA8C21]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        ) : activeTrip.trip_type?.toLowerCase().includes('pick-up') ? (
                                            <svg className="w-5 h-5 text-[#00658D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        ) : activeTrip.trip_type?.toLowerCase().includes('hotel') ? (
                                            <svg className="w-5 h-5 text-[#0A5A36]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4zM3 9l2-4h10l2 4M3 9h18v7a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <span className="text-[11px] font-semibold text-[#6E7881] tracking-[0.8px] uppercase leading-tight mb-0.5">TRIP TYPE</span>
                                        <span className="text-base sm:text-lg font-bold text-[#171C20] leading-snug truncate">{activeTrip.trip_type}</span>
                                    </div>
                                </div>

                                {/* Item 2: Guest & Passengers */}
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 min-w-[40px] bg-[#EAEEF4] rounded-full flex items-center justify-center text-[#00658D] transition-transform duration-300 hover:scale-105 shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <span className="text-[11px] font-semibold text-[#6E7881] tracking-[0.8px] uppercase leading-tight mb-0.5">GUEST & PASSENGERS</span>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-base sm:text-lg font-bold text-[#171C20] truncate">{activeTrip.guest_name}</span>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#00658D] border border-sky-100">
                                                {activeTrip.pax} Pax
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Item 3: Pick-up Point */}
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 min-w-[40px] bg-[#EAEEF4] rounded-full flex items-center justify-center text-[#00658D] transition-transform duration-300 hover:scale-105 shrink-0 mt-0.5">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <span className="text-[11px] font-semibold text-[#6E7881] tracking-[0.8px] uppercase leading-tight mb-0.5">PICK-UP POINT</span>
                                        <span className="text-base sm:text-lg font-bold text-[#171C20] leading-snug">{activeTrip.pickup_location}</span>
                                    </div>
                                </div>

                                {/* Item 4: Drop-off / Route */}
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 min-w-[40px] bg-[#EAEEF4] rounded-full flex items-center justify-center text-[#00658D] transition-transform duration-300 hover:scale-105 shrink-0 mt-0.5">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <span className="text-[11px] font-semibold text-[#6E7881] tracking-[0.8px] uppercase leading-tight mb-0.5">DROP-OFF / ROUTE</span>
                                        <span className="text-base sm:text-lg font-bold text-[#171C20] leading-snug">{activeTrip.dropoff_location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Guest Notes Alert if present */}
                            {activeTrip.notes && (
                                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-center gap-2.5 text-amber-800 text-xs font-semibold mt-1">
                                    <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <span>{activeTrip.notes}</span>
                                </div>
                            )}

                            {/* Action CTA Button */}
                            <Link 
                                href={`/driver/trips/${activeTrip.id}?from=home`} 
                                className="group w-full h-[52px] bg-[#00AEEF] hover:bg-[#009cd7] rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-[#003E58] text-sm sm:text-base font-bold tracking-wide transition-all duration-300 ease-out active:scale-[0.985] shadow-md shadow-sky-500/20 cursor-pointer mt-1"
                            >
                                <span>View Trip Details</span>
                                <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5">&rarr;</span>
                            </Link>
                        </div>

                        {/* Panel Later Today */}
                        {laterTodayTrips && laterTodayTrips.length > 0 && (
                            <div className="flex flex-col gap-3.5">
                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                                        <h3 className="text-slate-900 text-base sm:text-lg font-bold tracking-tight">Later Today</h3>
                                    </div>
                                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-[#00658D] border border-sky-200/80">
                                        {laterTodayTrips.length} {laterTodayTrips.length === 1 ? 'Trip' : 'Trips'}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {laterTodayTrips.map((laterTrip, idx) => {
                                        const timeParts = (laterTrip.trip_time || '').trim().split(' ');
                                        const timeNum = timeParts[0] || laterTrip.trip_time;
                                        const timePeriod = timeParts[1] || '';
                                        const compactDate = formatCompactDate(laterTrip.trip_date);
                                        const delayClass = `delay-${Math.min(5, idx + 2)}`;

                                        return (
                                            <Link
                                                key={laterTrip.id || idx}
                                                href={`/driver/trips/${laterTrip.id}?from=home`}
                                                className={`group bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4 anim-ease-up ${delayClass} transition-all duration-200 ease-out active:scale-[0.985] hover:border-[#00AEEF] hover:shadow-md cursor-pointer`}
                                            >
                                                {/* Left Time Box */}
                                                <div className="w-16 sm:w-20 flex flex-col items-center justify-center shrink-0 pr-3 sm:pr-4 border-r border-slate-100">
                                                    {compactDate && (
                                                        <span className="text-slate-400 text-[9px] sm:text-[10px] font-bold tracking-wide uppercase mb-0.5 text-center">{compactDate}</span>
                                                    )}
                                                    <span className="text-[#00658D] text-base sm:text-lg font-extrabold text-center leading-none">{timeNum}</span>
                                                    {timePeriod && (
                                                        <span className="text-slate-400 text-[10px] font-bold tracking-wider uppercase mt-1 text-center">{timePeriod}</span>
                                                    )}
                                                </div>

                                                {/* Center Info */}
                                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                                    <span className="text-slate-900 text-sm sm:text-base font-bold truncate">{laterTrip.guest_name}</span>
                                                    <div className="mt-1 flex items-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold shrink-0 whitespace-nowrap ${getBadgeColor(laterTrip.trip_type, laterTrip.booking_type)}`}>
                                                            {laterTrip.trip_type}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Right Arrow */}
                                                <svg className="w-5 h-5 text-slate-300 group-hover:text-[#00658D] group-hover:translate-x-1 transition-all duration-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Empty State: All Done for Today! */
                    <div className="-mt-16 sm:-mt-20 relative z-20 flex flex-col gap-4">
                        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center text-center gap-5 anim-ease-up delay-1 my-2 max-w-xl mx-auto w-full">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-2xs">
                                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">All Done for Today!</h3>
                                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                                    Seluruh jadwal perjalanan hari ini sudah selesai. Kamu bisa mengecek agenda berikutnya di menu jadwal.
                                </p>
                            </div>
                            <Link 
                                href="/driver/schedule" 
                                className="group w-full max-w-xs h-12 bg-[#00AEEF] hover:bg-[#009cd7] active:scale-[0.985] rounded-xl flex items-center justify-center gap-2 text-[#003E58] text-xs sm:text-sm font-bold tracking-wide shadow-md shadow-sky-500/20 transition-all duration-200 cursor-pointer"
                            >
                                <span>View Schedule</span>
                                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </DriverLayout>
    );
}
