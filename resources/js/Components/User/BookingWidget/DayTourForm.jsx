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
const IconLocation = () => <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>;
const IconCalendar = () => <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>;
const IconClock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>;
const IconTourMap = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>;
const IconNote = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;

export default function DayTourForm({ packages = [], vehicles = [], childSeatTypes = [] }) {
    const { flash = {} } = usePage().props;
    const [selectedSeats, setSelectedSeats] = useState({});
    const [estimatedFee, setEstimatedFee] = useState(null);
    const [loadingEstimate, setLoadingEstimate] = useState(false);

    const defaultVehicle = vehicles[0];
    const defaultPackage = packages[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        guest_name: '',
        whatsapp_number: '',
        email: '',
        booking_type: 'Day Tour',
        package_id: defaultPackage?.id || '',
        vehicle_id: defaultVehicle?.id || '',
        pickup_hotel_id: null,
        dropoff_hotel_id: null,
        booking_date: '',
        pickup_time: '08:30',
        adults: 2,
        children: 1,
        notes: '',
        child_seats: [],
    });

    const selectedVehicle = vehicles.find((v) => String(v.id) === String(data.vehicle_id));
    const totalPax = (parseInt(data.adults, 10) || 0) + (parseInt(data.children, 10) || 0);
    const isOverCapacity = Boolean(selectedVehicle?.passenger_capacity && totalPax > selectedVehicle.passenger_capacity);

    useEffect(() => {
        if (!data.vehicle_id && defaultVehicle?.id) {
            setData('vehicle_id', defaultVehicle.id);
        }
    }, [vehicles]);

    useEffect(() => {
        if (!data.package_id && defaultPackage?.id) {
            setData('package_id', defaultPackage.id);
        }
    }, [packages]);

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

    // Live price calculation on package and vehicle
    useEffect(() => {
        if (!data.package_id || !data.vehicle_id) {
            setEstimatedFee(null);
            return;
        }

        const timer = setTimeout(() => {
            setLoadingEstimate(true);
            axios.post('/api/pricing/estimate', {
                booking_type: 'Day Tour',
                package_id: data.package_id,
                vehicle_id: data.vehicle_id,
            })
                .then((res) => {
                    setEstimatedFee(res.data.total_fee);
                })
                .catch(() => {
                    // Fallback to package price if estimate has constraint (e.g. minibus only for full day)
                    const p = packages.find((pkg) => String(pkg.id) === String(data.package_id));
                    setEstimatedFee(p?.regular_price || p?.price || 800000);
                })
                .finally(() => {
                    setLoadingEstimate(false);
                });
        }, 300);

        return () => clearTimeout(timer);
    }, [data.package_id, data.vehicle_id]);

    const handleFormSubmit = (e) => {
        if (e) e.preventDefault();
        post('/booking', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSelectedSeats({});
                setEstimatedFee(null);
            },
        });
    };

    const handleWA = () => {
        const pObj = packages.find((p) => String(p.id) === String(data.package_id));
        const vehObj = vehicles.find((v) => String(v.id) === String(data.vehicle_id));

        const seatsText = Object.entries(selectedSeats)
            .filter(([_, q]) => q > 0)
            .map(([id, q]) => {
                const s = childSeatTypes.find((st) => String(st.id) === String(id));
                return `${q}x ${s?.name || 'Child Seat'}`;
            })
            .join(', ') || '1x Free Included';

        const msg = `Hi Bali Family Safe!\n\n*Private Day Tour Booking:*
- Tour Package: ${pObj?.name || 'Custom Day Tour'}
- Guest Name: ${data.guest_name}
- WhatsApp: ${data.whatsapp_number}
- Tour Date: ${data.booking_date} at ${data.pickup_time}
- Vehicle: ${vehObj?.name || 'Not specified'}
- Child Seats: ${seatsText}
- Estimated Price: ${estimatedFee ? `Rp ${Number(estimatedFee).toLocaleString('id-ID')}` : 'To be confirmed'}
- Notes: ${data.notes || '-'}`;

        window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            {flash?.success && (
                <div className="mx-6 mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{flash.success}</span>
                </div>
            )}

            {/* 1. Row 1: Tour Package & Vehicle Choice (50% / 50%) */}
            <div className="bfs-form-row" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                padding: '24px 32px 0',
            }}>
                <div style={{ gridColumn: 'span 2' }}>
                    <FieldWithIcon label="Select Family Tour Package *" isSelect={true} icon={<IconTourMap />}>
                        <select
                            required
                            style={{
                                ...selectStyle,
                                borderColor: errors.package_id ? '#F43F5E' : (data.package_id ? '#00658D' : '#CBD5E1'),
                            }}
                            value={data.package_id}
                            onChange={(e) => setData('package_id', e.target.value ? parseInt(e.target.value, 10) : '')}
                        >
                            <option value="">Choose Tour Itinerary</option>
                            {packages.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                    {pkg.name} ({pkg.duration_type || 'Full Day'})
                                </option>
                            ))}
                        </select>
                    </FieldWithIcon>
                    {errors.package_id && (
                        <span style={{ fontSize: '11px', color: '#F43F5E', marginTop: '4px' }}>{errors.package_id}</span>
                    )}
                </div>

                <div style={{ gridColumn: 'span 2' }}>
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

            {/* 2. Row 2: Date, Time, Notes */}
            <div className="bfs-form-row" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                padding: '16px 32px 0',
            }}>
                <div style={{ gridColumn: 'span 2' }}>
                    <FieldWithIcon label="Tour Date *" icon={<IconCalendar />}>
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

                <div style={{ gridColumn: 'span 2' }}>
                    <FieldWithIcon label="Departure Time *" icon={<IconClock />}>
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
            </div>

            {/* 3. Row 3: Guest Info */}
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
                            placeholder="e.g. Jessica Davis"
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
                            placeholder="jessica@example.com"
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

            {/* 4. Child Seats Selection */}
            <div style={{ padding: '16px 32px 0' }}>
                <ChildSeatsSelector
                    childSeatTypes={childSeatTypes}
                    selectedSeats={selectedSeats}
                    onSeatChange={handleSeatChange}
                />
            </div>

            {/* 5. Custom Stops / Hotel Info */}
            <div style={{ padding: '16px 32px 0' }}>
                <FieldWithIcon label="Pick-Up Hotel & Custom Stops" icon={<IconLocation />} optional={true}>
                    <textarea
                        rows="2"
                        placeholder="e.g. Pick-up at Ayana Resort Jimbaran. We would love to stop at Tegenungan waterfall and a kid-friendly cafe..."
                        style={textareaStyle}
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                    />
                </FieldWithIcon>
            </div>

            {/* 6. Footer */}
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
