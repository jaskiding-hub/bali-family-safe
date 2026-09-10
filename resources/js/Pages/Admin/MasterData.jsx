import React, { useState, useRef } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';

const selectClass = "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2364748b%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.22%208.22a.75.75%200%200%201%201.06%200L10%2011.94l3.72-3.72a.75.75%200%201%201%201.06%201.06l-4.25%204.25a.75.75%200%200%201-1.06%200L5.22%209.28a.75.75%200%200%201%200-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10";

export default function MasterData({
    active_tab = 'vehicles',
    vehicles = [],
    vehicle_categories = [],
    drivers = { data: [], links: [] },
    available_vehicle_units = [],
    hotels = [],
    airports = [],
    hotel_transfer_price_lists = [],
    hotels_list = [],
    airports_list = [],
    stats = {},
    filters = {},
}) {
    const { flash = {}, errors = {} } = usePage().props;
    const [currentTab, setCurrentTab] = useState(active_tab || 'vehicles');

    // -------------------------------------------------------------------------
    // TAB 1: VEHICLES STATE & HANDLERS
    // -------------------------------------------------------------------------
    const [vehicleSearch, setVehicleSearch] = useState(filters.search_vehicle || '');
    const [selectedVehicleCategory, setSelectedVehicleCategory] = useState(filters.category_vehicle || 'all');
    const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
    const [showEditVehicleModal, setShowEditVehicleModal] = useState(false);
    const [showDeleteVehicleModal, setShowDeleteVehicleModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [addVehiclePhotoPreview, setAddVehiclePhotoPreview] = useState(null);
    const [editVehiclePhotoPreview, setEditVehiclePhotoPreview] = useState(null);
    const addVehicleFileInputRef = useRef(null);
    const editVehicleFileInputRef = useRef(null);

    const addVehicleForm = useForm({
        name: '',
        category: vehicle_categories[0] || 'Regular Family SUV',
        model: new Date().getFullYear().toString(),
        daily_rate: '',
        passenger_capacity: 6,
        luggage_capacity: 4,
        is_popular: false,
        photo: null,
    });

    const editVehicleForm = useForm({
        _method: 'put',
        name: '',
        category: '',
        model: '',
        daily_rate: '',
        passenger_capacity: 1,
        luggage_capacity: 0,
        is_popular: false,
        photo: null,
    });

    const handleVehicleFilterSubmit = (e) => {
        e.preventDefault();
        router.get(
            '/admin/master-data',
            { tab: 'vehicles', search_vehicle: vehicleSearch, category_vehicle: selectedVehicleCategory },
            { preserveState: true, replace: true }
        );
    };

    const handleVehiclePhotoChange = (file, isEdit = false) => {
        if (!file) return;
        if (isEdit) {
            editVehicleForm.setData('photo', file);
            setEditVehiclePhotoPreview(URL.createObjectURL(file));
        } else {
            addVehicleForm.setData('photo', file);
            setAddVehiclePhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleAddVehicleSubmit = (e) => {
        e.preventDefault();
        addVehicleForm.post('/admin/vehicles', {
            forceFormData: true,
            onSuccess: () => {
                setShowAddVehicleModal(false);
                addVehicleForm.reset();
                setAddVehiclePhotoPreview(null);
            },
        });
    };

    const openEditVehicleModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        editVehicleForm.setData({
            _method: 'put',
            name: vehicle.name || '',
            category: vehicle.category || (vehicle_categories[0] || 'Regular Family SUV'),
            model: vehicle.model || '',
            daily_rate: vehicle.daily_rate || '',
            passenger_capacity: vehicle.passenger_capacity || 6,
            luggage_capacity: vehicle.luggage_capacity || 4,
            is_popular: Boolean(vehicle.is_popular),
            photo: null,
        });
        setEditVehiclePhotoPreview(vehicle.photo_url || null);
        setShowEditVehicleModal(true);
    };

    const handleEditVehicleSubmit = (e) => {
        e.preventDefault();
        if (!selectedVehicle) return;
        editVehicleForm.post(`/admin/vehicles/${selectedVehicle.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setShowEditVehicleModal(false);
                editVehicleForm.reset();
                setEditVehiclePhotoPreview(null);
                setSelectedVehicle(null);
            },
        });
    };

    const openDeleteVehicleModal = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowDeleteVehicleModal(true);
    };

    const handleDeleteVehicle = () => {
        if (!selectedVehicle) return;
        router.delete(`/admin/vehicles/${selectedVehicle.id}`, {
            onSuccess: () => {
                setShowDeleteVehicleModal(false);
                setSelectedVehicle(null);
            },
        });
    };

    // -------------------------------------------------------------------------
    // TAB 2: DRIVERS STATE & HANDLERS
    // -------------------------------------------------------------------------
    const [driverSearch, setDriverSearch] = useState(filters.search_driver || '');
    const [showAddDriverModal, setShowAddDriverModal] = useState(false);
    const [showEditDriverModal, setShowEditDriverModal] = useState(false);
    const [showDeleteDriverModal, setShowDeleteDriverModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [addDriverPhotoPreview, setAddDriverPhotoPreview] = useState(null);
    const [editDriverPhotoPreview, setEditDriverPhotoPreview] = useState(null);
    const addDriverFileInputRef = useRef(null);
    const editDriverFileInputRef = useRef(null);

    const addDriverForm = useForm({
        full_name: '',
        whatsapp_number: '',
        email: '',
        password: '',
        license_number: '',
        license_expiry_date: '',
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
        status: 'Active',
        profile_photo: null,
    });

    const handleDriverSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/master-data',
            { tab: 'drivers', search_driver: driverSearch },
            { preserveState: true, replace: true }
        );
    };

    const handleDriverFileChange = (file, isEdit = false) => {
        if (!file) return;
        if (isEdit) {
            editDriverForm.setData('profile_photo', file);
            setEditDriverPhotoPreview(URL.createObjectURL(file));
        } else {
            addDriverForm.setData('profile_photo', file);
            setAddDriverPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleAddDriverSubmit = (e) => {
        e.preventDefault();
        addDriverForm.post('/admin/drivers', {
            forceFormData: true,
            onSuccess: () => {
                setShowAddDriverModal(false);
                addDriverForm.reset();
                setAddDriverPhotoPreview(null);
            },
        });
    };

    const openEditDriverModal = (driver) => {
        setSelectedDriver(driver);
        editDriverForm.setData({
            _method: 'put',
            full_name: driver.full_name || '',
            whatsapp_number: driver.whatsapp_number || '',
            email: driver.email || '',
            password: '',
            license_number: driver.license_number || '',
            license_expiry_date: driver.license_expiry_date || '',
            status: driver.status || 'Active',
            profile_photo: null,
        });
        setEditDriverPhotoPreview(driver.profile_photo_url || null);
        setShowEditDriverModal(true);
    };

    const handleEditDriverSubmit = (e) => {
        e.preventDefault();
        if (!selectedDriver) return;
        editDriverForm.post(`/admin/drivers/${selectedDriver.raw_id}`, {
            forceFormData: true,
            onSuccess: () => {
                setShowEditDriverModal(false);
                editDriverForm.reset();
                setEditDriverPhotoPreview(null);
                setSelectedDriver(null);
            },
        });
    };

    const openDeleteDriverModal = (driver) => {
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

    // -------------------------------------------------------------------------
    // TAB 3: HOTELS STATE & HANDLERS
    // -------------------------------------------------------------------------
    const [hotelSearch, setHotelSearch] = useState(filters.search_hotel || '');
    const [showAddHotelModal, setShowAddHotelModal] = useState(false);
    const [showEditHotelModal, setShowEditHotelModal] = useState(false);
    const [showDeleteHotelModal, setShowDeleteHotelModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);

    const addHotelForm = useForm({
        nama_hotel: '',
        airport_ids: [],
    });

    const editHotelForm = useForm({
        _method: 'put',
        nama_hotel: '',
        airport_ids: [],
    });

    const handleHotelSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/master-data',
            { tab: 'hotels', search_hotel: hotelSearch },
            { preserveState: true, replace: true }
        );
    };

    const handleAddHotelSubmit = (e) => {
        e.preventDefault();
        addHotelForm.post('/admin/hotels', {
            onSuccess: () => {
                setShowAddHotelModal(false);
                addHotelForm.reset();
            },
        });
    };

    const openEditHotelModal = (hotel) => {
        setSelectedHotel(hotel);
        editHotelForm.setData({
            _method: 'put',
            nama_hotel: hotel.nama_hotel || '',
            airport_ids: hotel.airport_ids || [],
        });
        setShowEditHotelModal(true);
    };

    const handleEditHotelSubmit = (e) => {
        e.preventDefault();
        if (!selectedHotel) return;
        editHotelForm.put(`/admin/hotels/${selectedHotel.id}`, {
            onSuccess: () => {
                setShowEditHotelModal(false);
                editHotelForm.reset();
                setSelectedHotel(null);
            },
        });
    };

    const openDeleteHotelModal = (hotel) => {
        setSelectedHotel(hotel);
        setShowDeleteHotelModal(true);
    };

    const handleDeleteHotel = () => {
        if (!selectedHotel) return;
        router.delete(`/admin/hotels/${selectedHotel.id}`, {
            onSuccess: () => {
                setShowDeleteHotelModal(false);
                setSelectedHotel(null);
            },
        });
    };

    // -------------------------------------------------------------------------
    // TAB 4: DESTINASI / AIRPORT STATE & HANDLERS
    // -------------------------------------------------------------------------
    const [airportSearch, setAirportSearch] = useState(filters.search_airport || '');
    const [airportTypeFilter, setAirportTypeFilter] = useState(filters.type_airport || 'all');
    const [showAddAirportModal, setShowAddAirportModal] = useState(false);
    const [showEditAirportModal, setShowEditAirportModal] = useState(false);
    const [showDeleteAirportModal, setShowDeleteAirportModal] = useState(false);
    const [selectedAirport, setSelectedAirport] = useState(null);

    const addAirportForm = useForm({
        destinasi: '',
        type: 'Pick-Up',
        price_regular: '',
        price_luxury: '',
    });

    const editAirportForm = useForm({
        _method: 'put',
        destinasi: '',
        type: 'Pick-Up',
        price_regular: '',
        price_luxury: '',
    });

    const handleAirportFilterSubmit = (e) => {
        e.preventDefault();
        router.get(
            '/admin/master-data',
            { tab: 'airports', search_airport: airportSearch, type_airport: airportTypeFilter },
            { preserveState: true, replace: true }
        );
    };

    const handleAddAirportSubmit = (e) => {
        e.preventDefault();
        addAirportForm.post('/admin/airports', {
            onSuccess: () => {
                setShowAddAirportModal(false);
                addAirportForm.reset();
            },
        });
    };

    const openEditAirportModal = (airport) => {
        setSelectedAirport(airport);
        editAirportForm.setData({
            _method: 'put',
            destinasi: airport.destinasi || '',
            type: airport.type || 'Pick-Up',
            price_regular: airport.price_regular || '',
            price_luxury: airport.price_luxury || '',
        });
        setShowEditAirportModal(true);
    };

    const handleEditAirportSubmit = (e) => {
        e.preventDefault();
        if (!selectedAirport) return;
        editAirportForm.put(`/admin/airports/${selectedAirport.id}`, {
            onSuccess: () => {
                setShowEditAirportModal(false);
                editAirportForm.reset();
                setSelectedAirport(null);
            },
        });
    };

    const openDeleteAirportModal = (airport) => {
        setSelectedAirport(airport);
        setShowDeleteAirportModal(true);
    };

    const handleDeleteAirport = () => {
        if (!selectedAirport) return;
        router.delete(`/admin/airports/${selectedAirport.id}`, {
            onSuccess: () => {
                setShowDeleteAirportModal(false);
                setSelectedAirport(null);
            },
        });
    };

    // -------------------------------------------------------------------------
    // TAB 5: HOTEL PRICELIST STATE & HANDLERS
    // -------------------------------------------------------------------------
    const [hotelPriceSearch, setHotelPriceSearch] = useState(filters.search_hotel_pricelist || '');
    const [showAddHotelPriceModal, setShowAddHotelPriceModal] = useState(false);
    const [showEditHotelPriceModal, setShowEditHotelPriceModal] = useState(false);
    const [showDeleteHotelPriceModal, setShowDeleteHotelPriceModal] = useState(false);
    const [selectedHotelPrice, setSelectedHotelPrice] = useState(null);

    const addHotelPriceForm = useForm({
        hotel_id_pickup: hotels_list[0]?.id ? String(hotels_list[0].id) : '',
        hotel_id_dropoff: hotels_list[1]?.id ? String(hotels_list[1].id) : '',
        regular_price: '',
        luxury_price: '',
    });

    const editHotelPriceForm = useForm({
        _method: 'put',
        hotel_id_pickup: '',
        hotel_id_dropoff: '',
        regular_price: '',
        luxury_price: '',
    });

    const handleHotelPriceSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/master-data',
            { tab: 'hotel_transfer_price_lists', search_hotel_pricelist: hotelPriceSearch },
            { preserveState: true, replace: true }
        );
    };

    const handleAddHotelPriceSubmit = (e) => {
        e.preventDefault();
        if (addHotelPriceForm.data.hotel_id_pickup === addHotelPriceForm.data.hotel_id_dropoff) {
            alert('Hotel Tujuan tidak boleh sama dengan Hotel Asal.');
            return;
        }
        addHotelPriceForm.post('/admin/hotel-transfer-price-lists', {
            onSuccess: () => {
                setShowAddHotelPriceModal(false);
                addHotelPriceForm.reset();
            },
        });
    };

    const openEditHotelPriceModal = (item) => {
        setSelectedHotelPrice(item);
        editHotelPriceForm.setData({
            _method: 'put',
            hotel_id_pickup: item.hotel_id_pickup ? String(item.hotel_id_pickup) : '',
            hotel_id_dropoff: item.hotel_id_dropoff ? String(item.hotel_id_dropoff) : '',
            regular_price: item.regular_price || '',
            luxury_price: item.luxury_price || '',
        });
        setShowEditHotelPriceModal(true);
    };

    const handleEditHotelPriceSubmit = (e) => {
        e.preventDefault();
        if (!selectedHotelPrice) return;
        if (editHotelPriceForm.data.hotel_id_pickup === editHotelPriceForm.data.hotel_id_dropoff) {
            alert('Hotel Tujuan tidak boleh sama dengan Hotel Asal.');
            return;
        }
        editHotelPriceForm.put(`/admin/hotel-transfer-price-lists/${selectedHotelPrice.id}`, {
            onSuccess: () => {
                setShowEditHotelPriceModal(false);
                editHotelPriceForm.reset();
                setSelectedHotelPrice(null);
            },
        });
    };

    const openDeleteHotelPriceModal = (item) => {
        setSelectedHotelPrice(item);
        setShowDeleteHotelPriceModal(true);
    };

    const handleDeleteHotelPrice = () => {
        if (!selectedHotelPrice) return;
        router.delete(`/admin/hotel-transfer-price-lists/${selectedHotelPrice.id}`, {
            onSuccess: () => {
                setShowDeleteHotelPriceModal(false);
                setSelectedHotelPrice(null);
            },
        });
    };

    // Generic pagination renderer
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
                        if (label.includes('&laquo;') || label.includes('Previous')) label = 'Prev';
                        else if (label.includes('&raquo;') || label.includes('Next')) label = 'Next';

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
        <AdminLayout title="Master Data Management">
            <div className="space-y-6 max-w-[1280px]">
                {/* Flash Message */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-in fade-in duration-200">
                        <svg className="w-5 h-5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Top Header Card */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-[#00AEEF] bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                                    Master Data
                                </span>
                                <span className="text-xs font-medium text-slate-400">&bull;</span>
                                <span className="text-xs font-medium text-slate-500">Pusat Data Master Operasional</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                                Master Data Management
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Kelola armada mobil 3-tier, data pengemudi, database hotel, tarif destinasi bandara, dan pricelist transfer antar hotel.
                            </p>
                        </div>
                    </div>

                    {/* 5 Interactive KPI Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-6">
                        {/* KPI 1: Vehicles */}
                        <button
                            type="button"
                            onClick={() => setCurrentTab('vehicles')}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                                currentTab === 'vehicles'
                                    ? 'bg-sky-50/70 border-sky-400/80 ring-2 ring-sky-500/20 shadow-xs'
                                    : 'bg-white border-slate-200/80 hover:border-sky-300 hover:bg-slate-50/60'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                    currentTab === 'vehicles' ? 'bg-[#00AEEF] text-white shadow-xs' : 'bg-sky-100 text-sky-700 group-hover:bg-sky-200'
                                }`}>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                        <circle cx="7" cy="17" r="2" />
                                        <circle cx="17" cy="17" r="2" />
                                    </svg>
                                </div>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                    currentTab === 'vehicles' ? 'bg-sky-200/80 text-sky-900' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    3 Tiers
                                </span>
                            </div>
                            <div className="mt-3">
                                <div className="text-2xl font-black text-slate-900 leading-none">
                                    {stats?.total_vehicles || vehicles.length}
                                </div>
                                <div className="text-xs font-bold text-slate-700 mt-1">Armada Mobil</div>
                                <div className="text-[11px] text-slate-400 truncate">Regular, Luxury, Big Van</div>
                            </div>
                        </button>

                        {/* KPI 2: Drivers */}
                        <button
                            type="button"
                            onClick={() => setCurrentTab('drivers')}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                                currentTab === 'drivers'
                                    ? 'bg-indigo-50/70 border-indigo-400/80 ring-2 ring-indigo-500/20 shadow-xs'
                                    : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/60'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                    currentTab === 'drivers' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200'
                                }`}>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <polyline points="16 11 18 13 22 9" />
                                    </svg>
                                </div>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                    currentTab === 'drivers' ? 'bg-indigo-200/80 text-indigo-900' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    Driver
                                </span>
                            </div>
                            <div className="mt-3">
                                <div className="text-2xl font-black text-slate-900 leading-none">
                                    {stats?.total_drivers || drivers.total || drivers.data?.length || 0}
                                </div>
                                <div className="text-xs font-bold text-slate-700 mt-1">Pengemudi Aktif</div>
                                <div className="text-[11px] text-slate-400 truncate">SIM & WhatsApp</div>
                            </div>
                        </button>

                        {/* KPI 3: Hotels */}
                        <button
                            type="button"
                            onClick={() => setCurrentTab('hotels')}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                                currentTab === 'hotels'
                                    ? 'bg-amber-50/70 border-amber-400/80 ring-2 ring-amber-500/20 shadow-xs'
                                    : 'bg-white border-slate-200/80 hover:border-amber-300 hover:bg-slate-50/60'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                    currentTab === 'hotels' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-100 text-amber-800 group-hover:bg-amber-200'
                                }`}>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M2 20h20" />
                                        <path d="M4 20V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
                                        <path d="M9 20v-6h6v6" />
                                        <path d="M9 8h2" />
                                        <path d="M13 8h2" />
                                        <path d="M9 12h2" />
                                        <path d="M13 12h2" />
                                    </svg>
                                </div>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                    currentTab === 'hotels' ? 'bg-amber-200/80 text-amber-900' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    Resort
                                </span>
                            </div>
                            <div className="mt-3">
                                <div className="text-2xl font-black text-slate-900 leading-none">
                                    {stats?.total_hotels || hotels.length}
                                </div>
                                <div className="text-xs font-bold text-slate-700 mt-1">Database Hotel</div>
                                <div className="text-[11px] text-slate-400 truncate">Hotel & Resort Bali</div>
                            </div>
                        </button>

                        {/* KPI 4: Airports */}
                        <button
                            type="button"
                            onClick={() => setCurrentTab('airports')}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                                currentTab === 'airports'
                                    ? 'bg-emerald-50/70 border-emerald-400/80 ring-2 ring-emerald-500/20 shadow-xs'
                                    : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:bg-slate-50/60'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                    currentTab === 'airports' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200'
                                }`}>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                                    </svg>
                                </div>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                    currentTab === 'airports' ? 'bg-emerald-200/80 text-emerald-900' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    Airport
                                </span>
                            </div>
                            <div className="mt-3">
                                <div className="text-2xl font-black text-slate-900 leading-none">
                                    {stats?.total_airports || airports.length}
                                </div>
                                <div className="text-xs font-bold text-slate-700 mt-1">Destinasi Bandara</div>
                                <div className="text-[11px] text-slate-400 truncate">Pick-Up & Drop-Off</div>
                            </div>
                        </button>

                        {/* KPI 5: Hotel Pricelists */}
                        <button
                            type="button"
                            onClick={() => setCurrentTab('hotel_transfer_price_lists')}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                                currentTab === 'hotel_transfer_price_lists'
                                    ? 'bg-purple-50/70 border-purple-400/80 ring-2 ring-purple-500/20 shadow-xs'
                                    : 'bg-white border-slate-200/80 hover:border-purple-300 hover:bg-slate-50/60'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                    currentTab === 'hotel_transfer_price_lists' ? 'bg-purple-600 text-white shadow-xs' : 'bg-purple-100 text-purple-800 group-hover:bg-purple-200'
                                }`}>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect width="20" height="14" x="2" y="5" rx="2" />
                                        <line x1="2" x2="22" y1="10" y2="10" />
                                    </svg>
                                </div>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                    currentTab === 'hotel_transfer_price_lists' ? 'bg-purple-200/80 text-purple-900' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    Transfer
                                </span>
                            </div>
                            <div className="mt-3">
                                <div className="text-2xl font-black text-slate-900 leading-none">
                                    {stats?.total_hotel_pricelists || hotel_transfer_price_lists.length}
                                </div>
                                <div className="text-xs font-bold text-slate-700 mt-1">Tarif Antar Hotel</div>
                                <div className="text-[11px] text-slate-400 truncate">Rute Antar Hotel</div>
                            </div>
                        </button>
                    </div>

                    {/* Secondary Navigation Tabs Bar */}
                    <div className="flex items-center gap-2 pt-5 border-t border-slate-100 mt-5 overflow-x-auto no-scrollbar">
                        <button
                            type="button"
                            onClick={() => setCurrentTab('vehicles')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                                currentTab === 'vehicles'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <span>Armada Mobil</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                currentTab === 'vehicles' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                                {vehicles.length}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setCurrentTab('drivers')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                                currentTab === 'drivers'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <span>Driver</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                currentTab === 'drivers' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                                {drivers.total || drivers.data?.length || 0}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setCurrentTab('hotels')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                                currentTab === 'hotels'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <span>Database Hotel</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                currentTab === 'hotels' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                                {hotels.length}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setCurrentTab('airports')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                                currentTab === 'airports'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <span>Destinasi Bandara</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                currentTab === 'airports' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                                {airports.length}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setCurrentTab('hotel_transfer_price_lists')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                                currentTab === 'hotel_transfer_price_lists'
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <span>Tarif Antar Hotel</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                                currentTab === 'hotel_transfer_price_lists' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                                {hotel_transfer_price_lists.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* ================================================================= */}
                {/* CONTENT: TAB 1 — VEHICLES                                        */}
                {/* ================================================================= */}
                {currentTab === 'vehicles' && (
                    <div className="space-y-6">
                        {/* Vehicle Section Header & Filter Toolbar */}
                        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Armada Mobil & 3 Kategori Tier</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Armada terbagi atas 3 tier utama: <strong>Regular</strong>, <strong>Luxury</strong>, dan <strong>Big Van</strong>.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addVehicleForm.reset();
                                        setAddVehiclePhotoPreview(null);
                                        setShowAddVehicleModal(true);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs active:scale-[0.98] cursor-pointer min-h-[42px] shrink-0"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    <span>Tambah Mobil</span>
                                </button>
                            </div>

                            <form onSubmit={handleVehicleFilterSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                                    <div className="relative flex-1 max-w-md">
                                        <input
                                            type="text"
                                            value={vehicleSearch}
                                            onChange={(e) => setVehicleSearch(e.target.value)}
                                            placeholder="Cari nama mobil atau model..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-base sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 min-h-[42px]"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="11" cy="11" r="8" />
                                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-56">
                                        <select
                                            value={selectedVehicleCategory}
                                            onChange={(e) => {
                                                setSelectedVehicleCategory(e.target.value);
                                                router.get(
                                                    '/admin/master-data',
                                                    { tab: 'vehicles', search_vehicle: vehicleSearch, category_vehicle: e.target.value },
                                                    { preserveState: true, replace: true }
                                                );
                                            }}
                                            className={selectClass}
                                        >
                                            <option value="all">Semua Kategori Tier</option>
                                            {vehicle_categories.map((cat, idx) => (
                                                <option key={idx} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer min-h-[42px]"
                                >
                                    Filter
                                </button>
                            </form>
                        </div>

                        {/* Vehicles Grid */}
                        {vehicles && vehicles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {vehicles.map((v) => (
                                    <div
                                        key={v.id}
                                        className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                                    >
                                        <div>
                                            <div className="relative h-44 bg-slate-100 overflow-hidden flex items-center justify-center">
                                                {v.photo_url ? (
                                                    <img
                                                        src={v.photo_url}
                                                        alt={v.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                                        <svg className="w-12 h-12 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                                            <circle cx="7" cy="17" r="2" />
                                                            <circle cx="17" cy="17" r="2" />
                                                        </svg>
                                                        <span className="text-xs font-semibold text-slate-400 mt-1">No Image Preview</span>
                                                    </div>
                                                )}

                                                <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-xs border ${
                                                        v.tier === 'Luxury'
                                                            ? 'bg-indigo-900/90 text-white border-indigo-700/60'
                                                            : (v.tier === 'Big Van' ? 'bg-emerald-900/90 text-white border-emerald-700/60' : 'bg-sky-900/90 text-white border-sky-700/60')
                                                    }`}>
                                                        {v.tier || 'Regular'}
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-slate-800 shadow-xs border border-white/60">
                                                        {v.category}
                                                    </span>
                                                </div>

                                                {v.is_popular && (
                                                    <div className="absolute top-3 right-3">
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-950 shadow-xs">
                                                            <svg className="w-3 h-3 fill-amber-950" viewBox="0 0 24 24">
                                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                            </svg>
                                                            Popular
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4 sm:p-5 space-y-3">
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                                                        {v.name}
                                                    </h3>
                                                    <span className="text-xs font-medium text-slate-400 mt-0.5 block">
                                                        Model / Tahun: {v.model}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                                                    <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg font-semibold">
                                                        <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                            <circle cx="12" cy="7" r="4" />
                                                        </svg>
                                                        {v.passenger_capacity} Penumpang
                                                    </span>

                                                    <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg font-semibold">
                                                        <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <rect width="18" height="14" x="3" y="6" rx="2" />
                                                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        </svg>
                                                        {v.luggage_capacity} Koper
                                                    </span>
                                                </div>

                                                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                                                    <span className="text-xs font-semibold text-slate-500">Tarif Harian:</span>
                                                    <div className="text-right">
                                                        <span className="text-base font-extrabold text-[#00AEEF]">
                                                            {v.daily_rate_formatted}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400 font-medium ml-1">/ hari</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 sm:p-5 pt-0 flex items-center justify-end gap-2 border-t border-slate-100 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditVehicleModal(v)}
                                                className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl transition flex items-center justify-center gap-1.5 min-h-[38px] cursor-pointer"
                                            >
                                                <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                    <path d="m15 5 4 4" />
                                                </svg>
                                                <span>Edit Mobil</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => openDeleteVehicleModal(v)}
                                                className="p-2 text-red-600 hover:bg-red-50 border border-red-200/60 rounded-xl transition flex items-center justify-center min-h-[38px] min-w-[38px] cursor-pointer"
                                                title="Hapus Mobil"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 py-16 text-center text-slate-400 p-6">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                        <circle cx="7" cy="17" r="2" />
                                        <circle cx="17" cy="17" r="2" />
                                    </svg>
                                </div>
                                <h4 className="text-base font-bold text-slate-700">Belum ada armada mobil</h4>
                                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                    Klik tombol Tambah Mobil untuk mendaftarkan jenis armada kendaraan baru.
                                </p>
                            </div>
                        )}
                    </div>
                )}                {/* ================================================================= */}
                {/* CONTENT: TAB 2 — DRIVERS                                         */}
                {/* ================================================================= */}
                {currentTab === 'drivers' && (
                    <div className="space-y-6">
                        {/* Driver Section Header & Search Toolbar */}
                        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Data Driver & Lisensi Pengemudi</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Kelola profil pengemudi, kontak WhatsApp, nomor SIM, masa berlaku, dan status operasional.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addDriverForm.reset();
                                        setAddDriverPhotoPreview(null);
                                        setShowAddDriverModal(true);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs active:scale-[0.98] cursor-pointer min-h-[42px] shrink-0"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    <span>Tambah Driver</span>
                                </button>
                            </div>

                            <form onSubmit={handleDriverSearch} className="relative w-full">
                                <input
                                    type="text"
                                    value={driverSearch}
                                    onChange={(e) => setDriverSearch(e.target.value)}
                                    placeholder="Cari driver berdasarkan ID, nama, email, nomor SIM, atau WhatsApp..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all min-h-[42px]"
                                />
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
                            {/* Desktop Driver Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                            <th className="w-20 px-6 py-3.5">ID</th>
                                            <th className="px-6 py-3.5">Driver Info</th>
                                            <th className="px-6 py-3.5">Contact (WA)</th>
                                            <th className="px-6 py-3.5">License & Status</th>
                                            <th className="px-6 py-3.5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {drivers.data && drivers.data.length > 0 ? (
                                            drivers.data.map((driver) => (
                                                <tr key={driver.raw_id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="w-20 px-6 py-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                                                        #{driver.id}
                                                    </td>
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
                                                                <span className="text-xs text-slate-500">{driver.email}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-700 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-semibold text-slate-800 font-mono">
                                                                {driver.whatsapp_number}
                                                            </span>
                                                            {driver.whatsapp_number && (
                                                                <a
                                                                    href={`https://wa.me/${driver.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors inline-flex items-center"
                                                                    title="Chat WhatsApp"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                                        <polyline points="15 3 21 3 21 9" />
                                                                        <line x1="10" y1="14" x2="21" y2="3" />
                                                                    </svg>
                                                                </a>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-xs font-medium text-slate-700">
                                                                SIM: {driver.license_number} (Exp: {driver.license_expiry_date || '-'})
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
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditDriverModal(driver)}
                                                                className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                                                                title="Edit Driver"
                                                            >
                                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                                    <path d="m15 5 4 4" />
                                                                </svg>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => openDeleteDriverModal(driver)}
                                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
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
                                                    Tidak ada driver ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Driver Card List */}
                            <div className="block lg:hidden divide-y divide-slate-100">
                                {drivers.data && drivers.data.length > 0 ? (
                                    drivers.data.map((driver) => (
                                        <div key={driver.raw_id} className="p-4 flex flex-col gap-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {driver.profile_photo_url ? (
                                                        <img
                                                            src={driver.profile_photo_url}
                                                            alt={driver.full_name}
                                                            className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-11 h-11 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-sm font-bold shrink-0">
                                                            {driver.full_name?.charAt(0).toUpperCase() || 'D'}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-mono font-bold text-slate-400">#{driver.id}</span>
                                                            <span className="font-bold text-slate-900 text-sm truncate">{driver.full_name}</span>
                                                        </div>
                                                        <div className="text-xs text-slate-500 truncate mt-0.5">{driver.email}</div>
                                                    </div>
                                                </div>

                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${
                                                    driver.status === 'Active'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                        : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                                }`}>
                                                    {driver.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                <span className="font-mono font-semibold">{driver.whatsapp_number}</span>
                                                <span className="text-slate-400">SIM: {driver.license_number}</span>
                                            </div>

                                            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditDriverModal(driver)}
                                                    className="px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200/60 rounded-xl"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openDeleteDriverModal(driver)}
                                                    className="px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200/60 rounded-xl"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-8 text-center text-slate-400 text-sm">
                                        Tidak ada driver ditemukan.
                                    </div>
                                )}
                            </div>

                            {renderPagination(drivers)}
                        </div>
                    </div>
                )}

                {/* ================================================================= */}
                {/* CONTENT: TAB 3 — HOTELS                                          */}
                {/* ================================================================= */}
                {currentTab === 'hotels' && (
                    <div className="space-y-6">
                        {/* Hotel Section Header & Search Toolbar */}
                        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Database Hotel & Resort Bali</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Daftar hotel tujuan dan hubungannya dengan wilayah destinasi penjemputan/pengantaran bandara.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addHotelForm.reset();
                                        setShowAddHotelModal(true);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs active:scale-[0.98] cursor-pointer min-h-[42px] shrink-0"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    <span>Tambah Hotel</span>
                                </button>
                            </div>

                            <form onSubmit={handleHotelSearch} className="relative w-full">
                                <input
                                    type="text"
                                    value={hotelSearch}
                                    onChange={(e) => setHotelSearch(e.target.value)}
                                    placeholder="Cari nama hotel / resort..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all min-h-[42px]"
                                />
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
                            {/* Desktop Hotel Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                            <th className="w-16 px-6 py-3.5">No</th>
                                            <th className="px-6 py-3.5">Nama Hotel / Resort</th>
                                            <th className="px-6 py-3.5">Destinasi / Wilayah Terhubung</th>
                                            <th className="px-6 py-3.5 text-center">Jumlah Wilayah</th>
                                            <th className="px-6 py-3.5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {hotels && hotels.length > 0 ? (
                                            hotels.map((hotel, idx) => (
                                                <tr key={hotel.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-slate-400 text-xs">
                                                        {idx + 1}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-slate-900">
                                                        {hotel.nama_hotel}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1.5 max-w-md">
                                                            {hotel.airports && hotel.airports.length > 0 ? (
                                                                hotel.airports.map((ap) => (
                                                                    <span
                                                                        key={ap.id}
                                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-sky-50 text-[#00AEEF] border border-sky-200/60"
                                                                    >
                                                                        {ap.destinasi} ({ap.type})
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-xs text-slate-400 italic">
                                                                    Belum terhubung ke destinasi
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                                            {hotel.airports_count || 0} Wilayah
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditHotelModal(hotel)}
                                                                className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                                                                title="Edit Hotel"
                                                            >
                                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                                    <path d="m15 5 4 4" />
                                                                </svg>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => openDeleteHotelModal(hotel)}
                                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                                                                title="Delete Hotel"
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
                                                    Belum ada hotel terdaftar.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Hotel Card List */}
                            <div className="block lg:hidden divide-y divide-slate-100">
                                {hotels && hotels.length > 0 ? (
                                    hotels.map((hotel) => (
                                        <div key={hotel.id} className="p-4 flex flex-col gap-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h4 className="text-base font-bold text-slate-900">{hotel.nama_hotel}</h4>
                                                    <span className="text-xs text-slate-400">{hotel.airports_count || 0} Wilayah terhubung</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditHotelModal(hotel)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200/60 rounded-lg"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeleteHotelModal(hotel)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200/60 rounded-lg"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>

                                            {hotel.airports && hotel.airports.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    {hotel.airports.map((ap) => (
                                                        <span key={ap.id} className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                                            {ap.destinasi} ({ap.type})
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-8 text-center text-slate-400 text-sm">
                                        Belum ada hotel terdaftar.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ================================================================= */}
                {/* CONTENT: TAB 4 — DESTINASI & TARIF AIRPORT                       */}
                {/* ================================================================= */}
                {currentTab === 'airports' && (
                    <div className="space-y-6">
                        {/* Airport Section Header & Filter Toolbar */}
                        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Destinasi & Tarif Transfer Bandara</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Tarif bandara DPS dibedakan antara <strong>Pick-Up</strong> (jemput di bandara) dan <strong>Drop-Off</strong> (antar ke bandara).
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addAirportForm.reset();
                                        setShowAddAirportModal(true);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs active:scale-[0.98] cursor-pointer min-h-[42px] shrink-0"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    <span>Tambah Destinasi</span>
                                </button>
                            </div>

                            <form onSubmit={handleAirportFilterSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                                    <div className="relative flex-1 max-w-md">
                                        <input
                                            type="text"
                                            value={airportSearch}
                                            onChange={(e) => setAirportSearch(e.target.value)}
                                            placeholder="Cari nama destinasi / wilayah (mis: Ubud, Seminyak)..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-base sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 min-h-[42px]"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="11" cy="11" r="8" />
                                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-48">
                                        <select
                                            value={airportTypeFilter}
                                            onChange={(e) => {
                                                setAirportTypeFilter(e.target.value);
                                                router.get(
                                                    '/admin/master-data',
                                                    { tab: 'airports', search_airport: airportSearch, type_airport: e.target.value },
                                                    { preserveState: true, replace: true }
                                                );
                                            }}
                                            className={selectClass}
                                        >
                                            <option value="all">Semua Tipe Transfer</option>
                                            <option value="Pick-Up">🛬 Pick-Up (Dari Bandara)</option>
                                            <option value="Drop-Off">🛫 Drop-Off (Ke Bandara)</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer min-h-[42px]"
                                >
                                    Filter
                                </button>
                            </form>
                        </div>

                        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
                            {/* Desktop Airport Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                            <th className="px-6 py-3.5">Destinasi / Wilayah</th>
                                            <th className="px-6 py-3.5">Tipe Transfer</th>
                                            <th className="px-6 py-3.5">Tarif Regular</th>
                                            <th className="px-6 py-3.5">Tarif Luxury</th>
                                            <th className="px-6 py-3.5 text-center">Hotel Terhubung</th>
                                            <th className="px-6 py-3.5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {airports && airports.length > 0 ? (
                                            airports.map((ap) => (
                                                <tr key={ap.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-slate-900">
                                                        {ap.destinasi}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                            ap.type === 'Pick-Up'
                                                                ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                                                                : 'bg-purple-50 text-purple-700 border border-purple-200/70'
                                                        }`}>
                                                            {ap.type === 'Pick-Up' ? '🛬 Pick-Up (Dari Bandara)' : '🛫 Drop-Off (Ke Bandara)'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-slate-800 whitespace-nowrap font-mono">
                                                        {ap.price_regular_formatted}
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-[#00AEEF] whitespace-nowrap font-mono">
                                                        {ap.price_luxury_formatted}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                                                            {ap.hotels_count || 0} Hotel
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditAirportModal(ap)}
                                                                className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                                                                title="Edit Destinasi"
                                                            >
                                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                                    <path d="m15 5 4 4" />
                                                                </svg>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => openDeleteAirportModal(ap)}
                                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                                                                title="Delete Destinasi"
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
                                                <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-sm">
                                                    Belum ada tarif destinasi terdaftar.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Airport Card List */}
                            <div className="block lg:hidden divide-y divide-slate-100">
                                {airports && airports.length > 0 ? (
                                    airports.map((ap) => (
                                        <div key={ap.id} className="p-4 flex flex-col gap-2.5">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h4 className="text-base font-bold text-slate-900">{ap.destinasi}</h4>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold mt-1 ${
                                                        ap.type === 'Pick-Up' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                                    }`}>
                                                        {ap.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditAirportModal(ap)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200/60 rounded-lg"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeleteAirportModal(ap)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200/60 rounded-lg"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase">Regular</span>
                                                    <span className="font-bold text-slate-800">{ap.price_regular_formatted}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase">Luxury</span>
                                                    <span className="font-bold text-[#00AEEF]">{ap.price_luxury_formatted}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-8 text-center text-slate-400 text-sm">
                                        Belum ada tarif destinasi terdaftar.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ================================================================= */}
                {/* CONTENT: TAB 5 — HOTEL TRANSFER PRICELIST                         */}
                {/* ================================================================= */}
                {currentTab === 'hotel_transfer_price_lists' && (
                    <div className="space-y-6">
                        {/* Hotel Transfer Pricelist Header & Search Toolbar */}
                        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Tarif Transfer Antar Hotel (Pricelist)</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Tentukan tarif perjalanan langsung dari satu hotel/resort ke hotel/resort lainnya untuk opsi armada Regular dan Luxury.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addHotelPriceForm.reset();
                                        setShowAddHotelPriceModal(true);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs active:scale-[0.98] cursor-pointer min-h-[42px] shrink-0"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    <span>Tambah Tarif Antar Hotel</span>
                                </button>
                            </div>

                            <form onSubmit={handleHotelPriceSearch} className="relative w-full">
                                <input
                                    type="text"
                                    value={hotelPriceSearch}
                                    onChange={(e) => setHotelPriceSearch(e.target.value)}
                                    placeholder="Cari rute transfer hotel (nama hotel asal atau tujuan)..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all min-h-[42px]"
                                />
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
                            {/* Desktop Hotel Transfer Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                            <th className="px-6 py-3.5">Rute Transfer (Hotel Asal &rarr; Hotel Tujuan)</th>
                                            <th className="px-6 py-3.5">Tarif Regular</th>
                                            <th className="px-6 py-3.5">Tarif Luxury</th>
                                            <th className="px-6 py-3.5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {hotel_transfer_price_lists && hotel_transfer_price_lists.length > 0 ? (
                                            hotel_transfer_price_lists.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-slate-900">
                                                                {item.pickup_hotel_name}
                                                            </span>
                                                            <div className="flex items-center text-[#00AEEF] px-2.5 py-1 rounded-full bg-sky-50 border border-sky-100 text-xs font-bold">
                                                                &rarr;
                                                            </div>
                                                            <span className="font-bold text-slate-900">
                                                                {item.dropoff_hotel_name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-slate-800 whitespace-nowrap font-mono">
                                                        {item.regular_price_formatted}
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-[#00AEEF] whitespace-nowrap font-mono">
                                                        {item.luxury_price_formatted}
                                                    </td>
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditHotelPriceModal(item)}
                                                                className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                                                                title="Edit Tarif"
                                                            >
                                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                                    <path d="m15 5 4 4" />
                                                                </svg>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => openDeleteHotelPriceModal(item)}
                                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                                                                title="Delete Tarif"
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
                                                <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">
                                                    Belum ada pricelist transfer antar hotel terdaftar.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Hotel Transfer List */}
                            <div className="block lg:hidden divide-y divide-slate-100">
                                {hotel_transfer_price_lists && hotel_transfer_price_lists.length > 0 ? (
                                    hotel_transfer_price_lists.map((item) => (
                                        <div key={item.id} className="p-4 flex flex-col gap-2.5">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="text-sm font-bold text-slate-900">
                                                    <div>{item.pickup_hotel_name}</div>
                                                    <div className="text-xs text-[#00AEEF] flex items-center gap-1 font-semibold mt-0.5">
                                                        <span>&darr; Transfer ke</span>
                                                    </div>
                                                    <div>{item.dropoff_hotel_name}</div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditHotelPriceModal(item)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200/60 rounded-lg"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeleteHotelPriceModal(item)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200/60 rounded-lg"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase">Regular</span>
                                                    <span className="font-bold text-slate-800">{item.regular_price_formatted}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase">Luxury</span>
                                                    <span className="font-bold text-[#00AEEF]">{item.luxury_price_formatted}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-8 text-center text-slate-400 text-sm">
                                        Belum ada pricelist transfer antar hotel terdaftar.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* MODALS SECTION                                                            */}
            {/* ========================================================================= */}

            {/* 1. ADD VEHICLE MODAL */}
            <Modal
                show={showAddVehicleModal}
                onClose={() => setShowAddVehicleModal(false)}
                title="Tambah Armada Mobil Baru"
                maxWidth="xl"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAddVehicleModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="add-vehicle-form"
                            disabled={addVehicleForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer min-h-[44px]"
                        >
                            {addVehicleForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Mobil</span>
                        </button>
                    </>
                }
            >
                <form id="add-vehicle-form" onSubmit={handleAddVehicleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Nama Mobil <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={addVehicleForm.data.name}
                                onChange={(e) => addVehicleForm.setData('name', e.target.value)}
                                placeholder="Contoh: Toyota Innova Zenix"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            {addVehicleForm.errors.name && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addVehicleForm.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Kategori <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={addVehicleForm.data.category}
                                onChange={(e) => addVehicleForm.setData('category', e.target.value)}
                                className={selectClass}
                            >
                                {vehicle_categories.map((cat, idx) => (
                                    <option key={idx} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            {addVehicleForm.errors.category && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addVehicleForm.errors.category}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Tahun / Model <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={addVehicleForm.data.model}
                                onChange={(e) => addVehicleForm.setData('model', e.target.value)}
                                placeholder="Contoh: 2024"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            {addVehicleForm.errors.model && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addVehicleForm.errors.model}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Tarif Sewa / Hari (Rp) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="10000"
                                value={addVehicleForm.data.daily_rate}
                                onChange={(e) => addVehicleForm.setData('daily_rate', e.target.value)}
                                placeholder="Contoh: 850000"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                            {addVehicleForm.errors.daily_rate && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addVehicleForm.errors.daily_rate}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Kapasitas Penumpang <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="50"
                                value={addVehicleForm.data.passenger_capacity}
                                onChange={(e) => addVehicleForm.setData('passenger_capacity', parseInt(e.target.value, 10) || 1)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Kapasitas Koper <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="50"
                                value={addVehicleForm.data.luggage_capacity}
                                onChange={(e) => addVehicleForm.setData('luggage_capacity', parseInt(e.target.value, 10) || 0)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-6">
                            <input
                                type="checkbox"
                                id="add_is_popular_m"
                                checked={addVehicleForm.data.is_popular}
                                onChange={(e) => addVehicleForm.setData('is_popular', e.target.checked)}
                                className="w-4 h-4 text-[#00AEEF] rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                            />
                            <label htmlFor="add_is_popular_m" className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer">
                                Mobil Populer / Unggulan
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Foto Mobil (Opsional)
                        </label>
                        <input
                            type="file"
                            ref={addVehicleFileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleVehiclePhotoChange(e.target.files[0], false);
                                }
                            }}
                        />

                        {addVehiclePhotoPreview ? (
                            <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-2xl bg-slate-50">
                                <img
                                    src={addVehiclePhotoPreview}
                                    alt="Preview"
                                    className="w-20 h-14 rounded-xl object-cover border-2 border-white shadow-xs"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-800 truncate">Foto armada dipilih</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => addVehicleFileInputRef.current?.click()}
                                        className="text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg"
                                    >
                                        Ganti
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            addVehicleForm.setData('photo', null);
                                            setAddVehiclePhotoPreview(null);
                                        }}
                                        className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => addVehicleFileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-sky-400 hover:bg-sky-50/30 transition-all cursor-pointer bg-slate-50/50"
                            >
                                <p className="text-xs font-semibold text-slate-700">
                                    <span className="text-[#00AEEF]">Klik untuk unggah</span> foto mobil
                                </p>
                            </div>
                        )}
                    </div>
                </form>
            </Modal>

            {/* 2. EDIT VEHICLE MODAL */}
            <Modal
                show={showEditVehicleModal}
                onClose={() => setShowEditVehicleModal(false)}
                title={`Edit Armada (${selectedVehicle?.name || ''})`}
                maxWidth="xl"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowEditVehicleModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="edit-vehicle-form"
                            disabled={editVehicleForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer min-h-[44px]"
                        >
                            {editVehicleForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Perbarui Mobil</span>
                        </button>
                    </>
                }
            >
                <form id="edit-vehicle-form" onSubmit={handleEditVehicleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Nama Mobil <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editVehicleForm.data.name}
                                onChange={(e) => editVehicleForm.setData('name', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Kategori <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={editVehicleForm.data.category}
                                onChange={(e) => editVehicleForm.setData('category', e.target.value)}
                                className={selectClass}
                            >
                                {vehicle_categories.map((cat, idx) => (
                                    <option key={idx} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Tahun / Model <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editVehicleForm.data.model}
                                onChange={(e) => editVehicleForm.setData('model', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Tarif Sewa / Hari (Rp) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="10000"
                                value={editVehicleForm.data.daily_rate}
                                onChange={(e) => editVehicleForm.setData('daily_rate', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Kapasitas Penumpang <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="50"
                                value={editVehicleForm.data.passenger_capacity}
                                onChange={(e) => editVehicleForm.setData('passenger_capacity', parseInt(e.target.value, 10) || 1)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Kapasitas Koper <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="50"
                                value={editVehicleForm.data.luggage_capacity}
                                onChange={(e) => editVehicleForm.setData('luggage_capacity', parseInt(e.target.value, 10) || 0)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-6">
                            <input
                                type="checkbox"
                                id="edit_is_popular_m"
                                checked={editVehicleForm.data.is_popular}
                                onChange={(e) => editVehicleForm.setData('is_popular', e.target.checked)}
                                className="w-4 h-4 text-[#00AEEF] rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                            />
                            <label htmlFor="edit_is_popular_m" className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer">
                                Mobil Populer / Unggulan
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Foto Mobil (Opsional)
                        </label>
                        <input
                            type="file"
                            ref={editVehicleFileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleVehiclePhotoChange(e.target.files[0], true);
                                }
                            }}
                        />

                        {editVehiclePhotoPreview || selectedVehicle?.photo_url ? (
                            <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-2xl bg-slate-50">
                                <img
                                    src={editVehiclePhotoPreview || selectedVehicle?.photo_url}
                                    alt="Preview"
                                    className="w-20 h-14 rounded-xl object-cover border-2 border-white shadow-xs"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-800 truncate">Foto armada mobil</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => editVehicleFileInputRef.current?.click()}
                                        className="text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg"
                                    >
                                        Ganti
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => editVehicleFileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-sky-400 hover:bg-sky-50/30 transition-all cursor-pointer bg-slate-50/50"
                            >
                                <p className="text-xs font-semibold text-slate-700">
                                    <span className="text-[#00AEEF]">Klik untuk unggah</span> foto mobil
                                </p>
                            </div>
                        )}
                    </div>
                </form>
            </Modal>

            {/* 3. DELETE VEHICLE MODAL */}
            <Modal
                show={showDeleteVehicleModal}
                onClose={() => setShowDeleteVehicleModal(false)}
                title="Hapus Armada Mobil"
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowDeleteVehicleModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteVehicle}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
                            Hapus Mobil
                        </button>
                    </>
                }
            >
                <p className="text-sm text-slate-600">
                    Apakah Anda yakin ingin menghapus armada <strong>{selectedVehicle?.name}</strong>?
                </p>
            </Modal>

            {/* 4. ADD DRIVER MODAL */}
            <Modal
                show={showAddDriverModal}
                onClose={() => setShowAddDriverModal(false)}
                title="Tambah Driver Baru"
                maxWidth="xl"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAddDriverModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="add-driver-form-m"
                            disabled={addDriverForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer min-h-[44px]"
                        >
                            {addDriverForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Driver</span>
                        </button>
                    </>
                }
            >
                <form id="add-driver-form-m" onSubmit={handleAddDriverSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={addDriverForm.data.full_name}
                                onChange={(e) => addDriverForm.setData('full_name', e.target.value)}
                                placeholder="Contoh: Wayan Sudira"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                WhatsApp / No. HP <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={addDriverForm.data.whatsapp_number}
                                onChange={(e) => addDriverForm.setData('whatsapp_number', e.target.value)}
                                placeholder="+62 812-3456-7890"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={addDriverForm.data.email}
                                onChange={(e) => addDriverForm.setData('email', e.target.value)}
                                placeholder="driver@balifamilysafe.com"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Password Sementara <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                required
                                value={addDriverForm.data.password}
                                onChange={(e) => addDriverForm.setData('password', e.target.value)}
                                placeholder="Min. 6 karakter"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Nomor SIM <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={addDriverForm.data.license_number}
                                onChange={(e) => addDriverForm.setData('license_number', e.target.value)}
                                placeholder="SIM-12345678"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Masa Berlaku SIM <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={addDriverForm.data.license_expiry_date}
                                onChange={(e) => addDriverForm.setData('license_expiry_date', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

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
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Foto Profil (Opsional)
                        </label>
                        <input
                            type="file"
                            ref={addDriverFileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleDriverFileChange(e.target.files[0], false);
                                }
                            }}
                        />

                        {addDriverPhotoPreview ? (
                            <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-2xl bg-slate-50">
                                <img
                                    src={addDriverPhotoPreview}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-800 truncate">Foto driver dipilih</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addDriverForm.setData('profile_photo', null);
                                        setAddDriverPhotoPreview(null);
                                    }}
                                    className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg"
                                >
                                    Hapus
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => addDriverFileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-sky-400 hover:bg-sky-50/30 transition-all cursor-pointer bg-slate-50/50"
                            >
                                <p className="text-xs font-semibold text-slate-700">
                                    <span className="text-[#00AEEF]">Klik untuk unggah</span> foto driver
                                </p>
                            </div>
                        )}
                    </div>
                </form>
            </Modal>

            {/* 5. EDIT DRIVER MODAL */}
            <Modal
                show={showEditDriverModal}
                onClose={() => setShowEditDriverModal(false)}
                title={`Edit Driver ${selectedDriver ? `(${selectedDriver.full_name})` : ''}`}
                maxWidth="xl"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowEditDriverModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="edit-driver-form-m"
                            disabled={editDriverForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer min-h-[44px]"
                        >
                            {editDriverForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Perbarui Driver</span>
                        </button>
                    </>
                }
            >
                <form id="edit-driver-form-m" onSubmit={handleEditDriverSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editDriverForm.data.full_name}
                                onChange={(e) => editDriverForm.setData('full_name', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                WhatsApp / No. HP <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editDriverForm.data.whatsapp_number}
                                onChange={(e) => editDriverForm.setData('whatsapp_number', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={editDriverForm.data.email}
                                onChange={(e) => editDriverForm.setData('email', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Ganti Password (Opsional)
                            </label>
                            <input
                                type="password"
                                value={editDriverForm.data.password}
                                onChange={(e) => editDriverForm.setData('password', e.target.value)}
                                placeholder="Kosongkan jika tidak diubah"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Nomor SIM <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editDriverForm.data.license_number}
                                onChange={(e) => editDriverForm.setData('license_number', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Masa Berlaku SIM <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={editDriverForm.data.license_expiry_date}
                                onChange={(e) => editDriverForm.setData('license_expiry_date', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                        </div>

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
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Foto Profil (Opsional)
                        </label>
                        <input
                            type="file"
                            ref={editDriverFileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleDriverFileChange(e.target.files[0], true);
                                }
                            }}
                        />

                        {editDriverPhotoPreview || selectedDriver?.profile_photo_url ? (
                            <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-2xl bg-slate-50">
                                <img
                                    src={editDriverPhotoPreview || selectedDriver?.profile_photo_url}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-800 truncate">Foto profil driver</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => editDriverFileInputRef.current?.click()}
                                    className="text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg"
                                >
                                    Ganti
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => editDriverFileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-sky-400 hover:bg-sky-50/30 transition-all cursor-pointer bg-slate-50/50"
                            >
                                <p className="text-xs font-semibold text-slate-700">
                                    <span className="text-[#00AEEF]">Klik untuk unggah</span> foto profil
                                </p>
                            </div>
                        )}
                    </div>
                </form>
            </Modal>

            {/* 6. DELETE DRIVER MODAL */}
            <Modal
                show={showDeleteDriverModal}
                onClose={() => setShowDeleteDriverModal(false)}
                title="Hapus Driver"
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowDeleteDriverModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteDriver}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
                            Hapus Driver
                        </button>
                    </>
                }
            >
                <p className="text-sm text-slate-600">
                    Apakah Anda yakin ingin menghapus driver <strong>{selectedDriver?.full_name}</strong>?
                </p>
            </Modal>

            {/* 7. ADD HOTEL MODAL */}
            <Modal
                show={showAddHotelModal}
                onClose={() => setShowAddHotelModal(false)}
                title="Tambah Hotel Baru"
                maxWidth="xl"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAddHotelModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="add-hotel-form"
                            disabled={addHotelForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer min-h-[44px]"
                        >
                            {addHotelForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Hotel</span>
                        </button>
                    </>
                }
            >
                <form id="add-hotel-form" onSubmit={handleAddHotelSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Nama Hotel / Resort <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={addHotelForm.data.nama_hotel}
                            onChange={(e) => addHotelForm.setData('nama_hotel', e.target.value)}
                            placeholder="Contoh: The Kayon Resort Ubud"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                        />
                        {addHotelForm.errors.nama_hotel && (
                            <p className="text-xs text-red-600 mt-1 font-medium">{addHotelForm.errors.nama_hotel}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Hubungkan ke Destinasi / Wilayah Tarif Bandara
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                            Centang wilayah destinasi yang mencakup area hotel ini:
                        </p>
                        <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                            {airports_list && airports_list.length > 0 ? (
                                airports_list.map((ap) => {
                                    const checked = addHotelForm.data.airport_ids.includes(ap.id);
                                    return (
                                        <label
                                            key={ap.id}
                                            className={`flex items-center gap-3 p-2 rounded-xl transition cursor-pointer ${
                                                checked ? 'bg-sky-50 border border-sky-200/80 text-[#00AEEF]' : 'hover:bg-slate-100 text-slate-700'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                value={ap.id}
                                                checked={checked}
                                                onChange={(e) => {
                                                    const val = ap.id;
                                                    if (e.target.checked) {
                                                        addHotelForm.setData('airport_ids', [...addHotelForm.data.airport_ids, val]);
                                                    } else {
                                                        addHotelForm.setData('airport_ids', addHotelForm.data.airport_ids.filter((id) => id !== val));
                                                    }
                                                }}
                                                className="w-4 h-4 text-[#00AEEF] rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                                            />
                                            <span className="text-xs font-semibold">{ap.label}</span>
                                        </label>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-slate-400 italic">Belum ada daftar destinasi bandara terdaftar.</p>
                            )}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 8. EDIT HOTEL MODAL */}
            <Modal
                show={showEditHotelModal}
                onClose={() => setShowEditHotelModal(false)}
                title={`Edit Hotel (${selectedHotel?.nama_hotel || ''})`}
                maxWidth="xl"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowEditHotelModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="edit-hotel-form"
                            disabled={editHotelForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer min-h-[44px]"
                        >
                            {editHotelForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Perbarui Hotel</span>
                        </button>
                    </>
                }
            >
                <form id="edit-hotel-form" onSubmit={handleEditHotelSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Nama Hotel / Resort <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={editHotelForm.data.nama_hotel}
                            onChange={(e) => editHotelForm.setData('nama_hotel', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                        />
                        {editHotelForm.errors.nama_hotel && (
                            <p className="text-xs text-red-600 mt-1 font-medium">{editHotelForm.errors.nama_hotel}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Hubungkan ke Destinasi / Wilayah Tarif Bandara
                        </label>
                        <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                            {airports_list && airports_list.length > 0 ? (
                                airports_list.map((ap) => {
                                    const checked = editHotelForm.data.airport_ids.includes(ap.id);
                                    return (
                                        <label
                                            key={ap.id}
                                            className={`flex items-center gap-3 p-2 rounded-xl transition cursor-pointer ${
                                                checked ? 'bg-sky-50 border border-sky-200/80 text-[#00AEEF]' : 'hover:bg-slate-100 text-slate-700'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                value={ap.id}
                                                checked={checked}
                                                onChange={(e) => {
                                                    const val = ap.id;
                                                    if (e.target.checked) {
                                                        editHotelForm.setData('airport_ids', [...editHotelForm.data.airport_ids, val]);
                                                    } else {
                                                        editHotelForm.setData('airport_ids', editHotelForm.data.airport_ids.filter((id) => id !== val));
                                                    }
                                                }}
                                                className="w-4 h-4 text-[#00AEEF] rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                                            />
                                            <span className="text-xs font-semibold">{ap.label}</span>
                                        </label>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-slate-400 italic">Belum ada daftar destinasi bandara terdaftar.</p>
                            )}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 9. DELETE HOTEL MODAL */}
            <Modal
                show={showDeleteHotelModal}
                onClose={() => setShowDeleteHotelModal(false)}
                title="Hapus Hotel"
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowDeleteHotelModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteHotel}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
                            Hapus Hotel
                        </button>
                    </>
                }
            >
                <p className="text-sm text-slate-600">
                    Apakah Anda yakin ingin menghapus hotel <strong>{selectedHotel?.nama_hotel}</strong>?
                </p>
            </Modal>

            {/* 10. ADD AIRPORT MODAL */}
            <Modal
                show={showAddAirportModal}
                onClose={() => setShowAddAirportModal(false)}
                title="Tambah Destinasi & Tarif Bandara"
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAddAirportModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="add-airport-form"
                            disabled={addAirportForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer min-h-[44px]"
                        >
                            {addAirportForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Destinasi</span>
                        </button>
                    </>
                }
            >
                <form id="add-airport-form" onSubmit={handleAddAirportSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Nama Destinasi / Wilayah <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={addAirportForm.data.destinasi}
                            onChange={(e) => addAirportForm.setData('destinasi', e.target.value)}
                            placeholder="Contoh: Ubud / Seminyak / Canggu"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                        />
                        {addAirportForm.errors.destinasi && (
                            <p className="text-xs text-red-600 mt-1 font-medium">{addAirportForm.errors.destinasi}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Tipe Transfer Bandara <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={addAirportForm.data.type}
                            onChange={(e) => addAirportForm.setData('type', e.target.value)}
                            className={selectClass}
                        >
                            <option value="Pick-Up">Pick-Up (Penjemputan dari Bandara DPS)</option>
                            <option value="Drop-Off">Drop-Off (Pengantaran menuju Bandara DPS)</option>
                        </select>
                        {addAirportForm.errors.type && (
                            <p className="text-xs text-red-600 mt-1 font-medium">{addAirportForm.errors.type}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Tarif Regular (Rp) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="5000"
                                value={addAirportForm.data.price_regular}
                                onChange={(e) => addAirportForm.setData('price_regular', e.target.value)}
                                placeholder="Contoh: 350000"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {addAirportForm.errors.price_regular && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addAirportForm.errors.price_regular}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Tarif Luxury (Rp) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="5000"
                                value={addAirportForm.data.price_luxury}
                                onChange={(e) => addAirportForm.setData('price_luxury', e.target.value)}
                                placeholder="Contoh: 650000"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {addAirportForm.errors.price_luxury && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addAirportForm.errors.price_luxury}</p>
                            )}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 11. EDIT AIRPORT MODAL */}
            <Modal
                show={showEditAirportModal}
                onClose={() => setShowEditAirportModal(false)}
                title={`Edit Destinasi (${selectedAirport?.destinasi || ''})`}
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowEditAirportModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="edit-airport-form"
                            disabled={editAirportForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer min-h-[44px]"
                        >
                            {editAirportForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Perbarui Destinasi</span>
                        </button>
                    </>
                }
            >
                <form id="edit-airport-form" onSubmit={handleEditAirportSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Nama Destinasi / Wilayah <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={editAirportForm.data.destinasi}
                            onChange={(e) => editAirportForm.setData('destinasi', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                            Tipe Transfer Bandara <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={editAirportForm.data.type}
                            onChange={(e) => editAirportForm.setData('type', e.target.value)}
                            className={selectClass}
                        >
                            <option value="Pick-Up">Pick-Up (Penjemputan dari Bandara DPS)</option>
                            <option value="Drop-Off">Drop-Off (Pengantaran menuju Bandara DPS)</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Tarif Regular (Rp) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="5000"
                                value={editAirportForm.data.price_regular}
                                onChange={(e) => editAirportForm.setData('price_regular', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Tarif Luxury (Rp) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="5000"
                                value={editAirportForm.data.price_luxury}
                                onChange={(e) => editAirportForm.setData('price_luxury', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 12. DELETE AIRPORT MODAL */}
            <Modal
                show={showDeleteAirportModal}
                onClose={() => setShowDeleteAirportModal(false)}
                title="Hapus Destinasi"
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowDeleteAirportModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteAirport}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
                            Hapus Destinasi
                        </button>
                    </>
                }
            >
                <p className="text-sm text-slate-600">
                    Apakah Anda yakin ingin menghapus destinasi <strong>{selectedAirport?.destinasi} ({selectedAirport?.type})</strong>?
                </p>
            </Modal>

            {/* 13. ADD HOTEL PRICELIST MODAL */}
            <Modal
                show={showAddHotelPriceModal}
                onClose={() => setShowAddHotelPriceModal(false)}
                title="Tambah Tarif Transfer Antar Hotel"
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAddHotelPriceModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="add-hotel-price-form"
                            disabled={addHotelPriceForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer min-h-[44px]"
                        >
                            {addHotelPriceForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Tarif Rute</span>
                        </button>
                    </>
                }
            >
                <form id="add-hotel-price-form" onSubmit={handleAddHotelPriceSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Hotel Asal (Pick-Up) <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={addHotelPriceForm.data.hotel_id_pickup}
                                onChange={(e) => addHotelPriceForm.setData('hotel_id_pickup', e.target.value)}
                                className={selectClass}
                                required
                            >
                                <option value="">-- Pilih Hotel Asal --</option>
                                {hotels_list.map((h) => (
                                    <option key={h.id} value={h.id}>
                                        {h.name}
                                    </option>
                                ))}
                            </select>
                            {addHotelPriceForm.errors.hotel_id_pickup && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addHotelPriceForm.errors.hotel_id_pickup}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Hotel Tujuan (Drop-Off) <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={addHotelPriceForm.data.hotel_id_dropoff}
                                onChange={(e) => addHotelPriceForm.setData('hotel_id_dropoff', e.target.value)}
                                className={selectClass}
                                required
                            >
                                <option value="">-- Pilih Hotel Tujuan --</option>
                                {hotels_list.map((h) => (
                                    <option key={h.id} value={h.id}>
                                        {h.name}
                                    </option>
                                ))}
                            </select>
                            {addHotelPriceForm.errors.hotel_id_dropoff && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addHotelPriceForm.errors.hotel_id_dropoff}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Tarif Regular (Rp) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="10000"
                                value={addHotelPriceForm.data.regular_price}
                                onChange={(e) => addHotelPriceForm.setData('regular_price', e.target.value)}
                                placeholder="Contoh: 400000"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {addHotelPriceForm.errors.regular_price && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addHotelPriceForm.errors.regular_price}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Tarif Luxury (Rp) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="10000"
                                value={addHotelPriceForm.data.luxury_price}
                                onChange={(e) => addHotelPriceForm.setData('luxury_price', e.target.value)}
                                placeholder="Contoh: 750000"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {addHotelPriceForm.errors.luxury_price && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{addHotelPriceForm.errors.luxury_price}</p>
                            )}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 14. EDIT HOTEL PRICELIST MODAL */}
            <Modal
                show={showEditHotelPriceModal}
                onClose={() => setShowEditHotelPriceModal(false)}
                title="Edit Tarif Transfer Antar Hotel"
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowEditHotelPriceModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="edit-hotel-price-form"
                            disabled={editHotelPriceForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer min-h-[44px]"
                        >
                            {editHotelPriceForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Perbarui Tarif Rute</span>
                        </button>
                    </>
                }
            >
                <form id="edit-hotel-price-form" onSubmit={handleEditHotelPriceSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Hotel Asal (Pick-Up) <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={editHotelPriceForm.data.hotel_id_pickup}
                                onChange={(e) => editHotelPriceForm.setData('hotel_id_pickup', e.target.value)}
                                className={selectClass}
                                required
                            >
                                <option value="">-- Pilih Hotel Asal --</option>
                                {hotels_list.map((h) => (
                                    <option key={h.id} value={h.id}>
                                        {h.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Hotel Tujuan (Drop-Off) <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={editHotelPriceForm.data.hotel_id_dropoff}
                                onChange={(e) => editHotelPriceForm.setData('hotel_id_dropoff', e.target.value)}
                                className={selectClass}
                                required
                            >
                                <option value="">-- Pilih Hotel Tujuan --</option>
                                {hotels_list.map((h) => (
                                    <option key={h.id} value={h.id}>
                                        {h.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Tarif Regular (Rp) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="10000"
                                value={editHotelPriceForm.data.regular_price}
                                onChange={(e) => editHotelPriceForm.setData('regular_price', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Tarif Luxury (Rp) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="10000"
                                value={editHotelPriceForm.data.luxury_price}
                                onChange={(e) => editHotelPriceForm.setData('luxury_price', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 15. DELETE HOTEL PRICELIST MODAL */}
            <Modal
                show={showDeleteHotelPriceModal}
                onClose={() => setShowDeleteHotelPriceModal(false)}
                title="Hapus Tarif Transfer Hotel"
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowDeleteHotelPriceModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteHotelPrice}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
                            Hapus Tarif
                        </button>
                    </>
                }
            >
                <p className="text-sm text-slate-600">
                    Apakah Anda yakin ingin menghapus tarif rute transfer dari <strong>{selectedHotelPrice?.pickup_hotel_name}</strong> ke <strong>{selectedHotelPrice?.dropoff_hotel_name}</strong>?
                </p>
            </Modal>
        </AdminLayout>
    );
}
