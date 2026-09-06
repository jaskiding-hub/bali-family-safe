import React, { useState, useRef } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';

const selectClass = "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2364748b%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.22%208.22a.75.75%200%200%201%201.06%200L10%2011.94l3.72-3.72a.75.75%200%201%201%201.06%201.06l-4.25%204.25a.75.75%200%200%201-1.06%200L5.22%209.28a.75.75%200%200%201%200-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10";

export default function Dashboard({
    stats = {},
    today_date = '',
    today_schedule = [],
    drivers = { data: [], links: [] },
    available_vehicle_units = [],
    filters = {},
}) {
    const { errors = {}, flash = {} } = usePage().props;

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

    // Driver search state
    const [driverSearch, setDriverSearch] = useState(filters.search_driver || '');

    // Driver modal states
    const [showAddDriverModal, setShowAddDriverModal] = useState(false);
    const [showEditDriverModal, setShowEditDriverModal] = useState(false);
    const [showDeleteDriverModal, setShowDeleteDriverModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);

    // Photo preview states
    const [addPhotoPreview, setAddPhotoPreview] = useState(null);
    const [editPhotoPreview, setEditPhotoPreview] = useState(null);
    const addFileInputRef = useRef(null);
    const editFileInputRef = useRef(null);

    // Driver forms
    const addDriverForm = useForm({
        full_name: '',
        whatsapp_number: '',
        email: '',
        password: '',
        license_number: '',
        license_expiry_date: '',
        vehicle_unit_id: '',
        status: 'Active',
        profile_photo: null,
    });

    const editDriverForm = useForm({
        _method: 'put',
        full_name: '',
        whatsapp_number: '',
        email: '',
        password: '',
        license_number: '',
        license_expiry_date: '',
        vehicle_unit_id: '',
        status: 'Active',
        profile_photo: null,
    });

    // Handle Driver Search
    const handleDriverSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/dashboard',
            { search_driver: driverSearch },
            { preserveState: true, replace: true }
        );
    };

    // Photo file change handler
    const handleFileChange = (file, isEdit = false) => {
        if (!file) return;
        if (isEdit) {
            editDriverForm.setData('profile_photo', file);
            setEditPhotoPreview(URL.createObjectURL(file));
        } else {
            addDriverForm.setData('profile_photo', file);
            setAddPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleDrop = (e, isEdit = false) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0], isEdit);
        }
    };

    // Add Driver Submit
    const handleAddDriverSubmit = (e) => {
        e.preventDefault();
        addDriverForm.post('/admin/drivers', {
            forceFormData: true,
            onSuccess: () => {
                setShowAddDriverModal(false);
                addDriverForm.reset();
                setAddPhotoPreview(null);
            },
        });
    };

    // Open Edit Driver
    const openEditDriver = (driver) => {
        setSelectedDriver(driver);
        editDriverForm.setData({
            _method: 'put',
            full_name: driver.full_name || '',
            whatsapp_number: driver.whatsapp_number || '',
            email: driver.email || '',
            password: '',
            license_number: driver.license_number || '',
            license_expiry_date: driver.license_expiry_date || '',
            vehicle_unit_id: driver.vehicle_unit_id ? String(driver.vehicle_unit_id) : '',
            status: driver.status || 'Active',
            profile_photo: null,
        });
        setEditPhotoPreview(driver.profile_photo_url || null);
        setShowEditDriverModal(true);
    };

    // Edit Driver Submit
    const handleEditDriverSubmit = (e) => {
        e.preventDefault();
        if (!selectedDriver) return;
        editDriverForm.post(`/admin/drivers/${selectedDriver.raw_id}`, {
            forceFormData: true,
            onSuccess: () => {
                setShowEditDriverModal(false);
                editDriverForm.reset();
                setEditPhotoPreview(null);
                setSelectedDriver(null);
            },
        });
    };

    // Delete Driver Handlers
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

                {/* 2. 4 KPI Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Pending Bookings */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                PENDING BOOKINGS
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
                                <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                                    Action Required
                                </span>
                            ) : (
                                <span className="text-xs text-slate-400 font-medium">
                                    -
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Card 2: Today's Trips */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                TODAY'S TRIPS
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
                                AVAILABLE DRIVERS
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
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Online & Ready
                            </span>
                        </div>
                    </div>

                    {/* Card 4: This Month's Revenue */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                MONTH'S REVENUE
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

                {/* 3. PANEL DRIVER (Moved from Booking Management) */}
                <div className="space-y-3">
                    {/* Search Driver */}
                    <form onSubmit={handleDriverSearch} className="relative w-full">
                        <input
                            type="text"
                            value={driverSearch}
                            onChange={(e) => setDriverSearch(e.target.value)}
                            placeholder="Search driver by ID, name, email, or WhatsApp..."
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
                                onClick={() => {
                                    addDriverForm.reset();
                                    setAddPhotoPreview(null);
                                    setShowAddDriverModal(true);
                                }}
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
                                        <th className="w-20 px-6 py-3.5">ID</th>
                                        <th className="px-6 py-3.5">Driver Info</th>
                                        <th className="px-6 py-3.5">Vehicle Unit</th>
                                        <th className="px-6 py-3.5">License & Status</th>
                                        <th className="px-6 py-3.5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {drivers.data && drivers.data.length > 0 ? (
                                        drivers.data.map((driver) => (
                                            <tr key={driver.raw_id} className="hover:bg-slate-50/60 transition-colors">
                                                {/* ID */}
                                                <td className="w-20 px-6 py-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                                                    #{driver.id}
                                                </td>

                                                {/* Driver Info */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {driver.profile_photo_url ? (
                                                            <img
                                                                src={driver.profile_photo_url}
                                                                alt={driver.full_name}
                                                                className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-sm font-bold shrink-0">
                                                                {driver.full_name?.charAt(0).toUpperCase() || 'D'}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-slate-900">{driver.full_name}</span>
                                                            <span className="text-xs text-slate-500">{driver.email} &bull; {driver.whatsapp_number}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Assigned Vehicle Unit */}
                                                <td className="px-6 py-4 text-slate-700 whitespace-nowrap">
                                                    {driver.vehicle_unit_label ? (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                            <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                                                <circle cx="7" cy="17" r="2" />
                                                                <circle cx="17" cy="17" r="2" />
                                                            </svg>
                                                            {driver.vehicle_unit_label}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">Belum ada</span>
                                                    )}
                                                </td>

                                                {/* License & Status */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs font-medium text-slate-700">
                                                            {driver.license_number} (Exp: {driver.license_expiry_date || '-'})
                                                        </span>
                                                        <div>
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                                                driver.status === 'Active'
                                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                                    : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                                            }`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${driver.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                                {driver.status}
                                                            </span>
                                                        </div>
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
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
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

                {/* 4. Today's Schedule & Dispatch Section */}
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
                                                    href="/admin/bookings"
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

            {/* ========================================================================= */}
            {/* DRIVER MODALS SECTION                                                     */}
            {/* ========================================================================= */}

            {/* 1. Modal: Add New Driver */}
            <Modal
                show={showAddDriverModal}
                onClose={() => setShowAddDriverModal(false)}
                title="Add New Driver"
                maxWidth="xl"
            >
                <form onSubmit={handleAddDriverSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Driver ID (Read-only) */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                                Driver ID
                            </label>
                            <input
                                type="text"
                                disabled
                                value="Auto-generated"
                                className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-xl px-3.5 py-2.5 cursor-not-allowed font-medium"
                            />
                            <p className="text-[11px] text-slate-400 mt-1">ID otomatis dibuat oleh sistem.</p>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={addDriverForm.data.full_name}
                                onChange={(e) => addDriverForm.setData('full_name', e.target.value)}
                                placeholder="e.g. Wayan Sudira"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            {addDriverForm.errors.full_name && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addDriverForm.errors.full_name}</p>
                            )}
                        </div>

                        {/* WhatsApp / Phone Number */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Phone / WhatsApp <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={addDriverForm.data.whatsapp_number}
                                onChange={(e) => addDriverForm.setData('whatsapp_number', e.target.value)}
                                placeholder="+62 812-3456-7890"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            {addDriverForm.errors.whatsapp_number && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addDriverForm.errors.whatsapp_number}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={addDriverForm.data.email}
                                onChange={(e) => addDriverForm.setData('email', e.target.value)}
                                placeholder="driver@balifamilysafe.com"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            {addDriverForm.errors.email && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addDriverForm.errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                required
                                value={addDriverForm.data.password}
                                onChange={(e) => addDriverForm.setData('password', e.target.value)}
                                placeholder="Min. 6 characters"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            {addDriverForm.errors.password && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addDriverForm.errors.password}</p>
                            )}
                        </div>

                        {/* License Number */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                License Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={addDriverForm.data.license_number}
                                onChange={(e) => addDriverForm.setData('license_number', e.target.value)}
                                placeholder="SIM-12345678"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            {addDriverForm.errors.license_number && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addDriverForm.errors.license_number}</p>
                            )}
                        </div>

                        {/* License Expiry Date */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                License Expiry Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={addDriverForm.data.license_expiry_date}
                                onChange={(e) => addDriverForm.setData('license_expiry_date', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            {addDriverForm.errors.license_expiry_date && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addDriverForm.errors.license_expiry_date}</p>
                            )}
                        </div>

                        {/* Vehicle Assignment */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Vehicle Assignment
                            </label>
                            <select
                                value={addDriverForm.data.vehicle_unit_id}
                                onChange={(e) => addDriverForm.setData('vehicle_unit_id', e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Belum ada</option>
                                {available_vehicle_units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.label}
                                    </option>
                                ))}
                            </select>
                            {addDriverForm.errors.vehicle_unit_id && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addDriverForm.errors.vehicle_unit_id}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={addDriverForm.data.status}
                                onChange={(e) => addDriverForm.setData('status', e.target.value)}
                                className={selectClass}
                            >
                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                            </select>
                            {addDriverForm.errors.status && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addDriverForm.errors.status}</p>
                            )}
                        </div>
                    </div>

                    {/* Profile Photo (Drag & Drop) */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Profile Photo (Optional)
                        </label>
                        <input
                            type="file"
                            ref={addFileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleFileChange(e.target.files[0], false);
                                }
                            }}
                        />

                        {addPhotoPreview ? (
                            <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-2xl bg-slate-50">
                                <img
                                    src={addPhotoPreview}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-800 truncate">Foto profil dipilih</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Format valid & siap diunggah.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addDriverForm.setData('profile_photo', null);
                                        setAddPhotoPreview(null);
                                    }}
                                    className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                                >
                                    Hapus Foto
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => addFileInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, false)}
                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-sky-400 hover:bg-sky-50/30 transition-all cursor-pointer bg-slate-50/50"
                            >
                                <div className="w-10 h-10 rounded-full bg-sky-50 text-[#00AEEF] flex items-center justify-center mb-2">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" x2="12" y1="3" y2="15" />
                                    </svg>
                                </div>
                                <p className="text-xs font-semibold text-slate-700">
                                    <span className="text-[#00AEEF]">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">SVG, PNG, JPG or GIF (max. 800x400px / 2MB)</p>
                            </div>
                        )}
                        {addDriverForm.errors.profile_photo && (
                            <p className="text-xs text-red-600 mt-1 font-medium">{addDriverForm.errors.profile_photo}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowAddDriverModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={addDriverForm.processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            {addDriverForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Save Driver</span>
                        </button>
                    </div>
                </form>
            </Modal>

            {/* 2. Modal: Edit Driver */}
            <Modal
                show={showEditDriverModal}
                onClose={() => setShowEditDriverModal(false)}
                title={`Edit Driver ${selectedDriver ? `(${selectedDriver.full_name})` : ''}`}
                maxWidth="xl"
            >
                <form onSubmit={handleEditDriverSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Driver ID (Read-only) */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                                Driver ID
                            </label>
                            <input
                                type="text"
                                disabled
                                value={`#${selectedDriver?.id || '00'}`}
                                className="w-full bg-slate-100 border border-slate-200 text-slate-700 font-mono font-semibold text-sm rounded-xl px-3.5 py-2.5 cursor-not-allowed"
                            />
                            <p className="text-[11px] text-slate-400 mt-1">ID database terdaftar.</p>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editDriverForm.data.full_name}
                                onChange={(e) => editDriverForm.setData('full_name', e.target.value)}
                                placeholder="e.g. Wayan Sudira"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            {editDriverForm.errors.full_name && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editDriverForm.errors.full_name}</p>
                            )}
                        </div>

                        {/* WhatsApp / Phone Number */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Phone / WhatsApp <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editDriverForm.data.whatsapp_number}
                                onChange={(e) => editDriverForm.setData('whatsapp_number', e.target.value)}
                                placeholder="+62 812-3456-7890"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            {editDriverForm.errors.whatsapp_number && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editDriverForm.errors.whatsapp_number}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={editDriverForm.data.email}
                                onChange={(e) => editDriverForm.setData('email', e.target.value)}
                                placeholder="driver@balifamilysafe.com"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            {editDriverForm.errors.email && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editDriverForm.errors.email}</p>
                            )}
                        </div>

                        {/* Password (Optional on edit) */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                New Password <span className="text-slate-400 text-[11px] font-normal lowercase">(opsional)</span>
                            </label>
                            <input
                                type="password"
                                value={editDriverForm.data.password}
                                onChange={(e) => editDriverForm.setData('password', e.target.value)}
                                placeholder="Kosongkan jika tidak diubah"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            <p className="text-[11px] text-slate-400 mt-1">Biarkan kosong jika tidak ingin mengubah password.</p>
                            {editDriverForm.errors.password && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editDriverForm.errors.password}</p>
                            )}
                        </div>

                        {/* License Number */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                License Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editDriverForm.data.license_number}
                                onChange={(e) => editDriverForm.setData('license_number', e.target.value)}
                                placeholder="SIM-12345678"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            {editDriverForm.errors.license_number && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editDriverForm.errors.license_number}</p>
                            )}
                        </div>

                        {/* License Expiry Date */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                License Expiry Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={editDriverForm.data.license_expiry_date}
                                onChange={(e) => editDriverForm.setData('license_expiry_date', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            {editDriverForm.errors.license_expiry_date && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editDriverForm.errors.license_expiry_date}</p>
                            )}
                        </div>

                        {/* Vehicle Assignment */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Vehicle Assignment
                            </label>
                            <select
                                value={editDriverForm.data.vehicle_unit_id}
                                onChange={(e) => editDriverForm.setData('vehicle_unit_id', e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Belum ada</option>
                                {available_vehicle_units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.label}
                                    </option>
                                ))}
                            </select>
                            {editDriverForm.errors.vehicle_unit_id && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editDriverForm.errors.vehicle_unit_id}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={editDriverForm.data.status}
                                onChange={(e) => editDriverForm.setData('status', e.target.value)}
                                className={selectClass}
                            >
                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                            </select>
                            {editDriverForm.errors.status && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{editDriverForm.errors.status}</p>
                            )}
                        </div>
                    </div>

                    {/* Profile Photo (Drag & Drop) */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Profile Photo (Optional)
                        </label>
                        <input
                            type="file"
                            ref={editFileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleFileChange(e.target.files[0], true);
                                }
                            }}
                        />

                        {editPhotoPreview ? (
                            <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-2xl bg-slate-50">
                                <img
                                    src={editPhotoPreview}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-800 truncate">Foto profil driver</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Klik ganti foto untuk memilih file baru.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => editFileInputRef.current?.click()}
                                        className="text-xs font-semibold text-[#00AEEF] hover:text-[#009cd7] bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                                    >
                                        Ganti Foto
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            editDriverForm.setData('profile_photo', null);
                                            setEditPhotoPreview(null);
                                        }}
                                        className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => editFileInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, true)}
                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-sky-400 hover:bg-sky-50/30 transition-all cursor-pointer bg-slate-50/50"
                            >
                                <div className="w-10 h-10 rounded-full bg-sky-50 text-[#00AEEF] flex items-center justify-center mb-2">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" x2="12" y1="3" y2="15" />
                                    </svg>
                                </div>
                                <p className="text-xs font-semibold text-slate-700">
                                    <span className="text-[#00AEEF]">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">SVG, PNG, JPG or GIF (max. 800x400px / 2MB)</p>
                            </div>
                        )}
                        {editDriverForm.errors.profile_photo && (
                            <p className="text-xs text-red-600 mt-1 font-medium">{editDriverForm.errors.profile_photo}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowEditDriverModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={editDriverForm.processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            {editDriverForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Update Driver</span>
                        </button>
                    </div>
                </form>
            </Modal>

            {/* 3. Modal: Delete Driver */}
            <Modal
                show={showDeleteDriverModal}
                onClose={() => setShowDeleteDriverModal(false)}
                title="Delete Driver"
                maxWidth="md"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Apakah Anda yakin ingin menghapus driver <strong>{selectedDriver?.full_name}</strong>?
                    </p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowDeleteDriverModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteDriver}
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
