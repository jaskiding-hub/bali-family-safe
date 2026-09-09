import React, { useState } from 'react';
import { BookingFooter, FieldWithIcon, inputStyle, selectStyle, textareaStyle, VehicleSelect } from './FormShared';
import { BALI_DESTINATIONS } from '../../../data/user/destinationsHotels';

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

export default function AirportBookingForm() {
    const [category, setCategory] = useState('pickup');
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        flight: '',
        adults: '2',
        children: '1',
        area: '',
        hotel: '',
        customHotel: '',
        date: '',
        time: '',
        vehicle: 'Toyota Innova Reborn',
        infantSeat: '0',
        toddlerSeat: '1',
        boosterSeat: '0',
        notes: ''
    });

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

    const handleAreaChange = (e) => {
        const selectedArea = e.target.value;
        setForm(f => ({
            ...f,
            area: selectedArea,
            hotel: '',
            customHotel: '',
        }));
    };

    const selectedDestination = BALI_DESTINATIONS.find(d => d.name === form.area);
    const hotelsList = selectedDestination?.popularHotels || [];
    const isCustomHotelSelected = form.hotel === '__custom__' || form.area === 'Other Area in Bali';

    const handleWA = () => {
        const seatsSummary = [];
        if (parseInt(form.infantSeat) > 0) seatsSummary.push(`${form.infantSeat}x Rear-Facing Infant`);
        if (parseInt(form.toddlerSeat) > 0) seatsSummary.push(`${form.toddlerSeat}x Forward-Facing Toddler`);
        if (parseInt(form.boosterSeat) > 0) seatsSummary.push(`${form.boosterSeat}x Booster Seat`);
        const seatsText = seatsSummary.length > 0 ? seatsSummary.join(', ') : 'Standard free car seat';

        const categoryTitle = category === 'pickup' ? 'Airport Pick-Up' : 'Airport Drop-Off';

        const finalHotel = isCustomHotelSelected
            ? (form.customHotel || 'Custom Hotel / Villa')
            : (form.hotel || form.customHotel || 'Not specified');

        let routeDetails = '';
        if (category === 'pickup') {
            routeDetails = `- Pick-Up Location: DPS Ngurah Rai Airport (Arrival)\n- Destination Area: ${form.area || 'Not specified'}\n- Drop-Off Hotel / Villa: ${finalHotel}`;
        } else {
            routeDetails = `- Pick-Up Area: ${form.area || 'Not specified'}\n- Pick-Up Hotel / Villa: ${finalHotel}\n- Drop-Off Location: DPS Ngurah Rai Airport (Departure)`;
        }

        const msg = `Hi Bali Family Safe!\n\n*${categoryTitle} Booking:*\n- Full Name: ${form.name}\n- WhatsApp: ${form.phone}\n- Email: ${form.email || '-'}\n- Flight Number: ${form.flight || '-'}\n${routeDetails}\n- Date: ${form.date || 'To be confirmed'}, Time: ${form.time || 'To be confirmed'}\n- Vehicle Model: ${form.vehicle || 'Not specified'}\n- Passengers: ${form.adults || '1'} Adults, ${form.children || '0'} Children\n- Free Car Seats: ${seatsText}\n- Notes: ${form.notes || '-'}`;

        window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column' }}>
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
                        onClick={() => setCategory('pickup')}
                        style={{
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            borderRadius: '7px',
                            border: 'none',
                            background: category === 'pickup' ? '#FFFFFF' : 'transparent',
                            boxShadow: category === 'pickup' ? '0px 1px 3px rgba(0,0,0,0.08)' : 'none',
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: category === 'pickup' ? 600 : 500,
                            fontSize: '13px',
                            color: category === 'pickup' ? '#00658D' : '#64748B',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: category === 'pickup' ? '#00658D' : '#94A3B8' }} />
                        <span>Airport Pick-Up (DPS Airport → Hotel)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setCategory('dropoff')}
                        style={{
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            borderRadius: '7px',
                            border: 'none',
                            background: category === 'dropoff' ? '#FFFFFF' : 'transparent',
                            boxShadow: category === 'dropoff' ? '0px 1px 3px rgba(0,0,0,0.08)' : 'none',
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: category === 'dropoff' ? 600 : 500,
                            fontSize: '13px',
                            color: category === 'dropoff' ? '#00658D' : '#64748B',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: category === 'dropoff' ? '#00658D' : '#94A3B8' }} />
                        <span>Airport Drop-Off (Hotel → DPS Airport)</span>
                    </button>
                </div>
            </div>

            {/* 2. Row 1: Route (50% Area / 50% Hotel) */}
            <div className="bfs-form-row" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                padding: '16px 32px 0',
            }}>
                <div style={{ gridColumn: 'span 2' }}>
                    <FieldWithIcon
                        label={category === 'pickup' ? '1. Destination Area in Bali' : '1. Pick-Up Area in Bali'}
                        isSelect={true}
                        icon={<IconLocation />}
                    >
                        <select
                            style={selectStyle}
                            value={form.area}
                            onChange={handleAreaChange}
                        >
                            <option value="">
                                {category === 'pickup' ? 'Select destination (e.g. Kuta, Canggu)...' : 'Select pick-up area (e.g. Kuta, Canggu)...'}
                            </option>
                            {BALI_DESTINATIONS.map(dest => (
                                <option key={dest.id} value={dest.name}>{dest.name}</option>
                            ))}
                        </select>
                    </FieldWithIcon>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                    <FieldWithIcon
                        label={category === 'dropoff' ? '2. Pick-Up Hotel / Villa' : '2. Drop-Off Hotel / Villa'}
                        isSelect={true}
                        icon={<IconHotel />}
                    >
                        <select
                            disabled={!form.area}
                            style={{
                                ...selectStyle,
                                opacity: !form.area ? 0.6 : 1,
                                cursor: !form.area ? 'not-allowed' : 'pointer',
                                background: !form.area ? '#F8FAFC' : '#FFFFFF',
                            }}
                            value={form.hotel}
                            onChange={set('hotel')}
                        >
                            {!form.area ? (
                                <option value="">Please select destination area first...</option>
                            ) : (
                                <>
                                    <option value="">-- Choose Hotel / Resort in {form.area} --</option>
                                    {hotelsList.map((hotelName) => (
                                        <option key={hotelName} value={hotelName}>{hotelName}</option>
                                    ))}
                                    <option value="__custom__">✍️ Other Hotel / Private Villa / Airbnb (Input manually)...</option>
                                </>
                            )}
                        </select>
                    </FieldWithIcon>
                </div>

                {isCustomHotelSelected && (
                    <div style={{ gridColumn: 'span 4' }}>
                        <FieldWithIcon label="Specify Hotel / Villa Name & Address" icon={<IconHotel />}>
                            <input
                                style={inputStyle}
                                placeholder={
                                    category === 'dropoff'
                                        ? "Type pick-up hotel / villa name or exact street address..."
                                        : "Type drop-off hotel / villa name or exact street address..."
                                }
                                value={form.customHotel}
                                onChange={set('customHotel')}
                                autoFocus
                            />
                        </FieldWithIcon>
                    </div>
                )}
            </div>

            {/* 3. Row 2: Date, Time & Vehicle */}
            <div className="bfs-form-row" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                padding: '16px 32px 0',
            }}>
                <div style={{ gridColumn: 'span 1' }}>
                    <FieldWithIcon label={category === 'dropoff' ? 'Pick-Up Date' : 'Arrival Date'} icon={<IconCalendar />}>
                        <input
                            type="date"
                            style={inputStyle}
                            value={form.date}
                            onChange={set('date')}
                        />
                    </FieldWithIcon>
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                    <FieldWithIcon label={category === 'dropoff' ? 'Pick-Up Time' : 'Arrival Time'} icon={<IconClock />}>
                        <input
                            type="time"
                            style={inputStyle}
                            value={form.time}
                            onChange={set('time')}
                        />
                    </FieldWithIcon>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                    <VehicleSelect value={form.vehicle} onChange={set('vehicle')} />
                </div>
            </div>

            {/* 4. Row 3: Passengers & 3 Free Child Car Seats (All 4 equal 1fr columns!) */}
            <div className="bfs-form-row" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                padding: '16px 32px 0',
            }}>
                {/* Passengers */}
                <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column' }}>
                    <label style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '13px',
                        lineHeight: '18px',
                        color: '#334155',
                        marginBottom: '6px',
                    }}>
                        Passengers
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <select
                                style={{ ...selectStyle, paddingLeft: '10px', paddingRight: '18px', fontSize: '13px' }}
                                value={form.adults}
                                onChange={set('adults')}
                            >
                                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Adl</option>)}
                            </select>
                        </div>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <select
                                style={{ ...selectStyle, paddingLeft: '10px', paddingRight: '18px', fontSize: '13px' }}
                                value={form.children}
                                onChange={set('children')}
                            >
                                {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n} Chd</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Free Car Seat 1: Infant */}
                <div style={{ gridColumn: 'span 1' }}>
                    <FieldWithIcon label="Infant (0–12 Mo)" isSelect={true}>
                        <select
                            style={{ ...selectStyle, paddingLeft: '12px' }}
                            value={form.infantSeat}
                            onChange={set('infantSeat')}
                        >
                            <option value="0">0 (None)</option>
                            <option value="1">1 Seat</option>
                            <option value="2">2 Seats</option>
                            <option value="3">3 Seats</option>
                        </select>
                    </FieldWithIcon>
                </div>

                {/* Free Car Seat 2: Toddler */}
                <div style={{ gridColumn: 'span 1' }}>
                    <FieldWithIcon label="Toddler (1–4 Yrs)" isSelect={true}>
                        <select
                            style={{ ...selectStyle, paddingLeft: '12px' }}
                            value={form.toddlerSeat}
                            onChange={set('toddlerSeat')}
                        >
                            <option value="0">0 (None)</option>
                            <option value="1">1 Seat</option>
                            <option value="2">2 Seats</option>
                            <option value="3">3 Seats</option>
                        </select>
                    </FieldWithIcon>
                </div>

                {/* Free Car Seat 3: Booster */}
                <div style={{ gridColumn: 'span 1' }}>
                    <FieldWithIcon label="Booster (4–8+ Yrs)" isSelect={true}>
                        <select
                            style={{ ...selectStyle, paddingLeft: '12px' }}
                            value={form.boosterSeat}
                            onChange={set('boosterSeat')}
                        >
                            <option value="0">0 (None)</option>
                            <option value="1">1 Seat</option>
                            <option value="2">2 Seats</option>
                            <option value="3">3 Seats</option>
                        </select>
                    </FieldWithIcon>
                </div>
            </div>

            {/* 5. Row 4: Personal Contact & Flight */}
            <div className="bfs-form-row" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                padding: '16px 32px 0',
            }}>
                <div style={{ gridColumn: 'span 1' }}>
                    <FieldWithIcon label="Full Name" icon={<IconUser />}>
                        <input style={inputStyle} placeholder="John Doe" value={form.name} onChange={set('name')} />
                    </FieldWithIcon>
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                    <FieldWithIcon label="WhatsApp Number" icon={<IconPhone />}>
                        <input style={inputStyle} placeholder="+1 234 567 8900" value={form.phone} onChange={set('phone')} />
                    </FieldWithIcon>
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                    <FieldWithIcon label="Email Address" optional={true} icon={<IconEmail />}>
                        <input style={inputStyle} placeholder="john@example.com" value={form.email} onChange={set('email')} type="email" />
                    </FieldWithIcon>
                </div>

                <div style={{ gridColumn: 'span 1' }}>
                    <FieldWithIcon
                        label={category === 'dropoff' ? 'Departure Flight' : 'Arrival Flight'}
                        optional={true}
                        icon={<IconFlight />}
                    >
                        <input style={inputStyle} placeholder="e.g., GA123 / QF43" value={form.flight} onChange={set('flight')} />
                    </FieldWithIcon>
                </div>
            </div>

            {/* 6. Row 5: Notes & Special Requests */}
            <div className="bfs-form-row" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                padding: '16px 32px 0',
            }}>
                <div style={{ gridColumn: 'span 4' }}>
                    <FieldWithIcon label="Notes & Special Requests" optional={true} icon={<IconNote />}>
                        <textarea
                            style={textareaStyle}
                            placeholder="Luggage count, stroller space, flight delay updates, or special requests..."
                            value={form.notes}
                            onChange={set('notes')}
                            rows={2}
                        />
                    </FieldWithIcon>
                </div>
            </div>

            {/* 7. Footer Actions */}
            <BookingFooter onWhatsApp={handleWA} onBook={handleWA} />
        </form>
    );
}
