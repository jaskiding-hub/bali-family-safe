import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    BookingFooter,
    ChildSeatsSelector,
    FieldWithIcon,
    inputStyle,
    selectStyle,
    textareaStyle,
    VehicleSelect,
} from './FormShared';

const IconUser = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;
const IconPhone = () => <svg width="15" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>;
const IconEmail = () => <svg width="18" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;
const IconFlight = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>;
const IconPeople = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const IconLocation = () => <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>;
const IconHotel = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>;
const IconCalendar = () => <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>;
const IconClock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>;
const IconNote = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;

export default function AirportBookingForm({ vehicles = [], childSeatTypes = [] }) {
    const { flash = {} } = usePage().props;
    const [direction, setDirection] = useState('Pick-Up'); // 'Pick-Up' or 'Drop-Off'
    const [zones, setZones] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedHotelId, setSelectedHotelId] = useState('');
    const [selectedSeats, setSelectedSeats] = useState({});
    const [estimatedFee, setEstimatedFee] = useState(null);
    const [loadingEstimate, setLoadingEstimate] = useState(false);
    const [validationWarning, setValidationWarning] = useState('');

    // Initial vehicle selection
    const defaultVehicle = vehicles.find((v) => !v.category?.includes('Minibus')) || vehicles[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        guest_name: '',
        whatsapp_number: '',
        email: '',
        flight_number: '',
        booking_type: 'Airport Transfer',
        transfer_direction: 'Pick-Up',
        vehicle_id: defaultVehicle?.id || '',
        pickup_hotel_id: '',
        dropoff_hotel_id: '',
        booking_date: '',
        pickup_time: '',
        adults: 2,
        children: 1,
        notes: '',
        child_seats: [],
    });

    const selectedVehicle = vehicles.find((v) => String(v.id) === String(data.vehicle_id));
    const totalPax = (parseInt(data.adults, 10) || 0) + (parseInt(data.children, 10) || 0);
    const isOverCapacity = Boolean(selectedVehicle?.passenger_capacity && totalPax > selectedVehicle.passenger_capacity);

    // Fetch zones and hotels from Bagas's pricing APIs
    useEffect(() => {
        axios.get('/api/pricing/zones')
            .then((res) => {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setZones(res.data);
                }
            })
            .catch(() => {});

        axios.get('/api/pricing/hotels')
            .then((res) => {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setHotels(res.data);
                }
            })
            .catch(() => {});
    }, []);

    // Keep vehicle_id updated if vehicles change
    useEffect(() => {
        if (!data.vehicle_id && defaultVehicle?.id) {
            setData('vehicle_id', defaultVehicle.id);
        }
    }, [vehicles]);

    // Available destination areas based on current direction
    const availableDestinations = React.useMemo(() => {
        if (zones.length > 0) {
            const matchingZones = zones.filter((z) => !z.type || z.type === direction);
            const source = matchingZones.length > 0 ? matchingZones : zones;
            const unique = Array.from(new Set(source.map((z) => z.destinasi))).filter(Boolean);
            return unique.filter((d) => d.toLowerCase() !== 'dps airport');
        }
        return [];
    }, [zones, direction]);

    // Direction changes: reset hotel and recalculate
    const handleDirectionChange = (newDir) => {
        setDirection(newDir);
        setSelectedHotelId('');
        setEstimatedFee(null);
        setValidationWarning('');
        setData((prev) => ({
            ...prev,
            transfer_direction: newDir,
            pickup_hotel_id: '',
            dropoff_hotel_id: '',
        }));
    };

    // If destination is no longer valid in new direction, reset it cleanly
    useEffect(() => {
        if (selectedArea && availableDestinations.length > 0 && !availableDestinations.includes(selectedArea)) {
            setSelectedArea('');
            setSelectedHotelId('');
            setEstimatedFee(null);
            setData((prev) => ({
                ...prev,
                pickup_hotel_id: '',
                dropoff_hotel_id: '',
            }));
        }
    }, [direction, availableDestinations, selectedArea]);

    // Area selection changes: reset hotel & price estimate
    const handleAreaChange = (e) => {
        const newArea = e.target.value;
        setSelectedArea(newArea);
        setSelectedHotelId('');
        setEstimatedFee(null);
        setValidationWarning('');
        setData((prev) => ({
            ...prev,
            pickup_hotel_id: '',
            dropoff_hotel_id: '',
        }));
    };

    // Hotel selection
    const handleHotelChange = (e) => {
        const hId = e.target.value;
        setSelectedHotelId(hId);
        setValidationWarning('');
        if (direction === 'Pick-Up') {
            setData('dropoff_hotel_id', hId ? parseInt(hId, 10) : '');
            setData('pickup_hotel_id', '');
        } else {
            setData('pickup_hotel_id', hId ? parseInt(hId, 10) : '');
            setData('dropoff_hotel_id', '');
        }
    };

    // Child seat counter
    const handleSeatChange = (seatId, quantity) => {
        const updated = { ...selectedSeats, [seatId]: quantity };
        setSelectedSeats(updated);

        const childSeatsPayload = Object.entries(updated)
            .filter(([_, q]) => q > 0)
            .map(([id, q]) => ({
                id: parseInt(id, 10),
                quantity: parseInt(q, 10),
            }));

        setData('child_seats', childSeatsPayload);
    };

    // Auto-calculate live price estimate on change
    useEffect(() => {
        if (!data.vehicle_id || !selectedHotelId) {
            setEstimatedFee(null);
            return;
        }

        const timer = setTimeout(() => {
            setLoadingEstimate(true);
            axios.post('/api/pricing/estimate', {
                booking_type: 'Airport Transfer',
                transfer_direction: direction,
                vehicle_id: data.vehicle_id,
                dropoff_hotel_id: direction === 'Pick-Up' ? selectedHotelId : undefined,
                pickup_hotel_id: direction === 'Drop-Off' ? selectedHotelId : undefined,
            })
                .then((res) => {
                    setEstimatedFee(res.data.total_fee);
                })
                .catch(() => {
                    setEstimatedFee(null);
                })
                .finally(() => {
                    setLoadingEstimate(false);
                });
        }, 300);

        return () => clearTimeout(timer);
    }, [data.vehicle_id, selectedHotelId, direction]);

    // Handle standard submission via Inertia with validation guards
    const handleFormSubmit = (e) => {
        if (e) e.preventDefault();
        if (!selectedArea) {
            setValidationWarning(
                direction === 'Pick-Up'
                    ? 'Please select your Destination Area in Bali first.'
                    : 'Please select your Pick-Up Area in Bali first.'
            );
            return;
        }
        if (!selectedHotelId) {
            setValidationWarning(
                direction === 'Pick-Up'
                    ? `Please choose your Drop-Off Hotel or Resort in ${selectedArea}.`
                    : `Please choose your Pick-Up Hotel or Resort in ${selectedArea}.`
            );
            return;
        }
        setValidationWarning('');
        post('/booking', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSelectedSeats({});
                setSelectedHotelId('');
                setSelectedArea('');
                setEstimatedFee(null);
                setValidationWarning('');
            },
        });
    };

    // Handle WhatsApp fallback with validation guards
    const handleWA = () => {
        if (!selectedArea) {
            setValidationWarning(
                direction === 'Pick-Up'
                    ? 'Please select your Destination Area in Bali first.'
                    : 'Please select your Pick-Up Area in Bali first.'
            );
            return;
        }
        if (!selectedHotelId) {
            setValidationWarning(
                direction === 'Pick-Up'
                    ? `Please choose your Drop-Off Hotel or Resort in ${selectedArea}.`
                    : `Please choose your Pick-Up Hotel or Resort in ${selectedArea}.`
            );
            return;
        }
        setValidationWarning('');

        const hotelObj = hotels.find((h) => String(h.id) === String(selectedHotelId));
        const hotelName = hotelObj?.nama_hotel || 'Selected Hotel';
        const vehObj = vehicles.find((v) => String(v.id) === String(data.vehicle_id));
        const vehName = vehObj?.name || 'Selected Vehicle';

        const seatsText = Object.entries(selectedSeats)
            .filter(([_, q]) => q > 0)
            .map(([id, q]) => {
                const s = childSeatTypes.find((st) => String(st.id) === String(id));
                return `${q}x ${s?.name || 'Child Seat'}`;
            })
            .join(', ') || '1x Free Included';

        const msg = `Hi Bali Family Safe!\n\n*Airport Transfer Booking:*
- Type: ${direction === 'Pick-Up' ? 'DPS Airport → Hotel (Pick-Up)' : 'Hotel → DPS Airport (Drop-Off)'}
- Area: ${selectedArea}
- Hotel: ${hotelName}
- Guest Name: ${data.guest_name}
- WhatsApp: ${data.whatsapp_number}
- Flight Number: ${data.flight_number || '-'}
- Date & Time: ${data.booking_date} at ${data.pickup_time}
- Vehicle: ${vehName}
- Child Seats: ${seatsText}
- Estimated Fare: ${estimatedFee ? `Rp ${Number(estimatedFee).toLocaleString('id-ID')}` : 'To be confirmed'}
- Notes: ${data.notes || '-'}`;

        window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, '_blank');
    };

    // Filter hotels strictly by chosen destination area and direction
    const filteredHotels = React.useMemo(() => {
        if (!selectedArea) return [];
        if (hotels.length === 0) return [];
        let matches = hotels.filter((h) =>
            (h.zones || []).some((z) =>
                (z.destinasi === selectedArea || String(z.id) === String(selectedArea)) &&
                (!z.type || z.type === direction)
            )
        );
        if (matches.length === 0) {
            matches = hotels.filter((h) =>
                (h.zones || []).some((z) => z.destinasi === selectedArea || String(z.id) === String(selectedArea))
            );
        }
        return matches.sort((a, b) => (a.nama_hotel || '').localeCompare(b.nama_hotel || ''));
    }, [hotels, selectedArea, direction]);

    return (
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Flash notification */}
            {flash?.success && (
                <div className="mx-6 mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{flash.success}</span>
                </div>
            )}

            {/* 1. Category Switcher — Clean 2-button toggle */}
            <div style={{ padding: '20px 32px 4px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    background: '#F1F5F9',
                    padding: '4px',
                    borderRadius: '10px',
                }}>
                    <button
                        type="button"
                        onClick={() => handleDirectionChange('Pick-Up')}
                        style={{
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            borderRadius: '7px',
                            border: 'none',
                            background: direction === 'Pick-Up' ? '#FFFFFF' : 'transparent',
                            boxShadow: direction === 'Pick-Up' ? '0px 1px 3px rgba(0,0,0,0.08)' : 'none',
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: direction === 'Pick-Up' ? 600 : 500,
                            fontSize: '13px',
                            color: direction === 'Pick-Up' ? '#00658D' : '#64748B',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: direction === 'Pick-Up' ? '#00658D' : '#94A3B8' }} />
                        <span>Airport Pick-Up (DPS Airport → Hotel)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleDirectionChange('Drop-Off')}
                        style={{
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            borderRadius: '7px',
                            border: 'none',
                            background: direction === 'Drop-Off' ? '#FFFFFF' : 'transparent',
                            boxShadow: direction === 'Drop-Off' ? '0px 1px 3px rgba(0,0,0,0.08)' : 'none',
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: direction === 'Drop-Off' ? 600 : 500,
                            fontSize: '13px',
                            color: direction === 'Drop-Off' ? '#00658D' : '#64748B',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: direction === 'Drop-Off' ? '#00658D' : '#94A3B8' }} />
                        <span>Airport Drop-Off (Hotel → DPS Airport)</span>
                    </button>
                </div>
            </div>

            {/* 2. Route Row: Area / Zone & Hotel */}
            <div className="bfs-form-row" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                padding: '16px 32px 0',
            }}>
                {validationWarning && (
                    <div style={{
                        gridColumn: 'span 4',
                        padding: '10px 14px',
                        background: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: '8px',
                        color: '#991B1B',
                        fontSize: '13px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" style={{ flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{validationWarning}</span>
                    </div>
                )}

                <div style={{ gridColumn: 'span 2' }}>
                    <FieldWithIcon
                        label={direction === 'Pick-Up' ? '1. Destination Area in Bali *' : '1. Pick-Up Area in Bali *'}
                        isSelect={true}
                        icon={<IconLocation />}
                    >
                        <select
                            required
                            style={{
                                ...selectStyle,
                                borderColor: selectedArea ? '#00658D' : '#CBD5E1',
                                background: '#FFFFFF',
                            }}
                            value={selectedArea}
                            onChange={handleAreaChange}
                        >
                            <option value="">
                                {direction === 'Pick-Up' ? '-- Choose Destination Area in Bali --' : '-- Choose Pick-Up Area in Bali --'}
                            </option>
                            {availableDestinations.map((dest) => (
                                <option key={dest} value={dest}>{dest}</option>
                            ))}
                        </select>
                    </FieldWithIcon>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                    <FieldWithIcon
                        label={
                            selectedArea
                                ? (direction === 'Drop-Off' ? `2. Pick-Up Hotel in ${selectedArea} *` : `2. Drop-Off Hotel in ${selectedArea} *`)
                                : (direction === 'Drop-Off' ? '2. Pick-Up Hotel / Resort *' : '2. Drop-Off Hotel / Resort *')
                        }
                        isSelect={true}
                        icon={<IconHotel />}
                    >
                        <select
                            required
                            disabled={!selectedArea}
                            style={{
                                ...selectStyle,
                                background: !selectedArea ? '#F8FAFC' : '#FFFFFF',
                                color: !selectedArea ? '#94A3B8' : '#0F172A',
                                cursor: !selectedArea ? 'not-allowed' : 'pointer',
                                borderColor: !selectedArea
                                    ? '#E2E8F0'
                                    : (errors.dropoff_hotel_id || errors.pickup_hotel_id
                                        ? '#F43F5E'
                                        : (selectedHotelId ? '#00658D' : '#CBD5E1')),
                            }}
                            value={selectedHotelId}
                            onChange={handleHotelChange}
                        >
                            <option value="">
                                {!selectedArea
                                    ? (direction === 'Pick-Up' ? '⚠️ Choose destination area first...' : '⚠️ Choose pick-up area first...')
                                    : (filteredHotels.length > 0
                                        ? `-- Select Hotel / Resort (${filteredHotels.length} available) --`
                                        : `-- No hotels registered in ${selectedArea} --`)}
                            </option>
                            {filteredHotels.map((h) => (
                                <option key={h.id} value={h.id}>
                                    {h.nama_hotel}
                                </option>
                            ))}
                        </select>
                    </FieldWithIcon>

                    {/* Helpful state cues */}
                    {!selectedArea && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11px',
                            color: '#64748B',
                            marginTop: '5px',
                            padding: '5px 8px',
                            background: '#F8FAFC',
                            borderRadius: '6px',
                            border: '1px dashed #CBD5E1',
                        }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00658D" strokeWidth="2.2" style={{ flexShrink: 0 }}>
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="8" />
                            </svg>
                            <span>Select your destination area on the left to unlock hotels.</span>
                        </div>
                    )}

                    {selectedArea && filteredHotels.length > 0 && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '11px',
                            color: '#0369A1',
                            marginTop: '5px',
                            padding: '4px 8px',
                            background: '#F0F9FF',
                            borderRadius: '6px',
                            border: '1px solid #BAE6FD',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>
                                    <strong>{filteredHotels.length}</strong> hotel{filteredHotels.length === 1 ? '' : 's'} available in <strong>{selectedArea}</strong>
                                </span>
                            </div>
                            {!selectedHotelId && (
                                <span style={{ color: '#0284C7', fontWeight: 600 }}>Choose hotel ↑</span>
                            )}
                        </div>
                    )}

                    {selectedArea && filteredHotels.length === 0 && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11px',
                            color: '#B45309',
                            marginTop: '5px',
                            padding: '5px 8px',
                            background: '#FFFBEB',
                            borderRadius: '6px',
                            border: '1px solid #FDE68A',
                        }}>
                            <span>Staying at a private villa? You can mention your address in the Special Instructions box below.</span>
                        </div>
                    )}

                    {(errors.dropoff_hotel_id || errors.pickup_hotel_id) && (
                        <span style={{ fontSize: '11px', color: '#F43F5E', marginTop: '4px', display: 'block' }}>
                            {errors.dropoff_hotel_id || errors.pickup_hotel_id}
                        </span>
                    )}
                </div>
            </div>

            {/* 3. Row 2: Date, Time, Flight Number, Vehicle */}
            <div className="bfs-form-row" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                padding: '16px 32px 0',
            }}>
                <div>
                    <FieldWithIcon label="Arrival / Pickup Date *" icon={<IconCalendar />}>
                        <input
                            type="date"
                            required
                            style={{
                                ...inputStyle,
                                borderColor: errors.booking_date ? '#F43F5E' : '#CBD5E1',
                            }}
                            value={data.booking_date}
                            onChange={(e) => setData('booking_date', e.target.value)}
                        />
                    </FieldWithIcon>
                    {errors.booking_date && (
                        <span style={{ fontSize: '11px', color: '#F43F5E' }}>{errors.booking_date}</span>
                    )}
                </div>

                <div>
                    <FieldWithIcon label="Flight Arrival Time *" icon={<IconClock />}>
                        <input
                            type="time"
                            required
                            style={{
                                ...inputStyle,
                                borderColor: errors.pickup_time ? '#F43F5E' : '#CBD5E1',
                            }}
                            value={data.pickup_time}
                            onChange={(e) => setData('pickup_time', e.target.value)}
                        />
                    </FieldWithIcon>
                    {errors.pickup_time && (
                        <span style={{ fontSize: '11px', color: '#F43F5E' }}>{errors.pickup_time}</span>
                    )}
                </div>

                <div>
                    <FieldWithIcon label="Flight Number" icon={<IconFlight />} optional={true}>
                        <input
                            type="text"
                            placeholder="e.g. GA-404, VA-045"
                            style={inputStyle}
                            value={data.flight_number}
                            onChange={(e) => setData('flight_number', e.target.value)}
                        />
                    </FieldWithIcon>
                </div>

                <div>
                    <VehicleSelect
                        vehicles={vehicles}
                        value={data.vehicle_id}
                        onChange={(e) => setData('vehicle_id', parseInt(e.target.value, 10))}
                    />
                    {errors.vehicle_id && (
                        <span style={{ fontSize: '11px', color: '#F43F5E' }}>{errors.vehicle_id}</span>
                    )}
                </div>
            </div>

            {/* 4. Row 3: Guest Name, WhatsApp, Email, Passengers */}
            <div className="bfs-form-row" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                padding: '16px 32px 0',
            }}>
                <div>
                    <FieldWithIcon label="Full Name *" icon={<IconUser />}>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Sarah Miller"
                            style={{
                                ...inputStyle,
                                borderColor: errors.guest_name ? '#F43F5E' : '#CBD5E1',
                            }}
                            value={data.guest_name}
                            onChange={(e) => setData('guest_name', e.target.value)}
                        />
                    </FieldWithIcon>
                    {errors.guest_name && (
                        <span style={{ fontSize: '11px', color: '#F43F5E' }}>{errors.guest_name}</span>
                    )}
                </div>

                <div>
                    <FieldWithIcon label="WhatsApp Number *" icon={<IconPhone />}>
                        <input
                            type="tel"
                            required
                            placeholder="e.g. +61 412 345 678"
                            style={{
                                ...inputStyle,
                                borderColor: errors.whatsapp_number ? '#F43F5E' : '#CBD5E1',
                            }}
                            value={data.whatsapp_number}
                            onChange={(e) => setData('whatsapp_number', e.target.value)}
                        />
                    </FieldWithIcon>
                    {errors.whatsapp_number && (
                        <span style={{ fontSize: '11px', color: '#F43F5E' }}>{errors.whatsapp_number}</span>
                    )}
                </div>

                <div>
                    <FieldWithIcon label="Email Address" icon={<IconEmail />} optional={true}>
                        <input
                            type="email"
                            placeholder="sarah@example.com"
                            style={inputStyle}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </FieldWithIcon>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <FieldWithIcon label="Adults" isSelect={true}>
                        <select
                            style={selectStyle}
                            value={data.adults}
                            onChange={(e) => setData('adults', parseInt(e.target.value, 10))}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </FieldWithIcon>

                    <FieldWithIcon label="Children" isSelect={true}>
                        <select
                            style={selectStyle}
                            value={data.children}
                            onChange={(e) => setData('children', parseInt(e.target.value, 10))}
                        >
                            {[0, 1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </FieldWithIcon>
                </div>
                {(isOverCapacity || errors.adults) && (
                    <span style={{ fontSize: '11px', color: '#F43F5E', marginTop: '4px', display: 'block' }}>
                        {errors.adults || (selectedVehicle ? `Melebihi kapasitas kendaraan ini (maks ${selectedVehicle.passenger_capacity} orang)` : 'Melebihi kapasitas kendaraan')}
                    </span>
                )}
            </div>

            {/* 5. Child Seats Selection */}
            <div style={{ padding: '16px 32px 0' }}>
                <ChildSeatsSelector
                    childSeatTypes={childSeatTypes}
                    selectedSeats={selectedSeats}
                    onSeatChange={handleSeatChange}
                />
            </div>

            {/* 6. Special Requests */}
            <div style={{ padding: '16px 32px 0' }}>
                <FieldWithIcon label="Special Instructions & Requests" icon={<IconNote />} optional={true}>
                    <textarea
                        rows="2"
                        placeholder="e.g. Flight delay details, pram size, driver meeting instructions..."
                        style={textareaStyle}
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                    />
                </FieldWithIcon>
            </div>

            {/* 7. Footer with Live Estimate & Submit Buttons */}
            <BookingFooter
                onWhatsApp={handleWA}
                onBook={handleFormSubmit}
                estimatedFee={estimatedFee}
                loadingEstimate={loadingEstimate}
                isSubmitting={processing}
            />
        </form>
    );
}
