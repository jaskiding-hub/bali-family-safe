import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import DriverLayout, { useDriverProfile } from '../../Layouts/DriverLayout';

const styleMap = {
    'Airport Drop-Off': {
        accent_bar: 'bg-[#EA8C21]',
        badge: 'bg-[#FFDCC0] border border-[#FFB876] text-[#6B3B00]',
        box_bg: 'bg-[#FFF9F2]',
        box_border: 'border-[#FFE6D0]',
        dot_color: '#EA8C21',
        btn_border: 'border-[#8D4F00]',
        btn_text: 'text-[#8D4F00]',
        btn_hover: 'hover:bg-amber-50',
    },
    'Hotel Transfers': {
        accent_bar: 'bg-[#10B981]',
        badge: 'bg-[#D1F2E0] border border-[#A3E5C2] text-[#0A5A36]',
        box_bg: 'bg-[#F2FCF7]',
        box_border: 'border-[#D1F2E0]',
        dot_color: '#10B981',
        btn_border: 'border-[#0A5A36]',
        btn_text: 'text-[#0A5A36]',
        btn_hover: 'hover:bg-emerald-50',
    },
    'Day Tour': {
        accent_bar: 'bg-[#6366F1]',
        badge: 'bg-[#E5DEFF] border border-[#C7B8FF] text-[#372773]',
        box_bg: 'bg-[#F8F6FF]',
        box_border: 'border-[#E5DEFF]',
        dot_color: '#6366F1',
        btn_border: 'border-[#4338CA]',
        btn_text: 'text-[#4338CA]',
        btn_hover: 'hover:bg-indigo-50',
    },
    'Airport Pick-Up': {
        accent_bar: 'bg-[#00AEEF]',
        badge: 'bg-[#D7E8FF] border border-[#ABC7FF] text-[#004C6B]',
        box_bg: 'bg-[#F5FAFF]',
        box_border: 'border-[#DEE3E8]',
        dot_color: '#00AEEF',
        btn_border: 'border-[#00658D]',
        btn_text: 'text-[#00658D]',
        btn_hover: 'hover:bg-sky-50',
    },
};

