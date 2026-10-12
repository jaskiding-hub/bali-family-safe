import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DriverLayout, { useDriverProfile } from '@/Layouts/DriverLayout';

function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            const day = parseInt(parts[2], 10);
            const month = months[parseInt(parts[1], 10) - 1];
            const year = parts[0];
            return `${day} ${month} ${year}`;
        }
        return dateStr;
    } catch {
        return dateStr;
    }
}

export default function History({
    driver = {},
    completedTrips = { data: [], links: [], total: 0 },
    stats = { total_completed: 0, this_month_completed: 0 },
    filters = {},
}) {
    const { openProfile } = useDriverProfile();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedMonth, setSelectedMonth] = useState(filters.month || '');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(
            '/driver/history',
            {
                search: searchTerm || undefined,
                month: selectedMonth || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleResetFilter = () => {
        setSearchTerm('');
        setSelectedMonth('');
        router.get('/driver/history', {}, { preserveState: true, replace: true });
    };

    const trips = completedTrips?.data || [];

    return (
        <DriverLayout>
            <Head title="Riwayat Trip - Driver Bali Family Safe" />

            <div className="flex-1 w-full max-w-xl md:max-w-2xl mx-auto px-4 sm:px-6 pt-5 pb-24 flex flex-col gap-5">
                {/* Top Bar Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-sky-700 tracking-wider uppercase">Bali Family Safe Tours</span>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Riwayat Trip</h1>
                    </div>
                    <button
                        type="button"
                        onClick={openProfile}
                        className="btn-open-driver-profile flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 transition cursor-pointer"
                        title="Buka Profil Driver"
                    >
                        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-sky-100">
                            {driver?.profile_photo_url ? (
                                <img
                                    src={driver.profile_photo_url}
                                    alt={driver.full_name || 'Driver'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-sky-800 text-sm">
                                    {(driver?.full_name || 'D').charAt(0)}
                                </div>
                            )}
                        </div>
                    </button>
                </header>

                {/* Stat Counters */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Total Selesai</span>
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                                {stats.total_completed ?? completedTrips.total ?? 0}
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">Trips completed</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500">Bulan Ini</span>
                            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                                {stats.this_month_completed ?? 0}
                            </span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">Trips this month</span>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative flex-1 w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Cari kode booking atau nama tamu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="py-2 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition"
                            title="Filter bulan"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#00AEEF] hover:bg-[#009cd7] text-[#003E58] font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
                        >
                            Filter
                        </button>
                        {(searchTerm || selectedMonth) && (
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl transition cursor-pointer shrink-0"
                                title="Reset filter"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </form>

                {/* Trip Cards List */}
                {trips.length > 0 ? (
                    <div className="flex flex-col gap-3.5">
                        {trips.map((trip) => {
                            const isDayTour = trip.booking_type === 'Day Tour' || trip.trip_type?.toLowerCase().includes('day tour');

                            return (
                                <div
                                    key={trip.id}
                                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition duration-200 hover:border-slate-300"
                                >
                                    {/* Card Header: Booking Code & Status */}
                                    <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                                                {trip.booking_code}
                                            </span>
                                            <span className="text-[11px] font-semibold text-slate-500">
                                                {formatDisplayDate(trip.trip_date)} • {trip.trip_time}
                                            </span>
                                        </div>

                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                            <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Completed
                                        </span>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4 sm:p-5 pt-3 space-y-3">
                                        {/* Guest & Trip Type */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900 leading-snug">
                                                    {trip.guest_name}
                                                </h3>
                                                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                                                    <span>{trip.pax_description || `${trip.pax} Pax`}</span>
                                                    <span>•</span>
                                                    <span>{trip.vehicle_type}</span>
                                                </div>
                                            </div>

                                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-sky-50 text-[#00658D] border border-sky-100">
                                                {trip.trip_type}
                                            </span>
                                        </div>

                                        {/* Route Timeline (Khusus Day Tour tidak menampilkan Drop-off) */}
                                        {isDayTour ? (
                                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 flex items-center gap-3">
                                                <div className="w-2.5 h-2.5 rounded-full border-2 border-sky-500 bg-white shrink-0"></div>
                                                <div className="min-w-0">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pick-up Point</span>
                                                    <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block mt-0.5">{trip.pickup_location}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 flex items-stretch gap-3">
                                                <div className="flex flex-col items-center w-2.5 shrink-0 py-0.5">
                                                    <div className="w-2 h-2 rounded-full border-2 border-sky-500 bg-white shrink-0"></div>
                                                    <div className="w-[1.5px] grow my-1 bg-slate-200"></div>
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                                                </div>
                                                <div className="flex flex-col justify-between grow gap-1.5 min-w-0 text-xs">
                                                    <div className="min-w-0">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pick-up</span>
                                                        <span className="font-bold text-slate-800 truncate block">{trip.pickup_location}</span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Drop-off / Route</span>
                                                        <span className="font-bold text-slate-800 truncate block">{trip.dropoff_location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons Footer */}
                                        <div className="flex items-center gap-2 pt-1">
                                            <Link
                                                href={`/driver/trips/${trip.id}?from=history`}
                                                className="flex-1 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-[0.985] cursor-pointer"
                                            >
                                                <span>Detail Perjalanan</span>
                                                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>

                                            <Link
                                                href={`/driver/trips/${trip.id}/expense`}
                                                className="px-3.5 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-[0.985] cursor-pointer"
                                                title="Biaya operasional / Reimburse"
                                            >
                                                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Biaya ({trip.expenses?.length || 0})</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Pagination Links if applicable */}
                        {completedTrips?.links && completedTrips.links.length > 3 && (
                            <div className="flex items-center justify-center gap-1 pt-4">
                                {completedTrips.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="px-3 py-1.5 text-xs text-slate-400 rounded-lg cursor-not-allowed"
                                            />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                                                link.active
                                                    ? 'bg-[#00AEEF] text-[#003E58]'
                                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center gap-4 my-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900">Belum Ada Riwayat Perjalanan</h3>
                            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                                {searchTerm || selectedMonth
                                    ? 'Tidak ditemukan trip yang cocok dengan kata kunci atau filter bulan yang dipilih.'
                                    : 'Perjalanan yang telah diselesaikan (Completed) akan otomatis tercatat dan tersimpan di halaman ini.'}
                            </p>
                        </div>
                        {(searchTerm || selectedMonth) && (
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="px-4 py-2 bg-[#00AEEF] hover:bg-[#009cd7] text-[#003E58] font-bold text-xs rounded-xl transition cursor-pointer"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                )}
            </div>
        </DriverLayout>
    );
}
