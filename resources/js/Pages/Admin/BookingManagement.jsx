import React, { useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';

const selectClass = "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs hover:border-slate-300 transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2364748b%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.22%208.22a.75.75%200%200%201%201.06%200L10%2011.94l3.72-3.72a.75.75%200%201%201%201.06%201.06l-4.25%204.25a.75.75%200%200%201-1.06%200L5.22%209.28a.75.75%200%200%201%200-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10";

export default function BookingManagement({
    stats = {},
    bookings = { data: [], links: [] },
    available_drivers = [],
    available_vehicle_units = [],
    vehicles = [],
    packages = [],
    hotels = [],
    airports = [],
    hotel_price_lists = [],
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
        vehicle_unit_id: '',
    });

    const addBookingForm = useForm({
        auto_parse_text: '',
        status: 'Pending',
        booking_type_ui: 'Airport Pick-Up',
        selected_destinasi: '',
        selected_hotel_id: '',
        hotel_id_pickup: '',
        hotel_id_dropoff: '',
        vehicle_tier: 'Regular',
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
        selected_destinasi: '',
        selected_hotel_id: '',
        hotel_id_pickup: '',
        hotel_id_dropoff: '',
        vehicle_tier: 'Regular',
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

    // Helper functions for pricing and data filtering
    const getDestinations = (direction) => {
        const list = airports
            .filter((a) => a.type === direction)
            .map((a) => a.destinasi);
        return Array.from(new Set(list));
    };

    const getHotelsForDestinasi = (destinasiName) => {
        if (!destinasiName) return [];
        return hotels.filter((h) =>
            Array.isArray(h.airports) && h.airports.some((a) => a.destinasi === destinasiName)
        );
    };

    const getFilteredVehicles = (tier, durationType = null) => {
        if (durationType === 'Full Day') {
            return vehicles.filter((v) => v.category === 'Family Minibus');
        }
        const targetCat = tier === 'Luxury' ? 'Luxury Touring Van' : 'Regular Family SUV';
        return vehicles.filter((v) => v.category === targetCat);
    };

    const calcAirportPrice = (destinasi, direction, tier) => {
        if (!destinasi) return null;
        const row = airports.find((a) => a.destinasi === destinasi && a.type === direction);
        if (!row) return null;
        if (tier === 'Luxury') return row.price_luxury;
        if (tier === 'Big Van') return row.price_luxury;
        return row.price_regular;
    };

    const calcHotelTransferPrice = (pickupId, dropoffId, tier) => {
        if (!pickupId || !dropoffId) return { price: null, warning: null };
        let row = hotel_price_lists.find(
            (hp) => String(hp.hotel_id_pickup) === String(pickupId) && String(hp.hotel_id_dropoff) === String(dropoffId)
        );
        if (!row) {
            row = hotel_price_lists.find(
                (hp) => String(hp.hotel_id_pickup) === String(dropoffId) && String(hp.hotel_id_dropoff) === String(pickupId)
            );
        }
        if (row) {
            return {
                price: (tier === 'Luxury' || tier === 'Big Van') ? row.luxury_price : row.regular_price,
                warning: null,
            };
        }
        return {
            price: null,
            warning: 'Harga belum diatur untuk rute ini, isi manual',
        };
    };

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
        const initialDirection = 'Pick-Up';
        const defaultDestinations = getDestinations(initialDirection);
        const firstDest = defaultDestinations[0] || '';
        const regVehicles = vehicles.filter((v) => v.tier === 'Regular' || v.category === 'Regular Family SUV');
        const defaultVehicle = regVehicles[0] || vehicles[0];
        const initialTier = defaultVehicle?.tier || 'Regular';
        const autoPrice = calcAirportPrice(firstDest, initialDirection, initialTier);

        addBookingForm.setData({
            auto_parse_text: '',
            status: 'Pending',
            booking_type_ui: 'Airport Pick-Up',
            selected_destinasi: firstDest,
            selected_hotel_id: '',
            hotel_id_pickup: '',
            hotel_id_dropoff: '',
            vehicle_tier: initialTier,
            package_id: '',
            guest_name: '',
            whatsapp_number: '',
            email: '',
            flight_number: '',
            vehicle_id: defaultVehicle?.id ? String(defaultVehicle.id) : '',
            booking_date: new Date().toISOString().split('T')[0],
            pickup_time: '09:00',
            pickup_location: 'I Gusti Ngurah Rai Airport (DPS)',
            dropoff_location: '',
            adults: 1,
            children: 0,
            total_fee: autoPrice !== null ? String(autoPrice) : '',
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
        if (['Completed', 'Cancelled'].includes(booking?.status)) {
            return;
        }
        setSelectedBooking(booking);
        assignDriverForm.clearErrors();
        assignDriverForm.setData({
            driver_id: booking.driver_id || '',
            vehicle_unit_id: booking.vehicle_unit_id || '',
        });
        setShowAssignDriverModal(true);
    };

    const handleAssignDriverSubmit = (e) => {
        e.preventDefault();
        if (!selectedBooking) return;
        assignDriverForm.post(`/admin/bookings/${selectedBooking.raw_id}/assign-driver`, {
            onSuccess: () => {
                setShowAssignDriverModal(false);
                setSelectedBooking(null);
                assignDriverForm.reset();
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

        const currentVehicle = vehicles.find((v) => String(v.id) === String(booking.vehicle_id));
        let tier = 'Regular';
        if (currentVehicle?.tier === 'Luxury' || currentVehicle?.category === 'Luxury Touring Van') {
            tier = 'Luxury';
        } else if (currentVehicle?.tier === 'Big Van' || currentVehicle?.category === 'Family Minibus') {
            tier = 'Big Van';
        }

        let selectedDest = '';
        let selectedHotelId = '';
        let hotelPickupId = '';
        let hotelDropoffId = '';

        if (typeUi === 'Airport Pick-Up' || typeUi === 'Airport Drop-Off') {
            const hotelTargetId = typeUi === 'Airport Pick-Up' ? booking.dropoff_hotel_id : booking.pickup_hotel_id;
            const hotelTargetName = typeUi === 'Airport Pick-Up' ? (booking.dropoff_location_name || booking.dropoff_location) : (booking.pickup_location_name || booking.pickup_location);

            let matchedHotel = null;
            if (hotelTargetId) {
                matchedHotel = hotels.find((h) => String(h.id) === String(hotelTargetId));
            }
            if (!matchedHotel && hotelTargetName) {
                matchedHotel = hotels.find((h) => h.nama_hotel?.toLowerCase() === hotelTargetName?.toLowerCase());
            }

            if (matchedHotel) {
                selectedHotelId = String(matchedHotel.id);
                if (matchedHotel.airports && matchedHotel.airports.length > 0) {
                    selectedDest = matchedHotel.airports[0].destinasi;
                }
            }

            if (!selectedDest && booking.airport_id) {
                const matchedAirport = airports.find((a) => String(a.id) === String(booking.airport_id));
                if (matchedAirport) {
                    selectedDest = matchedAirport.destinasi;
                }
            }

            if (!selectedDest && hotelTargetName) {
                const dir = typeUi === 'Airport Pick-Up' ? 'Pick-Up' : 'Drop-Off';
                const availDests = getDestinations(dir);
                const foundDest = availDests.find((d) => hotelTargetName?.toLowerCase()?.includes(d.toLowerCase()));
                if (foundDest) {
                    selectedDest = foundDest;
                }
            }
        } else if (typeUi === 'Hotel Transfer') {
            if (booking.pickup_hotel_id) {
                hotelPickupId = String(booking.pickup_hotel_id);
            } else if (booking.pickup_location_name || booking.pickup_location) {
                const loc = (booking.pickup_location_name || booking.pickup_location).toLowerCase();
                const hPickup = hotels.find((h) => h.nama_hotel?.toLowerCase() === loc);
                if (hPickup) hotelPickupId = String(hPickup.id);
            }

            if (booking.dropoff_hotel_id) {
                hotelDropoffId = String(booking.dropoff_hotel_id);
            } else if (booking.dropoff_location_name || booking.dropoff_location) {
                const loc = (booking.dropoff_location_name || booking.dropoff_location).toLowerCase();
                const hDropoff = hotels.find((h) => h.nama_hotel?.toLowerCase() === loc);
                if (hDropoff) hotelDropoffId = String(hDropoff.id);
            }
        }

        editBookingForm.setData({
            _method: 'put',
            auto_parse_text: '',
            status: booking.status || 'Pending',
            booking_type_ui: typeUi,
            selected_destinasi: selectedDest,
            selected_hotel_id: selectedHotelId,
            hotel_id_pickup: hotelPickupId,
            hotel_id_dropoff: hotelDropoffId,
            vehicle_tier: tier,
            package_id: booking.package_id ? String(booking.package_id) : '',
            guest_name: booking.guest_name || '',
            whatsapp_number: booking.whatsapp_number || '',
            email: booking.email || '',
            flight_number: booking.flight_number || '',
            vehicle_id: booking.vehicle_id ? String(booking.vehicle_id) : (vehicles[0]?.id ? String(vehicles[0].id) : ''),
            booking_date: booking.raw_booking_date || '',
            pickup_time: booking.raw_pickup_time || '09:00',
            pickup_location: booking.pickup_location_name || booking.pickup_location || '',
            dropoff_location: booking.dropoff_location_name || booking.dropoff_location || '',
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

    // Booking Type Badge Component
    const renderBookingTypeBadge = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('pick-up') || t.includes('pickup')) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]"></span>
                    {type}
                </span>
            );
        }
        if (t.includes('drop-off') || t.includes('dropoff')) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    {type}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {type}
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

    // Render Conditional Booking Form Fields for Add and Edit Modals
    const renderBookingFormFields = (form, formId) => {
        const typeUi = form.data.booking_type_ui;
        const isAirport = typeUi === 'Airport Pick-Up' || typeUi === 'Airport Drop-Off';
        const direction = typeUi === 'Airport Pick-Up' ? 'Pick-Up' : 'Drop-Off';
        const isHotelTransfer = typeUi === 'Hotel Transfer';
        const isDayTour = typeUi === 'Day Tour';

        const selectedPkg = packages.find((p) => String(p.id) === String(form.data.package_id));
        const isFullDayTour = isDayTour && (selectedPkg?.duration_type === 'Full Day');

        // Dynamic lists
        const availableDestinations = isAirport ? getDestinations(direction) : [];
        const hotelsForSelectedDest = isAirport ? getHotelsForDestinasi(form.data.selected_destinasi) : [];
        const selectedVehicle = vehicles.find((v) => String(v.id) === String(form.data.vehicle_id));
        const vehicleTier = selectedVehicle?.tier || form.data.vehicle_tier || 'Regular';

        const hotelTransferPricing = isHotelTransfer
            ? calcHotelTransferPrice(form.data.hotel_id_pickup, form.data.hotel_id_dropoff, vehicleTier)
            : { price: null, warning: null };

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Status */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={form.data.status}
                        onChange={(e) => form.setData('status', e.target.value)}
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
                    {form.errors.status && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.status}</p>
                    )}
                </div>

                {/* 2. Booking Type */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Booking Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={form.data.booking_type_ui}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'Airport Pick-Up') {
                                const dests = getDestinations('Pick-Up');
                                const firstDest = dests[0] || '';
                                const regVehicles = vehicles.filter((v) => v.tier === 'Regular' || v.category === 'Regular Family SUV');
                                const chosenV = regVehicles[0] || vehicles[0];
                                const tier = chosenV?.tier || 'Regular';
                                const price = calcAirportPrice(firstDest, 'Pick-Up', tier);
                                form.setData((prev) => ({
                                    ...prev,
                                    booking_type_ui: 'Airport Pick-Up',
                                    selected_destinasi: firstDest,
                                    selected_hotel_id: '',
                                    hotel_id_pickup: '',
                                    hotel_id_dropoff: '',
                                    vehicle_tier: tier,
                                    vehicle_id: chosenV?.id ? String(chosenV.id) : '',
                                    package_id: '',
                                    pickup_location: 'I Gusti Ngurah Rai Airport (DPS)',
                                    dropoff_location: '',
                                    total_fee: price !== null ? String(price) : '',
                                }));
                            } else if (val === 'Airport Drop-Off') {
                                const dests = getDestinations('Drop-Off');
                                const firstDest = dests[0] || '';
                                const regVehicles = vehicles.filter((v) => v.tier === 'Regular' || v.category === 'Regular Family SUV');
                                const chosenV = regVehicles[0] || vehicles[0];
                                const tier = chosenV?.tier || 'Regular';
                                const price = calcAirportPrice(firstDest, 'Drop-Off', tier);
                                form.setData((prev) => ({
                                    ...prev,
                                    booking_type_ui: 'Airport Drop-Off',
                                    selected_destinasi: firstDest,
                                    selected_hotel_id: '',
                                    hotel_id_pickup: '',
                                    hotel_id_dropoff: '',
                                    vehicle_tier: tier,
                                    vehicle_id: chosenV?.id ? String(chosenV.id) : '',
                                    package_id: '',
                                    pickup_location: '',
                                    dropoff_location: 'I Gusti Ngurah Rai Airport (DPS)',
                                    total_fee: price !== null ? String(price) : '',
                                }));
                            } else if (val === 'Hotel Transfer') {
                                const regVehicles = vehicles.filter((v) => v.tier === 'Regular' || v.category === 'Regular Family SUV');
                                const chosenV = regVehicles[0] || vehicles[0];
                                const tier = chosenV?.tier || 'Regular';
                                form.setData((prev) => ({
                                    ...prev,
                                    booking_type_ui: 'Hotel Transfer',
                                    selected_destinasi: '',
                                    selected_hotel_id: '',
                                    hotel_id_pickup: '',
                                    hotel_id_dropoff: '',
                                    vehicle_tier: tier,
                                    vehicle_id: chosenV?.id ? String(chosenV.id) : '',
                                    package_id: '',
                                    flight_number: '',
                                    pickup_location: '',
                                    dropoff_location: '',
                                    total_fee: '',
                                }));
                            } else if (val === 'Day Tour') {
                                const firstPkg = packages[0];
                                const pkgId = firstPkg?.id ? String(firstPkg.id) : '';
                                const isFull = firstPkg?.duration_type === 'Full Day';
                                const targetList = isFull
                                    ? vehicles.filter((v) => v.tier === 'Big Van' || v.category === 'Family Minibus')
                                    : vehicles.filter((v) => v.tier === 'Regular' || v.category === 'Regular Family SUV');
                                const chosenV = targetList[0] || vehicles[0];
                                const tier = isFull ? 'Big Van' : (chosenV?.tier || 'Regular');
                                const price = isFull
                                    ? (firstPkg?.big_van_price || firstPkg?.price)
                                    : (firstPkg?.regular_price || firstPkg?.price);
                                form.setData((prev) => ({
                                    ...prev,
                                    booking_type_ui: 'Day Tour',
                                    selected_destinasi: '',
                                    selected_hotel_id: '',
                                    hotel_id_pickup: '',
                                    hotel_id_dropoff: '',
                                    vehicle_tier: tier,
                                    vehicle_id: chosenV?.id ? String(chosenV.id) : '',
                                    package_id: pkgId,
                                    flight_number: '',
                                    pickup_location: '',
                                    dropoff_location: '',
                                    total_fee: price ? String(price) : '',
                                }));
                            }
                        }}
                        required
                        className={selectClass}
                    >
                        <option value="Airport Pick-Up">Airport Pick-Up</option>
                        <option value="Airport Drop-Off">Airport Drop-Off</option>
                        <option value="Hotel Transfer">Hotel Transfer</option>
                        <option value="Day Tour">Day Tour</option>
                    </select>
                    {form.errors.booking_type && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.booking_type}</p>
                    )}
                </div>

                {/* ═══ SECTION A: AIRPORT TRANSFER FLOW ═══ */}
                {isAirport && (
                    <>
                        {/* 1. Destinasi/Wilayah */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Destinasi / Wilayah ({direction}) <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.data.selected_destinasi}
                                onChange={(e) => {
                                    const destVal = e.target.value;
                                    const price = calcAirportPrice(destVal, direction, vehicleTier);
                                    form.setData((prev) => ({
                                        ...prev,
                                        selected_destinasi: destVal,
                                        selected_hotel_id: '',
                                        total_fee: price !== null ? String(price) : prev.total_fee,
                                        ...(direction === 'Pick-Up' ? { dropoff_location: '' } : { pickup_location: '' }),
                                    }));
                                }}
                                required
                                className={selectClass}
                            >
                                <option value="">-- Pilih Wilayah/Destinasi --</option>
                                {availableDestinations.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 2. Hotel Tujuan / Penjemputan */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Hotel {direction === 'Pick-Up' ? 'Tujuan' : 'Penjemputan'}{' '}
                                {form.data.selected_destinasi ? `di ${form.data.selected_destinasi}` : ''} <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.data.selected_hotel_id}
                                onChange={(e) => {
                                    const hotelId = e.target.value;
                                    if (hotelId === '__custom__') {
                                        form.setData((prev) => ({
                                            ...prev,
                                            selected_hotel_id: '__custom__',
                                            ...(direction === 'Pick-Up' ? { dropoff_location: '' } : { pickup_location: '' }),
                                        }));
                                    } else {
                                        const selectedH = hotels.find((h) => String(h.id) === String(hotelId));
                                        const hotelName = selectedH?.nama_hotel || '';
                                        form.setData((prev) => ({
                                            ...prev,
                                            selected_hotel_id: hotelId,
                                            ...(direction === 'Pick-Up'
                                                ? { dropoff_location: hotelName }
                                                : { pickup_location: hotelName }),
                                        }));
                                    }
                                }}
                                disabled={!form.data.selected_destinasi}
                                required={form.data.selected_hotel_id !== '__custom__'}
                                className={selectClass}
                            >
                                <option value="">
                                    {form.data.selected_destinasi
                                        ? (hotelsForSelectedDest.length > 0 ? '-- Pilih Hotel Terdaftar --' : '-- Belum ada hotel terdaftar, ketik manual --')
                                        : '-- Pilih Destinasi Dahulu --'}
                                </option>
                                {hotelsForSelectedDest.map((h) => (
                                    <option key={h.id} value={h.id}>
                                        {h.nama_hotel}
                                    </option>
                                ))}
                                {form.data.selected_destinasi && (
                                    <option value="__custom__">+ Ketik Nama Hotel / Villa Manual</option>
                                )}
                            </select>
                        </div>

                        {/* Custom Hotel Input if chosen or no hotels in dest */}
                        {(form.data.selected_hotel_id === '__custom__' || (form.data.selected_destinasi && hotelsForSelectedDest.length === 0)) && (
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Nama Hotel / Villa / Lokasi {direction === 'Pick-Up' ? 'Tujuan' : 'Penjemputan'} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={direction === 'Pick-Up' ? form.data.dropoff_location : form.data.pickup_location}
                                    onChange={(e) => {
                                        const locVal = e.target.value;
                                        form.setData((prev) => ({
                                            ...prev,
                                            selected_hotel_id: '__custom__',
                                            ...(direction === 'Pick-Up' ? { dropoff_location: locVal } : { pickup_location: locVal }),
                                        }));
                                    }}
                                    placeholder="e.g. Maya Sanur Resort & Spa / Villa Ombak Sunset"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                                />
                            </div>
                        )}

                        {/* 3. Pilih Kendaraan */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Pilih Kendaraan <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.data.vehicle_tier}
                                onChange={(e) => {
                                    const newTier = e.target.value;
                                    const chosenV = vehicles.find((v) => v.tier === newTier) || vehicles[0];
                                    const price = calcAirportPrice(form.data.selected_destinasi, direction, newTier);
                                    form.setData((prev) => ({
                                        ...prev,
                                        vehicle_tier: newTier,
                                        vehicle_id: chosenV?.id ? String(chosenV.id) : prev.vehicle_id,
                                        total_fee: price !== null ? String(price) : prev.total_fee,
                                    }));
                                }}
                                required
                                className={selectClass}
                            >
                                <option value="Regular">Regular</option>
                                <option value="Luxury">Luxury</option>
                                <option value="Big Van">Big Van</option>
                            </select>
                            {form.errors.vehicle_id && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.vehicle_id}</p>
                            )}
                        </div>

                        {/* 4. Flight Number */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Flight Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={form.data.flight_number}
                                onChange={(e) => form.setData('flight_number', e.target.value)}
                                placeholder="e.g. SQ-938 / GA-401"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {form.errors.flight_number && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.flight_number}</p>
                            )}
                        </div>

                        {/* Route Summary Pill */}
                        <div className="sm:col-span-2 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-slate-600">
                                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Rute:</span>
                                <span className="font-semibold text-slate-800">{form.data.pickup_location || '(Bandara DPS)'}</span>
                                <span className="text-slate-400">➔</span>
                                <span className="font-semibold text-slate-800">{form.data.dropoff_location || '(Hotel Tujuan)'}</span>
                            </div>
                            <span className="text-[11px] font-medium text-slate-500">
                                Kendaraan: <strong className="text-slate-700">{vehicleTier}</strong>
                            </span>
                        </div>
                    </>
                )}

                {/* ═══ SECTION B: HOTEL TRANSFER FLOW ═══ */}
                {isHotelTransfer && (
                    <>
                        {/* 1. Hotel Asal */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Hotel Asal (Penjemputan) <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.data.hotel_id_pickup}
                                onChange={(e) => {
                                    const asalId = e.target.value;
                                    const hAsal = hotels.find((h) => String(h.id) === String(asalId));
                                    const destinationPairCheck = (destId) => (form.data.hotel_id_dropoff === destId ? '' : form.data.hotel_id_dropoff);
                                    const tujuanId = form.data.hotel_id_dropoff === asalId ? '' : form.data.hotel_id_dropoff;
                                    const hTujuan = hotels.find((h) => String(h.id) === String(tujuanId));
                                    const pricing = calcHotelTransferPrice(asalId, tujuanId, vehicleTier);
                                    form.setData((prev) => ({
                                        ...prev,
                                        hotel_id_pickup: asalId,
                                        hotel_id_dropoff: tujuanId,
                                        pickup_location: hAsal?.nama_hotel || '',
                                        dropoff_location: hTujuan?.nama_hotel || (tujuanId ? prev.dropoff_location : ''),
                                        total_fee: pricing.price !== null ? String(pricing.price) : '',
                                    }));
                                }}
                                required
                                className={selectClass}
                            >
                                <option value="">-- Pilih Hotel Asal --</option>
                                {hotels.map((h) => (
                                    <option key={h.id} value={h.id}>
                                        {h.nama_hotel}
                                    </option>
                                ))}
                            </select>
                            {form.errors.pickup_location && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.pickup_location}</p>
                            )}
                        </div>

                        {/* 2. Hotel Tujuan (Exclude Hotel Asal) */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Hotel Tujuan (Pengantaran) <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.data.hotel_id_dropoff}
                                onChange={(e) => {
                                    const tujuanId = e.target.value;
                                    const hTujuan = hotels.find((h) => String(h.id) === String(tujuanId));
                                    const pricing = calcHotelTransferPrice(form.data.hotel_id_pickup, tujuanId, vehicleTier);
                                    form.setData((prev) => ({
                                        ...prev,
                                        hotel_id_dropoff: tujuanId,
                                        dropoff_location: hTujuan?.nama_hotel || '',
                                        total_fee: pricing.price !== null ? String(pricing.price) : '',
                                    }));
                                }}
                                required
                                className={selectClass}
                            >
                                <option value="">-- Pilih Hotel Tujuan --</option>
                                {hotels
                                    .filter((h) => String(h.id) !== String(form.data.hotel_id_pickup))
                                    .map((h) => (
                                        <option key={h.id} value={h.id}>
                                            {h.nama_hotel}
                                        </option>
                                    ))}
                            </select>
                            {form.errors.dropoff_location && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.dropoff_location}</p>
                            )}
                        </div>

                        {/* 3. Pilih Kendaraan */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Pilih Kendaraan <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.data.vehicle_tier}
                                onChange={(e) => {
                                    const newTier = e.target.value;
                                    const chosenV = vehicles.find((v) => v.tier === newTier) || vehicles[0];
                                    const pricing = calcHotelTransferPrice(form.data.hotel_id_pickup, form.data.hotel_id_dropoff, newTier);
                                    form.setData((prev) => ({
                                        ...prev,
                                        vehicle_tier: newTier,
                                        vehicle_id: chosenV?.id ? String(chosenV.id) : prev.vehicle_id,
                                        total_fee: pricing.price !== null ? String(pricing.price) : prev.total_fee,
                                    }));
                                }}
                                required
                                className={selectClass}
                            >
                                <option value="Regular">Regular</option>
                                <option value="Luxury">Luxury</option>
                                <option value="Big Van">Big Van</option>
                            </select>
                            {form.errors.vehicle_id && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.vehicle_id}</p>
                            )}
                        </div>

                        {/* Price Warning if unconfigured */}
                        {form.data.hotel_id_pickup && form.data.hotel_id_dropoff && hotelTransferPricing.warning && (
                            <div className="sm:col-span-2 flex items-center gap-2 p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-semibold text-amber-800">
                                <svg className="w-4 h-4 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{hotelTransferPricing.warning}</span>
                            </div>
                        )}

                        {/* Route Summary Pill */}
                        <div className="sm:col-span-2 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-slate-600">
                                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">Rute Antar Hotel:</span>
                                <span className="font-semibold text-slate-800">{form.data.pickup_location || '(Hotel Asal)'}</span>
                                <span className="text-slate-400">➔</span>
                                <span className="font-semibold text-slate-800">{form.data.dropoff_location || '(Hotel Tujuan)'}</span>
                            </div>
                            <span className="text-[11px] font-medium text-slate-500">
                                Kendaraan: <strong className="text-slate-700">{vehicleTier}</strong>
                            </span>
                        </div>
                    </>
                )}

                {/* ═══ SECTION C: DAY TOUR FLOW ═══ */}
                {isDayTour && (
                    <>
                        {/* 1. Pilih Package */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Pilih Package Tour <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.data.package_id}
                                onChange={(e) => {
                                    const pkgId = e.target.value;
                                    const pkg = packages.find((p) => String(p.id) === String(pkgId));
                                    const isFull = pkg?.duration_type === 'Full Day';
                                    const newTier = isFull ? 'Big Van' : (form.data.vehicle_tier === 'Big Van' ? 'Regular' : form.data.vehicle_tier);
                                    const chosenV = vehicles.find((v) => v.tier === newTier) || vehicles[0];

                                    const price = isFull
                                        ? (pkg?.big_van_price || pkg?.price || '')
                                        : (newTier === 'Luxury' ? (pkg?.luxury_price || pkg?.price || '') : (pkg?.regular_price || pkg?.price || ''));

                                    form.setData((prev) => ({
                                        ...prev,
                                        package_id: pkgId,
                                        vehicle_id: chosenV?.id ? String(chosenV.id) : prev.vehicle_id,
                                        vehicle_tier: newTier,
                                        total_fee: price ? String(price) : prev.total_fee,
                                    }));
                                }}
                                required
                                className={selectClass}
                            >
                                <option value="">-- Pilih Tour Package --</option>
                                {packages.map((pkg) => (
                                    <option key={pkg.id} value={pkg.id}>
                                        {pkg.name} ({pkg.duration_type || 'Full Day'})
                                    </option>
                                ))}
                            </select>
                            {form.errors.package_id && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.package_id}</p>
                            )}
                        </div>

                        {/* 2. Vehicle Selector */}
                        {isFullDayTour ? (
                            <div className="sm:col-span-2">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                                        Pilih Kendaraan <span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        Full Day: Big Van
                                    </span>
                                </div>
                                <select
                                    value="Big Van"
                                    disabled
                                    className={`${selectClass} bg-slate-100 opacity-90 cursor-not-allowed`}
                                >
                                    <option value="Big Van">Big Van</option>
                                </select>
                            </div>
                        ) : (
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Pilih Kendaraan <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.data.vehicle_tier}
                                    onChange={(e) => {
                                        const newTier = e.target.value;
                                        const chosenV = vehicles.find((v) => v.tier === newTier) || vehicles[0];
                                        const p = newTier === 'Big Van'
                                            ? (selectedPkg?.big_van_price || selectedPkg?.price)
                                            : (newTier === 'Luxury' ? (selectedPkg?.luxury_price || selectedPkg?.price) : (selectedPkg?.regular_price || selectedPkg?.price));
                                        form.setData((prev) => ({
                                            ...prev,
                                            vehicle_id: chosenV?.id ? String(chosenV.id) : prev.vehicle_id,
                                            vehicle_tier: newTier,
                                            total_fee: p ? String(p) : prev.total_fee,
                                        }));
                                    }}
                                    required
                                    className={selectClass}
                                >
                                    <option value="Regular">Regular</option>
                                    <option value="Luxury">Luxury</option>
                                    <option value="Big Van">Big Van</option>
                                </select>
                                {form.errors.vehicle_id && (
                                    <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.vehicle_id}</p>
                                )}
                            </div>
                        )}

                        {/* 3. Lokasi Penjemputan Day Tour */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Lokasi Penjemputan (Hotel / Villa / Meeting Point) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={form.data.pickup_location}
                                onChange={(e) => {
                                    const loc = e.target.value;
                                    form.setData((prev) => ({
                                        ...prev,
                                        pickup_location: loc,
                                        dropoff_location: loc,
                                    }));
                                }}
                                placeholder="e.g. Lobby Maya Sanur Resort & Spa / Villa Seminyak"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                            />
                            {form.errors.pickup_location && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.pickup_location}</p>
                            )}
                        </div>
                    </>
                )}

                {/* Date */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        required
                        value={form.data.booking_date}
                        onChange={(e) => form.setData('booking_date', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                    />
                    {form.errors.booking_date && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.booking_date}</p>
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
                        value={form.data.pickup_time}
                        onChange={(e) => form.setData('pickup_time', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                    />
                    {form.errors.pickup_time && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.pickup_time}</p>
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
                        value={form.data.guest_name}
                        onChange={(e) => form.setData('guest_name', e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                    />
                    {form.errors.guest_name && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.guest_name}</p>
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
                        value={form.data.whatsapp_number}
                        onChange={(e) => form.setData('whatsapp_number', e.target.value)}
                        placeholder="e.g. +62 812-3456-7890"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                    />
                    {form.errors.whatsapp_number && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.whatsapp_number}</p>
                    )}
                </div>

                {/* Email Address */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        placeholder="e.g. john@example.com"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                    />
                    {form.errors.email && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.email}</p>
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
                        value={form.data.adults}
                        onChange={(e) => form.setData('adults', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                    />
                    {form.errors.adults && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.adults}</p>
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
                        value={form.data.children}
                        onChange={(e) => form.setData('children', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs"
                    />
                    {form.errors.children && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.children}</p>
                    )}
                </div>

                {/* Total Fee */}
                <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                            Total Fee (Rp) <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-medium">
                            Otomatis terisi dari rute/paket & kendaraan, dapat disesuaikan manual
                        </span>
                    </div>
                    <input
                        type="number"
                        min="0"
                        max="9999999999"
                        required
                        value={form.data.total_fee}
                        onChange={(e) => form.setData('total_fee', e.target.value)}
                        placeholder="e.g. 450000"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs font-semibold"
                    />
                    {form.errors.total_fee && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.total_fee}</p>
                    )}
                </div>

                {/* Notes */}
                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Notes / Special Requests
                    </label>
                    <textarea
                        rows="2"
                        value={form.data.notes}
                        onChange={(e) => form.setData('notes', e.target.value)}
                        placeholder="e.g. Request 1 baby car seat, butuh driver fasih bahasa inggris..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-base sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none font-sans shadow-2xs"
                    />
                    {form.errors.notes && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.notes}</p>
                    )}
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

                {/* 1. 4 STAT CARDS (2 Columns on mobile, 4 Columns on desktop) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                    {/* Card 1: All Bookings */}
                    <div className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-50 border border-sky-200/60 flex items-center justify-center text-[#00AEEF] shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2" />
                                <path d="M3 9h18" />
                                <path d="M9 21V9" />
                            </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-tight whitespace-nowrap">
                                All Bookings
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-xl sm:text-2xl font-bold text-slate-900">
                                    {stats.all_bookings ?? 0}
                                </span>
                                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                                    Total
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Airport Pick-Up */}
                    <div className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                            </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-tight whitespace-nowrap">
                                Airport Pick-Up
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-xl sm:text-2xl font-bold text-slate-900">
                                    {stats.airport_pickup ?? 0}
                                </span>
                                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                                    Trips
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Airport Drop-Off */}
                    <div className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 -scale-x-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                            </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-tight whitespace-nowrap">
                                Airport Drop-Off
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-xl sm:text-2xl font-bold text-slate-900">
                                    {stats.airport_dropoff ?? 0}
                                </span>
                                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                                    Trips
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Day Tour */}
                    <div className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                                <line x1="9" x2="9" y1="3" y2="18" />
                                <line x1="15" x2="15" y1="6" y2="21" />
                            </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-tight whitespace-nowrap">
                                Day Tour
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-xl sm:text-2xl font-bold text-slate-900">
                                    {stats.day_tour ?? 0}
                                </span>
                                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                                    Tours
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
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/90 rounded-xl text-base sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-xs min-h-[44px]"
                        />
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" x2="16.65" y1="21" y2="16.65" />
                            </svg>
                        </div>
                    </form>

                    {/* Bookings Card Container */}
                    <div className="bg-white border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden">
                        {/* Table Header / Action Bar */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 gap-2">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                                    Recent Bookings
                                </h3>
                                <span className="bg-slate-100 text-slate-600 text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shrink-0">
                                    {bookings.total || bookings.data?.length || 0}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={openAddBooking}
                                className="inline-flex items-center gap-1.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white text-xs font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-xs active:scale-[0.98] cursor-pointer min-h-[40px] shrink-0"
                            >
                                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <line x1="12" x2="12" y1="5" y2="19" />
                                    <line x1="5" x2="19" y1="12" y2="12" />
                                </svg>
                                <span><span className="hidden xs:inline">Add </span>Booking</span>
                            </button>
                        </div>

                        {/* Desktop Bookings Table (No horizontal scroll, fully fitted) */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left border-collapse table-fixed">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                                        <th className="px-4 py-3.5 w-[14%]">ID & Date</th>
                                        <th className="px-4 py-3.5 w-[19%]">Guest</th>
                                        <th className="px-4 py-3.5 w-[27%]">Service & Route</th>
                                        <th className="px-4 py-3.5 w-[13%]">Payment</th>
                                        <th className="px-4 py-3.5 w-[12%]">Status</th>
                                        <th className="px-4 py-3.5 w-[15%] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {bookings.data && bookings.data.length > 0 ? (
                                        bookings.data.map((booking) => (
                                            <tr key={booking.raw_id} className="hover:bg-slate-50/70 transition-colors">
                                                {/* ID & Date */}
                                                <td className="px-4 py-3.5 align-middle">
                                                    <div className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                                                        #{booking.id}
                                                    </div>
                                                    <div className="text-xs text-slate-600 font-medium mt-0.5 whitespace-nowrap">
                                                        {booking.date}
                                                    </div>
                                                    {booking.raw_pickup_time && (
                                                        <div className="text-[11px] text-slate-400 font-normal flex items-center gap-1 mt-0.5 whitespace-nowrap">
                                                            <svg className="w-3 h-3 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <polyline points="12 6 12 12 16 14" />
                                                            </svg>
                                                            <span>{booking.raw_pickup_time}</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Guest Name & WhatsApp */}
                                                <td className="px-4 py-3.5 align-middle">
                                                    <div className="font-bold text-slate-900 text-sm leading-snug truncate" title={booking.guest_name}>
                                                        {booking.guest_name}
                                                    </div>
                                                    {booking.whatsapp_number ? (
                                                        <a
                                                            href={`https://wa.me/${booking.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 hover:underline mt-1 font-medium group truncate max-w-full"
                                                            title="Hubungi via WhatsApp"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <svg className="w-3 h-3 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                                                            </svg>
                                                            <span className="truncate">{booking.whatsapp_number}</span>
                                                        </a>
                                                    ) : booking.email ? (
                                                        <div className="text-[11px] text-slate-400 font-normal truncate mt-0.5" title={booking.email}>
                                                            {booking.email}
                                                        </div>
                                                    ) : null}
                                                </td>

                                                {/* Service & Route */}
                                                <td className="px-4 py-3.5 align-middle">
                                                    <div className="flex flex-col gap-1">
                                                        <div>
                                                            {renderBookingTypeBadge(booking.booking_type)}
                                                        </div>
                                                        <div className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed" title={booking.detail}>
                                                            {booking.detail}
                                                        </div>
                                                        {booking.driver ? (
                                                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100/90 px-2 py-0.5 rounded-md w-fit mt-0.5">
                                                                <svg className="w-3 h-3 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                                    <circle cx="9" cy="7" r="4" />
                                                                </svg>
                                                                <span className="truncate max-w-[150px]">{booking.driver.name}</span>
                                                            </div>
                                                        ) : (
                                                            !['Completed', 'Cancelled'].includes(booking.status) ? (
                                                                <span className="text-[11px] text-amber-600 font-medium inline-flex items-center gap-1 mt-0.5">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                                                    Belum ada driver
                                                                </span>
                                                            ) : null
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Payment */}
                                                <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                                                    <span className="font-bold text-slate-900 text-sm sm:text-base tabular-nums">
                                                        {booking.payment}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-3.5 align-middle whitespace-nowrap">
                                                    {renderStatusBadge(booking.status)}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-3.5 align-middle text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* Assign Driver Action */}
                                                        {['Completed', 'Cancelled'].includes(booking.status) ? (
                                                            <span
                                                                className="p-1.5 sm:p-2 text-slate-300 bg-slate-50 border border-slate-100 rounded-xl cursor-not-allowed opacity-50 flex items-center justify-center min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px]"
                                                                title={`Booking ${booking.status} tidak dapat di-assign driver`}
                                                            >
                                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                                    <circle cx="9" cy="7" r="4" />
                                                                    <line x1="19" x2="19" y1="8" y2="14" />
                                                                    <line x1="22" x2="16" y1="11" y2="11" />
                                                                </svg>
                                                            </span>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => openAssignDriver(booking)}
                                                                className="p-1.5 sm:p-2 text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 rounded-xl transition-all cursor-pointer flex items-center justify-center min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] shadow-2xs hover:scale-105 active:scale-95"
                                                                title={booking.driver ? `Ganti Driver (${booking.driver.name})` : "Assign Driver"}
                                                            >
                                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                                    <circle cx="9" cy="7" r="4" />
                                                                    <line x1="19" x2="19" y1="8" y2="14" />
                                                                    <line x1="22" x2="16" y1="11" y2="11" />
                                                                </svg>
                                                            </button>
                                                        )}

                                                        {/* Edit Booking Action */}
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditBooking(booking)}
                                                            className="p-1.5 sm:p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/70 rounded-xl transition-all cursor-pointer flex items-center justify-center min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] shadow-2xs hover:scale-105 active:scale-95"
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
                                                            className="p-1.5 sm:p-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/60 rounded-xl transition-all cursor-pointer flex items-center justify-center min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] shadow-2xs hover:scale-105 active:scale-95"
                                                            title="Hapus Booking"
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
                                                No bookings found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile & Tablet Bookings Card List */}
                        <div className="block lg:hidden divide-y divide-slate-100">
                            {bookings.data && bookings.data.length > 0 ? (
                                bookings.data.map((booking) => (
                                    <div key={booking.raw_id} className="p-4 sm:p-5 flex flex-col gap-3 hover:bg-slate-50/50 transition-colors">
                                        {/* Top Row */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono font-bold text-slate-500">ID : #{booking.id}</span>
                                                </div>
                                                <div className="text-xs text-slate-400 font-medium mt-0.5">
                                                    {booking.date} {booking.raw_pickup_time ? `• ${booking.raw_pickup_time}` : ''}
                                                </div>
                                            </div>
                                            <div>
                                                {renderStatusBadge(booking.status)}
                                            </div>
                                        </div>

                                        {/* Guest Name & WhatsApp */}
                                        <div>
                                            <h4 className="text-base font-bold text-slate-900 leading-tight">
                                                {booking.guest_name}
                                            </h4>
                                            {booking.whatsapp_number && (
                                                <a
                                                    href={`https://wa.me/${booking.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 mt-1 font-medium"
                                                >
                                                    <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                                                    </svg>
                                                    <span>{booking.whatsapp_number}</span>
                                                </a>
                                            )}
                                        </div>

                                        {/* Details info */}
                                        <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Booking Type:</span>
                                                <div>{renderBookingTypeBadge(booking.booking_type)}</div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Detail :</span>
                                                <span className="font-medium text-slate-700 truncate max-w-[200px]">{booking.detail}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Driver :</span>
                                                <span className="font-semibold text-slate-800">{booking.driver ? booking.driver.name : (['Completed', 'Cancelled'].includes(booking.status) ? '-' : 'Belum di-assign')}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                                                <span className="text-slate-500 font-medium">Total Fee:</span>
                                                <span className="text-sm font-extrabold text-[#00AEEF]">{booking.payment}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons Row */}
                                        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                                            {['Completed', 'Cancelled'].includes(booking.status) ? (
                                                <button
                                                    type="button"
                                                    disabled
                                                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-slate-300 bg-slate-50 border border-slate-100 rounded-xl cursor-not-allowed opacity-50 min-h-[44px]"
                                                    title={`Booking ${booking.status} tidak dapat di-assign`}
                                                >
                                                    <svg className="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                        <circle cx="9" cy="7" r="4" />
                                                        <line x1="19" x2="19" y1="8" y2="14" />
                                                        <line x1="22" x2="16" y1="11" y2="11" />
                                                    </svg>
                                                    <span>Assign</span>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => openAssignDriver(booking)}
                                                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 rounded-xl transition-colors cursor-pointer min-h-[44px]"
                                                >
                                                    <svg className="w-3.5 h-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                        <circle cx="9" cy="7" r="4" />
                                                        <line x1="19" x2="19" y1="8" y2="14" />
                                                        <line x1="22" x2="16" y1="11" y2="11" />
                                                    </svg>
                                                    <span>Assign</span>
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => openEditBooking(booking)}
                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl transition-colors cursor-pointer min-h-[44px]"
                                            >
                                                <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                    <path d="m15 5 4 4" />
                                                </svg>
                                                <span>Edit</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => openDeleteBooking(booking)}
                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 rounded-xl transition-colors cursor-pointer min-h-[44px]"
                                            >
                                                <svg className="w-3.5 h-3.5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                </svg>
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-6 py-8 text-center text-slate-400 text-sm">
                                    No bookings found.
                                </div>
                            )}
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
                onClose={() => {
                    setShowAssignDriverModal(false);
                    setSelectedBooking(null);
                    assignDriverForm.reset();
                }}
                title={`Assign Driver ${selectedBooking ? `(${selectedBooking.booking_code})` : ''}`}
                maxWidth="md"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => {
                                setShowAssignDriverModal(false);
                                setSelectedBooking(null);
                                assignDriverForm.reset();
                            }}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="assign-driver-form"
                            disabled={assignDriverForm.processing || !assignDriverForm.data.driver_id || !assignDriverForm.data.vehicle_unit_id}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer min-h-[44px]"
                        >
                            {assignDriverForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Confirm Assignment</span>
                        </button>
                    </>
                }
            >
                {(() => {
                    const targetCategory = selectedBooking?.vehicle_category || vehicles.find((v) => String(v.id) === String(selectedBooking?.vehicle_id))?.category;
                    const eligibleUnits = (available_vehicle_units || []).filter(
                        (u) => (!targetCategory || u.category === targetCategory) && u.status === 'Available'
                    );

                    return (
                        <form id="assign-driver-form" onSubmit={handleAssignDriverSubmit} className="space-y-4">
                            {selectedBooking && (
                                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1 text-xs text-slate-600">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-slate-900">{selectedBooking.guest_name}</span>
                                        <span className="text-slate-500">{selectedBooking.date}</span>
                                    </div>
                                    <div className="text-slate-500 font-medium">
                                        {selectedBooking.booking_type} &bull; {selectedBooking.detail}
                                    </div>
                                    {targetCategory && (
                                        <div className="text-slate-700 font-medium flex items-center gap-1.5 pt-1.5 border-t border-slate-200/80 mt-1">
                                            <span className="text-slate-400">Kategori Armada:</span>
                                            <span className="font-bold text-slate-900">{targetCategory}</span>
                                            {selectedBooking.vehicle_name && (
                                                <span className="text-slate-500">({selectedBooking.vehicle_name})</span>
                                            )}
                                        </div>
                                    )}
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

                            {/* Select Vehicle Unit */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Pilih Unit Kendaraan {targetCategory ? `(${targetCategory})` : ''} <span className="text-red-500">*</span>
                                </label>
                                {eligibleUnits.length > 0 ? (
                                    <select
                                        value={assignDriverForm.data.vehicle_unit_id}
                                        onChange={(e) => assignDriverForm.setData('vehicle_unit_id', e.target.value)}
                                        required
                                        className={selectClass}
                                    >
                                        <option value="">-- Pilih Unit Kendaraan --</option>
                                        {eligibleUnits.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.label || `${u.plate_number} (${u.category}, ${u.passenger_capacity} Pax)`}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                        <span>
                                            Tidak ada unit <strong>{targetCategory || 'kategori ini'}</strong> yang tersedia (Available) saat ini.
                                        </span>
                                    </div>
                                )}
                                {assignDriverForm.errors.vehicle_unit_id && (
                                    <p className="text-xs text-red-600 mt-1 font-medium">{assignDriverForm.errors.vehicle_unit_id}</p>
                                )}
                            </div>
                        </form>
                    );
                })()}
            </Modal>

            {/* 2. Modal: Add New Booking */}
            <Modal
                show={showAddBookingModal}
                onClose={() => setShowAddBookingModal(false)}
                title="Add New Booking"
                maxWidth="2xl"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowAddBookingModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="add-booking-form"
                            disabled={addBookingForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer min-h-[44px]"
                        >
                            {addBookingForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Save Booking</span>
                        </button>
                    </>
                }
            >
                <form id="add-booking-form" onSubmit={handleAddBookingSubmit} className="space-y-5">
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
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-base sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none font-sans shadow-2xs"
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

                    {/* Conditional Form Fields */}
                    {renderBookingFormFields(addBookingForm, 'add-booking-form')}
                </form>
            </Modal>

            {/* 3. Modal: Edit Booking */}
            <Modal
                show={showEditBookingModal}
                onClose={() => setShowEditBookingModal(false)}
                title={`Edit Booking ${selectedBooking ? `(${selectedBooking.booking_code})` : ''}`}
                maxWidth="2xl"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowEditBookingModal(false)}
                            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="edit-booking-form"
                            disabled={editBookingForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 cursor-pointer min-h-[44px]"
                        >
                            {editBookingForm.processing && (
                                <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                                </svg>
                            )}
                            <span>Update Booking</span>
                        </button>
                    </>
                }
            >
                <form id="edit-booking-form" onSubmit={handleEditBookingSubmit} className="space-y-5">
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
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-base sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none font-sans shadow-2xs"
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

                    {/* Conditional Form Fields */}
                    {renderBookingFormFields(editBookingForm, 'edit-booking-form')}
                </form>
            </Modal>

            {/* 4. Modal: Delete Booking */}
            <Modal
                show={showDeleteBookingModal}
                onClose={() => setShowDeleteBookingModal(false)}
                title="Delete Booking"
                maxWidth="md"
                footer={
                    <>
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
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Apakah Anda yakin ingin menghapus booking <strong>{selectedBooking?.booking_code}</strong>?
                    </p>
                </div>
            </Modal>
        </AdminLayout>
    );
}
