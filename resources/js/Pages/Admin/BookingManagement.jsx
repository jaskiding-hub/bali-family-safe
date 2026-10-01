import React, { useState, useEffect, useRef } from 'react';
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

    // Search and filter state
    const [bookingSearch, setBookingSearch] = useState(filters.search_booking || '');
    const [filterType, setFilterType] = useState(filters.filter_type || 'all');
    const isFirstSearchRender = useRef(true);

    // Modal states
    const [showAddBookingModal, setShowAddBookingModal] = useState(false);
    const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
    const [showEditBookingModal, setShowEditBookingModal] = useState(false);
    const [showDeleteBookingModal, setShowDeleteBookingModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [addSelectedSeats, setAddSelectedSeats] = useState({});
    const [editSelectedSeats, setEditSelectedSeats] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Child seat types
    const childSeatTypes = [
        { id: 1, name: 'Infant Capsule', age_range: '0–1 yr', weight_range: '0–13 kg' },
        { id: 2, name: 'Toddler Seat', age_range: '1–4 yr', weight_range: '9–18 kg' },
        { id: 3, name: 'Booster Seat', age_range: '4–8 yr', weight_range: '15–36 kg' },
    ];

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
        vehicle_unit_id: available_vehicle_units[0]?.id || '',
        package_id: '',
        guest_name: '',
        whatsapp_number: '',
        email: '',
        flight_number: '',
        booking_date: '',
        pickup_time: '09:00',
        pickup_location: '',
        dropoff_location: '',
        adults: 1,
        children: 0,
        total_fee: '',
        notes: '',
        child_seats: [],
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
        vehicle_unit_id: available_vehicle_units[0]?.id || '',
        package_id: '',
        guest_name: '',
        whatsapp_number: '',
        email: '',
        flight_number: '',
        booking_date: '',
        pickup_time: '09:00',
        pickup_location: '',
        dropoff_location: '',
        adults: 1,
        children: 0,
        total_fee: '',
        notes: '',
        child_seats: [],
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

    const calcAirportPrice = (destinasi, direction, categoryOrTier, unitId = null) => {
        if (!destinasi) return null;
        const row = airports.find((a) => a.destinasi === destinasi && a.type === direction);
        if (!row) return null;

        // Check dynamic unit_prices first
        if (unitId && row.unit_prices && row.unit_prices[unitId] !== undefined && row.unit_prices[unitId] !== '') {
            return Number(row.unit_prices[unitId]);
        }

        // Check if category contains 'luxury' (case insensitive)
        const isLuxury = categoryOrTier && String(categoryOrTier).toLowerCase().includes('luxury');

        return isLuxury ? row.price_luxury : row.price_regular;
    };

    const calcHotelTransferPrice = (pickupId, dropoffId, categoryOrTier, unitId = null) => {
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
            // Check dynamic unit_prices first
            if (unitId && row.unit_prices && row.unit_prices[unitId] !== undefined && row.unit_prices[unitId] !== '') {
                return {
                    price: Number(row.unit_prices[unitId]),
                    warning: null,
                };
            }

            const isLuxury = categoryOrTier && String(categoryOrTier).toLowerCase().includes('luxury');

            return {
                price: isLuxury ? row.luxury_price : row.regular_price,
                warning: null,
            };
        }
        return {
            price: null,
            warning: 'Harga belum diatur untuk rute ini, silakan isi manual pada Total Fee',
        };
    };

    // Handle Real-time Debounced Booking Search & Filter
    useEffect(() => {
        if (isFirstSearchRender.current) {
            isFirstSearchRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            router.get(
                '/admin/bookings',
                {
                    search_booking: bookingSearch || undefined,
                    filter_type: filterType !== 'all' ? filterType : undefined,
                },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [bookingSearch, filterType]);

    const handleBookingSearch = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        router.get(
            '/admin/bookings',
            {
                search_booking: bookingSearch || undefined,
                filter_type: filterType !== 'all' ? filterType : undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    // Booking Action Handlers
    const openAddBooking = () => {
        const initialDirection = 'Pick-Up';
        const defaultDestinations = getDestinations(initialDirection);
        const firstDest = defaultDestinations[0] || '';
        const defaultUnit = available_vehicle_units[0];
        const defaultUnitId = defaultUnit?.id ? String(defaultUnit.id) : '';
        const regVehicles = vehicles.filter((v) => v.tier === 'Regular' || v.category === 'Regular Family SUV');
        const defaultVehicle = regVehicles[0] || vehicles[0];
        const initialTier = defaultVehicle?.tier || 'Regular';
        const autoPrice = calcAirportPrice(firstDest, initialDirection, defaultUnit?.category || initialTier, defaultUnitId);

        addBookingForm.setData({
            auto_parse_text: '',
            status: 'Pending',
            booking_type_ui: 'Airport Pick-Up',
            selected_destinasi: firstDest,
            selected_hotel_id: '',
            hotel_id_pickup: '',
            hotel_id_dropoff: '',
            vehicle_unit_id: defaultUnitId,
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
            child_seats: [],
        });
        setAddSelectedSeats({});
        setShowAddBookingModal(true);
    };

    const handleGenerateClick = (e) => {
        e.preventDefault();

        const text = addBookingForm.data.auto_parse_text.trim();
        if (!text) {
            alert('Tempel teks booking terlebih dahulu');
            return;
        }

        // Parse line by line: "FIELD: value"
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        const data = {};

        lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex === -1) return;

            const key = line.substring(0, colonIndex).trim().toUpperCase();
            const value = line.substring(colonIndex + 1).trim();

            if (value) data[key] = value;
        });

        // Map to form fields
        const bookingType = data['BOOKING TYPE'] || '';
        let booking_type_ui = 'Airport Pick-Up';

        if (bookingType.includes('PICK-UP')) booking_type_ui = 'Airport Pick-Up';
        else if (bookingType.includes('DROP-OFF')) booking_type_ui = 'Airport Drop-Off';
        else if (bookingType.includes('HOTEL TRANSFER')) booking_type_ui = 'Hotel Transfer';
        else if (bookingType.includes('DAY TOUR')) booking_type_ui = 'Day Tour';

        // Vehicle: map nama kendaraan ke unit kendaraan yang tersedia
        const vehicleRaw = (data['VEHICLE / KENDARAAN'] || data['VEHICLE'] || '').toLowerCase();
        let matchedUnit = available_vehicle_units.find(u => vehicleRaw.includes(u.category.toLowerCase()));
        if (!matchedUnit && available_vehicle_units.length > 0) {
            matchedUnit = available_vehicle_units[0];
        }

        // Parse adults & children
        const adults = parseInt(data['ADULTS / DEWASA']) || parseInt(data['ADULTS']) || 1;
        const children = parseInt(data['CHILDREN / ANAK']) || parseInt(data['CHILDREN']) || 0;

        // Build updated form data
        const updates = {
            booking_type_ui,
            guest_name: data['NAMA LENGKAP / GUEST NAME'] || data['GUEST NAME'] || '',
            whatsapp_number: data['NO. WHATSAPP / PHONE'] || data['PHONE/WHATSAPP'] || data['WHATSAPP'] || '',
            email: data['EMAIL'] || '',
            booking_date: data['TANGGAL / DATE'] || data['DATE'] || '',
            pickup_time: data['WAKTU JEMPUT / PICK-UP TIME'] || data['PICK-UP TIME'] || '09:00',
            flight_number: data['NOMOR PENERBANGAN / FLIGHT'] || data['FLIGHT NUMBER'] || '',
            adults,
            children,
            vehicle_unit_id: matchedUnit?.id ? String(matchedUnit.id) : addBookingForm.data.vehicle_unit_id,
            notes: data['CATATAN / NOTES'] || data['NOTES'] || '',
            total_fee: data['TOTAL HARGA / TOTAL FEE'] || data['TOTAL FEE'] ? String(parseInt((data['TOTAL HARGA / TOTAL FEE'] || data['TOTAL FEE'] || '0').replace(/[^\d]/g, '')) || 0) : '',
        };

        // Booking type specific fields
        if (booking_type_ui === 'Airport Pick-Up' || booking_type_ui === 'Airport Drop-Off') {
            const direction = booking_type_ui === 'Airport Pick-Up' ? 'Pick-Up' : 'Drop-Off';
            updates.selected_destinasi = data['DESTINASI / WILAYAH'] || data['DESTINASI/WILAYAH'] || data['DESTINASI'] || '';

            const hotelField = direction === 'Pick-Up' ? 'HOTEL TUJUAN' : 'HOTEL PENJEMPUTAN';
            const hotelName = data[hotelField] || data['HOTEL'] || '';

            // Cari hotel dari database berdasarkan nama
            const matchedHotel = hotels.find(h => h.nama_hotel?.toLowerCase() === hotelName.toLowerCase());
            if (matchedHotel) {
                updates.selected_hotel_id = String(matchedHotel.id);
            }
        } else if (booking_type_ui === 'Hotel Transfer') {
            const pickupName = data['HOTEL ASAL / ORIGIN'] || data['HOTEL ASAL (PENJEMPUTAN)'] || data['HOTEL ASAL'] || '';
            const dropoffName = data['HOTEL TUJUAN / DESTINATION'] || data['HOTEL TUJUAN (PENGANTARAN)'] || data['HOTEL TUJUAN'] || '';

            const pickupHotel = hotels.find(h => h.nama_hotel?.toLowerCase() === pickupName.toLowerCase());
            const dropoffHotel = hotels.find(h => h.nama_hotel?.toLowerCase() === dropoffName.toLowerCase());

            if (pickupHotel) updates.hotel_id_pickup = String(pickupHotel.id);
            if (dropoffHotel) updates.hotel_id_dropoff = String(dropoffHotel.id);
        } else if (booking_type_ui === 'Day Tour') {
            const pickupLoc = data['LOKASI JEMPUT / PICK-UP LOCATION'] || data['PICK-UP LOCATION'] || data['PICKUP LOCATION'] || '';
            updates.pickup_location = pickupLoc;
            updates.dropoff_location = pickupLoc;
            updates.package_id = ''; // Admin pilih manual dari dropdown
        }

        // Parse child car seats from text if available
        const rawSeats = data['CHILD CAR SEATS'] || data['CAR SEAT'] || data['CHILD SEAT'] || '';
        if (rawSeats) {
            const parsedSeats = {};
            childSeatTypes.forEach(seat => {
                const regex = new RegExp(`(\\d+)\\s*x?\\s*${seat.name.split(' ')[0]}`, 'i');
                const match = rawSeats.match(regex);
                if (match) {
                    parsedSeats[seat.id] = parseInt(match[1], 10);
                }
            });
            if (Object.keys(parsedSeats).length > 0) {
                setAddSelectedSeats(parsedSeats);
            }
        }

        // Apply to form
        addBookingForm.setData(prev => ({
            ...prev,
            ...updates,
        }));

        alert('Form berhasil diisi otomatis! Periksa dan sesuaikan jika perlu.');
    };

    // Template auto-parse untuk WA
    const bookingTemplates = {
        airport_pickup: `BOOKING TYPE: AIRPORT PICK-UP
TANGGAL / DATE:
NAMA LENGKAP / GUEST NAME:
NO. WHATSAPP / PHONE:
EMAIL:
WAKTU JEMPUT / PICK-UP TIME:
NOMOR PENERBANGAN / FLIGHT:
DESTINASI / WILAYAH:
HOTEL TUJUAN:
VEHICLE / KENDARAAN:
ADULTS / DEWASA:
CHILDREN / ANAK:
CHILD CAR SEATS:
TOTAL HARGA / TOTAL FEE:
CATATAN / NOTES:`,

        airport_dropoff: `BOOKING TYPE: AIRPORT DROP-OFF
TANGGAL / DATE:
NAMA LENGKAP / GUEST NAME:
NO. WHATSAPP / PHONE:
EMAIL:
WAKTU JEMPUT / PICK-UP TIME:
NOMOR PENERBANGAN / FLIGHT:
DESTINASI / WILAYAH:
HOTEL PENJEMPUTAN:
VEHICLE / KENDARAAN:
ADULTS / DEWASA:
CHILDREN / ANAK:
CHILD CAR SEATS:
TOTAL HARGA / TOTAL FEE:
CATATAN / NOTES:`,

        hotel_transfer: `BOOKING TYPE: HOTEL TRANSFER
TANGGAL / DATE:
NAMA LENGKAP / GUEST NAME:
NO. WHATSAPP / PHONE:
EMAIL:
WAKTU JEMPUT / PICK-UP TIME:
HOTEL ASAL / ORIGIN:
HOTEL TUJUAN / DESTINATION:
VEHICLE / KENDARAAN:
ADULTS / DEWASA:
CHILDREN / ANAK:
CHILD CAR SEATS:
TOTAL HARGA / TOTAL FEE:
CATATAN / NOTES:`,

        day_tour: `BOOKING TYPE: DAY TOUR
TANGGAL / DATE:
NAMA LENGKAP / GUEST NAME:
NO. WHATSAPP / PHONE:
EMAIL:
WAKTU JEMPUT / PICK-UP TIME:
LOKASI JEMPUT / PICK-UP LOCATION:
TOUR PACKAGE:
VEHICLE / KENDARAAN:
ADULTS / DEWASA:
CHILDREN / ANAK:
CHILD CAR SEATS:
TOTAL HARGA / TOTAL FEE:
CATATAN / NOTES:`,
    };

    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

    const handleAddBookingSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        const typeUi = addBookingForm.data.booking_type_ui;
        const isPickup = typeUi === 'Airport Pick-Up';
        const isDropoff = typeUi === 'Airport Drop-Off';
        const isHotel = typeUi === 'Hotel Transfer';
        const isDayTour = typeUi === 'Day Tour';

        if (!addBookingForm.data.guest_name?.trim()) {
            alert('Mohon isi nama tamu terlebih dahulu.');
            return;
        }
        if (!addBookingForm.data.whatsapp_number?.trim()) {
            alert('Mohon isi nomor WhatsApp tamu.');
            return;
        }
        if (!addBookingForm.data.booking_date) {
            alert('Mohon pilih tanggal booking.');
            return;
        }
        if (!addBookingForm.data.vehicle_unit_id) {
            alert('Mohon pilih kategori unit kendaraan.');
            return;
        }
        if (addBookingForm.data.total_fee === '' || isNaN(Number(addBookingForm.data.total_fee))) {
            alert('Mohon isi Total Fee dengan nominal yang valid.');
            return;
        }
        if (isDayTour && !addBookingForm.data.package_id) {
            alert('Mohon pilih paket tour terlebih dahulu.');
            return;
        }
        if (isPickup && !addBookingForm.data.selected_hotel_id) {
            alert('Mohon pilih hotel tujuan terlebih dahulu.');
            return;
        }
        if (isDropoff && !addBookingForm.data.selected_hotel_id) {
            alert('Mohon pilih hotel penjemputan terlebih dahulu.');
            return;
        }
        if (isHotel && (!addBookingForm.data.hotel_id_pickup || !addBookingForm.data.hotel_id_dropoff)) {
            alert('Mohon pilih hotel asal dan hotel tujuan terlebih dahulu.');
            return;
        }

        // Convert addSelectedSeats to child_seats array
        const childSeatsArray = Object.entries(addSelectedSeats)
            .filter(([_, qty]) => qty > 0)
            .map(([seatId, qty]) => {
                const seat = childSeatTypes.find(s => s.id === parseInt(seatId));
                return { id: parseInt(seatId), name: seat?.name, quantity: qty };
            });

        // STEP 1: Set transform DULU (terpisah, bukan di-chain)
        addBookingForm.transform((data) => ({
            status: data.status || 'Pending',
            booking_type_ui: data.booking_type_ui,
            guest_name: data.guest_name,
            whatsapp_number: data.whatsapp_number,
            email: data.email || null,
            vehicle_unit_id: data.vehicle_unit_id,
            booking_date: data.booking_date,
            pickup_time: data.pickup_time,
            adults: parseInt(data.adults) || 1,
            children: parseInt(data.children) || 0,
            total_fee: parseFloat(data.total_fee) || 0,
            notes: data.notes || null,
            flight_number: data.flight_number || null,
            package_id: isDayTour ? (data.package_id || null) : null,
            selected_hotel_id: data.selected_hotel_id || null,
            hotel_id_pickup: data.hotel_id_pickup || null,
            hotel_id_dropoff: data.hotel_id_dropoff || null,
            selected_destinasi: data.selected_destinasi || null,
            vehicle_tier: data.vehicle_tier || null,
            auto_parse_text: data.auto_parse_text || null,
            child_seats: childSeatsArray,
        }));

        // STEP 2: Kirim POST (dipanggil setelah transform, bukan di-chain)
        addBookingForm.post('/admin/bookings', {
            onSuccess: () => {
                setShowAddBookingModal(false);
                addBookingForm.reset();
                setAddSelectedSeats({});
                setSuccessMessage('✓ Booking berhasil dibuat!');
                setShowSuccessAlert(true);
                setTimeout(() => setShowSuccessAlert(false), 3000);
            },
            onError: (errors) => {
                console.error('Validasi gagal:', errors);
                const msg = Object.entries(errors).map(([k, v]) => `${k}: ${v}`).join('\n');
                alert('Gagal menyimpan booking:\n' + msg);
            },
        });
    };

    const openAssignDriver = (booking) => {
        if (['Completed', 'Cancelled'].includes(booking?.status)) {
            return;
        }
        setSelectedBooking(booking);
        assignDriverForm.clearErrors();

        // Auto-assign vehicle_unit_id based on vehicle category tamu pilih
        const targetCategory = booking.vehicle_category || vehicles.find((v) => String(v.id) === String(booking.vehicle_id))?.category;
        const matchingUnit = (available_vehicle_units || []).find((u) => u.category === targetCategory);

        assignDriverForm.setData({
            driver_id: booking.driver_id || '',
            vehicle_unit_id: booking.vehicle_unit_id || (matchingUnit?.id ? String(matchingUnit.id) : ''),
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

        // Populate existing child seats
        const initialEditSeats = {};
        (booking.child_seats || []).forEach(cs => {
            const sId = cs.id || cs.child_seat_type_id;
            if (sId) {
                initialEditSeats[sId] = cs.quantity;
            } else {
                const found = childSeatTypes.find(t => t.name?.toLowerCase() === (cs.type || cs.name || '').toLowerCase());
                if (found) {
                    initialEditSeats[found.id] = cs.quantity;
                }
            }
        });
        setEditSelectedSeats(initialEditSeats);

        editBookingForm.setData({
            _method: 'put',
            auto_parse_text: '',
            status: booking.status || 'Pending',
            booking_type_ui: typeUi,
            selected_destinasi: selectedDest,
            selected_hotel_id: selectedHotelId,
            hotel_id_pickup: hotelPickupId,
            hotel_id_dropoff: hotelDropoffId,
            vehicle_unit_id: booking.vehicle_unit_id ? String(booking.vehicle_unit_id) : (available_vehicle_units[0]?.id ? String(available_vehicle_units[0].id) : ''),
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
            child_seats: booking.child_seats || [],
        });
        setShowEditBookingModal(true);
    };

    const handleEditBookingSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!selectedBooking) return;

        const typeUi = editBookingForm.data.booking_type_ui;
        const isPickup = typeUi === 'Airport Pick-Up';
        const isDropoff = typeUi === 'Airport Drop-Off';
        const isHotel = typeUi === 'Hotel Transfer';
        const isDayTour = typeUi === 'Day Tour';

        const editChildSeatsArray = Object.entries(editSelectedSeats)
            .filter(([_, qty]) => qty > 0)
            .map(([seatId, qty]) => {
                const seat = childSeatTypes.find(s => s.id === parseInt(seatId));
                return { id: parseInt(seatId), name: seat?.name, quantity: qty };
            });

        // STEP 1: Set transform DULU (terpisah, bukan di-chain)
        editBookingForm.transform((data) => ({
            ...data,
            pickup_hotel_id: isDropoff ? (data.selected_hotel_id || null) : (isHotel ? (data.hotel_id_pickup || null) : null),
            dropoff_hotel_id: isPickup ? (data.selected_hotel_id || null) : (isHotel ? (data.hotel_id_dropoff || null) : null),
            package_id: isDayTour ? (data.package_id || null) : null,
            flight_number: (isPickup || isDropoff) ? (data.flight_number || null) : null,
            email: data.email || null,
            notes: data.notes || null,
            child_seats: editChildSeatsArray,
        }));

        // STEP 2: Kirim POST (dipanggil setelah transform, bukan di-chain)
        editBookingForm.post(`/admin/bookings/${selectedBooking.raw_id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowEditBookingModal(false);
                editBookingForm.reset();
                setEditSelectedSeats({});
                setSelectedBooking(null);
            },
            onError: (errors) => {
                console.error('Validasi edit gagal:', errors);
                const msg = Object.entries(errors).map(([k, v]) => `${k}: ${v}`).join('\n');
                alert('Gagal memperbarui booking:\n' + msg);
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
    const renderBookingFormFields = (form, formId, currentSeats, setCurrentSeats) => {
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
        const hotelsToShow = hotelsForSelectedDest.length > 0 ? hotelsForSelectedDest : hotels;
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
                            const defaultUnitId = available_vehicle_units[0]?.id ? String(available_vehicle_units[0].id) : '';
                            const currentUnitId = form.data.vehicle_unit_id || defaultUnitId;
                            const currentUnit = available_vehicle_units.find((u) => String(u.id) === String(currentUnitId)) || available_vehicle_units[0];

                            if (val === 'Airport Pick-Up') {
                                const dests = getDestinations('Pick-Up');
                                const firstDest = dests[0] || '';
                                const regVehicles = vehicles.filter((v) => v.tier === 'Regular' || v.category === 'Regular Family SUV');
                                const chosenV = regVehicles[0] || vehicles[0];
                                const tier = chosenV?.tier || 'Regular';
                                const price = calcAirportPrice(firstDest, 'Pick-Up', currentUnit?.category || tier, currentUnitId);
                                form.setData((prev) => ({
                                    ...prev,
                                    booking_type_ui: 'Airport Pick-Up',
                                    selected_destinasi: firstDest,
                                    selected_hotel_id: '',
                                    hotel_id_pickup: '',
                                    hotel_id_dropoff: '',
                                    vehicle_unit_id: currentUnitId,
                                    vehicle_tier: tier,
                                    vehicle_id: chosenV?.id ? String(chosenV.id) : prev.vehicle_id,
                                    package_id: '',
                                    pickup_location: 'I Gusti Ngurah Rai Airport (DPS)',
                                    dropoff_location: '',
                                    total_fee: price !== null ? String(price) : prev.total_fee,
                                }));
                            } else if (val === 'Airport Drop-Off') {
                                const dests = getDestinations('Drop-Off');
                                const firstDest = dests[0] || '';
                                const regVehicles = vehicles.filter((v) => v.tier === 'Regular' || v.category === 'Regular Family SUV');
                                const chosenV = regVehicles[0] || vehicles[0];
                                const tier = chosenV?.tier || 'Regular';
                                const price = calcAirportPrice(firstDest, 'Drop-Off', currentUnit?.category || tier, currentUnitId);
                                form.setData((prev) => ({
                                    ...prev,
                                    booking_type_ui: 'Airport Drop-Off',
                                    selected_destinasi: firstDest,
                                    selected_hotel_id: '',
                                    hotel_id_pickup: '',
                                    hotel_id_dropoff: '',
                                    vehicle_unit_id: currentUnitId,
                                    vehicle_tier: tier,
                                    vehicle_id: chosenV?.id ? String(chosenV.id) : prev.vehicle_id,
                                    package_id: '',
                                    pickup_location: '',
                                    dropoff_location: 'I Gusti Ngurah Rai Airport (DPS)',
                                    total_fee: price !== null ? String(price) : prev.total_fee,
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
                                    vehicle_unit_id: currentUnitId,
                                    vehicle_tier: tier,
                                    vehicle_id: chosenV?.id ? String(chosenV.id) : prev.vehicle_id,
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
                                const bigVanUnit = available_vehicle_units.find((u) => u.category.toLowerCase().includes('minibus') || u.category.toLowerCase().includes('big van'));
                                const selectedUnitId = isFull && bigVanUnit?.id ? String(bigVanUnit.id) : currentUnitId;
                                const unit = available_vehicle_units.find((u) => String(u.id) === String(selectedUnitId));
                                let price = null;
                                if (unit && firstPkg) {
                                    const isBigVan = unit.category.toLowerCase().includes('minibus') || unit.category.toLowerCase().includes('big van');
                                    const isLuxury = unit.category.toLowerCase().includes('luxury');
                                    if (isBigVan) {
                                        price = firstPkg.big_van_price || firstPkg.price;
                                    } else if (isLuxury) {
                                        price = firstPkg.luxury_price || firstPkg.price;
                                    } else {
                                        price = firstPkg.regular_price || firstPkg.price;
                                    }
                                }

                                const regVehicles = vehicles.filter((v) => v.tier === 'Regular' || v.category === 'Regular Family SUV');
                                const chosenV = regVehicles[0] || vehicles[0];
                                const tier = isFull ? 'Big Van' : (chosenV?.tier || 'Regular');
                                form.setData((prev) => ({
                                    ...prev,
                                    booking_type_ui: 'Day Tour',
                                    selected_destinasi: '',
                                    selected_hotel_id: '',
                                    hotel_id_pickup: '',
                                    hotel_id_dropoff: '',
                                    vehicle_unit_id: selectedUnitId,
                                    vehicle_tier: tier,
                                    vehicle_id: chosenV?.id ? String(chosenV.id) : prev.vehicle_id,
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
                                    const selectedH = hotels.find((h) => String(h.id) === String(hotelId));
                                    const hotelName = selectedH?.nama_hotel || '';
                                    form.setData((prev) => ({
                                        ...prev,
                                        selected_hotel_id: hotelId,
                                        ...(direction === 'Pick-Up'
                                            ? { dropoff_location: hotelName }
                                            : { pickup_location: hotelName }),
                                    }));
                                }}
                                disabled={!form.data.selected_destinasi}
                                required
                                className={selectClass}
                            >
                                <option value="">
                                    {form.data.selected_destinasi
                                        ? '-- Pilih Hotel --'
                                        : '-- Pilih Destinasi Dahulu --'}
                                </option>
                                {hotelsToShow.map((h) => (
                                    <option key={h.id} value={h.id}>
                                        {h.nama_hotel}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 3. Pilih Kendaraan */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                Pilih Kategori Kendaraan <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.data.vehicle_unit_id}
                                onChange={(e) => {
                                    const unitId = e.target.value;
                                    const unit = available_vehicle_units.find((u) => String(u.id) === String(unitId));
                                    const direction = form.data.booking_type_ui.includes('Pick-Up') ? 'Pick-Up' : 'Drop-Off';
                                    const price = unit ? calcAirportPrice(form.data.selected_destinasi, direction, unit.category, unitId) : null;
                                    form.setData((prev) => ({
                                        ...prev,
                                        vehicle_unit_id: unitId,
                                        total_fee: price !== null ? String(price) : prev.total_fee,
                                    }));
                                }}
                                required
                                className={selectClass}
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {available_vehicle_units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.category} (Max {unit.passenger_capacity} pax)
                                    </option>
                                ))}
                            </select>
                            {form.errors.vehicle_unit_id && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.vehicle_unit_id}</p>
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
                                Pilih Kategori Kendaraan <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.data.vehicle_unit_id}
                                onChange={(e) => {
                                    const unitId = e.target.value;
                                    const unit = available_vehicle_units.find((u) => String(u.id) === String(unitId));
                                    const pricing = unit ? calcHotelTransferPrice(form.data.hotel_id_pickup, form.data.hotel_id_dropoff, unit.category, unitId) : { price: null, warning: '' };
                                    form.setData((prev) => ({
                                        ...prev,
                                        vehicle_unit_id: unitId,
                                        total_fee: pricing.price !== null ? String(pricing.price) : prev.total_fee,
                                    }));
                                }}
                                required
                                className={selectClass}
                            >
                                <option value="">-- Pilih Kategori --</option>
                                {available_vehicle_units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.category} (Max {unit.passenger_capacity} pax)
                                    </option>
                                ))}
                            </select>
                            {form.errors.vehicle_unit_id && (
                                <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.vehicle_unit_id}</p>
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
                                        Pilih Kategori Kendaraan <span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        Rekomendasi Full Day: Big Van / Minibus
                                    </span>
                                </div>
                                <select
                                    value={form.data.vehicle_unit_id}
                                    onChange={(e) => {
                                        const unitId = e.target.value;
                                        const unit = available_vehicle_units.find((u) => String(u.id) === String(unitId));
                                        let price = null;
                                        if (unit && selectedPkg) {
                                            if (selectedPkg.unit_prices && selectedPkg.unit_prices[unitId] !== undefined && selectedPkg.unit_prices[unitId] !== '') {
                                                price = Number(selectedPkg.unit_prices[unitId]);
                                            } else {
                                                const isBigVan = unit.category.toLowerCase().includes('minibus') || unit.category.toLowerCase().includes('big van');
                                                const isLuxury = unit.category.toLowerCase().includes('luxury');
                                                if (isBigVan) price = selectedPkg.big_van_price || selectedPkg.price;
                                                else if (isLuxury) price = selectedPkg.luxury_price || selectedPkg.price;
                                                else price = selectedPkg.regular_price || selectedPkg.price;
                                            }
                                        }
                                        form.setData((prev) => ({
                                            ...prev,
                                            vehicle_unit_id: unitId,
                                            total_fee: price ? String(price) : prev.total_fee,
                                        }));
                                    }}
                                    required
                                    className={selectClass}
                                >
                                    <option value="">-- Pilih Kategori Kendaraan --</option>
                                    {available_vehicle_units.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.category} (Max {unit.passenger_capacity} pax)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Pilih Kategori Kendaraan <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.data.vehicle_unit_id}
                                    onChange={(e) => {
                                        const unitId = e.target.value;
                                        const unit = available_vehicle_units.find((u) => String(u.id) === String(unitId));

                                        let price = null;
                                        if (unit && selectedPkg) {
                                            if (selectedPkg.unit_prices && selectedPkg.unit_prices[unitId] !== undefined && selectedPkg.unit_prices[unitId] !== '') {
                                                price = Number(selectedPkg.unit_prices[unitId]);
                                            } else {
                                                const isBigVan = unit.category.toLowerCase().includes('minibus') || unit.category.toLowerCase().includes('big van');
                                                const isLuxury = unit.category.toLowerCase().includes('luxury');

                                                if (isBigVan) {
                                                    price = selectedPkg.big_van_price || selectedPkg.price;
                                                } else if (isLuxury) {
                                                    price = selectedPkg.luxury_price || selectedPkg.price;
                                                } else {
                                                    price = selectedPkg.regular_price || selectedPkg.price;
                                                }
                                            }
                                        }

                                        form.setData((prev) => ({
                                            ...prev,
                                            vehicle_unit_id: unitId,
                                            total_fee: price ? String(price) : prev.total_fee,
                                        }));
                                    }}
                                    required
                                    className={selectClass}
                                >
                                    <option value="">-- Pilih Kategori --</option>
                                    {available_vehicle_units.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.category} (Max {unit.passenger_capacity} pax)
                                        </option>
                                    ))}
                                </select>
                                {form.errors.vehicle_unit_id && (
                                    <p className="text-xs text-red-600 mt-1 font-medium">{form.errors.vehicle_unit_id}</p>
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

                {/* Passenger Capacity Warning */}
                {(() => {
                    const adults = parseInt(form.data.adults) || 0;
                    const children = parseInt(form.data.children) || 0;
                    const totalPassengers = adults + children;

                    // Map tier to capacity
                    const capacityMap = { 'Regular': 6, 'Luxury': 8, 'Big Van': 12 };
                    const currentCapacity = capacityMap[vehicleTier] || 6;

                    if (totalPassengers > currentCapacity) {
                        // Suggest bigger vehicle
                        let suggestedTier = null;
                        if (totalPassengers <= 8 && vehicleTier === 'Regular') suggestedTier = 'Luxury';
                        else if (totalPassengers <= 12 && (vehicleTier === 'Regular' || vehicleTier === 'Luxury')) suggestedTier = 'Big Van';

                        return (
                            <div className="sm:col-span-2 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
                                <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <div className="text-xs text-red-800">
                                    <p className="font-bold">Total penumpang ({totalPassengers} orang) melebihi kapasitas kendaraan {vehicleTier} (Max {currentCapacity} orang)!</p>
                                    {suggestedTier && (
                                        <p className="mt-1 font-medium">Silakan ganti kendaraan ke <strong>{suggestedTier}</strong> (kapasitas {capacityMap[suggestedTier]} orang) atau kurangi jumlah penumpang.</p>
                                    )}
                                    {!suggestedTier && (
                                        <p className="mt-1 font-medium">Silakan kurangi jumlah penumpang agar tidak melebihi kapasitas maksimal 12 orang.</p>
                                    )}
                                </div>
                            </div>
                        );
                    }

                    return null;
                })()}

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

                {/* Child Car Seats */}
                {(() => {
                    const totalChildren = parseInt(form.data.children) || 0;
                    const totalSelectedSeats = Object.values(currentSeats || {}).reduce((sum, qty) => sum + (parseInt(qty) || 0), 0);
                    const maxTotalSeats = totalChildren;
                    const canIncrease = totalSelectedSeats < maxTotalSeats;

                    return (
                        <div className="sm:col-span-2">
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                                    Child Car Seats (Free & Sanitized)
                                </label>
                                <span className="text-[11px] font-medium text-slate-500">
                                    {totalSelectedSeats} / {maxTotalSeats} terpilih
                                </span>
                            </div>

                            {totalChildren === 0 && (
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <span>Tambahkan jumlah anak (Children) untuk memilih child car seat.</span>
                                </div>
                            )}

                            {totalSelectedSeats >= maxTotalSeats && maxTotalSeats > 0 && (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <span>Maksimal {maxTotalSeats} child seat (sesuai {maxTotalSeats} anak dalam pemesanan).</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {childSeatTypes.map((seat) => {
                                    const qty = (currentSeats && currentSeats[seat.id]) || 0;
                                    return (
                                        <div
                                            key={seat.id}
                                            className="border rounded-xl p-3 flex items-center justify-between transition-all"
                                            style={{
                                                borderColor: qty > 0 ? '#00AEEF' : '#E2E8F0',
                                                background: qty > 0 ? '#F0F9FF' : '#FFFFFF',
                                            }}
                                        >
                                            <div className="flex-1 min-w-0 pr-3">
                                                <div className="text-sm font-semibold text-slate-900">{seat.name}</div>
                                                <div className="text-xs text-slate-500">{seat.age_range} · {seat.weight_range}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    disabled={qty === 0}
                                                    onClick={() => {
                                                        const newQty = Math.max(0, qty - 1);
                                                        setCurrentSeats(prev => ({ ...prev, [seat.id]: newQty }));
                                                    }}
                                                    className={`w-7 h-7 rounded-lg text-sm font-bold flex items-center justify-center transition cursor-pointer ${
                                                        qty === 0
                                                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-50'
                                                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700 active:scale-95'
                                                    }`}
                                                >
                                                    −
                                                </button>
                                                <span className="w-6 text-center text-sm font-bold text-slate-900">{qty}</span>
                                                <button
                                                    type="button"
                                                    disabled={!canIncrease}
                                                    onClick={() => {
                                                        if (!canIncrease) return;
                                                        setCurrentSeats(prev => ({ ...prev, [seat.id]: qty + 1 }));
                                                    }}
                                                    className={`w-7 h-7 rounded-lg text-sm font-bold flex items-center justify-center transition cursor-pointer ${
                                                        !canIncrease
                                                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-50'
                                                            : 'bg-[#00AEEF] hover:bg-[#009cd7] text-white active:scale-95'
                                                    }`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}

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
                {/* Success Alert */}
                {showSuccessAlert && (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl shadow-xs flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold text-emerald-800">{successMessage}</span>
                    </div>
                )}

                {/* Flash Success Alert */}
                {flash?.success && !showSuccessAlert && (
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

                {/* 1. 4 STAT CARDS (All Booking, Airport, Day Tour, Hotel Transfer) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                    {/* Card 1: All Bookings */}
                    <div 
                        onClick={() => setFilterType('all')}
                        className={`bg-white border shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4 cursor-pointer select-none ${
                            filterType === 'all'
                                ? 'border-[#00AEEF] ring-2 ring-sky-400/30 shadow-sky-500/10'
                                : 'border-slate-200/80 hover:border-slate-300'
                        }`}
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sky-50 border border-sky-200/60 flex items-center justify-center text-[#00AEEF] shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="4" rx="2" />
                                <line x1="16" x2="16" y1="2" y2="6" />
                                <line x1="8" x2="8" y1="2" y2="6" />
                                <line x1="3" x2="21" y1="10" y2="10" />
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

                    {/* Card 2: Airport */}
                    <div 
                        onClick={() => setFilterType('airport')}
                        className={`bg-white border shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4 cursor-pointer select-none ${
                            filterType === 'airport'
                                ? 'border-blue-500 ring-2 ring-blue-400/30 shadow-blue-500/10'
                                : 'border-slate-200/80 hover:border-slate-300'
                        }`}
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                            </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-tight whitespace-nowrap">
                                Airport
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-xl sm:text-2xl font-bold text-slate-900">
                                    {stats.airport ?? ((stats.airport_pickup ?? 0) + (stats.airport_dropoff ?? 0))}
                                </span>
                                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                                    Trips
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Day Tour */}
                    <div 
                        onClick={() => setFilterType('day_tour')}
                        className={`bg-white border shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4 cursor-pointer select-none ${
                            filterType === 'day_tour'
                                ? 'border-emerald-500 ring-2 ring-emerald-400/30 shadow-emerald-500/10'
                                : 'border-slate-200/80 hover:border-slate-300'
                        }`}
                    >
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

                    {/* Card 4: Hotel Transfer */}
                    <div 
                        onClick={() => setFilterType('hotel_transfer')}
                        className={`bg-white border shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4 cursor-pointer select-none ${
                            filterType === 'hotel_transfer'
                                ? 'border-purple-500 ring-2 ring-purple-400/30 shadow-purple-500/10'
                                : 'border-slate-200/80 hover:border-slate-300'
                        }`}
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600 shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 21h18" />
                                <path d="M9 8h1" />
                                <path d="M9 12h1" />
                                <path d="M9 16h1" />
                                <path d="M14 8h1" />
                                <path d="M14 12h1" />
                                <path d="M14 16h1" />
                                <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                            </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-tight whitespace-nowrap">
                                Hotel Transfer
                            </span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="text-xl sm:text-2xl font-bold text-slate-900">
                                    {stats.hotel_transfer ?? 0}
                                </span>
                                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                                    Transfers
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. PANEL RECENT BOOKINGS */}
                <div className="space-y-3">
                    {/* Search & Filter Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none shrink-0">
                            {[
                                { id: 'all', label: 'All Bookings', count: stats.all_bookings ?? 0 },
                                { id: 'airport', label: 'Airport', count: stats.airport ?? ((stats.airport_pickup ?? 0) + (stats.airport_dropoff ?? 0)) },
                                { id: 'day_tour', label: 'Day Tour', count: stats.day_tour ?? 0 },
                                { id: 'hotel_transfer', label: 'Hotel Transfer', count: stats.hotel_transfer ?? 0 },
                            ].map((tab) => {
                                const active = filterType === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setFilterType(tab.id)}
                                        className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer min-h-[42px] ${
                                            active
                                                ? 'bg-[#00AEEF] text-white shadow-xs'
                                                : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                            active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search Booking */}
                        <form onSubmit={handleBookingSearch} className="relative flex-1">
                            <input
                                type="text"
                                value={bookingSearch}
                                onChange={(e) => setBookingSearch(e.target.value)}
                                placeholder="Search booking real-time by code or guest name..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-base sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-xs min-h-[42px]"
                            />
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" x2="16.65" y1="21" y2="16.65" />
                                </svg>
                            </div>
                            {bookingSearch && (
                                <button
                                    type="button"
                                    onClick={() => setBookingSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            )}
                        </form>
                    </div>

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
                        (u) => !targetCategory || u.category === targetCategory
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

                            {/* Auto-assigned Vehicle Unit (Read-only Display) */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Unit Kendaraan (Otomatis dari pilihan tamu)
                                </label>
                                {eligibleUnits.length > 0 && assignDriverForm.data.vehicle_unit_id ? (
                                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-900 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                        <span className="font-semibold">
                                            {eligibleUnits.find(u => String(u.id) === String(assignDriverForm.data.vehicle_unit_id))?.label ||
                                             `${targetCategory} (Max ${eligibleUnits.find(u => String(u.id) === String(assignDriverForm.data.vehicle_unit_id))?.passenger_capacity} penumpang)`}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                        <span>
                                            Tidak ada kategori <strong>{targetCategory || 'yang sesuai'}</strong> terdaftar.
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
                            type="button"
                            onClick={handleAddBookingSubmit}
                            disabled={addBookingForm.processing}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px]"
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
                {/* Validation Error Banner */}
                {Object.keys(addBookingForm.errors).length > 0 && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl mb-4 flex items-start gap-3">
                        <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <div className="text-xs text-rose-800">
                            <p className="font-bold mb-1">Gagal menyimpan booking. Mohon lengkapi isian berikut:</p>
                            <ul className="list-disc list-inside space-y-0.5 font-medium">
                                {Object.entries(addBookingForm.errors).map(([fld, err]) => (
                                    <li key={fld}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <form id="add-booking-form" onSubmit={handleAddBookingSubmit} className="space-y-5">
                    {/* Auto-Parse Section */}
                    <div className="bg-gradient-to-r from-sky-50 to-indigo-50/50 border border-sky-100 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-lg bg-[#00AEEF] text-white flex items-center justify-center text-xs shadow-xs">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                </svg>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                Isi Otomatis (Auto-Parse)
                            </span>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">
                            Tempel teks pemesanan dari chat WhatsApp pelanggan untuk pengisian otomatis.
                        </p>
                        <textarea
                            rows="8"
                            value={addBookingForm.data.auto_parse_text}
                            onChange={(e) => addBookingForm.setData('auto_parse_text', e.target.value)}
                            placeholder={`Tempel format booking di sini, contoh:\n\nBOOKING TYPE: AIRPORT PICK-UP\nTANGGAL / DATE: 2026-12-25\nNAMA LENGKAP / GUEST NAME: John Doe\nNO. WHATSAPP / PHONE: +62 812-3456-7890\nEMAIL: john@email.com\nWAKTU JEMPUT / PICK-UP TIME: 14:00\nNOMOR PENERBANGAN / FLIGHT: GA-401\nDESTINASI / WILAYAH: Seminyak\nHOTEL TUJUAN: The Legian Bali\nVEHICLE / KENDARAAN: Regular Family SUV\nADULTS / DEWASA: 2\nCHILDREN / ANAK: 1\nCHILD CAR SEATS: 1x Infant Capsule\nTOTAL HARGA / TOTAL FEE: 350000\nCATATAN / NOTES: Flight delay 30 menit`}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-base sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none font-sans shadow-2xs"
                        />
                        <div className="flex items-center justify-between mt-2">
                            {/* Dropdown Pilih Template */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                    </svg>
                                    <span>Template</span>
                                </button>
                                {showTemplateDropdown && (
                                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 min-w-[200px]">
                                        {[
                                            { key: 'airport_pickup', label: 'Airport Pick-Up' },
                                            { key: 'airport_dropoff', label: 'Airport Drop-Off' },
                                            { key: 'hotel_transfer', label: 'Hotel Transfer' },
                                            { key: 'day_tour', label: 'Day Tour' },
                                        ].map((tpl) => (
                                            <button
                                                key={tpl.key}
                                                type="button"
                                                onClick={() => {
                                                    addBookingForm.setData('auto_parse_text', bookingTemplates[tpl.key]);
                                                    setSelectedTemplate(tpl.key);
                                                    setShowTemplateDropdown(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                                {tpl.label}
                                            </button>
                                        ))}
                                        <div className="border-t border-slate-100 mt-1 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const allTemplates = Object.values(bookingTemplates).join('\n\n---\n\n');
                                                    navigator.clipboard.writeText(allTemplates).then(() => {
                                                        alert('Semua template berhasil disalin ke clipboard!');
                                                    }).catch(() => {
                                                        alert('Gagal menyalin. Silakan copy manual.');
                                                    });
                                                    setShowTemplateDropdown(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-xs font-medium text-sky-600 hover:bg-sky-50 transition-colors"
                                            >
                                                Salin Semua Template (untuk dibagikan)
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                    {renderBookingFormFields(addBookingForm, 'add-booking-form', addSelectedSeats, setAddSelectedSeats)}
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
                            disabled={(() => {
                                if (editBookingForm.processing) return true;
                                const adults = parseInt(editBookingForm.data.adults) || 0;
                                const children = parseInt(editBookingForm.data.children) || 0;
                                const totalPassengers = adults + children;
                                const capacityMap = { 'Regular': 6, 'Luxury': 8, 'Big Van': 12 };
                                const vehicleTier = editBookingForm.data.vehicle_tier || 'Regular';
                                const currentCapacity = capacityMap[vehicleTier] || 6;
                                return totalPassengers > currentCapacity;
                            })()}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] text-white rounded-xl text-sm font-semibold transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px]"
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
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-lg bg-[#00AEEF] text-white flex items-center justify-center text-xs shadow-xs">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                </svg>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                Isi Otomatis (Auto-Parse)
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
                    {renderBookingFormFields(editBookingForm, 'edit-booking-form', editSelectedSeats, setEditSelectedSeats)}
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
