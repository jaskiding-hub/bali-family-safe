import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ stats = {}, today_schedule = [] }) {
    const {
        pending_bookings = 0,
        today_trips = 0,
        available_drivers = 0,
        month_revenue_formatted = 'Rp 0',
    } = stats;

    const todayFormatted = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <AdminLayout title="Dashboard">
            <div className="space-y-6 max-w-[1240px]">
                {/* Welcome & Quick Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#0A2540] to-[#1E3A8A] text-white p-6 rounded-2xl shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">
                            Operational Overview
                        </h2>
                        <p className="text-slate-300 text-sm mt-1">
                            {todayFormatted} &bull; Bali Family Safe Operations
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href="/admin/calendar"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-white/10 backdrop-blur-xs"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect width="18" height="18" x="3" y="4" rx="2" />
                                <line x1="16" x2="16" y1="2" y2="6" />
                                <line x1="8" x2="8" y1="2" y2="6" />
                                <line x1="3" x2="21" y1="10" y2="10" />
                            </svg>
                            <span>Open Calendar</span>
                        </Link>

                        <Link
                            href="/admin/bookings"
                            className="inline-flex items-center gap-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" x2="12" y1="5" y2="19" />
                                <line x1="5" x2="19" y1="12" y2="12" />
                            </svg>
                            <span>Manage Bookings</span>
                        </Link>
                    </div>
                </div>

                {/* Row 1: KPI Stat Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Pending Bookings */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Pending Bookings
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0">
                                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                {pending_bookings}
                            </span>
                            {pending_bookings > 0 ? (
                                <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                    Action Required
                                </span>
                            ) : (
                                <span className="text-xs text-slate-400 font-medium">
                                    All clear
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Card 2: Today's Trips */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Today's Trips
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200/60 flex items-center justify-center text-[#00AEEF] shrink-0">
                                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                    <circle cx="7" cy="17" r="2" />
                                    <path d="M9 17h6" />
                                    <circle cx="17" cy="17" r="2" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                {today_trips}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                Scheduled Today
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Available Drivers */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Available Drivers
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
                                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <polyline points="16 11 18 13 22 9" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                {available_drivers}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Online & Ready
                            </span>
                        </div>
                    </div>

                    {/* Card 4: This Month's Revenue */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Month's Revenue
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
                                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="14" x="2" y="5" rx="2" />
                                    <line x1="2" x2="22" y1="10" y2="10" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-4 flex items-baseline justify-between">
                            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                                {month_revenue_formatted}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                                This Month
                            </span>
                        </div>
                    </div>
                </div>

                {/* Row 2: Today's Schedule & Dispatch Table */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <h3 className="text-base font-bold text-slate-900">
                                Today's Schedule & Dispatch
                            </h3>
                            <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                                {today_schedule.length} trips
                            </span>
                        </div>

                        <Link
                            href="/admin/calendar"
                            className="text-xs font-semibold text-[#00AEEF] hover:text-[#0084B4] transition-colors"
                        >
                            View on Calendar &rarr;
                        </Link>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
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
                                                <Link
                                                    href={`/admin/bookings/${item.id}`}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:bg-sky-50 px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <span>View Details</span>
                                                    <span>&rarr;</span>
                                                </Link>
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
                </div>
            </div>
        </AdminLayout>
    );
}