function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function Schedule({
    calendarDays = [],
    tripsByDate = {},
    monthName,
    prevMonth,
    nextMonth,
    monthParam,
    selectedDate: initialSelectedDate,
    driver,
    trips: initialTrips = [],
}) {
    const { openProfile } = useDriverProfile();
    const [selectedDate, setSelectedDate] = useState(initialSelectedDate);

    React.useEffect(() => {
        if (initialSelectedDate) {
            setSelectedDate(initialSelectedDate);
        }
    }, [initialSelectedDate]);

    // Retrieve trips for selected date from tripsByDate, falling back to initialTrips only if selectedDate is the initial date
    const currentTrips = tripsByDate[selectedDate] !== undefined 
        ? tripsByDate[selectedDate] 
        : (selectedDate === initialSelectedDate ? initialTrips : []);

    const handleSelectDate = (dateKey) => {
        setSelectedDate(dateKey);
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('date', dateKey);
        window.history.replaceState({}, '', newUrl);

        // Scroll to trip details section
        setTimeout(() => {
            const tripSection = document.getElementById('trip-cards-container');
            if (tripSection) {
                tripSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    return (
        <DriverLayout>
            {/* Top App Bar Header (Full-Width Edge-to-Edge) */}
            <header className="w-full bg-[#3E5E95] border-b border-white/10 shadow-sm sticky top-0 z-30 anim-ease-up">
                <div className="max-w-6xl mx-auto h-[64px] px-4 sm:px-8 lg:px-12 flex items-center justify-between">
                    <button 
                        type="button" 
                        onClick={openProfile}
                        className="btn-open-driver-profile flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
                    >
                        <img 
                            src={driver?.profile_photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'} 
                            alt="Driver Profile Avatar" 
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
                            aria-label="Previous Month"
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
                            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">{monthName}</h2>
                        </div>

                        <Link 
                            href={`/driver/schedule?month=${nextMonth}`} 
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-90 text-slate-600 transition cursor-pointer border border-slate-200/60" 
                            title="Bulan Berikutnya" 
                            aria-label="Next Month"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Days of Week Header (Sun - Sat) */}
                    <div className="grid grid-cols-7 text-center mb-2.5">
                        <span className="text-[11px] sm:text-xs font-bold text-rose-500 tracking-wider uppercase py-1">Min</span>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase py-1">Sen</span>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase py-1">Sel</span>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase py-1">Rab</span>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase py-1">Kam</span>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase py-1">Jum</span>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase py-1">Sab</span>
                    </div>

                    {/* Calendar Days Grid (7 Columns) */}
                    <div id="calendar-days-grid" className="grid grid-cols-7 gap-1.5 sm:gap-2.5 text-center">
                        {calendarDays.map((day) => {
                            const isSel = day.date === selectedDate;
                            const isToday = day.is_today;
                            const isCurr = day.is_current_month;
                            const count = day.trip_count;
                            const dayTrips = tripsByDate[day.date] || [];

                            return (
                                <button
                                    key={day.date}
                                    type="button"
                                    onClick={() => handleSelectDate(day.date)}
                                    className={`calendar-day-btn group w-full min-h-[46px] sm:min-h-[52px] p-1.5 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer active:scale-90
                                        ${isSel ? 'active-selected' : ''}
                                        ${!isSel && isToday ? 'is-today' : ''}
                                        ${!isSel && !isToday && isCurr ? 'text-slate-800 hover:bg-slate-100 font-semibold border border-slate-100 hover:border-slate-200' : ''}
                                        ${!isSel && !isCurr ? 'text-slate-300 font-normal opacity-30 hover:opacity-70 border border-transparent' : ''}
                                    `}
                                >
                                    <span className="text-sm sm:text-base leading-none day-text">{day.day_number}</span>

                                    {/* Trip Dot Indicators with Status Colors */}
                                    <div className="h-2 flex items-center justify-center gap-0.5 mt-1 pointer-events-none">
                                        {dayTrips.slice(0, 3).map((trip, idx) => {
                                            const statusColors = {
                                                'pending': 'bg-amber-400',
                                                'confirmed': 'bg-blue-500',
                                                'assigned': 'bg-indigo-500',
                                                'on going': 'bg-[#00AEEF]',
                                                'completed': 'bg-emerald-500',
                                                'cancelled': 'bg-rose-500',
                                            };
                                            const dotColor = statusColors[trip.status?.toLowerCase()] || 'bg-indigo-500';

                                            return (
                                                <span key={idx} className={`trip-dot w-1.5 h-1.5 rounded-full ${dotColor} ring-1 ring-white`}></span>
                                            );
                                        })}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Date Header & Trip Counter */}
                <div className="flex items-center justify-between anim-ease-up delay-2 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
                    <div>
                        <span id="selected-date-label" className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                            {formatDisplayDate(selectedDate)}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                            Scheduled Trips
                        </h3>
                    </div>
                    <span id="trip-count-badge" className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold bg-sky-50 text-[#00658D] border border-sky-200/80 shrink-0 shadow-2xs">
                        {currentTrips.length} {currentTrips.length === 1 ? 'Trip' : 'Trips'}
                    </span>
                </div>

                {/* Trip Cards Container */}
                <div id="trip-cards-container" className="flex flex-col gap-4">
                    {currentTrips.length > 0 ? (
                        currentTrips.map((trip, index) => {
                            const delayClass = `delay-${Math.min(5, index + 3)}`;
                            const style = styleMap[trip.trip_type] || (trip.booking_type === 'Day Tour' ? styleMap['Day Tour'] : styleMap['Airport Pick-Up']);
                            const isCompleted = trip.status === 'completed';
                            const durText = trip.duration_est ? trip.duration_est.replace(/^Est\.\s*/i, '').trim() : null;

                            return (
                                <div 
                                    key={trip.id || index}
                                    className={`trip-ticket-card w-full ${isCompleted ? 'bg-[#FAFCFD] opacity-90 border-slate-200/80' : 'bg-white border-slate-200/80'} rounded-2xl sm:rounded-3xl shadow-xs border relative overflow-hidden flex flex-col anim-ease-up ${delayClass} transition-all hover:shadow-md hover:border-slate-300`}
                                >
                                    {/* Left Accent Strip */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isCompleted ? 'bg-emerald-500' : style.accent_bar}`}></div>

                                    {/* Card Header (Two-Column Layout) */}
                                    <div className="pt-4 pb-3.5 px-5 sm:px-6 flex items-center">
                                        {/* Left Column (Time & Duration) */}
                                        <div className="w-28 min-w-[105px] shrink-0 pr-4 border-r border-slate-200 flex flex-col justify-center">
                                            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Inter'] leading-none tracking-tight">
                                                {trip.trip_time}
                                            </h3>
                                            {durText && (
                                                <div className="text-[11px] text-slate-400 font-normal flex items-center gap-1 mt-1.5 whitespace-nowrap">
                                                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="whitespace-nowrap">{durText}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Column (Guest Info & Badge) */}
                                        <div className="flex-1 min-w-0 pl-4 flex flex-col justify-center">
                                            <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug truncate">
                                                {trip.guest_name}
                                            </h4>
                                            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide shrink-0 whitespace-nowrap shadow-2xs ${style.badge}`}>
                                                    {trip.trip_type}
                                                </span>
                                                {isCompleted && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0 whitespace-nowrap shadow-2xs">
                                                        <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Completed
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Perforated Ticket Tear Line with Cutout Notches */}
                                    <div className="relative flex items-center my-0.5 w-full overflow-hidden">
                                        <div className="w-4 h-4 bg-[#F8FAFC] rounded-full border-r border-slate-200 -ml-2 shrink-0 z-10"></div>
                                        <div className="grow border-t-2 border-dashed border-slate-200 mx-1"></div>
                                        <div className="w-4 h-4 bg-[#F8FAFC] rounded-full border-l border-slate-200 -mr-2 shrink-0 z-10"></div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="pt-2 pb-4 px-5 sm:px-6 flex flex-col gap-3">
                                        {(trip.pax_description || trip.pax) && (
                                            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                                                <svg className="w-4 h-4 text-[#00658D] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span className="truncate">
                                                    {trip.pax_description || `${trip.pax} Guest • ${trip.vehicle_type || 'Standard Sedan'}`}
                                                </span>
                                            </div>
                                        )}

                                        {/* Route Timeline Box (Khusus Day Tour hanya menampilkan Pick-up Point) */}
                                        {(trip.booking_type === 'Day Tour' || trip.trip_type?.toLowerCase().includes('day tour')) ? (
                                            <div className={`w-full ${style.box_bg} border ${style.box_border} rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-center gap-3`}>
                                                <div className="flex flex-col items-center w-3 shrink-0 py-0.5">
                                                    <div className="w-2.5 h-2.5 rounded-full border-2 bg-white shrink-0" style={{ borderColor: style.dot_color }}></div>
                                                </div>
                                                <div className="flex flex-col justify-center grow min-w-0">
                                                    <span className="text-slate-400 font-semibold tracking-wider block uppercase text-[10px]">Pick-up Point</span>
                                                    <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5 truncate">{trip.pickup_location}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`w-full ${style.box_bg} border ${style.box_border} rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-stretch gap-3`}>
                                                {/* Timeline Dots Column */}
                                                <div className="flex flex-col items-center w-3 shrink-0 py-0.5">
                                                    <div className="w-2.5 h-2.5 rounded-full border-2 bg-white shrink-0" style={{ borderColor: style.dot_color }}></div>
                                                    <div className="w-[2px] grow my-1 bg-slate-200"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: style.dot_color }}></div>
                                                </div>
                                                {/* Details Text Column */}
                                                <div className="flex flex-col justify-between grow gap-2 text-xs sm:text-sm min-w-0">
                                                    <div className="min-w-0">
                                                        <span className="text-slate-400 font-semibold tracking-wider block uppercase text-[10px]">Pick-up</span>
                                                        <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5 truncate">{trip.pickup_location}</span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="text-slate-400 font-semibold tracking-wider block uppercase text-[10px]">Drop-off / Route</span>
                                                        <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5 truncate">{trip.dropoff_location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* CTA Button */}
                                        <Link 
                                            href={`/driver/trips/${trip.id}?from=schedule&date=${selectedDate}&month=${encodeURIComponent(monthParam || '')}`} 
                                            className={`w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-[0.985] shadow-2xs cursor-pointer ${style.btn_border} ${style.btn_text} ${style.btn_hover}`}
                                        >
                                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            <span>View Trip Details</span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        /* Empty State */
                        <div className="empty-state-card bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-xs anim-ease-up">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3 shadow-2xs">
                                <svg className="w-7 h-7 text-[#00658D]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1">No trips scheduled for this date</h4>
                            <p className="text-xs sm:text-sm text-slate-400 max-w-[280px] leading-relaxed">
                                Enjoy your rest day or choose another date on the calendar above.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
}
