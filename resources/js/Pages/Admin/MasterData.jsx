import React, { useState, useRef } from 'react';
import { useForm, router, usePage, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';

const inputBaseClass = "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition";
const selectBaseClass = "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2364748b%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.22%208.22a.75.75%200%200%201%201.06%200L10%2011.94l3.72-3.72a.75.75%200%201%201%201.06%201.06l-4.25%204.25a.75.75%200%200%201-1.06%200L5.22%209.28a.75.75%200%200%201%200-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10";

export default function MasterData({
    active_tab = 'vehicles',
    vehicles = [],
    vehicle_categories = [],
    vehicle_units = [],
    packages = [],
    package_types = [],
    package_duration_types = [],
    drivers = { data: [], links: [] },
    hotels = [],
    airports = [],
    hotel_transfer_price_lists = [],
    hotels_list = [],
    airports_list = [],
    stats = {},
    filters = {},
}) {
    const { flash = {} } = usePage().props;
    const [currentTab, setCurrentTab] = useState(active_tab || 'vehicles');

    // -------------------------------------------------------------------------
    // TAB 1: VEHICLES (Showcase Fleet)
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
        passenger_capacity: 6,
        luggage_capacity: 4,
        photo: null,
        description: '',
        key_features: [''],
        ac_info: '',
    });

    const editVehicleForm = useForm({
        _method: 'put',
        name: '',
        category: '',
        model: '',
        passenger_capacity: 1,
        luggage_capacity: 0,
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
            passenger_capacity: vehicle.passenger_capacity || 6,
            luggage_capacity: vehicle.luggage_capacity || 4,
            photo: null,
            description: vehicle.description || '',
            key_features: vehicle.key_features && vehicle.key_features.length > 0 ? vehicle.key_features : [''],
            ac_info: vehicle.ac_info || '',
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
    // -------------------------------------------------------------------------
    // TAB: VEHICLE UNITS (Kategori Kendaraan)
    // -------------------------------------------------------------------------
    const [vehicleUnitSearch, setVehicleUnitSearch] = useState('');
    const [showAddVehicleUnitModal, setShowAddVehicleUnitModal] = useState(false);
    const [showEditVehicleUnitModal, setShowEditVehicleUnitModal] = useState(false);
    const [showDeleteVehicleUnitModal, setShowDeleteVehicleUnitModal] = useState(false);
    const [selectedVehicleUnit, setSelectedVehicleUnit] = useState(null);

    const addVehicleUnitForm = useForm({
        category: 'Regular Family SUV',
        passenger_capacity: 6,
    });

    const editVehicleUnitForm = useForm({
        category: 'Regular Family SUV',
        passenger_capacity: 6,
    });

    const handleAddVehicleUnitSubmit = (e) => {
        e.preventDefault();
        addVehicleUnitForm.post('/admin/vehicle-units', {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddVehicleUnitModal(false);
                addVehicleUnitForm.reset({
                    category: 'Regular Family SUV',
                    passenger_capacity: 6,
                });
            },
        });
    };

    const openEditVehicleUnitModal = (unit) => {
        setSelectedVehicleUnit(unit);
        editVehicleUnitForm.clearErrors();
        editVehicleUnitForm.setData({
            category: unit.category || 'Regular Family SUV',
            passenger_capacity: unit.passenger_capacity || 6,
        });
        setShowEditVehicleUnitModal(true);
    };

    const handleEditVehicleUnitSubmit = (e) => {
        e.preventDefault();
        if (!selectedVehicleUnit) return;
        editVehicleUnitForm.put(`/admin/vehicle-units/${selectedVehicleUnit.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowEditVehicleUnitModal(false);
                editVehicleUnitForm.reset();
                setSelectedVehicleUnit(null);
            },
        });
    };

    const openDeleteVehicleUnitModal = (unit) => {
        setSelectedVehicleUnit(unit);
        setShowDeleteVehicleUnitModal(true);
    };

    const handleDeleteVehicleUnit = () => {
        if (!selectedVehicleUnit) return;
        router.delete(`/admin/vehicle-units/${selectedVehicleUnit.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteVehicleUnitModal(false);
                setSelectedVehicleUnit(null);
            },
        });
    };

    const filteredVehicleUnits = (vehicle_units || []).filter((unit) => {
        const query = vehicleUnitSearch.trim().toLowerCase();
        return !query || unit.category?.toLowerCase().includes(query);
    });

    // -------------------------------------------------------------------------
    // TAB 2: PACKAGES (Day Tour Management)
    // -------------------------------------------------------------------------
    const [packageSearch, setPackageSearch] = useState(filters.search_package || '');
    const [selectedPackageType, setSelectedPackageType] = useState(filters.type_package || 'all');
    const [selectedPackageDuration, setSelectedPackageDuration] = useState(filters.duration_package || 'all');
    const [showAddPackageModal, setShowAddPackageModal] = useState(false);
    const [showEditPackageModal, setShowEditPackageModal] = useState(false);
    const [showDeletePackageModal, setShowDeletePackageModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [addPackagePhotoPreview, setAddPackagePhotoPreview] = useState(null);
    const [editPackagePhotoPreview, setEditPackagePhotoPreview] = useState(null);
    const addPackageFileInputRef = useRef(null);
    const editPackageFileInputRef = useRef(null);

    const addPackageForm = useForm({
        name: '',
        subtitle: '',
        description: '',
        package_type: package_types[0] || 'Ubud',
        duration_type: package_duration_types[1] || 'Full Day',
        regular_price: '',
        luxury_price: '',
        big_van_price: '',
        unit_prices: {},
        hero_image: null,
        highlights: [{ title: '', description: '' }],
    });

    const editPackageForm = useForm({
        _method: 'put',
        name: '',
        subtitle: '',
        description: '',
        package_type: 'Ubud',
        duration_type: 'Full Day',
        regular_price: '',
        luxury_price: '',
        big_van_price: '',
        unit_prices: {},
        hero_image: null,
        highlights: [],
    });

    const handlePackageFilterSubmit = (e) => {
        e.preventDefault();
        router.get(
            '/admin/master-data',
            {
                tab: 'packages',
                search_package: packageSearch,
                type_package: selectedPackageType,
                duration_package: selectedPackageDuration,
            },
            { preserveState: true, replace: true }
        );
    };

    const handlePackagePhotoChange = (file, isEdit = false) => {
        if (!file) return;
        if (isEdit) {
            editPackageForm.setData('hero_image', file);
            setEditPackagePhotoPreview(URL.createObjectURL(file));
        } else {
            addPackageForm.setData('hero_image', file);
            setAddPackagePhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleAddPackageSubmit = (e) => {
        e.preventDefault();
        addPackageForm.post('/admin/packages', {
            forceFormData: true,
            onSuccess: () => {
                setShowAddPackageModal(false);
                addPackageForm.reset();
                setAddPackagePhotoPreview(null);
            },
        });
    };

    const openEditPackageModal = (pkg) => {
        setSelectedPackage(pkg);
        editPackageForm.setData({
            _method: 'put',
            name: pkg.name || '',
            subtitle: pkg.subtitle || '',
            description: pkg.description || '',
            package_type: pkg.package_type || 'Ubud',
            duration_type: pkg.duration_type || 'Full Day',
            regular_price: pkg.regular_price || '',
            luxury_price: pkg.luxury_price || '',
            big_van_price: pkg.big_van_price || '',
            unit_prices: pkg.unit_prices || {},
            hero_image: null,
            highlights: pkg.highlights && pkg.highlights.length > 0
                ? pkg.highlights.map(h => ({ title: h.title || '', description: h.description || '' }))
                : [{ title: '', description: '' }],
        });
        setEditPackagePhotoPreview(pkg.hero_image || null);
        setShowEditPackageModal(true);
    };

    const handleEditPackageSubmit = (e) => {
        e.preventDefault();
        if (!selectedPackage) return;
        editPackageForm.post(`/admin/packages/${selectedPackage.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setShowEditPackageModal(false);
                editPackageForm.reset();
                setEditPackagePhotoPreview(null);
                setSelectedPackage(null);
            },
        });
    };

    const openDeletePackageModal = (pkg) => {
        setSelectedPackage(pkg);
        setShowDeletePackageModal(true);
    };

    const handleDeletePackage = () => {
        if (!selectedPackage) return;
        router.delete(`/admin/packages/${selectedPackage.id}`, {
            onSuccess: () => {
                setShowDeletePackageModal(false);
                setSelectedPackage(null);
            },
        });
    };

    // -------------------------------------------------------------------------
    // TAB 3: DRIVERS
    // -------------------------------------------------------------------------
    const [driverSearch, setDriverSearch] = useState(filters.search_driver || '');
    const [showAddDriverModal, setShowAddDriverModal] = useState(false);
    const [showEditDriverModal, setShowEditDriverModal] = useState(false);
    const [showDeleteDriverModal, setShowDeleteDriverModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [addDriverPhotoPreview, setAddDriverPhotoPreview] = useState(null);
    const [editDriverPhotoPreview, setEditDriverPhotoPreview] = useState(null);
    const [showAddDriverPassword, setShowAddDriverPassword] = useState(false);
    const [showEditDriverPassword, setShowEditDriverPassword] = useState(false);
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
        setShowEditDriverPassword(false);
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
    // TAB 4: HOTELS
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
    // TAB 5: AIRPORTS / DESTINASI BANDARA
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
        unit_prices: {},
    });

    const editAirportForm = useForm({
        _method: 'put',
        destinasi: '',
        type: 'Pick-Up',
        price_regular: '',
        price_luxury: '',
        unit_prices: {},
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
            unit_prices: airport.unit_prices || {},
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
    // TAB 6: HOTEL PRICELISTS
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
        unit_prices: {},
    });

    const editHotelPriceForm = useForm({
        _method: 'put',
        hotel_id_pickup: '',
        hotel_id_dropoff: '',
        regular_price: '',
        luxury_price: '',
        unit_prices: {},
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
            alert('Hotel tujuan tidak boleh sama dengan hotel asal.');
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
            unit_prices: item.unit_prices || {},
        });
        setShowEditHotelPriceModal(true);
    };

    const handleEditHotelPriceSubmit = (e) => {
        e.preventDefault();
        if (!selectedHotelPrice) return;
        if (editHotelPriceForm.data.hotel_id_pickup === editHotelPriceForm.data.hotel_id_dropoff) {
            alert('Hotel tujuan tidak boleh sama dengan hotel asal.');
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

    const renderPagination = (paginatedData) => {
        if (!paginatedData || paginatedData.total === 0) return null;
        const { from, to, total, links = [] } = paginatedData;

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-slate-50/50 border-t border-slate-200/80 gap-4">
                <div className="text-xs text-slate-500 font-medium">
                    Menampilkan <span className="font-semibold text-slate-900">{from}</span>&ndash;<span className="font-semibold text-slate-900">{to}</span> dari <span className="font-semibold text-slate-900">{total}</span> data
                </div>

                <div className="flex items-center gap-1">
                    {links.map((link, idx) => {
                        let label = link.label;
                        if (label.includes('&laquo;') || label.includes('Previous')) label = 'Sebelumnya';
                        else if (label.includes('&raquo;') || label.includes('Next')) label = 'Berikutnya';

                        if (!link.url) {
                            return (
                                <span
                                    key={idx}
                                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-400 bg-slate-50 cursor-not-allowed"
                                    dangerouslySetInnerHTML={{ __html: label }}
                                />
                            );
                        }

                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => router.visit(link.url, { preserveState: true })}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                                    link.active
                                        ? 'bg-slate-900 text-white font-semibold'
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

    const tabs = [
        {
            id: 'vehicles',
            label: 'Armada Mobil',
            sublabel: 'Showcase',
            count: stats.total_vehicles ?? vehicles.length,
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 11 2 11.3V16c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <path d="M9 17h6" />
                    <circle cx="17" cy="17" r="2" />
                </svg>
            ),
        },
        {
            id: 'vehicle_units',
            label: 'Unit Kendaraan',
            sublabel: 'Plat Nomor',
            count: stats.total_vehicle_units ?? vehicle_units.length,
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                    <circle cx="7" cy="15" r="1" />
                    <circle cx="17" cy="15" r="1" />
                </svg>
            ),
        },
        {
            id: 'packages',
            label: 'Paket Day Tour',
            sublabel: 'Wisata Bali',
            count: stats.total_packages ?? packages.length,
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
            ),
        },
        {
            id: 'drivers',
            label: 'Pengemudi',
            sublabel: 'Supir & Unit',
            count: stats.total_drivers ?? 0,
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
        },
        {
            id: 'hotels',
            label: 'Hotel & Resort',
            sublabel: 'Akomodasi',
            count: stats.total_hotels ?? hotels.length,
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                    <path d="M10 6h4" />
                    <path d="M10 10h4" />
                    <path d="M10 14h4" />
                    <path d="M10 18h4" />
                </svg>
            ),
        },
        {
            id: 'airports',
            label: 'Tarif Bandara',
            sublabel: 'Transfer Drop/Pick',
            count: stats.total_airports ?? airports.length,
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </svg>
            ),
        },
        {
            id: 'hotel_transfer_price_lists',
            label: 'Tarif Antar Hotel',
            sublabel: 'Point to Point',
            count: stats.total_hotel_pricelists ?? hotel_transfer_price_lists.length,
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m16 3 4 4-4 4" />
                    <path d="M20 7H4" />
                    <path d="m8 21-4-4 4-4" />
                    <path d="M4 17h16" />
                </svg>
            ),
        },
    ];

    return (
        <AdminLayout title="Master Data">
            <Head title="Master Data - Bali Family Safe Admin" />

            <div className="space-y-6 max-w-[1280px]">
                {/* Flash Message */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in duration-150">
                        <svg className="w-5 h-5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in duration-150">
                        <svg className="w-5 h-5 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Page Header & Symmetrical 6-Grid Card Navigation */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-5">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                            Master Data
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Kelola database armada showcase, paket wisata day tour, pengemudi, hotel, tarif bandara, dan tarif antar hotel.
                        </p>
                    </div>

                    {/* Symmetrical Balanced Responsive Grid: 6 cols (lg), 3 cols (sm/md), 2 cols (mobile) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                        {tabs.map((tab) => {
                            const isActive = currentTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => {
                                        setCurrentTab(tab.id);
                                        router.get('/admin/master-data', { tab: tab.id }, { preserveState: true, replace: true });
                                    }}
                                    className={`p-3 rounded-xl text-left transition duration-150 flex flex-col justify-between gap-2.5 cursor-pointer relative ${
                                        isActive
                                            ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900'
                                            : 'bg-slate-50/70 hover:bg-slate-100/90 text-slate-700 border border-slate-200/80 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-1 w-full">
                                        <div className={`p-1.5 rounded-lg ${
                                            isActive
                                                ? 'bg-white/15 text-white'
                                                : 'bg-white text-slate-600 shadow-2xs border border-slate-200/60'
                                        }`}>
                                            {tab.icon}
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold tabular-nums ${
                                            isActive
                                                ? 'bg-[#00AEEF] text-white'
                                                : 'bg-white text-slate-700 border border-slate-200/60 shadow-2xs'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    </div>

                                    <div>
                                        <span className={`block text-xs font-bold leading-tight ${
                                            isActive ? 'text-white' : 'text-slate-900'
                                        }`}>
                                            {tab.label}
                                        </span>
                                        <span className={`block text-[10px] mt-0.5 leading-none ${
                                            isActive ? 'text-slate-300' : 'text-slate-400'
                                        }`}>
                                            {tab.sublabel}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ================================================================= */}
                {/* TAB 1: VEHICLES (Our Cars Showcase)                               */}
                {/* ================================================================= */}
                {currentTab === 'vehicles' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Armada Mobil Showcase (Our Cars)</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Daftar mobil yang ditampilkan pada galeri Our Cars website. Pelanggan memilih jenis kendaraan berdasarkan 3 tier: <strong>Regular</strong>, <strong>Luxury</strong>, dan <strong>Big Van</strong>.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addVehicleForm.reset();
                                        setAddVehiclePhotoPreview(null);
                                        setShowAddVehicleModal(true);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer shrink-0"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                                            placeholder="Cari nama atau model mobil..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] min-h-[40px]"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="11" cy="11" r="8" />
                                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-60">
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
                                            className={selectBaseClass}
                                        >
                                            <option value="all">Semua Kategori Tier</option>
                                            {(vehicle_units || []).map((unit) => (
                                                <option key={unit.id} value={unit.category}>
                                                    {unit.category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer min-h-[40px]"
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
                                        className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:border-slate-300 transition shadow-2xs"
                                    >
                                        <div>
                                            <div className="relative aspect-16/10 bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-100">
                                                {v.photo_url ? (
                                                    <img
                                                        src={v.photo_url}
                                                        alt={v.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2 text-center p-4">
                                                        <svg className="w-8 h-8 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                                            <circle cx="7" cy="17" r="2" />
                                                            <path d="M9 17h6" />
                                                            <circle cx="17" cy="17" r="2" />
                                                        </svg>
                                                        <span className="text-xs font-medium">Foto belum diunggah</span>
                                                    </div>
                                                )}

                                                <div className="absolute top-3 left-3">
                                                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                                                        v.tier === 'Luxury'
                                                            ? 'bg-slate-900 text-white'
                                                            : v.tier === 'Big Van'
                                                            ? 'bg-indigo-950 text-white'
                                                            : 'bg-slate-800 text-white'
                                                    }`}>
                                                        {v.tier}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-5 space-y-3">
                                                <div>
                                                    <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                                                        {v.category}
                                                    </span>
                                                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                                                        {v.name}
                                                    </h3>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Kapasitas</span>
                                                        <span className="font-semibold text-slate-800">{v.passenger_capacity} Penumpang</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Bagasi</span>
                                                        <span className="font-semibold text-slate-800">{v.luggage_capacity} Koper</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Model / Tahun</span>
                                                        <span className="font-semibold text-slate-800">{v.model}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Unit Terdaftar</span>
                                                        <span className="font-semibold text-slate-800">{v.units_count} Unit</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditVehicleModal(v)}
                                                className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openDeleteVehicleModal(v)}
                                                className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
                                <h3 className="text-base font-bold text-slate-700">Belum ada armada mobil</h3>
                                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                    Klik tombol Tambah Mobil untuk mendaftarkan jenis kendaraan showcase.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* ================================================================= */}
                {/* TAB: VEHICLE UNITS (Plat Nomor Kendaraan)                         */}
                {/* ================================================================= */}
                {currentTab === 'vehicle_units' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Kategori Kendaraan</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Kelola kategori kendaraan yang tersedia (Regular, Luxury, Big Van) beserta kapasitas maksimal penumpang. Driver akan menyesuaikan dengan kategori yang dipesan tamu.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addVehicleUnitForm.reset();
                                        addVehicleUnitForm.clearErrors();
                                        addVehicleUnitForm.setData({
                                            category: 'Regular Family SUV',
                                            passenger_capacity: 6,
                                        });
                                        setShowAddVehicleUnitModal(true);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer shrink-0"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    <span>Tambah Kategori</span>
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                                    <div className="relative flex-1 max-w-sm">
                                        <input
                                            type="text"
                                            placeholder="Cari kategori kendaraan..."
                                            value={vehicleUnitSearch}
                                            onChange={(e) => setVehicleUnitSearch(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition"
                                        />
                                        <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="11" cy="11" r="8" />
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500 shrink-0">
                                    Total: <span className="font-bold text-slate-900">{filteredVehicleUnits.length}</span> kategori
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Units Table */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="px-6 py-3.5">Kategori</th>
                                            <th className="px-6 py-3.5">Kapasitas Maksimal</th>
                                            <th className="px-6 py-3.5 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                        {filteredVehicleUnits && filteredVehicleUnits.length > 0 ? (
                                            filteredVehicleUnits.map((unit) => (
                                                <tr key={unit.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-900 text-sm">
                                                            {unit.category || '-'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-slate-700 font-medium text-xs">
                                                            {unit.passenger_capacity || 4} Penumpang
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditVehicleUnitModal(unit)}
                                                                className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openDeleteVehicleUnitModal(unit)}
                                                                className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-xs">
                                                    Belum ada kategori kendaraan terdaftar.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================================================================= */}
                {/* TAB 2: PACKAGES (Day Tour Management)                            */}
                {/* ================================================================= */}
                {currentTab === 'packages' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Kelola Paket Wisata Day Tour</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Kelola katalog paket day tour Bali, foto utama, deskripsi penjelasan, highlight destinasi, dan tarif per tier kendaraan (Regular, Luxury, Big Van).
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addPackageForm.reset();
                                        setAddPackagePhotoPreview(null);
                                        setShowAddPackageModal(true);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer shrink-0"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    <span>Tambah Paket Tour</span>
                                </button>
                            </div>

                            <form onSubmit={handlePackageFilterSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                                    <div className="relative flex-1 max-w-md">
                                        <input
                                            type="text"
                                            value={packageSearch}
                                            onChange={(e) => setPackageSearch(e.target.value)}
                                            placeholder="Cari nama paket, wilayah, atau deskripsi..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] min-h-[40px]"
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
                                            value={selectedPackageType}
                                            onChange={(e) => {
                                                setSelectedPackageType(e.target.value);
                                                router.get(
                                                    '/admin/master-data',
                                                    {
                                                        tab: 'packages',
                                                        search_package: packageSearch,
                                                        type_package: e.target.value,
                                                        duration_package: selectedPackageDuration,
                                                    },
                                                    { preserveState: true, replace: true }
                                                );
                                            }}
                                            className={selectBaseClass}
                                        >
                                            <option value="all">Semua Wilayah</option>
                                            {package_types.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-full sm:w-48">
                                        <select
                                            value={selectedPackageDuration}
                                            onChange={(e) => {
                                                setSelectedPackageDuration(e.target.value);
                                                router.get(
                                                    '/admin/master-data',
                                                    {
                                                        tab: 'packages',
                                                        search_package: packageSearch,
                                                        type_package: selectedPackageType,
                                                        duration_package: e.target.value,
                                                    },
                                                    { preserveState: true, replace: true }
                                                );
                                            }}
                                            className={selectBaseClass}
                                        >
                                            <option value="all">Semua Durasi</option>
                                            {package_duration_types.map((dur) => (
                                                <option key={dur} value={dur}>{dur}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer min-h-[40px]"
                                >
                                    Filter
                                </button>
                            </form>
                        </div>

                        {/* Packages Grid */}
                        {packages && packages.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {packages.map((pkg) => (
                                    <div
                                        key={pkg.id}
                                        className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition duration-200"
                                    >
                                        <div>
                                            <div className="relative aspect-16/10 bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-100">
                                                {pkg.hero_image ? (
                                                    <img
                                                        src={pkg.hero_image}
                                                        alt={pkg.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2 text-center p-4">
                                                        <svg className="w-8 h-8 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                                                            <path d="m3.6 9 16.8 0" />
                                                            <path d="M3.6 15h16.8" />
                                                            <path d="M11.5 3a17 17 0 0 0 0 18" />
                                                            <path d="M12.5 3a17 17 0 0 1 0 18" />
                                                        </svg>
                                                        <span className="text-xs font-medium text-slate-400">Foto paket belum diunggah</span>
                                                    </div>
                                                )}

                                                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                                                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-slate-900/90 text-white shadow-xs">
                                                        {pkg.package_type}
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-[#00AEEF] text-white shadow-xs">
                                                        {pkg.duration_type}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-5 space-y-3.5">
                                                <div>
                                                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                                                        {pkg.name}
                                                    </h3>
                                                    {pkg.subtitle && (
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                                            {pkg.subtitle}
                                                        </p>
                                                    )}
                                                </div>

                                                {pkg.description && (
                                                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                                        {pkg.description}
                                                    </p>
                                                )}

                                                {/* Tier Rates Breakdown - Clean Structured List */}
                                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 space-y-2">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                                            <span className="font-semibold text-slate-600 text-[11px] uppercase tracking-wider">Regular</span>
                                                        </div>
                                                        <span className="font-bold text-slate-900 tabular-nums whitespace-nowrap">{pkg.regular_price_formatted}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs border-t border-slate-200/60 pt-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                            <span className="font-semibold text-slate-600 text-[11px] uppercase tracking-wider">Luxury</span>
                                                        </div>
                                                        <span className="font-bold text-slate-900 tabular-nums whitespace-nowrap">{pkg.luxury_price_formatted}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs border-t border-slate-200/60 pt-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-[#00AEEF]"></span>
                                                            <span className="font-semibold text-slate-600 text-[11px] uppercase tracking-wider">Big Van</span>
                                                        </div>
                                                        <span className="font-bold text-slate-900 tabular-nums whitespace-nowrap">{pkg.big_van_price_formatted}</span>
                                                    </div>
                                                </div>

                                                {/* Highlights preview */}
                                                {pkg.highlights && pkg.highlights.length > 0 && (
                                                    <div className="pt-1">
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                                                            Itinerary Destinasi ({pkg.highlights.length})
                                                        </span>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {pkg.highlights.map((h, hIdx) => (
                                                                <span key={h.id || hIdx} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/50 truncate max-w-[220px]">
                                                                    {h.title}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-3.5 px-5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditPackageModal(pkg)}
                                                className="px-3.5 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openDeletePackageModal(pkg)}
                                                className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
                                <h3 className="text-base font-bold text-slate-700">Belum ada paket wisata</h3>
                                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                    Klik tombol Tambah Paket Tour untuk mendaftarkan rute tour wisata baru.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* ================================================================= */}
                {/* TAB 3: DRIVERS                                                   */}
                {/* ================================================================= */}
                {currentTab === 'drivers' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Data Pengemudi & Driver</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Kelola akun pengemudi, kontak WhatsApp, nomor SIM, dan unit armada yang ditugaskan.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addDriverForm.reset();
                                        setAddDriverPhotoPreview(null);
                                        setShowAddDriverModal(true);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer shrink-0"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    <span>Tambah Driver</span>
                                </button>
                            </div>

                            <form onSubmit={handleDriverSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                <div className="relative flex-1 max-w-md">
                                    <input
                                        type="text"
                                        value={driverSearch}
                                        onChange={(e) => setDriverSearch(e.target.value)}
                                        placeholder="Cari nama, WhatsApp, email, atau no SIM..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] min-h-[40px]"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="11" cy="11" r="8" />
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer min-h-[40px]"
                                >
                                    Cari Driver
                                </button>
                            </form>
                        </div>

                        {/* Driver Table */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="px-6 py-3.5">ID & Driver</th>
                                            <th className="px-6 py-3.5">Kontak</th>
                                            <th className="px-6 py-3.5">Lisensi (SIM)</th>
                                            <th className="px-6 py-3.5">Status</th>
                                            <th className="px-6 py-3.5 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                        {drivers.data && drivers.data.length > 0 ? (
                                            drivers.data.map((driver) => (
                                                <tr key={driver.raw_id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                                                                {driver.profile_photo_url ? (
                                                                    <img src={driver.profile_photo_url} alt={driver.full_name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <span className="font-semibold text-xs text-slate-600">{driver.full_name?.charAt(0) || 'D'}</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <span className="font-mono text-[10px] text-slate-400 block">#{driver.id}</span>
                                                                <span className="font-bold text-slate-900 text-sm block">{driver.full_name}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-0.5">
                                                            {driver.whatsapp_number && (
                                                                <a
                                                                    href={`https://wa.me/${driver.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-slate-800 font-semibold hover:text-[#00AEEF] block"
                                                                >
                                                                    {driver.whatsapp_number}
                                                                </a>
                                                            )}
                                                            <span className="text-slate-400 text-[11px] block">{driver.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-0.5">
                                                            <span className="font-mono font-medium text-slate-800">{driver.license_number || '-'}</span>
                                                            {driver.license_expiry_date && (
                                                                <span className="text-[10px] text-slate-400 block">Exp: {driver.license_expiry_date}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                                            driver.status === 'Active'
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                        }`}>
                                                            {driver.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditDriverModal(driver)}
                                                                className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openDeleteDriverModal(driver)}
                                                                className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                                                    Belum ada data pengemudi terdaftar.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Driver List */}
                            <div className="block lg:hidden divide-y divide-slate-100">
                                {drivers.data && drivers.data.length > 0 ? (
                                    drivers.data.map((driver) => (
                                        <div key={driver.raw_id} className="p-4 space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                                                        {driver.profile_photo_url ? (
                                                            <img src={driver.profile_photo_url} alt={driver.full_name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="font-semibold text-xs text-slate-600">{driver.full_name?.charAt(0) || 'D'}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-900 text-sm block">{driver.full_name}</span>
                                                        <span className="text-xs text-slate-400">{driver.email}</span>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                    driver.status === 'Active'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                }`}>
                                                    {driver.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditDriverModal(driver)}
                                                    className="px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openDeleteDriverModal(driver)}
                                                    className="px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-8 text-center text-slate-400 text-sm">
                                        Belum ada data pengemudi terdaftar.
                                    </div>
                                )}
                            </div>

                            {renderPagination(drivers)}
                        </div>
                    </div>
                )}

                {/* ================================================================= */}
                {/* TAB 4: HOTELS                                                    */}
                {/* ================================================================= */}
                {currentTab === 'hotels' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Database Hotel & Resort Bali</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Kelola daftar hotel mitra dan sinkronisasi rute destinasi transfer bandara terkait.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addHotelForm.reset();
                                        setShowAddHotelModal(true);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer shrink-0"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    <span>Tambah Hotel</span>
                                </button>
                            </div>

                            <form onSubmit={handleHotelSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                <div className="relative flex-1 max-w-md">
                                    <input
                                        type="text"
                                        value={hotelSearch}
                                        onChange={(e) => setHotelSearch(e.target.value)}
                                        placeholder="Cari nama hotel atau resort..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] min-h-[40px]"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="11" cy="11" r="8" />
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer min-h-[40px]"
                                >
                                    Cari Hotel
                                </button>
                            </form>
                        </div>

                        {/* Hotel Table */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="px-6 py-3.5">Nama Hotel & Resort</th>
                                            <th className="px-6 py-3.5">Rute Destinasi Bandara Terhubung</th>
                                            <th className="px-6 py-3.5">Tanggal Dibuat</th>
                                            <th className="px-6 py-3.5 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                        {hotels && hotels.length > 0 ? (
                                            hotels.map((hotel) => (
                                                <tr key={hotel.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-slate-900 text-sm">{hotel.nama_hotel}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {hotel.airports && hotel.airports.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1.5 max-w-md">
                                                                {hotel.airports.map((ap) => (
                                                                    <span key={ap.id} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                                                        {ap.destinasi} ({ap.type})
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 italic">Belum ada rute terhubung</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                                                        {hotel.created_at_formatted}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditHotelModal(hotel)}
                                                                className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openDeleteHotelModal(hotel)}
                                                                className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">
                                                    Belum ada hotel terdaftar.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Hotel List */}
                            <div className="block lg:hidden divide-y divide-slate-100">
                                {hotels && hotels.length > 0 ? (
                                    hotels.map((hotel) => (
                                        <div key={hotel.id} className="p-4 space-y-2.5">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="font-bold text-slate-900 text-sm">{hotel.nama_hotel}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditHotelModal(hotel)}
                                                        className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeleteHotelModal(hotel)}
                                                        className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>

                                            {hotel.airports && hotel.airports.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    {hotel.airports.map((ap) => (
                                                        <span key={ap.id} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
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
                {/* TAB 5: DESTINASI BANDARA                                         */}
                {/* ================================================================= */}
                {currentTab === 'airports' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Destinasi & Tarif Transfer Bandara DPS</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Tarif bandara dibedakan antara <strong>Pick-Up</strong> (jemput bandara) dan <strong>Drop-Off</strong> (antar bandara).
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addAirportForm.reset();
                                        setShowAddAirportModal(true);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer shrink-0"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    <span>Tambah Destinasi Bandara</span>
                                </button>
                            </div>

                            <form onSubmit={handleAirportFilterSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                                    <div className="relative flex-1 max-w-md">
                                        <input
                                            type="text"
                                            value={airportSearch}
                                            onChange={(e) => setAirportSearch(e.target.value)}
                                            placeholder="Cari wilayah destinasi..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] min-h-[40px]"
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
                                            value={airportTypeFilter}
                                            onChange={(e) => {
                                                setAirportTypeFilter(e.target.value);
                                                router.get(
                                                    '/admin/master-data',
                                                    { tab: 'airports', search_airport: airportSearch, type_airport: e.target.value },
                                                    { preserveState: true, replace: true }
                                                );
                                            }}
                                            className={selectBaseClass}
                                        >
                                            <option value="all">Semua Tipe Rute</option>
                                            <option value="Pick-Up">Pick-Up (Jemput Bandara)</option>
                                            <option value="Drop-Off">Drop-Off (Antar Bandara)</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer min-h-[40px]"
                                >
                                    Filter
                                </button>
                            </form>
                        </div>

                        {/* Airport Table */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="px-6 py-3.5">Wilayah Destinasi</th>
                                            <th className="px-6 py-3.5">Tipe Transfer</th>
                                            <th className="px-6 py-3.5 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                        {airports && airports.length > 0 ? (
                                            airports.map((ap) => (
                                                <tr key={ap.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-slate-900 text-sm">{ap.destinasi}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                                            {ap.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditAirportModal(ap)}
                                                                className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openDeleteAirportModal(ap)}
                                                                className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-slate-400 text-sm">
                                                    Belum ada data tarif destinasi bandara terdaftar.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Airport List */}
                            <div className="block lg:hidden divide-y divide-slate-100">
                                {airports && airports.length > 0 ? (
                                    airports.map((ap) => (
                                        <div key={ap.id} className="p-4 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <span className="font-bold text-slate-900 text-sm block">{ap.destinasi}</span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold mt-1 bg-slate-100 text-slate-700 border border-slate-200">
                                                        {ap.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditAirportModal(ap)}
                                                        className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeleteAirportModal(ap)}
                                                        className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        Hapus
                                                    </button>
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
                {/* TAB 6: TARIF ANTAR HOTEL                                         */}
                {/* ================================================================= */}
                {currentTab === 'hotel_transfer_price_lists' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Tarif Transfer Antar Hotel</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Pricelist tarif perjalanan langsung dari hotel asal ke hotel tujuan.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addHotelPriceForm.reset();
                                        if (hotels_list.length > 1) {
                                            addHotelPriceForm.setData({
                                                hotel_id_pickup: String(hotels_list[0].id),
                                                hotel_id_dropoff: String(hotels_list[1].id),
                                                regular_price: '',
                                                luxury_price: '',
                                            });
                                        }
                                        setShowAddHotelPriceModal(true);
                                    }}
                                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer shrink-0"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    <span>Tambah Tarif Antar Hotel</span>
                                </button>
                            </div>

                            <form onSubmit={handleHotelPriceSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                <div className="relative flex-1 max-w-md">
                                    <input
                                        type="text"
                                        value={hotelPriceSearch}
                                        onChange={(e) => setHotelPriceSearch(e.target.value)}
                                        placeholder="Cari nama hotel asal atau tujuan..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] min-h-[40px]"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="11" cy="11" r="8" />
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer min-h-[40px]"
                                >
                                    Cari Tarif
                                </button>
                            </form>
                        </div>

                        {/* Hotel Transfer Table */}
                        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                            <th className="px-6 py-3.5">Rute Hotel (Asal &rarr; Tujuan)</th>
                                            <th className="px-6 py-3.5 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                        {hotel_transfer_price_lists && hotel_transfer_price_lists.length > 0 ? (
                                            hotel_transfer_price_lists.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-slate-900">{item.pickup_hotel_name}</span>
                                                            <span className="text-slate-400">&rarr;</span>
                                                            <span className="font-bold text-slate-900">{item.dropoff_hotel_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditHotelPriceModal(item)}
                                                                className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openDeleteHotelPriceModal(item)}
                                                                className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={2} className="px-6 py-8 text-center text-slate-400 text-sm">
                                                    Belum ada tarif transfer antar hotel terdaftar.
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
                                        <div key={item.id} className="p-4 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="text-sm font-bold text-slate-900">
                                                    <div>{item.pickup_hotel_name}</div>
                                                    <div className="text-xs text-slate-400 font-normal">
                                                        &darr; Menuju ke
                                                    </div>
                                                    <div>{item.dropoff_hotel_name}</div>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditHotelPriceModal(item)}
                                                        className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeleteHotelPriceModal(item)}
                                                        className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-8 text-center text-slate-400 text-sm">
                                        Belum ada tarif transfer antar hotel terdaftar.
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
                title="Tambah Mobil Showcase"
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAddVehicleModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[40px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="add-vehicle-form"
                            disabled={addVehicleForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer min-h-[40px]"
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
                <form id="add-vehicle-form" onSubmit={handleAddVehicleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Nama Mobil <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Toyota Innova Reborn, Toyota Alphard Transformer"
                            value={addVehicleForm.data.name}
                            onChange={(e) => addVehicleForm.setData('name', e.target.value)}
                            className={inputBaseClass}
                        />
                        {addVehicleForm.errors.name && (
                            <p className="text-red-500 text-xs mt-1">{addVehicleForm.errors.name}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Kategori Tier <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={addVehicleForm.data.category}
                                onChange={(e) => addVehicleForm.setData('category', e.target.value)}
                                className={selectBaseClass}
                            >
                                {(vehicle_units || []).map((unit) => (
                                    <option key={unit.id} value={unit.category}>
                                        {unit.category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Model / Tahun Rilis <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: 2024"
                                value={addVehicleForm.data.model}
                                onChange={(e) => addVehicleForm.setData('model', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Kapasitas Penumpang <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="50"
                                value={addVehicleForm.data.passenger_capacity}
                                onChange={(e) => addVehicleForm.setData('passenger_capacity', parseInt(e.target.value) || 1)}
                                className={inputBaseClass}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Kapasitas Bagasi (Koper) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="50"
                                value={addVehicleForm.data.luggage_capacity}
                                onChange={(e) => addVehicleForm.setData('luggage_capacity', parseInt(e.target.value) || 0)}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Deskripsi Detail Armada
                        </label>
                        <textarea
                            rows="3"
                            value={addVehicleForm.data.description || ''}
                            onChange={(e) => addVehicleForm.setData('description', e.target.value)}
                            placeholder="Deskripsi detail tentang armada ini..."
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Key Features
                        </label>
                        <div className="space-y-2">
                            {(addVehicleForm.data.key_features || ['']).map((feat, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={feat}
                                        onChange={(e) => {
                                            const newFeats = [...(addVehicleForm.data.key_features || [''])];
                                            newFeats[idx] = e.target.value;
                                            addVehicleForm.setData('key_features', newFeats);
                                        }}
                                        placeholder="e.g. Smooth suspension perfect for families with babies"
                                        className={inputBaseClass}
                                    />
                                    {(addVehicleForm.data.key_features || ['']).length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newFeats = (addVehicleForm.data.key_features || ['']).filter((_, i) => i !== idx);
                                                addVehicleForm.setData('key_features', newFeats);
                                            }}
                                            className="px-2 text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    const newFeats = [...(addVehicleForm.data.key_features || ['']), ''];
                                    addVehicleForm.setData('key_features', newFeats);
                                }}
                                className="text-xs text-[#00AEEF] hover:text-[#008dbf] font-semibold"
                            >
                                + Tambah Feature
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            AC Info
                        </label>
                        <input
                            type="text"
                            value={addVehicleForm.data.ac_info || ''}
                            onChange={(e) => addVehicleForm.setData('ac_info', e.target.value)}
                            placeholder="e.g. Dual-zone climate control with rear vents"
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Foto Mobil
                        </label>
                        <input
                            ref={addVehicleFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleVehiclePhotoChange(e.target.files[0], false)}
                            className="hidden"
                        />
                        <div className="flex items-center gap-4">
                            {addVehiclePhotoPreview ? (
                                <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                                    <img src={addVehiclePhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-24 h-16 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs shrink-0">
                                    Belum ada foto
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => addVehicleFileInputRef.current?.click()}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer"
                            >
                                Pilih Berkas Foto
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 2. EDIT VEHICLE MODAL */}
            <Modal
                show={showEditVehicleModal}
                onClose={() => setShowEditVehicleModal(false)}
                title="Edit Mobil Showcase"
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowEditVehicleModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[40px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="edit-vehicle-form"
                            disabled={editVehicleForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer min-h-[40px]"
                        >
                            {editVehicleForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Perubahan</span>
                        </button>
                    </>
                }
            >
                <form id="edit-vehicle-form" onSubmit={handleEditVehicleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Nama Mobil <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={editVehicleForm.data.name}
                            onChange={(e) => editVehicleForm.setData('name', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Kategori Tier <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={editVehicleForm.data.category}
                                onChange={(e) => editVehicleForm.setData('category', e.target.value)}
                                className={selectBaseClass}
                            >
                                {(vehicle_units || []).map((unit) => (
                                    <option key={unit.id} value={unit.category}>
                                        {unit.category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Model / Tahun Rilis <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editVehicleForm.data.model}
                                onChange={(e) => editVehicleForm.setData('model', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Kapasitas Penumpang <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="50"
                                value={editVehicleForm.data.passenger_capacity}
                                onChange={(e) => editVehicleForm.setData('passenger_capacity', parseInt(e.target.value) || 1)}
                                className={inputBaseClass}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Kapasitas Bagasi (Koper) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="50"
                                value={editVehicleForm.data.luggage_capacity}
                                onChange={(e) => editVehicleForm.setData('luggage_capacity', parseInt(e.target.value) || 0)}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Deskripsi Detail Armada
                        </label>
                        <textarea
                            rows="3"
                            value={editVehicleForm.data.description || ''}
                            onChange={(e) => editVehicleForm.setData('description', e.target.value)}
                            placeholder="Deskripsi detail tentang armada ini..."
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Key Features
                        </label>
                        <div className="space-y-2">
                            {(editVehicleForm.data.key_features || ['']).map((feat, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={feat}
                                        onChange={(e) => {
                                            const newFeats = [...(editVehicleForm.data.key_features || [''])];
                                            newFeats[idx] = e.target.value;
                                            editVehicleForm.setData('key_features', newFeats);
                                        }}
                                        placeholder="e.g. Smooth suspension perfect for families with babies"
                                        className={inputBaseClass}
                                    />
                                    {(editVehicleForm.data.key_features || ['']).length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newFeats = (editVehicleForm.data.key_features || ['']).filter((_, i) => i !== idx);
                                                editVehicleForm.setData('key_features', newFeats);
                                            }}
                                            className="px-2 text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    const newFeats = [...(editVehicleForm.data.key_features || ['']), ''];
                                    editVehicleForm.setData('key_features', newFeats);
                                }}
                                className="text-xs text-[#00AEEF] hover:text-[#008dbf] font-semibold"
                            >
                                + Tambah Feature
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            AC Info
                        </label>
                        <input
                            type="text"
                            value={editVehicleForm.data.ac_info || ''}
                            onChange={(e) => editVehicleForm.setData('ac_info', e.target.value)}
                            placeholder="e.g. Dual-zone climate control with rear vents"
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Ganti Foto Mobil
                        </label>
                        <input
                            ref={editVehicleFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleVehiclePhotoChange(e.target.files[0], true)}
                            className="hidden"
                        />
                        <div className="flex items-center gap-4">
                            {editVehiclePhotoPreview ? (
                                <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                                    <img src={editVehiclePhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-24 h-16 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs shrink-0">
                                    Belum ada foto
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => editVehicleFileInputRef.current?.click()}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer"
                            >
                                Ubah Foto
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 3. DELETE VEHICLE MODAL */}
            <Modal
                show={showDeleteVehicleModal}
                onClose={() => setShowDeleteVehicleModal(false)}
                title="Hapus Mobil Showcase"
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowDeleteVehicleModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteVehicle}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
                            Hapus Mobil
                        </button>
                    </>
                }
            >
                <p className="text-xs text-slate-600">
                    Apakah Anda yakin ingin menghapus mobil showcase <strong>{selectedVehicle?.name}</strong>?
                </p>
            </Modal>

            {/* ========================================================================= */}
            {/* DAY TOUR PACKAGE MODALS                                                   */}
            {/* ========================================================================= */}

            {/* ADD PACKAGE MODAL */}
            <Modal
                show={showAddPackageModal}
                onClose={() => setShowAddPackageModal(false)}
                title="Tambah Paket Wisata Day Tour"
                maxWidth="2xl"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAddPackageModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[40px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="add-package-form"
                            disabled={addPackageForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer min-h-[40px]"
                        >
                            {addPackageForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Paket Tour</span>
                        </button>
                    </>
                }
            >
                <form id="add-package-form" onSubmit={handleAddPackageSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Nama Paket Tour <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Ubud Cultural & Waterfall Experience"
                            value={addPackageForm.data.name}
                            onChange={(e) => addPackageForm.setData('name', e.target.value)}
                            className={inputBaseClass}
                        />
                        {addPackageForm.errors.name && (
                            <p className="text-red-500 text-xs mt-1">{addPackageForm.errors.name}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Wilayah / Region <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                list="add-package-type-suggestions"
                                placeholder="Contoh: Ubud, Bedugul, Kintamani, Nusa Penida, dll."
                                value={addPackageForm.data.package_type}
                                onChange={(e) => addPackageForm.setData('package_type', e.target.value)}
                                className={inputBaseClass}
                            />
                            <datalist id="add-package-type-suggestions">
                                {package_types.map((t) => (
                                    <option key={t} value={t} />
                                ))}
                            </datalist>
                            {addPackageForm.errors.package_type && (
                                <p className="text-red-500 text-xs mt-1">{addPackageForm.errors.package_type}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Tipe Durasi <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={addPackageForm.data.duration_type}
                                onChange={(e) => addPackageForm.setData('duration_type', e.target.value)}
                                className={selectBaseClass}
                            >
                                {package_duration_types.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Tagline / Subtitle Singkat
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: Eksplorasi air terjun tersembunyi dan puri seni Ubud"
                            value={addPackageForm.data.subtitle}
                            onChange={(e) => addPackageForm.setData('subtitle', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Penjelasan & Deskripsi Paket
                        </label>
                        <textarea
                            rows="3"
                            placeholder="Tuliskan gambaran lengkap perjalanan dan fasilitas tour..."
                            value={addPackageForm.data.description}
                            onChange={(e) => addPackageForm.setData('description', e.target.value)}
                            className={`${inputBaseClass} resize-none`}
                        />
                    </div>

                    {/* Dynamic Pricing per Vehicle Unit */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-slate-700">
                                Tarif per Kategori Unit Kendaraan <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[11px] text-slate-400">
                                Otomatis menyesuaikan unit di master data
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                            {vehicle_units && vehicle_units.map((unit) => (
                                <div key={unit.id}>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 truncate">
                                        {unit.category} (Max {unit.passenger_capacity} pax)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">Rp</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="10000"
                                            placeholder="650000"
                                            value={addPackageForm.data.unit_prices?.[unit.id] ?? ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const newPrices = { ...(addPackageForm.data.unit_prices || {}) };
                                                newPrices[unit.id] = val;
                                                const isBigVan = unit.category.toLowerCase().includes('minibus') || unit.category.toLowerCase().includes('big van');
                                                const isLux = unit.category.toLowerCase().includes('luxury');
                                                addPackageForm.setData((prev) => ({
                                                    ...prev,
                                                    unit_prices: newPrices,
                                                    regular_price: (!isBigVan && !isLux) ? val : prev.regular_price,
                                                    luxury_price: isLux ? val : prev.luxury_price,
                                                    big_van_price: isBigVan ? val : prev.big_van_price,
                                                }));
                                            }}
                                            className={`${inputBaseClass} pl-8 font-semibold text-xs`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Foto Utama Paket
                        </label>
                        <input
                            ref={addPackageFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePackagePhotoChange(e.target.files[0], false)}
                            className="hidden"
                        />
                        <div className="flex items-center gap-4">
                            {addPackagePhotoPreview ? (
                                <div className="relative w-28 aspect-16/10 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                                    <img src={addPackagePhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-28 aspect-16/10 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs shrink-0">
                                    Belum ada foto
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => addPackageFileInputRef.current?.click()}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer"
                            >
                                Pilih Berkas Foto
                            </button>
                        </div>
                    </div>

                    {/* Highlights / Destinations List */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-900">
                                Poin Destinasi & Itinerary Tour
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    addPackageForm.setData('highlights', [
                                        ...addPackageForm.data.highlights,
                                        { title: '', description: '' },
                                    ]);
                                }}
                                className="text-xs text-[#00AEEF] hover:text-[#008dbf] font-semibold cursor-pointer"
                            >
                                + Tambah Destinasi
                            </button>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {addPackageForm.data.highlights.map((hl, idx) => (
                                <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                                    <div className="flex-1 space-y-1.5">
                                        <input
                                            type="text"
                                            placeholder={`Destinasi #${idx + 1} (contoh: Tegenungan Waterfall)`}
                                            value={hl.title}
                                            onChange={(e) => {
                                                const newHl = [...addPackageForm.data.highlights];
                                                newHl[idx].title = e.target.value;
                                                addPackageForm.setData('highlights', newHl);
                                            }}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00AEEF]"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Deskripsi singkat kegiatan (opsional)"
                                            value={hl.description}
                                            onChange={(e) => {
                                                const newHl = [...addPackageForm.data.highlights];
                                                newHl[idx].description = e.target.value;
                                                addPackageForm.setData('highlights', newHl);
                                            }}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-600 placeholder-slate-400 focus:outline-none focus:border-[#00AEEF]"
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const newHl = [...addPackageForm.data.highlights];
                                                newHl[idx].photo = e.target.files[0];
                                                addPackageForm.setData('highlights', newHl);
                                            }}
                                            className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                                        />
                                    </div>
                                    {addPackageForm.data.highlights.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newHl = addPackageForm.data.highlights.filter((_, i) => i !== idx);
                                                addPackageForm.setData('highlights', newHl);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* EDIT PACKAGE MODAL */}
            <Modal
                show={showEditPackageModal}
                onClose={() => setShowEditPackageModal(false)}
                title="Edit Paket Wisata Day Tour"
                maxWidth="2xl"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowEditPackageModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[40px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="edit-package-form"
                            disabled={editPackageForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer min-h-[40px]"
                        >
                            {editPackageForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Perubahan</span>
                        </button>
                    </>
                }
            >
                <form id="edit-package-form" onSubmit={handleEditPackageSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Nama Paket Tour <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={editPackageForm.data.name}
                            onChange={(e) => editPackageForm.setData('name', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Wilayah / Region <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                list="edit-package-type-suggestions"
                                placeholder="Contoh: Ubud, Bedugul, Kintamani, Nusa Penida, dll."
                                value={editPackageForm.data.package_type}
                                onChange={(e) => editPackageForm.setData('package_type', e.target.value)}
                                className={inputBaseClass}
                            />
                            <datalist id="edit-package-type-suggestions">
                                {package_types.map((t) => (
                                    <option key={t} value={t} />
                                ))}
                            </datalist>
                            {editPackageForm.errors.package_type && (
                                <p className="text-red-500 text-xs mt-1">{editPackageForm.errors.package_type}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Tipe Durasi <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={editPackageForm.data.duration_type}
                                onChange={(e) => editPackageForm.setData('duration_type', e.target.value)}
                                className={selectBaseClass}
                            >
                                {package_duration_types.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Tagline / Subtitle Singkat
                        </label>
                        <input
                            type="text"
                            value={editPackageForm.data.subtitle}
                            onChange={(e) => editPackageForm.setData('subtitle', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Penjelasan & Deskripsi Paket
                        </label>
                        <textarea
                            rows="3"
                            value={editPackageForm.data.description}
                            onChange={(e) => editPackageForm.setData('description', e.target.value)}
                            className={`${inputBaseClass} resize-none`}
                        />
                    </div>

                    {/* Dynamic Pricing per Vehicle Unit */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-slate-700">
                                Tarif per Kategori Unit Kendaraan <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[11px] text-slate-400">
                                Otomatis menyesuaikan unit di master data
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                            {vehicle_units && vehicle_units.map((unit) => (
                                <div key={unit.id}>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 truncate">
                                        {unit.category} (Max {unit.passenger_capacity} pax)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">Rp</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="10000"
                                            value={editPackageForm.data.unit_prices?.[unit.id] ?? ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const newPrices = { ...(editPackageForm.data.unit_prices || {}) };
                                                newPrices[unit.id] = val;
                                                const isBigVan = unit.category.toLowerCase().includes('minibus') || unit.category.toLowerCase().includes('big van');
                                                const isLux = unit.category.toLowerCase().includes('luxury');
                                                editPackageForm.setData((prev) => ({
                                                    ...prev,
                                                    unit_prices: newPrices,
                                                    regular_price: (!isBigVan && !isLux) ? val : prev.regular_price,
                                                    luxury_price: isLux ? val : prev.luxury_price,
                                                    big_van_price: isBigVan ? val : prev.big_van_price,
                                                }));
                                            }}
                                            className={`${inputBaseClass} pl-8 font-semibold text-xs`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Ganti Foto Utama Paket
                        </label>
                        <input
                            ref={editPackageFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePackagePhotoChange(e.target.files[0], true)}
                            className="hidden"
                        />
                        <div className="flex items-center gap-4">
                            {editPackagePhotoPreview ? (
                                <div className="relative w-28 aspect-16/10 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                                    <img src={editPackagePhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-28 aspect-16/10 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs shrink-0">
                                    Belum ada foto
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => editPackageFileInputRef.current?.click()}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer"
                            >
                                Ubah Foto
                            </button>
                        </div>
                    </div>

                    {/* Highlights / Destinations List */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-900">
                                Poin Destinasi & Itinerary Tour
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    editPackageForm.setData('highlights', [
                                        ...editPackageForm.data.highlights,
                                        { title: '', description: '' },
                                    ]);
                                }}
                                className="text-xs text-[#00AEEF] hover:text-[#008dbf] font-semibold cursor-pointer"
                            >
                                + Tambah Destinasi
                            </button>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {editPackageForm.data.highlights.map((hl, idx) => (
                                <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                                    <div className="flex-1 space-y-1.5">
                                        <input
                                            type="text"
                                            placeholder={`Destinasi #${idx + 1}`}
                                            value={hl.title}
                                            onChange={(e) => {
                                                const newHl = [...editPackageForm.data.highlights];
                                                newHl[idx].title = e.target.value;
                                                editPackageForm.setData('highlights', newHl);
                                            }}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00AEEF]"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Deskripsi singkat kegiatan (opsional)"
                                            value={hl.description || ''}
                                            onChange={(e) => {
                                                const newHl = [...editPackageForm.data.highlights];
                                                newHl[idx].description = e.target.value;
                                                editPackageForm.setData('highlights', newHl);
                                            }}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-600 placeholder-slate-400 focus:outline-none focus:border-[#00AEEF]"
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const newHl = [...editPackageForm.data.highlights];
                                                newHl[idx].photo = e.target.files[0];
                                                editPackageForm.setData('highlights', newHl);
                                            }}
                                            className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                                        />
                                    </div>
                                    {editPackageForm.data.highlights.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newHl = editPackageForm.data.highlights.filter((_, i) => i !== idx);
                                                editPackageForm.setData('highlights', newHl);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer"
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* DELETE PACKAGE MODAL */}
            <Modal
                show={showDeletePackageModal}
                onClose={() => setShowDeletePackageModal(false)}
                title="Hapus Paket Wisata Day Tour"
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowDeletePackageModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeletePackage}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
                            Hapus Paket
                        </button>
                    </>
                }
            >
                <p className="text-xs text-slate-600">
                    Apakah Anda yakin ingin menghapus paket tour <strong>{selectedPackage?.name}</strong>?
                </p>
            </Modal>

            {/* 4. ADD DRIVER MODAL */}
            <Modal
                show={showAddDriverModal}
                onClose={() => setShowAddDriverModal(false)}
                title="Tambah Pengemudi Baru"
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAddDriverModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[40px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="add-driver-form"
                            disabled={addDriverForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer min-h-[40px]"
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
                <form id="add-driver-form" onSubmit={handleAddDriverSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: I Wayan Sudira"
                            value={addDriverForm.data.full_name}
                            onChange={(e) => addDriverForm.setData('full_name', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Nomor WhatsApp <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="081234567890"
                                value={addDriverForm.data.whatsapp_number}
                                onChange={(e) => addDriverForm.setData('whatsapp_number', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Email Login <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="driver@bfs.test"
                                value={addDriverForm.data.email}
                                onChange={(e) => addDriverForm.setData('email', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Password Login Driver <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showAddDriverPassword ? 'text' : 'password'}
                                    required
                                    placeholder="Minimal 6 karakter"
                                    value={addDriverForm.data.password}
                                    onChange={(e) => addDriverForm.setData('password', e.target.value)}
                                    className={`${inputBaseClass} pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowAddDriverPassword(!showAddDriverPassword)}
                                    aria-label="Toggle password visibility"
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                                >
                                    {showAddDriverPassword ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Status Driver
                            </label>
                            <select
                                value={addDriverForm.data.status}
                                onChange={(e) => addDriverForm.setData('status', e.target.value)}
                                className={selectBaseClass}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Nomor Lisensi / SIM <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: SIM-A-981726"
                                value={addDriverForm.data.license_number}
                                onChange={(e) => addDriverForm.setData('license_number', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Masa Berlaku SIM <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={addDriverForm.data.license_expiry_date}
                                onChange={(e) => addDriverForm.setData('license_expiry_date', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Foto Profil Driver
                        </label>
                        <input
                            ref={addDriverFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDriverFileChange(e.target.files[0], false)}
                            className="hidden"
                        />
                        <div className="flex items-center gap-4">
                            {addDriverPhotoPreview ? (
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
                                    <img src={addDriverPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs shrink-0">
                                    Foto
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => addDriverFileInputRef.current?.click()}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer"
                            >
                                Pilih Berkas Foto
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 5. EDIT DRIVER MODAL */}
            <Modal
                show={showEditDriverModal}
                onClose={() => setShowEditDriverModal(false)}
                title="Edit Data Pengemudi"
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowEditDriverModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[40px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="edit-driver-form"
                            disabled={editDriverForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer min-h-[40px]"
                        >
                            {editDriverForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Perubahan</span>
                        </button>
                    </>
                }
            >
                <form id="edit-driver-form" onSubmit={handleEditDriverSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={editDriverForm.data.full_name}
                            onChange={(e) => editDriverForm.setData('full_name', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Nomor WhatsApp <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editDriverForm.data.whatsapp_number}
                                onChange={(e) => editDriverForm.setData('whatsapp_number', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Email Login <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                value={editDriverForm.data.email}
                                onChange={(e) => editDriverForm.setData('email', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Password Baru (Opsional)
                            </label>
                            <div className="relative">
                                <input
                                    type={showEditDriverPassword ? 'text' : 'password'}
                                    placeholder="Kosongkan bila tidak diubah"
                                    value={editDriverForm.data.password}
                                    onChange={(e) => editDriverForm.setData('password', e.target.value)}
                                    className={`${inputBaseClass} pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowEditDriverPassword(!showEditDriverPassword)}
                                    aria-label="Toggle password visibility"
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                                >
                                    {showEditDriverPassword ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Status Driver
                            </label>
                            <select
                                value={editDriverForm.data.status}
                                onChange={(e) => editDriverForm.setData('status', e.target.value)}
                                className={selectBaseClass}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Nomor Lisensi / SIM <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editDriverForm.data.license_number}
                                onChange={(e) => editDriverForm.setData('license_number', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Masa Berlaku SIM <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={editDriverForm.data.license_expiry_date}
                                onChange={(e) => editDriverForm.setData('license_expiry_date', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Ganti Foto Profil
                        </label>
                        <input
                            ref={editDriverFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDriverFileChange(e.target.files[0], true)}
                            className="hidden"
                        />
                        <div className="flex items-center gap-4">
                            {editDriverPhotoPreview ? (
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
                                    <img src={editDriverPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs shrink-0">
                                    Foto
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => editDriverFileInputRef.current?.click()}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer"
                            >
                                Ubah Foto
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 6. DELETE DRIVER MODAL */}
            <Modal
                show={showDeleteDriverModal}
                onClose={() => setShowDeleteDriverModal(false)}
                title="Hapus Pengemudi"
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowDeleteDriverModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteDriver}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
                            Hapus Driver
                        </button>
                    </>
                }
            >
                <p className="text-xs text-slate-600">
                    Apakah Anda yakin ingin menghapus akun pengemudi <strong>{selectedDriver?.full_name}</strong>?
                </p>
            </Modal>

            {/* 7. ADD HOTEL MODAL */}
            <Modal
                show={showAddHotelModal}
                onClose={() => setShowAddHotelModal(false)}
                title="Tambah Hotel Baru"
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAddHotelModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[40px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="add-hotel-form"
                            disabled={addHotelForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer min-h-[40px]"
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
                <form id="add-hotel-form" onSubmit={handleAddHotelSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Nama Hotel & Resort <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Padma Resort Ubud, W Bali Seminyak"
                            value={addHotelForm.data.nama_hotel}
                            onChange={(e) => addHotelForm.setData('nama_hotel', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Hubungkan ke Destinasi Bandara DPS
                        </label>
                        <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                            {airports_list && airports_list.length > 0 ? (
                                airports_list.map((ap) => {
                                    const isChecked = addHotelForm.data.airport_ids.includes(ap.id);
                                    return (
                                        <label key={ap.id} className="flex items-center gap-2.5 cursor-pointer text-xs">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) => {
                                                    const current = [...addHotelForm.data.airport_ids];
                                                    if (e.target.checked) {
                                                        addHotelForm.setData('airport_ids', [...current, ap.id]);
                                                    } else {
                                                        addHotelForm.setData('airport_ids', current.filter((id) => id !== ap.id));
                                                    }
                                                }}
                                                className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF] border-slate-300"
                                            />
                                            <span className="text-slate-700">{ap.label}</span>
                                        </label>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-slate-400 italic">Belum ada daftar destinasi bandara.</p>
                            )}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 8. EDIT HOTEL MODAL */}
            <Modal
                show={showEditHotelModal}
                onClose={() => setShowEditHotelModal(false)}
                title="Edit Data Hotel"
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowEditHotelModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[40px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="edit-hotel-form"
                            disabled={editHotelForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer min-h-[40px]"
                        >
                            {editHotelForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Perubahan</span>
                        </button>
                    </>
                }
            >
                <form id="edit-hotel-form" onSubmit={handleEditHotelSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Nama Hotel & Resort <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={editHotelForm.data.nama_hotel}
                            onChange={(e) => editHotelForm.setData('nama_hotel', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Hubungkan ke Destinasi Bandara DPS
                        </label>
                        <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-2">
                            {airports_list && airports_list.length > 0 ? (
                                airports_list.map((ap) => {
                                    const isChecked = editHotelForm.data.airport_ids.includes(ap.id);
                                    return (
                                        <label key={ap.id} className="flex items-center gap-2.5 cursor-pointer text-xs">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) => {
                                                    const current = [...editHotelForm.data.airport_ids];
                                                    if (e.target.checked) {
                                                        editHotelForm.setData('airport_ids', [...current, ap.id]);
                                                    } else {
                                                        editHotelForm.setData('airport_ids', current.filter((id) => id !== ap.id));
                                                    }
                                                }}
                                                className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF] border-slate-300"
                                            />
                                            <span className="text-slate-700">{ap.label}</span>
                                        </label>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-slate-400 italic">Belum ada daftar destinasi bandara.</p>
                            )}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 9. DELETE HOTEL MODAL */}
            <Modal
                show={showDeleteHotelModal}
                onClose={() => setShowDeleteHotelModal(false)}
                title="Hapus Data Hotel"
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowDeleteHotelModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteHotel}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
                            Hapus Hotel
                        </button>
                    </>
                }
            >
                <p className="text-xs text-slate-600">
                    Apakah Anda yakin ingin menghapus hotel <strong>{selectedHotel?.nama_hotel}</strong>?
                </p>
            </Modal>

            {/* 10. ADD AIRPORT MODAL */}
            <Modal
                show={showAddAirportModal}
                onClose={() => setShowAddAirportModal(false)}
                title="Tambah Destinasi Bandara DPS"
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAddAirportModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[40px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="add-airport-form"
                            disabled={addAirportForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer min-h-[40px]"
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
                <form id="add-airport-form" onSubmit={handleAddAirportSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Wilayah Destinasi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: Ubud, Seminyak, Nusa Dua"
                                value={addAirportForm.data.destinasi}
                                onChange={(e) => addAirportForm.setData('destinasi', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Tipe Transfer <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={addAirportForm.data.type}
                                onChange={(e) => addAirportForm.setData('type', e.target.value)}
                                className={selectBaseClass}
                            >
                                <option value="Pick-Up">Pick-Up (Jemput di Bandara)</option>
                                <option value="Drop-Off">Drop-Off (Antar ke Bandara)</option>
                            </select>
                        </div>
                    </div>

                    {/* Dynamic Pricing per Vehicle Unit */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-slate-700">
                                Tarif per Kategori Unit Kendaraan <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[11px] text-slate-400">
                                Otomatis menyesuaikan unit di master data
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                            {vehicle_units && vehicle_units.map((unit) => (
                                <div key={unit.id}>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 truncate">
                                        {unit.category} (Max {unit.passenger_capacity} pax)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">Rp</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="5000"
                                            placeholder="350000"
                                            value={addAirportForm.data.unit_prices?.[unit.id] ?? ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const newPrices = { ...(addAirportForm.data.unit_prices || {}) };
                                                newPrices[unit.id] = val;
                                                const isLux = unit.category.toLowerCase().includes('luxury');
                                                addAirportForm.setData((prev) => ({
                                                    ...prev,
                                                    unit_prices: newPrices,
                                                    price_regular: !isLux ? val || prev.price_regular : prev.price_regular,
                                                    price_luxury: isLux ? val : prev.price_luxury,
                                                }));
                                            }}
                                            className={`${inputBaseClass} pl-8 font-semibold text-xs`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 11. EDIT AIRPORT MODAL */}
            <Modal
                show={showEditAirportModal}
                onClose={() => setShowEditAirportModal(false)}
                title="Edit Destinasi Bandara DPS"
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowEditAirportModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[40px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="edit-airport-form"
                            disabled={editAirportForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer min-h-[40px]"
                        >
                            {editAirportForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Perubahan</span>
                        </button>
                    </>
                }
            >
                <form id="edit-airport-form" onSubmit={handleEditAirportSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Wilayah Destinasi <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={editAirportForm.data.destinasi}
                                onChange={(e) => editAirportForm.setData('destinasi', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Tipe Transfer <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={editAirportForm.data.type}
                                onChange={(e) => editAirportForm.setData('type', e.target.value)}
                                className={selectBaseClass}
                            >
                                <option value="Pick-Up">Pick-Up (Jemput di Bandara)</option>
                                <option value="Drop-Off">Drop-Off (Antar ke Bandara)</option>
                            </select>
                        </div>
                    </div>

                    {/* Dynamic Pricing per Vehicle Unit */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-slate-700">
                                Tarif per Kategori Unit Kendaraan <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[11px] text-slate-400">
                                Otomatis menyesuaikan unit di master data
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                            {vehicle_units && vehicle_units.map((unit) => (
                                <div key={unit.id}>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 truncate">
                                        {unit.category} (Max {unit.passenger_capacity} pax)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">Rp</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="5000"
                                            placeholder="350000"
                                            value={editAirportForm.data.unit_prices?.[unit.id] ?? ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const newPrices = { ...(editAirportForm.data.unit_prices || {}) };
                                                newPrices[unit.id] = val;
                                                const isLux = unit.category.toLowerCase().includes('luxury');
                                                editAirportForm.setData((prev) => ({
                                                    ...prev,
                                                    unit_prices: newPrices,
                                                    price_regular: !isLux ? val || prev.price_regular : prev.price_regular,
                                                    price_luxury: isLux ? val : prev.price_luxury,
                                                }));
                                            }}
                                            className={`${inputBaseClass} pl-8 font-semibold text-xs`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </form>
            </Modal>

            {/* 12. DELETE AIRPORT MODAL */}
            <Modal
                show={showDeleteAirportModal}
                onClose={() => setShowDeleteAirportModal(false)}
                title="Hapus Destinasi Bandara"
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowDeleteAirportModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteAirport}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
                            Hapus Destinasi
                        </button>
                    </>
                }
            >
                <p className="text-xs text-slate-600">
                    Apakah Anda yakin ingin menghapus destinasi <strong>{selectedAirport?.destinasi} ({selectedAirport?.type})</strong>?
                </p>
            </Modal>

            {/* 13. ADD HOTEL PRICELIST MODAL */}
            <Modal
                show={showAddHotelPriceModal}
                onClose={() => setShowAddHotelPriceModal(false)}
                title="Tambah Tarif Antar Hotel"
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAddHotelPriceModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[40px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="add-hotel-price-form"
                            disabled={addHotelPriceForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer min-h-[40px]"
                        >
                            {addHotelPriceForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Tarif</span>
                        </button>
                    </>
                }
            >
                <form id="add-hotel-price-form" onSubmit={handleAddHotelPriceSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Hotel Asal <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={addHotelPriceForm.data.hotel_id_pickup}
                                onChange={(e) => addHotelPriceForm.setData('hotel_id_pickup', e.target.value)}
                                className={selectBaseClass}
                            >
                                {hotels_list && hotels_list.map((h) => (
                                    <option key={h.id} value={h.id}>{h.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Hotel Tujuan <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={addHotelPriceForm.data.hotel_id_dropoff}
                                onChange={(e) => addHotelPriceForm.setData('hotel_id_dropoff', e.target.value)}
                                className={selectBaseClass}
                            >
                                {hotels_list && hotels_list
                                    .filter((h) => String(h.id) !== String(addHotelPriceForm.data.hotel_id_pickup))
                                    .map((h) => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    {/* Dynamic Pricing per Vehicle Unit */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-slate-700">
                                Tarif per Kategori Unit Kendaraan <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[11px] text-slate-400">
                                Otomatis menyesuaikan unit di master data
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                            {vehicle_units && vehicle_units.map((unit) => (
                                <div key={unit.id}>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 truncate">
                                        {unit.category} (Max {unit.passenger_capacity} pax)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">Rp</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="5000"
                                            placeholder="450000"
                                            value={addHotelPriceForm.data.unit_prices?.[unit.id] ?? ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const newPrices = { ...(addHotelPriceForm.data.unit_prices || {}) };
                                                newPrices[unit.id] = val;
                                                const isLux = unit.category.toLowerCase().includes('luxury');
                                                addHotelPriceForm.setData((prev) => ({
                                                    ...prev,
                                                    unit_prices: newPrices,
                                                    regular_price: !isLux ? val || prev.regular_price : prev.regular_price,
                                                    luxury_price: isLux ? val : prev.luxury_price,
                                                }));
                                            }}
                                            className={`${inputBaseClass} pl-8 font-semibold text-xs`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 14. EDIT HOTEL PRICELIST MODAL */}
            <Modal
                show={showEditHotelPriceModal}
                onClose={() => setShowEditHotelPriceModal(false)}
                title="Edit Tarif Antar Hotel"
                maxWidth="lg"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowEditHotelPriceModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[40px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="edit-hotel-price-form"
                            disabled={editHotelPriceForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer min-h-[40px]"
                        >
                            {editHotelPriceForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Perubahan</span>
                        </button>
                    </>
                }
            >
                <form id="edit-hotel-price-form" onSubmit={handleEditHotelPriceSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Hotel Asal <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={editHotelPriceForm.data.hotel_id_pickup}
                                onChange={(e) => editHotelPriceForm.setData('hotel_id_pickup', e.target.value)}
                                className={selectBaseClass}
                            >
                                {hotels_list && hotels_list.map((h) => (
                                    <option key={h.id} value={h.id}>{h.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Hotel Tujuan <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={editHotelPriceForm.data.hotel_id_dropoff}
                                onChange={(e) => editHotelPriceForm.setData('hotel_id_dropoff', e.target.value)}
                                className={selectBaseClass}
                            >
                                {hotels_list && hotels_list
                                    .filter((h) => String(h.id) !== String(editHotelPriceForm.data.hotel_id_pickup))
                                    .map((h) => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    {/* Dynamic Pricing per Vehicle Unit */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-slate-700">
                                Tarif per Kategori Unit Kendaraan <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[11px] text-slate-400">
                                Otomatis menyesuaikan unit di master data
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                            {vehicle_units && vehicle_units.map((unit) => (
                                <div key={unit.id}>
                                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 truncate">
                                        {unit.category} (Max {unit.passenger_capacity} pax)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">Rp</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="5000"
                                            placeholder="450000"
                                            value={editHotelPriceForm.data.unit_prices?.[unit.id] ?? ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const newPrices = { ...(editHotelPriceForm.data.unit_prices || {}) };
                                                newPrices[unit.id] = val;
                                                const isLux = unit.category.toLowerCase().includes('luxury');
                                                editHotelPriceForm.setData((prev) => ({
                                                    ...prev,
                                                    unit_prices: newPrices,
                                                    regular_price: !isLux ? val || prev.regular_price : prev.regular_price,
                                                    luxury_price: isLux ? val : prev.luxury_price,
                                                }));
                                            }}
                                            className={`${inputBaseClass} pl-8 font-semibold text-xs`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>

            {/* 15. DELETE HOTEL PRICELIST MODAL */}
            <Modal
                show={showDeleteHotelPriceModal}
                onClose={() => setShowDeleteHotelPriceModal(false)}
                title="Hapus Tarif Antar Hotel"
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowDeleteHotelPriceModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteHotelPrice}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
                            Hapus Tarif
                        </button>
                    </>
                }
            >
                <p className="text-xs text-slate-600">
                    Apakah Anda yakin ingin menghapus rute <strong>{selectedHotelPrice?.pickup_hotel_name}</strong> ke <strong>{selectedHotelPrice?.dropoff_hotel_name}</strong>?
                </p>
            </Modal>

            {/* ========================================================================= */}
            {/* VEHICLE UNIT MODALS                                                       */}
            {/* ========================================================================= */}

            {/* ADD VEHICLE UNIT MODAL */}
            <Modal
                show={showAddVehicleUnitModal}
                onClose={() => setShowAddVehicleUnitModal(false)}
                title="Tambah Kategori Kendaraan"
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAddVehicleUnitModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[40px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="add-vehicle-unit-form"
                            disabled={addVehicleUnitForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer min-h-[40px]"
                        >
                            {addVehicleUnitForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Unit</span>
                        </button>
                    </>
                }
            >
                <form id="add-vehicle-unit-form" onSubmit={handleAddVehicleUnitSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Nama Kategori Kendaraan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Premium MPV, Luxury SUV, Economy Car"
                            value={addVehicleUnitForm.data.category}
                            onChange={(e) => addVehicleUnitForm.setData('category', e.target.value)}
                            className={inputBaseClass}
                        />
                        {addVehicleUnitForm.errors.category && (
                            <p className="text-red-500 text-xs mt-1">{addVehicleUnitForm.errors.category}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                            Buat kategori baru sesuai kebutuhan. Nama harus unik.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Kapasitas Penumpang Maksimal <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            required
                            placeholder="Contoh: 6"
                            value={addVehicleUnitForm.data.passenger_capacity}
                            onChange={(e) => addVehicleUnitForm.setData('passenger_capacity', parseInt(e.target.value) || '')}
                            className={inputBaseClass}
                        />
                        {addVehicleUnitForm.errors.passenger_capacity && (
                            <p className="text-red-500 text-xs mt-1">{addVehicleUnitForm.errors.passenger_capacity}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                            Kapasitas maksimal penumpang untuk kategori ini. Driver akan menyesuaikan dengan kategori yang dipesan tamu.
                        </p>
                    </div>
                </form>
            </Modal>

            {/* EDIT VEHICLE UNIT MODAL */}
            <Modal
                show={showEditVehicleUnitModal}
                onClose={() => setShowEditVehicleUnitModal(false)}
                title="Edit Kategori Kendaraan"
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowEditVehicleUnitModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[40px]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="edit-vehicle-unit-form"
                            disabled={editVehicleUnitForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer min-h-[40px]"
                        >
                            {editVehicleUnitForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Simpan Perubahan</span>
                        </button>
                    </>
                }
            >
                <form id="edit-vehicle-unit-form" onSubmit={handleEditVehicleUnitSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Nama Kategori Kendaraan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Premium MPV"
                            value={editVehicleUnitForm.data.category}
                            onChange={(e) => editVehicleUnitForm.setData('category', e.target.value)}
                            className={inputBaseClass}
                        />
                        {editVehicleUnitForm.errors.category && (
                            <p className="text-red-500 text-xs mt-1">{editVehicleUnitForm.errors.category}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                            Edit nama kategori. Nama harus tetap unik.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Kapasitas Penumpang Maksimal <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            required
                            placeholder="Contoh: 6"
                            value={editVehicleUnitForm.data.passenger_capacity}
                            onChange={(e) => editVehicleUnitForm.setData('passenger_capacity', parseInt(e.target.value) || '')}
                            className={inputBaseClass}
                        />
                        {editVehicleUnitForm.errors.passenger_capacity && (
                            <p className="text-red-500 text-xs mt-1">{editVehicleUnitForm.errors.passenger_capacity}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                            Kapasitas maksimal penumpang untuk kategori ini. Driver akan menyesuaikan dengan kategori yang dipesan tamu.
                        </p>
                    </div>
                </form>
            </Modal>

            {/* DELETE VEHICLE UNIT MODAL */}
            <Modal
                show={showDeleteVehicleUnitModal}
                onClose={() => setShowDeleteVehicleUnitModal(false)}
                title="Hapus Kategori Kendaraan"
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowDeleteVehicleUnitModal(false)}
                            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteVehicleUnit}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition cursor-pointer"
                        >
                            Hapus Kategori
                        </button>
                    </>
                }
            >
                <div className="space-y-2 text-xs">
                    <p className="text-slate-700">
                        Apakah Anda yakin ingin menghapus kategori kendaraan{' '}
                        <strong className="text-slate-900 font-bold">
                            {selectedVehicleUnit?.category}
                        </strong>
                        {selectedVehicleUnit?.passenger_capacity ? ` (Kapasitas: ${selectedVehicleUnit.passenger_capacity} penumpang)` : ''}?
                    </p>
                    <p className="text-slate-500 text-[11px] bg-slate-50 border border-slate-200/80 p-2.5 rounded-lg">
                        <strong>Perhatian:</strong> Kategori tidak dapat dihapus jika masih terhubung dengan pemesanan yang sedang berjalan (belum Completed/Cancelled).
                    </p>
                </div>
            </Modal>
        </AdminLayout>
    );
}
