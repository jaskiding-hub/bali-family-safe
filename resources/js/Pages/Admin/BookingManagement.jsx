import React, { useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';

export default function BookingManagement({
    stats = {},
    drivers = { data: [], links: [] },
    bookings = { data: [], links: [] },
    available_drivers = [],
    filters = {},
}) {
    const { errors = {}, flash = {} } = usePage().props;

    // Search states
    const [driverSearch, setDriverSearch] = useState(filters.search_driver || '');
    const [bookingSearch, setBookingSearch] = useState(filters.search_booking || '');

    // Modal states
    const [showAddDriverModal, setShowAddDriverModal] = useState(false);
    const [showEditDriverModal, setShowEditDriverModal] = useState(false);
    const [showDeleteDriverModal, setShowDeleteDriverModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);

    const [showAddBookingModal, setShowAddBookingModal] = useState(false);
    const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
    const [showEditBookingModal, setShowEditBookingModal] = useState(false);
    const [showDeleteBookingModal, setShowDeleteBookingModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Forms for actions
    const assignDriverForm = useForm({
        driver_id: '',
    });

    const driverForm = useForm({
        full_name: '',
        whatsapp_number: '',
        license_number: '',
        license_expiry_date: '',
        status: 'Active',
    });

    // Handle Driver Search
    const handleDriverSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/bookings',
            {
                search_driver: driverSearch,
                search_booking: bookingSearch,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Handle Booking Search
    const handleBookingSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/bookings',
            {
                search_driver: driverSearch,
                search_booking: bookingSearch,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Driver Action Handlers
    const openEditDriver = (driver) => {
        setSelectedDriver(driver);
        driverForm.setData({
            full_name: driver.full_name,
            whatsapp_number: driver.whatsapp_number || '',
            license_number: driver.license_number || '',
            license_expiry_date: driver.license_expiry_date || '',
            status: driver.status || 'Active',
        });
        setShowEditDriverModal(true);
    };

    const openDeleteDriver = (driver) => {
        setSelectedDriver(driver);
        setShowDeleteDriverModal(true);
    };

    const handleDeleteDriver = () => {
        if (!selectedDriver) return;
        router.delete(`/admin/drivers/${selectedDriver.raw_id}`, {
            onSuccess: () => {
                setShowDeleteDriverModal(false);
                setSelectedDriver(null);
            },
        });
    };

    // Booking Action Handlers
    const openAssignDriver = (booking) => {
        setSelectedBooking(booking);
        assignDriverForm.setData('driver_id', booking.driver_id || (available_drivers[0]?.id || ''));
        setShowAssignDriverModal(true);
    };

    const handleAssignDriverSubmit = (e) => {
        e.preventDefault();
        if (!selectedBooking) return;
        assignDriverForm.post(`/admin/bookings/${selectedBooking.raw_id}/assign-driver`, {
            onSuccess: () => {
                setShowAssignDriverModal(false);
                setSelectedBooking(null);
            },
        });
    };

    const openEditBooking = (booking) => {
        setSelectedBooking(booking);
        setShowEditBookingModal(true);
    };

    const openDeleteBooking = (booking) => {
        setSelectedBooking(booking);
        setShowDeleteBookingModal(true);
    };

    const handleDeleteBooking = () => {
        if (!selectedBooking) return;
        router.delete(`/admin/bookings/${selectedBooking.raw_id}`, {
            onSuccess: () => {
                setShowDeleteBookingModal(false);
                setSelectedBooking(null);
            },
        });
    };

    // Status Badge Component
    const renderStatusBadge = (status) => {
        const s = status ? status.toLowerCase() : '';
        if (s === 'pending') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Pending
                </span>
            );
        }
        if (s === 'confirmed' || s === 'completed') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {status}
                </span>
            );
        }
        if (s === 'assigned') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Assigned
                </span>
            );
        }
        if (s === 'on going' || s === 'ongoing') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                    On going
                </span>
            );
        }
        if (s === 'cancelled') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Cancelled
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                {status || '-'}
            </span>
        );
    };

    // Generic Pagination Component
    const renderPagination = (paginatedData) => {
        if (!paginatedData || paginatedData.total === 0) return null;

        const { from, to, total, links = [] } = paginatedData;

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-slate-50/50 border-t border-slate-100 gap-4">
                <div className="text-xs sm:text-sm font-medium text-slate-500">
                    Showing <span className="font-semibold text-slate-800">{from}</span> to <span className="font-semibold text-slate-800">{to}</span> of <span className="font-semibold text-slate-800">{total}</span> entries
                </div>

                <div className="flex items-center gap-1">
                    {links.map((link, idx) => {
                        let label = link.label;
                        if (label.includes('&laquo;') || label.includes('Previous')) {
                            label = 'Prev';
                        } else if (label.includes('&raquo;') || label.includes('Next')) {
                            label = 'Next';
                        }

                        if (!link.url) {
                            return (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-400 opacity-50 cursor-not-allowed bg-white"
                                    dangerouslySetInnerHTML={{ __html: label }}
                                />
                            );
                        }

                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => router.visit(link.url, { preserveState: true })}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    link.active
                                        ? 'bg-[#00AEEF] text-white shadow-xs font-semibold'
                                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                                dangerouslySetInnerHTML={{ __html: label }}
                            />
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <AdminLayout title="Booking Management">
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

                {/* Delete Error Alert */}
                {errors?.delete && (
                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl shadow-xs flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" x2="12" y1="8" y2="12" />
                                    <line x1="12" x2="12.01" y1="16" y2="16" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-rose-800">
                                {errors.delete}
                            </p>
                        </div>
                    </div>
                )}

                {/* 1. 4 STAT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: All Bookings */}
                    <div className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200/60 flex items-center justify-center text-[#00AEEF] shrink-0">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2" />
                                <path d="M3 9h18" />
                                <path d="M9 21V9" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                All Bookings
                            </span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="text-2xl font-bold text-slate-900">
                                    {stats.all_bookings ?? 0}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    Total
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Airport Transport */}
                    <div className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Airport Transport
                            </span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="text-2xl font-bold text-slate-900">
                                    {stats.airport_transport ?? 0}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    Orders
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Hotel Transfer */}
                    <div className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shrink-0">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 4v16" />
                                <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                                <path d="M2 17h20" />
                                <path d="M6 8v9" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Hotel Transfer
                            </span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="text-2xl font-bold text-slate-900">
                                    {stats.hotel_transfer ?? 0}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    Orders
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Day Tour */}
                    <div className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                                <line x1="9" x2="9" y1="3" y2="18" />
                                <line x1="15" x2="15" y1="6" y2="21" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Day Tour
                            </span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                                <span className="text-2xl font-bold text-slate-900">
                                    {stats.day_tour ?? 0}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    Orders
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. PANEL DRIVER */}
                <div className="space-y-3">
                    {/* Search Driver */}
                    <form onSubmit={handleDriverSearch} className="relative w-full">
                        <input
                            type="text"
                            value={driverSearch}
                            onChange={(e) => setDriverSearch(e.target.value)}
                            placeholder="Search driver by ID or name..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-xs"
                        />
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" x2="16.65" y1="21" y2="16.65" />
                            </svg>
                        </div>
                    </form>

                    {/* Driver Table Card */}
                    <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
                        {/* Table Header / Action Bar */}
                        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-slate-900">
                                    Drivers List
                                </h3>
                                <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    {drivers.total || drivers.data?.length || 0} drivers
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowAddDriverModal(true)}
                                className="inline-flex items-center gap-1.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs active:scale-[0.98] cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <line x1="12" x2="12" y1="5" y2="19" />
                                    <line x1="5" x2="19" y1="12" y2="12" />
                                </svg>
                                <span>Add New Driver</span>
                            </button>
                        </div>

                        {/* Driver List Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                        <th className="w-24 px-6 py-3.5">ID</th>
                                        <th className="px-6 py-3.5">Driver Name</th>
                                        <th className="px-6 py-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {drivers.data && drivers.data.length > 0 ? (
                                        drivers.data.map((driver) => (
                                            <tr key={driver.raw_id} className="hover:bg-slate-50/60 transition-colors">
                                                {/* ID */}
                                                <td className="w-24 px-6 py-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                                                    #{driver.id}
                                                </td>

                                                {/* Driver Name */}
                                                <td className="px-6 py-4 font-semibold text-slate-900">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-bold shrink-0">
                                                            {driver.full_name?.charAt(0).toUpperCase() || 'D'}
                                                        </div>
                                                        <span>{driver.full_name}</span>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditDriver(driver)}
                                                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                                                            title="Edit Driver"
                                                        >
                                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                                <path d="m15 5 4 4" />
                                                            </svg>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => openDeleteDriver(driver)}
                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                            title="Delete Driver"
                                                        >
                                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M3 6h18" />
                                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-slate-400 text-sm">
                                                No drivers found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Driver Pagination */}
                        {renderPagination(drivers)}
                    </div>
                </div>

                {/* 3. PANEL RECENT BOOKINGS */}
                <div className="space-y-3">
                    {/* Search Booking */}
                    <form onSubmit={handleBookingSearch} className="relative w-full">
                        <input
                            type="text"
                            value={bookingSearch}
                            onChange={(e) => setBookingSearch(e.target.value)}
                            placeholder="Search booking by code or guest name..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-xs"
                        />
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" x2="16.65" y1="21" y2="16.65" />
                            </svg>
                        </div>
                    </form>

                    {/* Bookings Table Card */}
                    <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
                        {/* Table Header / Action Bar */}
                        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-slate-900">
                                    Recent Bookings
                                </h3>
                                <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    {bookings.total || bookings.data?.length || 0} entries
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowAddBookingModal(true)}
                                className="inline-flex items-center gap-1.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs active:scale-[0.98] cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <line x1="12" x2="12" y1="5" y2="19" />
                                    <line x1="5" x2="19" y1="12" y2="12" />
                                </svg>
                                <span>Add New Booking</span>
                            </button>
                        </div>

                        {/* Bookings Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                        <th className="px-6 py-3.5">ID</th>
                                        <th className="px-6 py-3.5">Date</th>
                                        <th className="px-6 py-3.5">Guest Name</th>
                                        <th className="px-6 py-3.5">Booking Type</th>
                                        <th className="px-6 py-3.5">Detail</th>
                                        <th className="px-6 py-3.5">Payment</th>
                                        <th className="px-6 py-3.5">Status</th>
                                        <th className="px-6 py-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {bookings.data && bookings.data.length > 0 ? (
                                        bookings.data.map((booking) => (
                                            <tr key={booking.raw_id} className="hover:bg-slate-50/60 transition-colors">
                                                {/* ID */}
                                                <td className="px-6 py-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                                                    #{booking.id}
                                                </td>

                                                {/* Date */}
                                                <td className="px-6 py-4 text-slate-700 whitespace-nowrap font-medium">
                                                    {booking.date}
                                                </td>

                                                {/* Guest Name */}
                                                <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                                                    {booking.guest_name}
                                                </td>

                                                {/* Booking Type */}
                                                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                                                    <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium">
                                                        {booking.booking_type}
                                                    </span>
                                                </td>

                                                {/* Detail */}
                                                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                                                    {booking.detail}
                                                </td>

                                                {/* Payment */}
                                                <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                                                    {booking.payment}
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {renderStatusBadge(booking.status)}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* Assign Driver Action */}
                                                        <button
                                                            type="button"
                                                            onClick={() => openAssignDriver(booking)}
                                                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                                                            title="Assign Driver"
                                                        >
                                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                                <circle cx="9" cy="7" r="4" />
                                                                <line x1="19" x2="19" y1="8" y2="14" />
                                                                <line x1="22" x2="16" y1="11" y2="11" />
                                                            </svg>
                                                        </button>

                                                        {/* Edit Booking Action */}
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditBooking(booking)}
                                                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                                                            title="Edit Booking"
                                                        >
                                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                                <path d="m15 5 4 4" />
                                                            </svg>
                                                        </button>

                                                        {/* Delete Booking Action */}
                                                        <button
                                                            type="button"
                                                            onClick={() => openDeleteBooking(booking)}
                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                            title="Delete Booking"
                                                        >
                                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M3 6h18" />
                                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-slate-400 text-sm">
                                                No bookings found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Booking Pagination */}
                        {renderPagination(bookings)}
                    </div>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* MODALS SECTION                                                            */}
            {/* ========================================================================= */}

            {/* 1. Modal: Add New Driver */}
            <Modal
                show={showAddDriverModal}
                onClose={() => setShowAddDriverModal(false)}
                title="Add New Driver"
                maxWidth="lg"
            >
                {/* // TODO: isi form sesuai Figma popup yang menyusul */}
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Form pendaftaran driver baru akan dimuat sesuai desain popup Figma yang menyusul.
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowAddDriverModal(false)}
                            className="px-5 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

            {/* 2. Modal: Edit Driver */}
            <Modal
                show={showEditDriverModal}
                onClose={() => setShowEditDriverModal(false)}
                title={`Edit Driver ${selectedDriver ? `(${selectedDriver.full_name})` : ''}`}
                maxWidth="lg"
            >
                {/* // TODO: isi form edit driver sesuai Figma popup yang menyusul */}
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Form edit driver akan dimuat sesuai desain popup Figma yang menyusul.
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowEditDriverModal(false)}
                            className="px-5 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

            {/* 3. Modal: Delete Driver */}
            <Modal
                show={showDeleteDriverModal}
                onClose={() => setShowDeleteDriverModal(false)}
                title="Delete Driver"
                maxWidth="md"
            >
                {/* // TODO: isi konfirmasi delete driver sesuai Figma popup yang menyusul */}
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Apakah Anda yakin ingin menghapus driver <strong>{selectedDriver?.full_name}</strong>?
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowDeleteDriverModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteDriver}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>

            {/* 4. Modal: Assign Driver */}
            <Modal
                show={showAssignDriverModal}
                onClose={() => setShowAssignDriverModal(false)}
                title="Assign Driver"
                maxWidth="md"
            >
                {/* // TODO: isi dropdown assign driver sesuai Figma popup yang menyusul */}
                <form onSubmit={handleAssignDriverSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Select Available Driver:
                        </label>
                        <select
                            value={assignDriverForm.data.driver_id}
                            onChange={(e) => assignDriverForm.setData('driver_id', e.target.value)}
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 bg-slate-50 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        >
                            <option value="">-- Pilih Driver --</option>
                            {available_drivers.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-sky-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Driver Status: Ready for assignment</span>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowAssignDriverModal(false)}
                            className="px-5 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={assignDriverForm.processing || !assignDriverForm.data.driver_id}
                            className="px-5 py-2 bg-[#00AEEF] text-white rounded-xl text-sm font-semibold hover:bg-[#009cd7] transition disabled:opacity-50"
                        >
                            Confirm Assignment
                        </button>
                    </div>
                </form>
            </Modal>

            {/* 5. Modal: Add New Booking */}
            <Modal
                show={showAddBookingModal}
                onClose={() => setShowAddBookingModal(false)}
                title="Add New Booking"
                maxWidth="lg"
            >
                {/* // TODO: isi form add new booking sesuai Figma popup yang menyusul */}
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Form tambah booking baru akan dimuat sesuai desain popup Figma yang menyusul.
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowAddBookingModal(false)}
                            className="px-5 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

            {/* 6. Modal: Edit Booking */}
            <Modal
                show={showEditBookingModal}
                onClose={() => setShowEditBookingModal(false)}
                title={`Edit Booking ${selectedBooking ? `(${selectedBooking.booking_code})` : ''}`}
                maxWidth="lg"
            >
                {/* // TODO: isi form edit booking sesuai Figma popup yang menyusul */}
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Form edit booking akan dimuat sesuai desain popup Figma yang menyusul.
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowEditBookingModal(false)}
                            className="px-5 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

            {/* 7. Modal: Delete Booking */}
            <Modal
                show={showDeleteBookingModal}
                onClose={() => setShowDeleteBookingModal(false)}
                title="Delete Booking"
                maxWidth="md"
            >
                {/* // TODO: isi konfirmasi delete booking sesuai Figma popup yang menyusul */}
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Apakah Anda yakin ingin menghapus booking <strong>{selectedBooking?.booking_code}</strong>?
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowDeleteBookingModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteBooking}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
