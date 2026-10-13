import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';

const MONTHS = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
];

const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

export const getStatusTheme = (statusStr) => {
    const s = (statusStr || '').toLowerCase();
    switch (s) {
        case 'pending':
            return {
                label: 'Pending',
                borderClass: 'border-l-4 border-l-amber-400',
                badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold',
                pillClass: 'bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs',
                cellClass: 'bg-amber-100 text-amber-950 border border-amber-300 font-semibold',
                textColor: 'text-amber-700',
                dotColor: 'bg-amber-400',
            };
        case 'confirmed':
            return {
                label: 'Confirmed',
                borderClass: 'border-l-4 border-l-blue-500',
                badgeClass: 'bg-blue-500 text-white font-medium',
                pillClass: 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs',
                cellClass: 'bg-blue-500 text-white font-medium',
                textColor: 'text-blue-700',
                dotColor: 'bg-blue-500',
            };
        case 'assigned':
            return {
                label: 'Assigned',
                borderClass: 'border-l-4 border-l-indigo-500',
                badgeClass: 'bg-indigo-500 text-white font-medium',
                pillClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs',
                cellClass: 'bg-indigo-500 text-white font-medium',
                textColor: 'text-indigo-700',
                dotColor: 'bg-indigo-500',
            };
        case 'on going':
            return {
                label: 'On Going',
                borderClass: 'border-l-4 border-l-[#00AEEF]',
                badgeClass: 'bg-[#00AEEF] text-white font-medium',
                pillClass: 'bg-sky-50 text-sky-700 border border-sky-200/80 shadow-2xs',
                cellClass: 'bg-[#00AEEF] text-white font-medium',
                textColor: 'text-sky-700',
                dotColor: 'bg-[#00AEEF]',
            };
        case 'completed':
            return {
                label: 'Completed',
                borderClass: 'border-l-4 border-l-emerald-500',
                badgeClass: 'bg-emerald-500 text-white font-medium',
                pillClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs',
                cellClass: 'bg-emerald-500 text-white font-medium',
                textColor: 'text-emerald-700',
                dotColor: 'bg-emerald-500',
            };
        case 'cancelled':
            return {
                label: 'Cancelled',
                borderClass: 'border-l-4 border-l-rose-500',
                badgeClass: 'bg-rose-500 text-white font-medium',
                pillClass: 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs',
                cellClass: 'bg-rose-500 text-white font-medium',
                textColor: 'text-rose-700',
                dotColor: 'bg-rose-500',
            };
        default:
            return {
                label: statusStr || 'Assigned',
                borderClass: 'border-l-4 border-l-indigo-500',
                badgeClass: 'bg-indigo-500 text-white font-medium',
                pillClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs',
                cellClass: 'bg-indigo-500 text-white font-medium',
                textColor: 'text-indigo-700',
                dotColor: 'bg-indigo-500',
            };
    }
};

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
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showTripDetailModal, setShowTripDetailModal] = useState(false);

    const openTripDetails = (trip) => {
        setSelectedTrip(trip);
        setShowTripDetailModal(true);
    };

    const closeTripDetails = () => {
        setShowTripDetailModal(false);
    };

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

    // Navigate month/year
    const changeMonthYear = (targetYear, targetMonth) => {
        const today = new Date();
        const isCurrent = today.getFullYear() === targetYear && (today.getMonth() + 1) === targetMonth;
        const targetDate = isCurrent
            ? `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
            : `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;

        router.get(
            '/admin/calendar',
            {
                year: targetYear,
                month: targetMonth,
                selected_date: targetDate,
            },
            {
                preserveState: true,
            }
        );
        setSelectedDate(targetDate);
    };

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

        changeMonthYear(newYear, newMonth);
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

    // Handle day click (auto-navigate if clicking filler day of adjacent month)
    const handleDayClick = (dateStr) => {
        setSelectedDate(dateStr);
        const [y, m] = dateStr.split('-').map(Number);
        if (y !== current_year || m !== current_month) {
            router.get(
                '/admin/calendar',
                {
                    year: y,
                    month: m,
                    selected_date: dateStr,
                },
                {
                    preserveState: true,
                }
            );
        } else {
            // Scroll to agenda section smoothly
            setTimeout(() => {
                const agendaSection = document.getElementById('agenda-section');
                if (agendaSection) {
                    agendaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
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
                {/* 1. TOP SECTION: MONTHLY CALENDAR CARD */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden p-4 sm:p-6">
                    {/* Calendar Header Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                        {/* Month / Year Quick Selectors + Navigation */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                            {/* Month Dropdown */}
                            <div className="relative">
                                <select
                                    value={current_month}
                                    onChange={(e) => changeMonthYear(current_year, parseInt(e.target.value, 10))}
                                    className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-extrabold text-sm sm:text-base rounded-xl pl-3.5 pr-8 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all shadow-2xs min-h-[40px]"
                                    aria-label="Select Month"
                                >
                                    {MONTHS.map((m) => (
                                        <option key={m.value} value={m.value}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </div>

                            {/* Year Dropdown */}
                            <div className="relative">
                                <select
                                    value={current_year}
                                    onChange={(e) => changeMonthYear(parseInt(e.target.value, 10), current_month)}
                                    className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-extrabold text-sm sm:text-base rounded-xl pl-3.5 pr-8 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all shadow-2xs min-h-[40px]"
                                    aria-label="Select Year"
                                >
                                    {YEARS.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </div>

                            {/* Arrow Navigation */}
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-0.5 shadow-2xs">
                                <button
                                    type="button"
                                    onClick={() => navigateMonth(-1)}
                                    className="p-2 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-all cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center hover:shadow-2xs"
                                    title="Previous Month"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigateMonth(1)}
                                    className="p-2 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-all cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center hover:shadow-2xs"
                                    title="Next Month"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Right: Today Button & Status Legend */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                            <div className="hidden lg:flex items-center gap-2.5 text-xs">
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

                            <button
                                type="button"
                                onClick={goToToday}
                                className="px-4 py-2 border border-[#00AEEF] bg-[#00AEEF]/5 hover:bg-[#00AEEF]/10 text-[#00AEEF] rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 ml-auto sm:ml-0"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 14 14" />
                                </svg>
                                <span>Today</span>
                            </button>
                        </div>
                    </div>

                    {/* Desktop Full Calendar Grid (Hidden on <lg) */}
                    <div className="hidden lg:block pt-3">
                        {/* Day Headers (Sun - Sat) */}
                        <div className="grid grid-cols-7 bg-slate-50/70 border border-slate-100 rounded-t-xl text-center py-2.5">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => (
                                <div key={idx} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    {dayName}
                                </div>
                            ))}
                        </div>

                        {/* Days Matrix Grid */}
                        <div className="grid grid-cols-7 bg-slate-200/60 gap-[1px] border-x border-b border-slate-200/60 rounded-b-xl overflow-hidden">
                            {calendarGrid.map((item, idx) => {
                                const isSelected = item.dateStr === selectedDate;
                                const dayEvents = events_by_date[item.dateStr] || [];

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleDayClick(item.dateStr)}
                                        className={`min-h-[105px] p-2 bg-white flex flex-col justify-between cursor-pointer transition-all ${
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
                                                const theme = getStatusTheme(ev.status);

                                                return (
                                                    <div
                                                        key={ev.id}
                                                        className={`px-1.5 py-0.5 rounded text-[11px] truncate shadow-2xs ${theme.cellClass}`}
                                                        title={`${ev.time_formatted} - ${ev.guest_name} (${ev.booking_type}) - ${theme.label}`}
                                                    >
                                                        {theme.label === 'Pending'
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

                    {/* Mobile & Tablet Compact Mini Calendar (Shown on <lg - Matching Figma Image 1) */}
                    <div className="block lg:hidden pt-3">
                        {/* Day Headers (S M T W T F S) */}
                        <div className="grid grid-cols-7 text-center py-2 text-xs font-bold text-slate-400">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <div key={i}>{d}</div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-y-2 text-center text-sm font-medium py-1">
                            {calendarGrid.map((item, idx) => {
                                const isSelected = item.dateStr === selectedDate;
                                const dayEvents = events_by_date[item.dateStr] || [];
                                const hasEvents = dayEvents.length > 0;

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleDayClick(item.dateStr)}
                                        className="flex flex-col items-center justify-center cursor-pointer py-1 relative min-h-[44px]"
                                    >
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all ${
                                                !item.isCurrentMonth
                                                    ? 'text-slate-300'
                                                    : isSelected
                                                    ? 'bg-[#00AEEF] text-white font-bold shadow-md shadow-sky-500/30'
                                                    : 'text-slate-800 hover:bg-slate-100 active:scale-95'
                                            }`}
                                        >
                                            {item.day}
                                        </div>

                                        {/* Event indicator dot on mobile */}
                                        {hasEvents && !isSelected && (
                                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                                {dayEvents.slice(0, 3).map((ev, idx) => {
                                                    const theme = getStatusTheme(ev.status);
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`w-1.5 h-1.5 rounded-full ${theme.dotColor} ring-1 ring-white`}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 2. BOTTOM SECTION: AGENDA VIEW */}
                <div id="agenda-section" className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 sm:p-6 relative overflow-hidden">
                    {/* Agenda Header & Toolbar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200/60 flex items-center justify-center text-[#00AEEF] shrink-0">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect width="18" height="18" x="3" y="4" rx="2" />
                                    <line x1="16" x2="16" y1="2" y2="6" />
                                    <line x1="8" x2="8" y1="2" y2="6" />
                                    <line x1="3" x2="21" y1="10" y2="10" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                                    {getFormattedSelectedDate()}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {selectedEvents.length} {selectedEvents.length === 1 ? 'trip' : 'trips'} scheduled
                                </p>
                            </div>
                        </div>

                        {/* Search & Add Action */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {showSearch ? (
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Filter agenda..."
                                    className="px-3 py-2 text-base sm:text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 w-full sm:w-48 bg-white min-h-[40px]"
                                    autoFocus
                                />
                            ) : null}

                            <button
                                type="button"
                                onClick={() => setShowSearch(!showSearch)}
                                className="w-10 h-10 rounded-xl border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                                title="Search Agenda"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" x2="16.65" y1="21" y2="16.65" />
                                </svg>
                            </button>

                            <Link
                                href="/admin/bookings"
                                className="inline-flex items-center justify-center gap-1.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white text-xs font-semibold px-3 sm:px-3.5 py-2.5 rounded-xl transition-all shadow-xs active:scale-[0.98] min-h-[40px] shrink-0"
                            >
                                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <line x1="12" x2="12" y1="5" y2="19" />
                                    <line x1="5" x2="19" y1="12" y2="12" />
                                </svg>
                                <span><span className="hidden xs:inline">Add </span>Booking</span>
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Agenda Cards Grid (Hidden on <lg) */}
                    {selectedEvents.length > 0 ? (
                        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            {selectedEvents.map((booking) => {
                                const theme = getStatusTheme(booking.status);

                                return (
                                    <div
                                        key={booking.id}
                                        className={`bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md ${theme.borderClass}`}
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
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-2xs shrink-0 ${theme.pillClass}`}>
                                                <span className={`w-2 h-2 rounded-full ${theme.dotColor}`}></span>
                                                <span>{theme.label}</span>
                                            </span>
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

                                        {/* Card Action Footer */}
                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-800">
                                                {booking.total_fee_formatted || '-'}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => openTripDetails(booking)}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00AEEF] hover:text-[#0084B4] hover:bg-sky-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <span>View Details</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="hidden lg:block py-12 text-center text-slate-400">
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

                    {/* Mobile & Tablet Agenda List (Shown on <lg) */}
                    <div className="block lg:hidden space-y-3 pt-3">
                        {selectedEvents.length > 0 ? (
                            selectedEvents.map((booking) => {
                                const theme = getStatusTheme(booking.status);
                                const statusBadge = (
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${theme.pillClass}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor}`}></span>
                                        <span>{theme.label}</span>
                                    </span>
                                );

                                const timeParts = (booking.time_ampm || '09:00 AM').split(' ');
                                const timeDigits = timeParts[0] || '09:00';
                                const timeAmPm = timeParts[1] || '';

                                return (
                                    <div
                                        key={booking.id}
                                        className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 p-4 flex flex-col gap-3 hover:bg-slate-50/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {/* Time Display */}
                                                <div className="flex flex-col items-start justify-center min-w-[50px] shrink-0 bg-sky-50 px-2 py-1.5 rounded-xl border border-sky-100">
                                                    <span className="text-sm font-extrabold text-[#00AEEF] tracking-tight leading-none">
                                                        {timeDigits}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">
                                                        {timeAmPm}
                                                    </span>
                                                </div>

                                                {/* Trip Details */}
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">
                                                        {booking.guest_name}
                                                    </h4>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 truncate">
                                                        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                                                        </svg>
                                                        <span className="truncate">{booking.route_display || booking.booking_type}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="shrink-0">
                                                {statusBadge}
                                            </div>
                                        </div>

                                        {/* Mobile Details Row: Driver/Vehicle, Pax, Seats */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-xl">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                                    <circle cx="7" cy="17" r="2" />
                                                    <circle cx="17" cy="17" r="2" />
                                                </svg>
                                                <span className="font-medium text-slate-700 truncate">{booking.vehicle_driver_display}</span>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0 text-slate-500 font-medium text-[11px]">
                                                <span>{booking.pax_display}</span>
                                                <span>&bull;</span>
                                                <span>{booking.child_seats_display}</span>
                                            </div>
                                        </div>

                                        {/* Mobile Button: View Trip Details */}
                                        <div className="pt-1">
                                            <button
                                                type="button"
                                                onClick={() => openTripDetails(booking)}
                                                className="w-full py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200/90 rounded-xl flex items-center justify-center gap-1.5 transition-all min-h-[42px] cursor-pointer shadow-2xs"
                                            >
                                                <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                                <span>View Trip Details</span>
                                                <span className="text-slate-400">&rarr;</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-8 text-center text-slate-400">
                                <p className="text-xs font-medium text-slate-500">No scheduled trips for this date.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* TRIP DETAIL POP UP MODAL */}
                <Modal
                    show={showTripDetailModal && !!selectedTrip}
                    onClose={closeTripDetails}
                    title={`Trip Details (${selectedTrip?.booking_code || ''})`}
                    maxWidth="2xl"
                    footer={
                        <>
                            <button
                                type="button"
                                onClick={closeTripDetails}
                                className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                            >
                                Close
                            </button>
                            <Link
                                href="/admin/bookings"
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs cursor-pointer min-h-[44px]"
                            >
                                <span>Manage in Bookings</span>
                                <span>&rarr;</span>
                            </Link>
                        </>
                    }
                >
                    {selectedTrip && (
                        <div className="space-y-4 sm:space-y-5">
                            {/* Form Fields Grid - Mirrors Add Booking Form structure */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* 1. Status */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Status
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 shadow-2xs flex items-center justify-between min-h-[42px]">
                                        <span className="font-semibold">{selectedTrip.status}</span>
                                        {(() => {
                                            const theme = getStatusTheme(selectedTrip.status);
                                            return (
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.pillClass}`}>
                                                    <span className={`w-2 h-2 rounded-full ${theme.dotColor}`}></span>
                                                    <span>{theme.label}</span>
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* 2. Booking Type */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Booking Type
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 font-semibold shadow-2xs min-h-[42px] flex items-center">
                                        {selectedTrip.booking_type_ui}
                                    </div>
                                </div>

                                {/* 3. Trip Date */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Trip Date
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 shadow-2xs font-medium min-h-[42px] flex items-center">
                                        {selectedTrip.trip_date_formatted || selectedTrip.booking_date}
                                    </div>
                                </div>

                                {/* 4. Time */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Time
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 shadow-2xs font-medium min-h-[42px] flex items-center">
                                        {selectedTrip.time}
                                    </div>
                                </div>

                                {/* 5. Duration (Hours) */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Duration
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 shadow-2xs font-medium min-h-[42px] flex items-center">
                                        {selectedTrip.duration_hours ? `${selectedTrip.duration_hours} Hours` : '-'}
                                    </div>
                                </div>

                                {/* 6. Guest Name */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Guest Name
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 font-semibold shadow-2xs min-h-[42px] flex items-center">
                                        {selectedTrip.guest_name}
                                    </div>
                                </div>

                                {/* 7. Phone / WhatsApp */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Phone / WhatsApp
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 shadow-2xs flex items-center justify-between min-h-[42px]">
                                        <span className="font-medium">{selectedTrip.whatsapp_number || '-'}</span>
                                        {selectedTrip.whatsapp_number && selectedTrip.whatsapp_number !== '-' && (
                                            <a
                                                href={`https://wa.me/${selectedTrip.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#00AEEF] hover:underline"
                                            >
                                                <span>Chat WA</span>
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                    <polyline points="15 3 21 3 21 9" />
                                                    <line x1="10" y1="14" x2="21" y2="3" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* 8. Email Address */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 shadow-2xs truncate font-medium min-h-[42px] flex items-center">
                                        {selectedTrip.email && selectedTrip.email !== '-' ? selectedTrip.email : '-'}
                                    </div>
                                </div>

                                {/* 9. Vehicle Type & Driver */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Vehicle Type & Driver
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 shadow-2xs space-y-1.5 min-h-[42px]">
                                        <div className="font-semibold text-slate-900 flex items-center justify-between gap-2">
                                            <span>{selectedTrip.vehicle_name} ({selectedTrip.vehicle_category})</span>
                                            {selectedTrip.vehicle_plate && selectedTrip.vehicle_plate !== '-' && (
                                                <span className="font-mono bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-xs font-bold text-slate-700 shrink-0">
                                                    {selectedTrip.vehicle_plate}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-600 flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                                            <span className="flex items-center gap-1.5">
                                                <span className="text-slate-400">Driver:</span>
                                                <strong className="text-slate-800">{selectedTrip.driver_name}</strong>
                                            </span>
                                            {selectedTrip.driver_phone && selectedTrip.driver_phone !== '-' && (
                                                <a
                                                    href={`https://wa.me/${selectedTrip.driver_phone.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#00AEEF] hover:underline shrink-0"
                                                >
                                                    <span>Chat Driver WA</span>
                                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                        <polyline points="15 3 21 3 21 9" />
                                                        <line x1="10" y1="14" x2="21" y2="3" />
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 10. Conditional: Flight Number */}
                                {(selectedTrip.booking_type_ui === 'Airport Pick-Up' || selectedTrip.booking_type_ui === 'Airport Drop-Off' || (selectedTrip.flight_number && selectedTrip.flight_number !== '-')) && (
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Flight Number
                                        </label>
                                        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 font-semibold shadow-2xs min-h-[42px] flex items-center">
                                            {selectedTrip.flight_number && selectedTrip.flight_number !== '-' ? selectedTrip.flight_number : '-'}
                                        </div>
                                    </div>
                                )}

                                {/* 11. Pickup Location */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Pickup Location
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 font-medium shadow-2xs break-words min-h-[42px] flex items-center">
                                        {selectedTrip.pickup_location}
                                    </div>
                                </div>

                                {/* 12. Drop-off Location */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Drop-off Location
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 font-medium shadow-2xs break-words min-h-[42px] flex items-center">
                                        {selectedTrip.dropoff_location}
                                    </div>
                                </div>

                                {/* 13. Adults */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Adults
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 font-semibold shadow-2xs min-h-[42px] flex items-center">
                                        {selectedTrip.adults} Adults
                                    </div>
                                </div>

                                {/* 14. Children */}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Children
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 font-semibold shadow-2xs min-h-[42px] flex items-center">
                                        {selectedTrip.children || 0} Children
                                    </div>
                                </div>

                                {/* 15. Total Fee */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Total Fee (Rp)
                                    </label>
                                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-900 font-extrabold shadow-2xs min-h-[42px] flex items-center">
                                        {selectedTrip.total_fee_formatted || `Rp ${Number(selectedTrip.total_fee || 0).toLocaleString('id-ID')}`}
                                    </div>
                                </div>

                                {/* 16. Notes / Special Requests & Child Seats */}
                                <div className="sm:col-span-2 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Notes / Special Requests
                                        </label>
                                        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-base sm:text-xs text-slate-800 shadow-2xs min-h-[50px]">
                                            {selectedTrip.notes ? selectedTrip.notes : <span className="text-slate-400 italic">No special notes</span>}
                                        </div>
                                    </div>

                                    {/* Child Seats */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Child Seats Requested
                                        </label>
                                        {selectedTrip.child_seats_list && selectedTrip.child_seats_list.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedTrip.child_seats_list.map((cs, idx) => (
                                                    <span key={idx} className="bg-amber-50 text-amber-800 border border-amber-200/80 px-3 py-1.5 rounded-xl font-bold text-xs shadow-2xs flex items-center gap-1.5">
                                                        <svg className="w-3.5 h-3.5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                                        </svg>
                                                        {cs.name} &bull; {cs.quantity} Unit
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-xs text-slate-400 italic bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 shadow-2xs">
                                                No child seats requested
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </AdminLayout>
    );
}
