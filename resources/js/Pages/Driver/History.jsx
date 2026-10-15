import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DriverLayout, { useDriverProfile } from '@/Layouts/DriverLayout';
import Modal from '@/Components/Modal';
import AlertModal from '@/Components/AlertModal';

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
    const [selectedYear, setSelectedYear] = useState(filters.year || '');
    const [selectedMonthOnly, setSelectedMonthOnly] = useState(filters.month || '');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertModalConfig, setAlertModalConfig] = useState({ message: '', type: 'warning', title: 'Perhatian' });

    const showAlert = (message, type = 'warning', title = 'Perhatian') => {
        setAlertModalConfig({ message, type, title });
        setShowAlertModal(true);
    };

    // Generate year options (last 3 years to current)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i);

    const monthOptions = [
        { value: '01', label: 'Januari' },
        { value: '02', label: 'Februari' },
        { value: '03', label: 'Maret' },
        { value: '04', label: 'April' },
        { value: '05', label: 'Mei' },
        { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' },
        { value: '08', label: 'Agustus' },
        { value: '09', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];

    // Auto-search on type (debounced)
    const isFirstSearchRender = React.useRef(true);
    React.useEffect(() => {
        if (isFirstSearchRender.current) {
            isFirstSearchRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                '/driver/history',
                {
                    search: searchTerm || undefined,
                    year: selectedYear || undefined,
                    month: selectedMonthOnly || undefined,
                },
                { preserveState: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, selectedYear, selectedMonthOnly]);

    const handleResetFilter = () => {
        setSearchTerm('');
        setSelectedYear('');
        setSelectedMonthOnly('');
        router.get('/driver/history', {}, { preserveState: true, replace: true });
    };

    const openDeleteModal = (trip) => {
        setTripToDelete(trip);
        setShowDeleteModal(true);
    };

    const handleDeleteTrip = () => {
        if (!tripToDelete) return;
        router.delete(`/driver/history/${tripToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setTripToDelete(null);
            },
            onError: () => {
                showAlert('Gagal menghapus trip dari riwayat', 'error', 'Error');
            }
        });
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleMonthOnlyChange = (e) => {
        setSelectedMonthOnly(e.target.value);
    };

    const trips = completedTrips?.data || [];

    return (
        <DriverLayout>
            <Head title="Riwayat Trip - Driver Bali Family Safe" />

            {/* Top App Bar Header (sama seperti Home dan Schedule) */}
            <header className="w-full bg-[#3E5E95] border-b border-white/10 shadow-sm sticky top-0 z-30">
                <div className="max-w-6xl mx-auto h-[64px] px-4 sm:px-8 lg:px-12 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={openProfile}
                        className="btn-open-driver-profile flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
                    >
                        <img
                            src={driver?.profile_photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                            alt="Driver Profile"
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

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 w-full py-5 pb-28 sm:pb-32 flex flex-col gap-5">
                {/* Screen Title */}
                <div>
                    <h2 className="text-[#171C20] text-2xl font-bold tracking-tight">Riwayat Trip</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Perjalanan yang telah selesai</p>
                </div>
                {/* Stat Counters */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500">Total Selesai</span>
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                            {stats.total_completed ?? completedTrips.total ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">Trips completed</span>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500">Bulan Ini</span>
                            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                            {stats.this_month_completed ?? 0}
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">Trips this month</span>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                    <div className="flex flex-col gap-3">
                        {/* Search */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cari Trip</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Ketik kode booking atau nama tamu..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition"
                                />
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">Pencarian otomatis saat mengetik</p>
                        </div>

                        {/* Month Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Filter Bulan</label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <rect width="18" height="18" x="3" y="4" rx="2" />
                                            <line x1="16" x2="16" y1="2" y2="6" />
                                            <line x1="8" x2="8" y1="2" y2="6" />
                                            <line x1="3" x2="21" y1="10" y2="10" />
                                        </svg>
                                    </span>
                                    <select
                                        value={selectedYear}
                                        onChange={handleYearChange}
                                        className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition appearance-none cursor-pointer"
                                    >
                                        <option value="">Tahun</option>
                                        {yearOptions.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </div>
                                <div className="relative flex-1">
                                    <select
                                        value={selectedMonthOnly}
                                        onChange={handleMonthOnlyChange}
                                        className="w-full pl-3 pr-8 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition appearance-none cursor-pointer"
                                    >
                                        <option value="">Bulan</option>
                                        {monthOptions.map(month => (
                                            <option key={month.value} value={month.value}>{month.label}</option>
                                        ))}
                                    </select>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </div>
                                {(searchTerm || selectedYear || selectedMonthOnly) && (
                                    <button
                                        type="button"
                                        onClick={handleResetFilter}
                                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trip Table */}
                {trips.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-2xs border border-slate-200/80 overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4">Tanggal</th>
                                        <th className="py-3 px-4">Tamu & Trip</th>
                                        <th className="py-3 px-4">Lokasi</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {trips.map((trip) => {
                                        const isDayTour = trip.booking_type === 'Day Tour' || trip.trip_type?.toLowerCase().includes('day tour');
                                        return (
                                            <tr key={trip.id} className="hover:bg-slate-50/60 transition">
                                                <td className="py-3 px-4 whitespace-nowrap">
                                                    <div className="font-semibold text-slate-800 text-xs">
                                                        {formatDisplayDate(trip.trip_date)}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 mt-0.5">
                                                        {trip.trip_time}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-bold text-slate-900 text-sm">{trip.guest_name}</div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                                            {trip.booking_code}
                                                        </span>
                                                        <span className="text-xs text-slate-600">
                                                            {trip.trip_type}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-xs text-slate-700 max-w-xs">
                                                        {isDayTour ? (
                                                            <span className="font-medium">{trip.pickup_location}</span>
                                                        ) : (
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></div>
                                                                    <span className="truncate">{trip.pickup_location}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                                                    <span className="truncate">{trip.dropoff_location}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Completed
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={`/driver/trips/${trip.id}?from=history`}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00AEEF] hover:bg-[#009cd7] text-white font-semibold text-xs transition cursor-pointer"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            Detail
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => openDeleteModal(trip)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition cursor-pointer"
                                                            title="Hapus dari riwayat"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile/Tablet Card List */}
                        <div className="block md:hidden divide-y divide-slate-100">
                            {trips.map((trip) => {
                                const isDayTour = trip.booking_type === 'Day Tour' || trip.trip_type?.toLowerCase().includes('day tour');
                                return (
                                    <div key={trip.id} className="p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-slate-900 text-sm">{trip.guest_name}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                                        {trip.booking_code}
                                                    </span>
                                                    <span className="text-xs text-slate-600 truncate">{trip.trip_type}</span>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Done
                                            </span>
                                        </div>

                                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <rect width="18" height="18" x="3" y="4" rx="2" />
                                                <line x1="16" x2="16" y1="2" y2="6" />
                                                <line x1="8" x2="8" y1="2" y2="6" />
                                                <line x1="3" x2="21" y1="10" y2="10" />
                                            </svg>
                                            <span className="font-medium">{formatDisplayDate(trip.trip_date)}</span>
                                            <span>•</span>
                                            <span>{trip.trip_time}</span>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-xs">
                                            {isDayTour ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0"></div>
                                                    <span className="font-medium text-slate-700">{trip.pickup_location}</span>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0"></div>
                                                        <span className="text-slate-700">{trip.pickup_location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                                                        <span className="text-slate-700">{trip.dropoff_location}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-1 flex gap-2">
                                            <Link
                                                href={`/driver/trips/${trip.id}?from=history`}
                                                className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200/90 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                                            >
                                                <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                                <span>Detail</span>
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal(trip)}
                                                className="px-3 py-2.5 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl flex items-center justify-center transition cursor-pointer shadow-2xs"
                                                title="Hapus"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {completedTrips?.links && completedTrips.links.length > 3 && (
                            <div className="flex items-center justify-center gap-1 p-4 border-t border-slate-100 bg-slate-50/50">
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
                                                    ? 'bg-[#00AEEF] text-white shadow-xs'
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
                    <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900">Belum Ada Riwayat Perjalanan</h3>
                            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                                {searchTerm || selectedYear || selectedMonthOnly
                                    ? 'Tidak ditemukan trip yang cocok dengan kata kunci atau filter bulan yang dipilih.'
                                    : 'Perjalanan yang telah diselesaikan (Completed) akan otomatis tercatat dan tersimpan di halaman ini.'}
                            </p>
                        </div>
                        {(searchTerm || selectedYear || selectedMonthOnly) && (
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="px-4 py-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white font-bold text-xs rounded-xl transition cursor-pointer"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                maxWidth="sm"
            >
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900">Hapus dari Riwayat?</h3>
                            <p className="text-sm text-slate-600 mt-1">
                                Trip ini akan dihapus dari riwayat Anda. Data di admin tetap tersimpan.
                            </p>
                        </div>
                    </div>

                    {tripToDelete && (
                        <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-200">
                            <div className="text-xs text-slate-500 mb-1">Trip yang akan dihapus:</div>
                            <div className="font-semibold text-slate-900">{tripToDelete.guest_name}</div>
                            <div className="text-xs text-slate-600 mt-0.5">
                                {tripToDelete.booking_code} • {formatDisplayDate(tripToDelete.trip_date)}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(false)}
                            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteTrip}
                            className="flex-1 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-xs"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Alert Modal */}
            <AlertModal
                show={showAlertModal}
                onClose={() => setShowAlertModal(false)}
                title={alertModalConfig.title}
                message={alertModalConfig.message}
                type={alertModalConfig.type}
            />
        </DriverLayout>
    );
}
