import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Calendar({
    current_year = 2026,
    current_month = 8,
    month_name = 'August 2026',
    selected_date = '2026-08-06',
    selected_date_formatted = 'Thursday, 6 August 2026',
    events_by_date = {},
}) {
    const [selectedDate, setSelectedDate] = useState(selected_date);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    // Calculate calendar grid dates (Sunday-start 7xN grid)
    const generateCalendarGrid = () => {
        const firstDayOfMonth = new Date(current_year, current_month - 1, 1);
        const lastDayOfMonth = new Date(current_year, current_month, 0);

        const daysInMonth = lastDayOfMonth.getDate();
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday...

        const days = [];

        // Previous month filler days
        const prevMonthLastDay = new Date(current_year, current_month - 1, 0).getDate();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const dayNum = prevMonthLastDay - i;
            const prevMonth = current_month === 1 ? 12 : current_month - 1;
            const prevYear = current_month === 1 ? current_year - 1 : current_year;
            const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            days.push({
                day: dayNum,
                dateStr,
                isCurrentMonth: false,
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${current_year}-${String(current_month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({
                day: i,
                dateStr,
                isCurrentMonth: true,
            });
        }

        // Next month filler days (fill up to 35 or 42 cells)
        const totalCells = days.length > 35 ? 42 : 35;
        const remainingCells = totalCells - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            const nextMonth = current_month === 12 ? 1 : current_month + 1;
            const nextYear = current_month === 12 ? current_year + 1 : current_year;
            const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({
                day: i,
                dateStr,
                isCurrentMonth: false,
            });
        }

        return days;
    };

    const calendarGrid = generateCalendarGrid();

    // Navigate months
    const navigateMonth = (direction) => {
        let newMonth = current_month + direction;
        let newYear = current_year;

        if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        } else if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }

        router.get(
            '/admin/calendar',
            {
                year: newYear,
                month: newMonth,
                selected_date: `${newYear}-${String(newMonth).padStart(2, '0')}-01`,
            },
            {
                preserveState: true,
            }
        );
    };

    const goToToday = () => {
        const today = new Date();
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth() + 1;
        const todayDateStr = `${todayYear}-${String(todayMonth).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        router.get(
            '/admin/calendar',
            {
                year: todayYear,
                month: todayMonth,
                selected_date: todayDateStr,
            },
            {
                preserveState: true,
            }
        );
        setSelectedDate(todayDateStr);
    };

    // Handle day click
    const handleDayClick = (dateStr) => {
        setSelectedDate(dateStr);
    };

    // Selected Date Events
    const selectedEvents = (events_by_date[selectedDate] || []).filter((event) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            event.guest_name.toLowerCase().includes(query) ||
            event.booking_code.toLowerCase().includes(query) ||
            event.route_display.toLowerCase().includes(query) ||
            event.driver_name.toLowerCase().includes(query)
        );
    });

    // Format display for selected date in agenda header
    const getFormattedSelectedDate = () => {
        if (!selectedDate) return selected_date_formatted;
        const [y, m, d] = selectedDate.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        return dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AdminLayout title="Calendar">
            <div className="space-y-6 max-w-[1240px]">
                {/* ========================================================================= */}
                {/* 1. TOP SECTION: MONTHLY CALENDAR CARD                                     */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                    {/* Calendar Header Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-slate-100 gap-4">
                        {/* Month / Navigation */}
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                {month_name}
                            </h2>

                            {/* Navigation Group */}
                            <div className="flex items-center bg-slate-100/80 border border-slate-200/80 rounded-xl overflow-hidden h-9 shadow-2xs">
                                <button
                                    type="button"
                                    onClick={() => navigateMonth(-1)}
                                    className="px-2.5 h-full flex items-center justify-center hover:bg-slate-200/80 transition-colors text-slate-600 cursor-pointer"
                                    title="Previous Month"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={goToToday}
                                    className="px-4 h-full border-x border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
                                >
                                    Month
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigateMonth(1)}
                                    className="px-2.5 h-full flex items-center justify-center hover:bg-slate-200/80 transition-colors text-slate-600 cursor-pointer"
                                    title="Next Month"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Status Legend */}
                        <div className="flex items-center gap-3 text-xs">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200/60 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]"></span>
                                On Going
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FEDD00]"></span>
                                Pending
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]"></span>
                                Completed
                            </span>
                        </div>
                    </div>

                    {/* Day Headers (Sun - Sat) */}
                    <div className="grid grid-cols-7 bg-slate-50/70 border-b border-slate-100 text-center py-2.5">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => (
                            <div key={idx} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                {dayName}
                            </div>
                        ))}
                    </div>

                    {/* Days Matrix Grid */}
                    <div className="grid grid-cols-7 bg-slate-200/60 gap-[1px]">
                        {calendarGrid.map((item, idx) => {
                            const isSelected = item.dateStr === selectedDate;
                            const dayEvents = events_by_date[item.dateStr] || [];

                            return (
                                <div
                                    key={idx}
                                    onClick={() => handleDayClick(item.dateStr)}
                                    className={`min-h-[110px] p-2 bg-white flex flex-col justify-between cursor-pointer transition-all ${
                                        isSelected
                                            ? 'ring-2 ring-inset ring-[#00AEEF] bg-sky-50/20 z-10'
                                            : 'hover:bg-slate-50/80'
                                    }`}
                                >
                                    {/* Day Number */}
                                    <div className="flex justify-end mb-1">
                                        <span
                                            className={`text-sm leading-none flex items-center justify-center w-6 h-6 rounded-full ${
                                                !item.isCurrentMonth
                                                    ? 'text-slate-300'
                                                    : isSelected
                                                    ? 'bg-[#00AEEF] text-white font-bold shadow-xs'
                                                    : 'text-slate-800 font-medium'
                                            }`}
                                        >
                                            {item.day}
                                        </span>
                                    </div>

                                    {/* Event Badges inside Cell */}
                                    <div className="space-y-1 overflow-hidden">
                                        {dayEvents.slice(0, 2).map((ev) => {
                                            const status = ev.status ? ev.status.toLowerCase() : '';
                                            let badgeStyle = 'bg-sky-500 text-white font-medium';

                                            if (status === 'pending') {
                                                badgeStyle = 'bg-amber-100 text-amber-900 border border-amber-200/80 font-medium';
                                            } else if (status === 'completed') {
                                                badgeStyle = 'bg-emerald-500 text-white font-medium';
                                            }

                                            return (
                                                <div
                                                    key={ev.id}
                                                    className={`px-1.5 py-0.5 rounded text-[11px] truncate shadow-2xs ${badgeStyle}`}
                                                    title={`${ev.time_formatted} - ${ev.guest_name} (${ev.booking_type})`}
                                                >
                                                    {status === 'pending'
                                                        ? 'Pending'
                                                        : `${ev.time_formatted} ${ev.guest_name.split(' ')[0]}`}
                                                </div>
                                            );
                                        })}

                                        {dayEvents.length > 2 && (
                                            <div className="text-[10px] text-slate-400 font-semibold px-1">
                                                +{dayEvents.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* 2. BOTTOM SECTION: AGENDA VIEW (for Selected Date)                       */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 relative overflow-hidden">
                    {/* Agenda Header & Toolbar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200/60 flex items-center justify-center text-[#00AEEF]">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect width="18" height="18" x="3" y="4" rx="2" />
                                    <line x1="16" x2="16" y1="2" y2="6" />
                                    <line x1="8" x2="8" y1="2" y2="6" />
                                    <line x1="3" x2="21" y1="10" y2="10" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 leading-none">
                                    {getFormattedSelectedDate()}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    {selectedEvents.length} {selectedEvents.length === 1 ? 'trip' : 'trips'} scheduled for this date
                                </p>
                            </div>
                        </div>

                        {/* Search & Filter Icons */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {showSearch ? (
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Filter agenda..."
                                    className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 w-full sm:w-48 bg-white"
                                    autoFocus
                                />
                            ) : null}

                            <button
                                type="button"
                                onClick={() => setShowSearch(!showSearch)}
                                className="w-9 h-9 rounded-xl border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                                title="Search Agenda"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" x2="16.65" y1="21" y2="16.65" />
                                </svg>
                            </button>

                            <Link
                                href="/admin/bookings"
                                className="inline-flex items-center gap-1.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-xs active:scale-[0.98]"
                            >
                                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <line x1="12" x2="12" y1="5" y2="19" />
                                    <line x1="5" x2="19" y1="12" y2="12" />
                                </svg>
                                <span>Add Booking</span>
                            </Link>
                        </div>
                    </div>

                    {/* Agenda Cards Grid */}
                    {selectedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            {selectedEvents.map((booking) => {
                                const isCompleted = booking.status?.toLowerCase() === 'completed';

                                return (
                                    <div
                                        key={booking.id}
                                        className={`bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md ${
                                            isCompleted
                                                ? 'border-l-4 border-l-emerald-500'
                                                : 'border-l-4 border-l-[#00AEEF]'
                                        }`}
                                    >
                                        {/* Card Top: Type & Destination + Status Badge */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 block">
                                                    {booking.booking_type_label}
                                                </span>
                                                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                                                    {booking.route_display}
                                                </h4>
                                            </div>

                                            {/* Status Badge Pill */}
                                            {isCompleted ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs shrink-0">
                                                    <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                    <span>Completed</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/60 shadow-2xs shrink-0">
                                                    <svg className="w-3.5 h-3.5 text-[#00AEEF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                                                    </svg>
                                                    <span>{booking.badge_text}</span>
                                                </span>
                                            )}
                                        </div>

                                        {/* Card Body: 2x2 Detail Grid */}
                                        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
                                            {/* Time */}
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                <span className="font-semibold text-slate-800">{booking.time_ampm}</span>
                                            </div>

                                            {/* Guest & Pax */}
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                                <span className="truncate font-medium">{booking.pax_display}</span>
                                            </div>

                                            {/* Vehicle & Driver */}
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                                    <circle cx="7" cy="17" r="2" />
                                                    <circle cx="17" cy="17" r="2" />
                                                </svg>
                                                <span className="truncate font-medium">{booking.vehicle_driver_display}</span>
                                            </div>

                                            {/* Child Seats */}
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                                    <line x1="9" y1="9" x2="9.01" y2="9" />
                                                    <line x1="15" y1="9" x2="15.01" y2="9" />
                                                </svg>
                                                <span className="font-medium">{booking.child_seats_display}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-400">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect width="18" height="18" x="3" y="4" rx="2" />
                                    <line x1="16" x2="16" y1="2" y2="6" />
                                    <line x1="8" x2="8" y1="2" y2="6" />
                                    <line x1="3" x2="21" y1="10" y2="10" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-slate-600">No bookings scheduled for this date.</p>
                            <p className="text-xs text-slate-400 mt-1">Select another day or click Add Booking.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
