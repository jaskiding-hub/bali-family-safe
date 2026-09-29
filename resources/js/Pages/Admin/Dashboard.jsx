import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';

export default function Dashboard({
    stats = {},
    today_date = '',
    today_schedule = [],
}) {
    const { flash = {} } = usePage().props;

    const {
        pending_bookings = 0,
        today_trips = 0,
        available_drivers = 0,
        month_revenue_formatted = 'Rp 0',
    } = stats;

    const todayFormatted = today_date || new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    // Trip detail modal state
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [showTripDetailModal, setShowTripDetailModal] = useState(false);

    const openTripDetails = (trip) => {
        setSelectedTrip(trip);
        setShowTripDetailModal(true);
    };

    const closeTripDetails = () => {
        setShowTripDetailModal(false);
    };

    return (
        <AdminLayout title="Dashboard">
            <div className="space-y-6 max-w-[1240px]">
                {/* Flash Success Alert */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-emerald-800">
                                {flash.success}
                            </p>
                        </div>
                    </div>
                )}

                {/* 1. Operational Overview Banner */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#0A2540] to-[#1E3A8A] text-white p-4 sm:p-6 rounded-2xl shadow-sm">
                    <div>
                        <h2 className="text-base sm:text-xl font-bold tracking-tight">
                            Operational Overview
                        </h2>
                        <p className="text-slate-300 text-xs sm:text-sm mt-0.5 sm:mt-1">
                            {todayFormatted} &bull; Bali Family Safe
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-2 w-full sm:w-auto">
                        <Link
                            href="/admin/calendar"
                            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 sm:px-4 py-2.5 rounded-xl transition-all border border-white/10 backdrop-blur-xs min-h-[44px] text-center"
                        >
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect width="18" height="18" x="3" y="4" rx="2" />
                                <line x1="16" x2="16" y1="2" y2="6" />
                                <line x1="8" x2="8" y1="2" y2="6" />
                                <line x1="3" x2="21" y1="10" y2="10" />
                            </svg>
                            <span className="truncate">Calendar</span>
                        </Link>

                        <Link
                            href="/admin/bookings"
                            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white text-xs font-semibold px-3 sm:px-4 py-2.5 rounded-xl transition-all shadow-sm min-h-[44px] text-center"
                        >
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" x2="12" y1="5" y2="19" />
                                <line x1="5" x2="19" y1="12" y2="12" />
                            </svg>
                            <span className="truncate">Bookings</span>
                        </Link>
                    </div>
                </div>

                {/* 2. 4 KPI Stat Cards (2 Columns on mobile, 4 Columns on desktop) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                    {/* Card 1: Pending Bookings */}
                    <div className="bg-white border border-slate-200/80 border-l-4 border-l-rose-500 rounded-2xl p-3.5 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                                PENDING
                            </span>
                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0">
                                <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-2.5 sm:mt-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                {pending_bookings}
                            </span>
                            {pending_bookings > 0 ? (
                                <span className="inline-flex self-start sm:self-auto bg-rose-100 text-rose-800 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                                    Action
                                </span>
                            ) : (
                                <span className="text-xs text-slate-400 font-medium">
                                    -
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Card 2: Today's Trips */}
                    <div className="bg-white border border-slate-200/80 border-l-4 border-l-[#00AEEF] rounded-2xl p-3.5 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                                TODAY'S TRIPS
                            </span>
                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-sky-50 border border-sky-200/60 flex items-center justify-center text-[#00AEEF] shrink-0">
                                <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                    <circle cx="7" cy="17" r="2" />
                                    <path d="M9 17h6" />
                                    <circle cx="17" cy="17" r="2" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-2.5 sm:mt-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                {today_trips}
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                                Scheduled
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Available Drivers */}
                    <div className="bg-white border border-slate-200/80 border-l-4 border-l-slate-700 rounded-2xl p-3.5 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                                DRIVERS
                            </span>
                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
                                <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <polyline points="16 11 18 13 22 9" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-2.5 sm:mt-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                {available_drivers}
                            </span>
                            <span className="inline-flex self-start sm:self-auto items-center gap-1 text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Online
                            </span>
                        </div>
                    </div>

                    {/* Card 4: This Month's Revenue */}
                    <div className="bg-white border border-slate-200/80 border-l-4 border-l-amber-500 rounded-2xl p-3.5 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                                REVENUE
                            </span>
                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
                                <svg className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="14" x="2" y="5" rx="2" />
                                    <line x1="2" y1="22" x2="22" y2="10" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-2.5 sm:mt-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <span className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight truncate" title={month_revenue_formatted}>
                                {month_revenue_formatted}
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                                Month
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Today's Schedule & Dispatch Section */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                    {/* Header */}
                    <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                                Today's Schedule & Dispatch
                            </h3>
                            <span className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                                {today_schedule.length} {today_schedule.length === 1 ? 'trip' : 'trips'}
                            </span>
                        </div>

                        <Link
                            href="/admin/calendar"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#00AEEF] hover:text-[#0084B4] transition-colors shrink-0 whitespace-nowrap"
                        >
                            <span>View Calendar</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>

                    {/* Desktop Table View (Hidden on <lg) */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-3.5">
                                        Pickup Time
                                    </th>
                                    <th className="px-6 py-3.5">
                                        Guest & Service
                                    </th>
                                    <th className="px-6 py-3.5">
                                        Pickup Location
                                    </th>
                                    <th className="px-6 py-3.5">
                                        Assigned Driver
                                    </th>
                                    <th className="px-6 py-3.5 text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {today_schedule.length > 0 ? (
                                    today_schedule.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                             {/* Time */}
                                            <td className="px-6 py-4 font-semibold text-slate-800 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <polyline points="12 6 12 12 16 14" />
                                                    </svg>
                                                    <span>{item.pickup_time || '-'}</span>
                                                </div>
                                            </td>

                                            {/* Guest & Service */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">
                                                        {item.guest_name}
                                                    </span>
                                                    <span className="text-xs text-slate-500 mt-0.5">
                                                        {item.service_name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Pick-up Location */}
                                            <td className="px-6 py-4 text-slate-700">
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                                        <circle cx="12" cy="10" r="3" />
                                                    </svg>
                                                    <span className="truncate max-w-xs">{item.pickup_location}</span>
                                                </div>
                                            </td>

                                            {/* Assigned Driver */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.driver ? (
                                                    <div className="flex items-center gap-2.5">
                                                        {item.driver.photo_url ? (
                                                            <img
                                                                src={item.driver.photo_url}
                                                                alt={item.driver.name}
                                                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                                                            />
                                                        ) : (
                                                            <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-bold">
                                                                {item.driver.name ? item.driver.name.charAt(0).toUpperCase() : 'D'}
                                                            </div>
                                                        )}
                                                        <span className="font-medium text-slate-800">
                                                            {item.driver.name}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 font-medium">
                                                        Unassigned
                                                    </span>
                                                )}
                                            </td>

                                            {/* Action */}
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => openTripDetails(item)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:bg-sky-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <span>View Details</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <rect width="18" height="18" x="3" y="4" rx="2" />
                                                        <line x1="16" x2="16" y1="2" y2="6" />
                                                        <line x1="8" x2="8" y1="2" y2="6" />
                                                        <line x1="3" x2="21" y1="10" y2="10" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-medium text-slate-500">
                                                    No scheduled trips for today.
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile & Tablet Card List View (Shown on <lg) */}
                    <div className="block lg:hidden divide-y divide-slate-100">
                        {today_schedule.length > 0 ? (
                            today_schedule.map((item) => (
                                <div key={item.id} className="p-4 sm:p-5 flex flex-col gap-3.5 hover:bg-slate-50/50 transition-colors">
                                    <div>
                                        <div className="text-base font-extrabold text-slate-900 tracking-tight">
                                            {item.pickup_time || '-'}
                                        </div>
                                        <div className="text-sm font-semibold text-slate-800 mt-0.5">
                                            {item.guest_name} &bull; {item.service_name}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        <span className="truncate">{item.pickup_location}</span>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                                        <span className="text-xs font-semibold text-slate-500">Assigned Driver:</span>
                                        {item.driver ? (
                                            <div className="flex items-center gap-2">
                                                {item.driver.photo_url ? (
                                                    <img
                                                        src={item.driver.photo_url}
                                                        alt={item.driver.name}
                                                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-[10px] font-bold">
                                                        {item.driver.name ? item.driver.name.charAt(0).toUpperCase() : 'D'}
                                                    </div>
                                                )}
                                                <span className="text-xs font-bold text-slate-900">
                                                    {item.driver.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                                                Unassigned
                                            </span>
                                        )}
                                    </div>

                                    {/* Action button */}
                                    <div className="pt-1">
                                        <button
                                            type="button"
                                            onClick={() => openTripDetails(item)}
                                            className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all min-h-[42px] bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs cursor-pointer"
                                        >
                                            <span>View Details</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-12 text-center text-slate-400">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <rect width="18" height="18" x="3" y="4" rx="2" />
                                            <line x1="16" x2="16" y1="2" y2="6" />
                                            <line x1="8" x2="8" y1="2" y2="6" />
                                            <line x1="3" x2="21" y1="10" y2="10" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">
                                        No scheduled trips for today.
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal: Trip Details */}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* 1. Status */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Status
                                </label>
                                <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 shadow-2xs flex items-center justify-between min-h-[42px]">
                                    <span className="font-semibold">{selectedTrip.status}</span>
                                    {selectedTrip.status?.toLowerCase() === 'completed' ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            Completed
                                        </span>
                                    ) : selectedTrip.status?.toLowerCase() === 'pending' ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                            Pending
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                                            {selectedTrip.status}
                                        </span>
                                    )}
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
                                    {selectedTrip.time || selectedTrip.pickup_time}
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
        </AdminLayout>
    );
}
