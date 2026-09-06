import React, { useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';

const selectClass = "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2364748b%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.22%208.22a.75.75%200%200%201%201.06%200L10%2011.94l3.72-3.72a.75.75%200%201%201%201.06%201.06l-4.25%204.25a.75.75%200%200%201-1.06%200L5.22%209.28a.75.75%200%200%201%200-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10";

export default function BookingManagement({
    stats = {},
    bookings = { data: [], links: [] },
    available_drivers = [],
    vehicles = [],
    packages = [],
    filters = {},
}) {
    const { errors = {}, flash = {} } = usePage().props;

    // Search state
    const [bookingSearch, setBookingSearch] = useState(filters.search_booking || '');

    // Modal states
    const [showAddBookingModal, setShowAddBookingModal] = useState(false);
    const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
    const [showEditBookingModal, setShowEditBookingModal] = useState(false);
    const [showDeleteBookingModal, setShowDeleteBookingModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Forms for actions
    const assignDriverForm = useForm({
        driver_id: '',
    });

    const addBookingForm = useForm({
        auto_parse_text: '',
        status: 'Pending',
        booking_type_ui: 'Airport Pick-Up',
        package_id: '',
        guest_name: '',
        whatsapp_number: '',
        email: '',
        flight_number: '',
        vehicle_id: '',
        booking_date: '',
        pickup_time: '09:00',
        pickup_location: '',
        dropoff_location: '',
        adults: 1,
        children: 0,
        total_fee: '',
        notes: '',
    });

    const editBookingForm = useForm({
        _method: 'put',
        auto_parse_text: '',
        status: 'Pending',
        booking_type_ui: 'Airport Pick-Up',
        package_id: '',
        guest_name: '',
        whatsapp_number: '',
        email: '',
        flight_number: '',
        vehicle_id: '',
        booking_date: '',
        pickup_time: '09:00',
        pickup_location: '',
        dropoff_location: '',
        adults: 1,
        children: 0,
        total_fee: '',
        notes: '',
    });

    // Handle Booking Search
    const handleBookingSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/bookings',
            { search_booking: bookingSearch },
            { preserveState: true, replace: true }
        );
    };

    // Booking Action Handlers
    const openAddBooking = () => {
        addBookingForm.setData({
            auto_parse_text: '',
            status: 'Pending',
            booking_type_ui: 'Airport Pick-Up',
            package_id: packages[0]?.id ? String(packages[0].id) : '',
            guest_name: '',
            whatsapp_number: '',
            email: '',
            flight_number: '',
            vehicle_id: vehicles[0]?.id ? String(vehicles[0].id) : '',
            booking_date: new Date().toISOString().split('T')[0],
            pickup_time: '09:00',
            pickup_location: '',
            dropoff_location: '',
            adults: 1,
            children: 0,
            total_fee: '',
            notes: '',
        });
        setShowAddBookingModal(true);
    };

    const handleGenerateClick = (e) => {
        e.preventDefault();
        alert('Fitur auto-parse akan segera hadir');
    };

    const handleAddBookingSubmit = (e) => {
        e.preventDefault();
        addBookingForm.post('/admin/bookings', {
            onSuccess: () => {
                setShowAddBookingModal(false);
                addBookingForm.reset();
            },
        });
    };

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

        let typeUi = 'Airport Pick-Up';
        if (booking.booking_type === 'Airport Transfer') {
            typeUi = booking.transfer_direction === 'Drop-Off' ? 'Airport Drop-Off' : 'Airport Pick-Up';
        } else if (booking.booking_type === 'Hotel Transfer') {
            typeUi = 'Hotel Transfer';
        } else if (booking.booking_type === 'Day Tour') {
            typeUi = 'Day Tour';
        }

        editBookingForm.setData({
            _method: 'put',
            auto_parse_text: '',
            status: booking.status || 'Pending',
            booking_type_ui: typeUi,
            package_id: booking.package_id ? String(booking.package_id) : '',
            guest_name: booking.guest_name || '',
            whatsapp_number: booking.whatsapp_number || '',
            email: booking.email || '',
            flight_number: booking.flight_number || '',
            vehicle_id: booking.vehicle_id ? String(booking.vehicle_id) : (vehicles[0]?.id ? String(vehicles[0].id) : ''),
            booking_date: booking.raw_booking_date || '',
            pickup_time: booking.raw_pickup_time || '09:00',
            pickup_location: booking.pickup_location || '',
            dropoff_location: booking.dropoff_location || '',
            adults: booking.adults ?? 1,
            children: booking.children ?? 0,
            total_fee: booking.total_fee ? String(Number(booking.total_fee)) : '',
            notes: booking.notes || '',
        });
        setShowEditBookingModal(true);
    };

    const handleEditBookingSubmit = (e) => {
        e.preventDefault();
        if (!selectedBooking) return;
        editBookingForm.post(`/admin/bookings/${selectedBooking.raw_id}`, {
            onSuccess: () => {
                setShowEditBookingModal(false);
                editBookingForm.reset();
                setSelectedBooking(null);
            },
        });
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

                {/* 2. PANEL RECENT BOOKINGS */}
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
                                onClick={openAddBooking}
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
            {/* BOOKING MODALS SECTION                                                    */}
            {/* ========================================================================= */}

            {/* 1. Modal: Assign Driver */}
            <Modal
                show={showAssignDriverModal}
                onClose={() => setShowAssignDriverModal(false)}
                title={`Assign Driver ${selectedBooking ? `(${selectedBooking.booking_code})` : ''}`}
                maxWidth="md"
            >
                <form onSubmit={handleAssignDriverSubmit} className="space-y-4">
                    {selectedBooking && (
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1 text-xs text-slate-600">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-slate-900">{selectedBooking.guest_name}</span>
                                <span className="text-slate-500">{selectedBooking.date}</span>
                            </div>
                            <div className="text-slate-500 font-medium">
                                {selectedBooking.booking_type} &bull; {selectedBooking.detail}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Select Available Driver <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={assignDriverForm.data.driver_id}
                            onChange={(e) => assignDriverForm.setData('driver_id', e.target.value)}
                            required
                            className={selectClass}
                        >
                            <option value="">-- Pilih Driver --</option>
                            {available_drivers.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                        {assignDriverForm.errors.driver_id && (
                            <p className="text-xs text-red-600 mt-1 font-medium">{assignDriverForm.errors.driver_id}</p>
                        )}
                    </div>

                    {/* Dynamic Driver Status */}
                    {(() => {
                        const selectedAssignedDriver = available_drivers.find(
                            (d) => String(d.id) === String(assignDriverForm.data.driver_id)
                        );

                        if (selectedAssignedDriver) {
                            return (
                                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-xl px-3.5 py-2.5">
                                    <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>Driver Status: {selectedAssignedDriver.status || 'Available'}</span>
                                </div>
                            );
                        }

                        return (
                            <div className="flex items-center gap-2 text-xs text-slate-400 px-1 py-0.5">
                                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                <span>Pilih driver untuk melihat ketersediaan status.</span>
                            </div>
                        );
                    })()}

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowAssignDriverModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={assignDriverForm.processing || !assignDriverForm.data.driver_id}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            {assignDriverForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Confirm Assignment</span>
                        </button>
                    </div>
                </form>
            </Modal>

            {/* 2. Modal: Add New Booking */}
            <Modal
                show={showAddBookingModal}
                onClose={() => setShowAddBookingModal(false)}
                title="Add New Booking"
                maxWidth="2xl"
            >
                <form onSubmit={handleAddBookingSubmit} className="space-y-5">
                    {/* Auto-Parse Section */}
                    <div className="bg-gradient-to-r from-sky-50 to-indigo-50/50 border border-sky-100 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-[#00AEEF] text-white flex items-center justify-center text-xs shadow-xs">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                    Isi Otomatis (Auto-Parse)
                                </span>
                            </div>
                            <span className="text-[11px] font-semibold text-sky-600 bg-white/90 px-2.5 py-0.5 rounded-full border border-sky-200/60 shadow-2xs">
                                AI Assistant
                            </span>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">
                            Tempel teks pemesanan dari chat WhatsApp pelanggan untuk pengisian otomatis.
                        </p>
                        <textarea
                            rows="2"
                            value={addBookingForm.data.auto_parse_text}
                            onChange={(e) => addBookingForm.setData('auto_parse_text', e.target.value)}
                            placeholder="Contoh: Nama: John Doe, Tgl: 25 Des 2026, Penjemputan: Airport ke Seminyak, Pesawat GA-401..."
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none font-sans shadow-2xs"
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                type="button"
                                onClick={handleGenerateClick}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                                <span>Generate</span>
                            </button>
                        </div>
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Status */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={addBookingForm.data.status}
                                onChange={(e) => addBookingForm.setData('status', e.target.value)}
                                required
                                className={selectClass}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Assigned">Assigned</option>
                                <option value="On Going">On Going</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            {addBookingForm.errors.status && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.status}</p>
                            )}
                        </div>

                        {/* Booking Type */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Booking Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={addBookingForm.data.booking_type_ui}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    addBookingForm.setData((prev) => ({
                                        ...prev,
                                        booking_type_ui: val,
                                        package_id: val === 'Day Tour' ? (prev.package_id || (packages[0]?.id ? String(packages[0].id) : '')) : '',
                                        flight_number: (val === 'Airport Pick-Up' || val === 'Airport Drop-Off') ? prev.flight_number : '',
                                    }));
                                }}
                                required
                                className={selectClass}
                            >
                                <option value="Airport Pick-Up">Airport Pick-Up</option>
                                <option value="Airport Drop-Off">Airport Drop-Off</option>
                                <option value="Hotel Transfer">Hotel Transfer</option>
                                <option value="Day Tour">Day Tour</option>
                            </select>
                            {addBookingForm.errors.booking_type && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.booking_type}</p>
                            )}
                        </div>

                        {/* Conditional: Package for Day Tour */}
                        {addBookingForm.data.booking_type_ui === 'Day Tour' && (
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Pilih Package <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={addBookingForm.data.package_id}
                                    onChange={(e) => addBookingForm.setData('package_id', e.target.value)}
                                    required
                                    className={selectClass}
                                >
                                    <option value="">-- Pilih Tour Package --</option>
                                    {packages.map((pkg) => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name} {pkg.price ? `(Rp ${Number(pkg.price).toLocaleString('id-ID')})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {addBookingForm.errors.package_id && (
                                    <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.package_id}</p>
                                )}
                            </div>
                        )}

                        {/* Date */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={addBookingForm.data.booking_date}
                                onChange={(e) => addBookingForm.setData('booking_date', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {addBookingForm.errors.booking_date && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.booking_date}</p>
                            )}
                        </div>

                        {/* Pickup Time */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Pickup Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={addBookingForm.data.pickup_time}
                                onChange={(e) => addBookingForm.setData('pickup_time', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {addBookingForm.errors.pickup_time && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.pickup_time}</p>
                            )}
                        </div>

                        {/* Guest Name */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Guest Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={addBookingForm.data.guest_name}
                                onChange={(e) => addBookingForm.setData('guest_name', e.target.value)}
                                placeholder="e.g. John Doe"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {addBookingForm.errors.guest_name && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.guest_name}</p>
                            )}
                        </div>

                        {/* WhatsApp Number */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Phone / WhatsApp <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={addBookingForm.data.whatsapp_number}
                                onChange={(e) => addBookingForm.setData('whatsapp_number', e.target.value)}
                                placeholder="+62 812-3456-7890"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {addBookingForm.errors.whatsapp_number && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.whatsapp_number}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={addBookingForm.data.email}
                                onChange={(e) => addBookingForm.setData('email', e.target.value)}
                                placeholder="guest@example.com"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {addBookingForm.errors.email && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.email}</p>
                            )}
                        </div>

                        {/* Vehicle Selection */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Vehicle Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={addBookingForm.data.vehicle_id}
                                onChange={(e) => addBookingForm.setData('vehicle_id', e.target.value)}
                                required
                                className={selectClass}
                            >
                                <option value="">-- Pilih Kendaraan --</option>
                                {vehicles.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.label}
                                    </option>
                                ))}
                            </select>
                            {addBookingForm.errors.vehicle_id && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.vehicle_id}</p>
                            )}
                        </div>

                        {/* Conditional: Flight Number */}
                        {(addBookingForm.data.booking_type_ui === 'Airport Pick-Up' || addBookingForm.data.booking_type_ui === 'Airport Drop-Off') && (
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Flight Number
                                </label>
                                <input
                                    type="text"
                                    value={addBookingForm.data.flight_number}
                                    onChange={(e) => addBookingForm.setData('flight_number', e.target.value)}
                                    placeholder="e.g. GA-401 / SQ-942"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                                />
                                {addBookingForm.errors.flight_number && (
                                    <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.flight_number}</p>
                                )}
                            </div>
                        )}

                        {/* Pickup Location */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Pickup Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={addBookingForm.data.pickup_location}
                                onChange={(e) => addBookingForm.setData('pickup_location', e.target.value)}
                                placeholder="e.g. I Gusti Ngurah Rai Airport / Hotel Lobby"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {addBookingForm.errors.pickup_location && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.pickup_location}</p>
                            )}
                        </div>

                        {/* Dropoff Location */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Drop-off Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={addBookingForm.data.dropoff_location}
                                onChange={(e) => addBookingForm.setData('dropoff_location', e.target.value)}
                                placeholder="e.g. Maya Sanur Resort & Spa"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {addBookingForm.errors.dropoff_location && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.dropoff_location}</p>
                            )}
                        </div>

                        {/* Adults */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Adults <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                required
                                value={addBookingForm.data.adults}
                                onChange={(e) => addBookingForm.setData('adults', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {addBookingForm.errors.adults && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.adults}</p>
                            )}
                        </div>

                        {/* Children */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Children
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={addBookingForm.data.children}
                                onChange={(e) => addBookingForm.setData('children', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {addBookingForm.errors.children && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.children}</p>
                            )}
                        </div>

                        {/* Total Fee */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Total Fee (Rp)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="9999999999"
                                value={addBookingForm.data.total_fee}
                                onChange={(e) => addBookingForm.setData('total_fee', e.target.value)}
                                placeholder="e.g. 450000"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {addBookingForm.errors.total_fee && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.total_fee}</p>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Notes / Special Requests
                            </label>
                            <textarea
                                rows="2"
                                value={addBookingForm.data.notes}
                                onChange={(e) => addBookingForm.setData('notes', e.target.value)}
                                placeholder="e.g. Request 1 baby car seat, butuh driver fasih bahasa inggris..."
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none font-sans shadow-2xs"
                            />
                            {addBookingForm.errors.notes && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addBookingForm.errors.notes}</p>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowAddBookingModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={addBookingForm.processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            {addBookingForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Save Booking</span>
                        </button>
                    </div>
                </form>
            </Modal>

            {/* 3. Modal: Edit Booking */}
            <Modal
                show={showEditBookingModal}
                onClose={() => setShowEditBookingModal(false)}
                title={`Edit Booking ${selectedBooking ? `(${selectedBooking.booking_code})` : ''}`}
                maxWidth="2xl"
            >
                <form onSubmit={handleEditBookingSubmit} className="space-y-5">
                    {/* Auto-Parse Section */}
                    <div className="bg-gradient-to-r from-sky-50 to-indigo-50/50 border border-sky-100 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-[#00AEEF] text-white flex items-center justify-center text-xs shadow-xs">
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                    Isi Otomatis (Auto-Parse)
                                </span>
                            </div>
                            <span className="text-[11px] font-semibold text-sky-600 bg-white/90 px-2.5 py-0.5 rounded-full border border-sky-200/60 shadow-2xs">
                                AI Assistant
                            </span>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">
                            Tempel teks pemesanan dari chat WhatsApp pelanggan untuk pengisian otomatis.
                        </p>
                        <textarea
                            rows="2"
                            value={editBookingForm.data.auto_parse_text}
                            onChange={(e) => editBookingForm.setData('auto_parse_text', e.target.value)}
                            placeholder="Contoh: Nama: John Doe, Tgl: 25 Des 2026, Penjemputan: Airport ke Seminyak, Pesawat GA-401..."
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none font-sans shadow-2xs"
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                type="button"
                                onClick={handleGenerateClick}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                                <span>Generate</span>
                            </button>
                        </div>
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Status */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={editBookingForm.data.status}
                                onChange={(e) => editBookingForm.setData('status', e.target.value)}
                                required
                                className={selectClass}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Assigned">Assigned</option>
                                <option value="On Going">On Going</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            {editBookingForm.errors.status && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.status}</p>
                            )}
                        </div>

                        {/* Booking Type */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Booking Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={editBookingForm.data.booking_type_ui}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    editBookingForm.setData((prev) => ({
                                        ...prev,
                                        booking_type_ui: val,
                                        package_id: val === 'Day Tour' ? (prev.package_id || (packages[0]?.id ? String(packages[0].id) : '')) : '',
                                        flight_number: (val === 'Airport Pick-Up' || val === 'Airport Drop-Off') ? prev.flight_number : '',
                                    }));
                                }}
                                required
                                className={selectClass}
                            >
                                <option value="Airport Pick-Up">Airport Pick-Up</option>
                                <option value="Airport Drop-Off">Airport Drop-Off</option>
                                <option value="Hotel Transfer">Hotel Transfer</option>
                                <option value="Day Tour">Day Tour</option>
                            </select>
                            {editBookingForm.errors.booking_type && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.booking_type}</p>
                            )}
                        </div>

                        {/* Conditional: Package for Day Tour */}
                        {editBookingForm.data.booking_type_ui === 'Day Tour' && (
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Pilih Package <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={editBookingForm.data.package_id}
                                    onChange={(e) => editBookingForm.setData('package_id', e.target.value)}
                                    required
                                    className={selectClass}
                                >
                                    <option value="">-- Pilih Tour Package --</option>
                                    {packages.map((pkg) => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name} {pkg.price ? `(Rp ${Number(pkg.price).toLocaleString('id-ID')})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {editBookingForm.errors.package_id && (
                                    <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.package_id}</p>
                                )}
                            </div>
                        )}

                        {/* Date */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={editBookingForm.data.booking_date}
                                onChange={(e) => editBookingForm.setData('booking_date', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {editBookingForm.errors.booking_date && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.booking_date}</p>
                            )}
                        </div>

                        {/* Pickup Time */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Pickup Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={editBookingForm.data.pickup_time}
                                onChange={(e) => editBookingForm.setData('pickup_time', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {editBookingForm.errors.pickup_time && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.pickup_time}</p>
                            )}
                        </div>

                        {/* Guest Name */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Guest Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editBookingForm.data.guest_name}
                                onChange={(e) => editBookingForm.setData('guest_name', e.target.value)}
                                placeholder="e.g. John Doe"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {editBookingForm.errors.guest_name && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.guest_name}</p>
                            )}
                        </div>

                        {/* WhatsApp Number */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Phone / WhatsApp <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editBookingForm.data.whatsapp_number}
                                onChange={(e) => editBookingForm.setData('whatsapp_number', e.target.value)}
                                placeholder="+62 812-3456-7890"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {editBookingForm.errors.whatsapp_number && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.whatsapp_number}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={editBookingForm.data.email}
                                onChange={(e) => editBookingForm.setData('email', e.target.value)}
                                placeholder="guest@example.com"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {editBookingForm.errors.email && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.email}</p>
                            )}
                        </div>

                        {/* Vehicle Selection */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Vehicle Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={editBookingForm.data.vehicle_id}
                                onChange={(e) => editBookingForm.setData('vehicle_id', e.target.value)}
                                required
                                className={selectClass}
                            >
                                <option value="">-- Pilih Kendaraan --</option>
                                {vehicles.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.label}
                                    </option>
                                ))}
                            </select>
                            {editBookingForm.errors.vehicle_id && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.vehicle_id}</p>
                            )}
                        </div>

                        {/* Conditional: Flight Number */}
                        {(editBookingForm.data.booking_type_ui === 'Airport Pick-Up' || editBookingForm.data.booking_type_ui === 'Airport Drop-Off') && (
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Flight Number
                                </label>
                                <input
                                    type="text"
                                    value={editBookingForm.data.flight_number}
                                    onChange={(e) => editBookingForm.setData('flight_number', e.target.value)}
                                    placeholder="e.g. GA-401 / SQ-942"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                                />
                                {editBookingForm.errors.flight_number && (
                                    <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.flight_number}</p>
                                )}
                            </div>
                        )}

                        {/* Pickup Location */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Pickup Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editBookingForm.data.pickup_location}
                                onChange={(e) => editBookingForm.setData('pickup_location', e.target.value)}
                                placeholder="e.g. I Gusti Ngurah Rai Airport / Hotel Lobby"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {editBookingForm.errors.pickup_location && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.pickup_location}</p>
                            )}
                        </div>

                        {/* Dropoff Location */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Drop-off Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editBookingForm.data.dropoff_location}
                                onChange={(e) => editBookingForm.setData('dropoff_location', e.target.value)}
                                placeholder="e.g. Maya Sanur Resort & Spa"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {editBookingForm.errors.dropoff_location && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.dropoff_location}</p>
                            )}
                        </div>

                        {/* Adults */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Adults <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                required
                                value={editBookingForm.data.adults}
                                onChange={(e) => editBookingForm.setData('adults', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {editBookingForm.errors.adults && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.adults}</p>
                            )}
                        </div>

                        {/* Children */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Children
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={editBookingForm.data.children}
                                onChange={(e) => editBookingForm.setData('children', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {editBookingForm.errors.children && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.children}</p>
                            )}
                        </div>

                        {/* Total Fee */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Total Fee (Rp)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="9999999999"
                                value={editBookingForm.data.total_fee}
                                onChange={(e) => editBookingForm.setData('total_fee', e.target.value)}
                                placeholder="e.g. 450000"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {editBookingForm.errors.total_fee && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.total_fee}</p>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Notes / Special Requests
                            </label>
                            <textarea
                                rows="2"
                                value={editBookingForm.data.notes}
                                onChange={(e) => editBookingForm.setData('notes', e.target.value)}
                                placeholder="e.g. Request 1 baby car seat, butuh driver fasih bahasa inggris..."
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none font-sans shadow-2xs"
                            />
                            {editBookingForm.errors.notes && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editBookingForm.errors.notes}</p>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowEditBookingModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={editBookingForm.processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            {editBookingForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Update Booking</span>
                        </button>
                    </div>
                </form>
            </Modal>

            {/* 4. Modal: Delete Booking */}
            <Modal
                show={showDeleteBookingModal}
                onClose={() => setShowDeleteBookingModal(false)}
                title="Delete Booking"
                maxWidth="md"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Apakah Anda yakin ingin menghapus booking <strong>{selectedBooking?.booking_code}</strong>?
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowDeleteBookingModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteBooking}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
