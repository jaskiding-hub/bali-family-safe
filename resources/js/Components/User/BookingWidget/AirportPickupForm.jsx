import React, { useState } from 'react';
import { BookingFooter, FieldWithIcon, inputStyle, selectStyle, textareaStyle, VehicleSelect, CarSeatsSelector } from './FormShared';

const IconUser = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#6E7881"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;
const IconPhone = () => <svg width="15" height="22" viewBox="0 0 24 24" fill="#6E7881"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>;
const IconEmail = () => <svg width="20" height="16" viewBox="0 0 24 24" fill="#6E7881"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;
const IconFlight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="#6E7881"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>;
const IconPeople = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#6E7881"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const IconLocation = () => <svg width="16" height="20" viewBox="0 0 24 24" fill="#6E7881"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>;
const IconCalendar = () => <svg width="18" height="20" viewBox="0 0 24 24" fill="#6E7881"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>;
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="#6E7881"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>;
const IconNote = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#6E7881"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;

export default function AirportPickupForm() {
    const [form, setForm] = useState({
        name: '', phone: '', email: '', flight: '',
        adults: '', children: '', pickup: '',
        date: '', time: '', vehicle: '',
        infantSeat: '0', toddlerSeat: '0', boosterSeat: '0',
        notes: ''
    });

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

    const handleWA = () => {
        const seatsSummary = [];
        if (parseInt(form.infantSeat) > 0) seatsSummary.push(`${form.infantSeat}x Rear-Facing Infant`);
        if (parseInt(form.toddlerSeat) > 0) seatsSummary.push(`${form.toddlerSeat}x Forward-Facing Toddler`);
        if (parseInt(form.boosterSeat) > 0) seatsSummary.push(`${form.boosterSeat}x Booster Seat`);
        const seatsText = seatsSummary.length > 0 ? seatsSummary.join(', ') : 'Standard free car seat';

        const msg = `Hi Bali Family Safe!\n\nAirport Pick-Up Booking:\n- Name: ${form.name}\n- WhatsApp: ${form.phone}\n- Email: ${form.email}\n- Flight Number: ${form.flight}\n- Vehicle Model: ${form.vehicle || 'Not specified'}\n- Car Seats: ${seatsText}\n- Adults: ${form.adults}, Children: ${form.children}\n- Destination Area: ${form.pickup}\n- Arrival Date: ${form.date}, Time: ${form.time}\n- Notes: ${form.notes}`;
        window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <form onSubmit={e => e.preventDefault()}>
            {/* Row 1: Name | Phone | Email | Flight */}
            <div className="bfs-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', padding: '32px 32px 0' }}>
                <FieldWithIcon label="Full Name" icon={<IconUser />}>
                    <input style={inputStyle} placeholder="John Doe" value={form.name} onChange={set('name')} />
                </FieldWithIcon>
                <FieldWithIcon label="WhatsApp Number" icon={<IconPhone />}>
                    <input style={inputStyle} placeholder="+1 234 567 8900" value={form.phone} onChange={set('phone')} />
                </FieldWithIcon>
                <FieldWithIcon label="Email Address" icon={<IconEmail />}>
                    <input style={inputStyle} placeholder="john@example.com" value={form.email} onChange={set('email')} type="email" />
                </FieldWithIcon>
                <FieldWithIcon label="Flight Number" icon={<IconFlight />}>
                    <input style={inputStyle} placeholder="e.g., GA123" value={form.flight} onChange={set('flight')} />
                </FieldWithIcon>
            </div>

            {/* Row 2: Passengers | Destination Location (dropdown) */}
            <div className="bfs-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px 32px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', lineHeight: '20px', letterSpacing: '0.14px', color: '#191C1D' }}>
                        Passengers
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                <IconPeople />
                            </div>
                            <select style={selectStyle} value={form.adults} onChange={set('adults')}>
                                <option value="">Adults</option>
                                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Adult{n>1?'s':''}</option>)}
                            </select>
                        </div>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="#6E7881"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>
                            </div>
                            <select style={selectStyle} value={form.children} onChange={set('children')}>
                                <option value="">Children</option>
                                {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n} Child{n!==1?'ren':''}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Destination Location — area dropdown */}
                <FieldWithIcon label="Destination Area in Bali" icon={<IconLocation />}>
                    <select style={{ ...selectStyle, height: '43px' }} value={form.pickup} onChange={set('pickup')}>
                        <option value="">Select area in Bali...</option>
                        <option>Kuta / Legian</option>
                        <option>Seminyak</option>
                        <option>Canggu</option>
                        <option>Ubud</option>
                        <option>Nusa Dua</option>
                        <option>Sanur</option>
                        <option>Uluwatu / Jimbaran</option>
                        <option>Other (specify in notes)</option>
                    </select>
                </FieldWithIcon>
            </div>

            {/* Row 3: Arrival Date & Time | Vehicle Model */}
            <div className="bfs-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px 32px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', lineHeight: '20px', letterSpacing: '0.14px', color: '#191C1D' }}>
                        Arrival Date & Time
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                <IconCalendar />
                            </div>
                            <input type="date" style={{ ...inputStyle, height: '48px' }} value={form.date} onChange={set('date')} />
                        </div>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                <IconClock />
                            </div>
                            <input type="time" style={{ ...inputStyle, height: '48px' }} value={form.time} onChange={set('time')} />
                        </div>
                    </div>
                </div>

                {/* Vehicle Model Dropdown */}
                <VehicleSelect value={form.vehicle} onChange={set('vehicle')} />
            </div>

            {/* Row 4: Child Car Seats (3 Types & Quantity Selector) */}
            <div className="bfs-form-row" style={{ padding: '16px 32px 0' }}>
                <CarSeatsSelector
                    infantSeat={form.infantSeat}
                    setInfantSeat={val => setForm(f => ({ ...f, infantSeat: val }))}
                    toddlerSeat={form.toddlerSeat}
                    setToddlerSeat={val => setForm(f => ({ ...f, toddlerSeat: val }))}
                    boosterSeat={form.boosterSeat}
                    setBoosterSeat={val => setForm(f => ({ ...f, boosterSeat: val }))}
                />
            </div>

            {/* Row 5: Notes (full-width) */}
            <div className="bfs-form-row" style={{ padding: '16px 32px 0' }}>
                <FieldWithIcon label="Notes" icon={<IconNote />}>
                    <textarea
                        style={{ ...textareaStyle, width: '100%' }}
                        placeholder="Luggage count, flight delay info, special requests..."
                        value={form.notes}
                        onChange={set('notes')}
                        rows={3}
                    />
                </FieldWithIcon>
            </div>

            <BookingFooter onWhatsApp={handleWA} onBook={handleWA} />
        </form>
    );
}
