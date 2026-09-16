import React from 'react';

// Design tokens - Quiet, restrained, premium
export const LABEL_COLOR = '#334155'; // Slate-700
export const INPUT_BG = '#FFFFFF';
export const INPUT_BORDER = '#CBD5E1'; // Slate-300
export const INPUT_BORDER_FOCUS = '#00658D';
export const PLACEHOLDER_COLOR = '#94A3B8';
export const ICON_COLOR = '#64748B';

export const labelStyle = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '13px',
    lineHeight: '18px',
    color: LABEL_COLOR,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
};

export const inputStyle = {
    width: '100%',
    height: '46px',
    background: INPUT_BG,
    border: `1.5px solid ${INPUT_BORDER}`,
    borderRadius: '8px',
    padding: '10px 14px 10px 38px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    color: '#0F172A',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
};

export const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    cursor: 'pointer',
    paddingRight: '32px',
};

export const textareaStyle = {
    width: '100%',
    minHeight: '76px',
    background: INPUT_BG,
    border: `1.5px solid ${INPUT_BORDER}`,
    borderRadius: '8px',
    padding: '10px 14px 10px 38px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    color: '#0F172A',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
};

// Reusable Field with Inset Icon and optional custom dropdown chevron
export function FieldWithIcon({ label, icon, isSelect = false, optional = false, children, style = {} }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', ...style }}>
            {label && (
                <label style={labelStyle}>
                    <span>{label}</span>
                    {optional && (
                        <span style={{ fontSize: '11px', fontWeight: 400, color: '#94A3B8' }}>
                            Optional
                        </span>
                    )}
                </label>
            )}
            <div style={{ position: 'relative', width: '100%' }}>
                {icon && (
                    <div style={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        color: ICON_COLOR,
                        zIndex: 2,
                    }}>
                        {icon}
                    </div>
                )}
                {children}
                {isSelect && (
                    <div style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}

// Vehicle Selection Dropdown
export function VehicleSelect({ value, onChange, vehicles = [] }) {
    return (
        <FieldWithIcon
            label="Vehicle Model Preference"
            isSelect={true}
            icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
            }
        >
            <select
                style={{
                    ...selectStyle,
                    borderColor: value ? '#00658D' : INPUT_BORDER,
                }}
                value={value}
                onChange={onChange}
            >
                <option value="">Select vehicle model...</option>
                {vehicles && vehicles.length > 0 ? (
                    vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                            {v.name} (1–{v.passenger_capacity || 6} Passengers - {v.category || 'SUV'})
                        </option>
                    ))
                ) : (
                    <>
                        <option value="1">Toyota Avanza / Veloz (1–4 Passengers)</option>
                        <option value="2">Toyota Innova Reborn (1–6 Passengers - Most Popular)</option>
                        <option value="3">Toyota HiAce Commuter (1–12 Passengers)</option>
                    </>
                )}
            </select>
        </FieldWithIcon>
    );
}

// Child Seats Selector Component
export function ChildSeatsSelector({ childSeatTypes = [], selectedSeats = {}, onSeatChange }) {
    const defaultSeats = [
        { id: 1, name: 'Rear-Facing Infant Capsule', age_range: '0–1 yr', weight_range: '0–13 kg' },
        { id: 2, name: 'Forward-Facing Toddler Car Seat', age_range: '1–4 yr', weight_range: '9–18 kg' },
        { id: 3, name: 'High-Back Booster Seat', age_range: '4–8 yr', weight_range: '15–36 kg' },
    ];

    const seats = childSeatTypes && childSeatTypes.length > 0 ? childSeatTypes : defaultSeats;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: LABEL_COLOR }}>
                    Certified Child Car Seats (100% Free & Sanitized)
                </span>
                <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, background: '#DCFCE7', padding: '2px 8px', borderRadius: '6px' }}>
                    Free Included
                </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {seats.map((seat) => {
                    const qty = selectedSeats[seat.id] || 0;
                    return (
                        <div
                            key={seat.id}
                            style={{
                                border: qty > 0 ? '1.5px solid #00AEEF' : '1px solid #CBD5E1',
                                background: qty > 0 ? '#F0F9FF' : '#FFFFFF',
                                borderRadius: '10px',
                                padding: '10px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {seat.name}
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748B' }}>
                                    {seat.age_range} • {seat.weight_range}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <button
                                    type="button"
                                    onClick={() => onSeatChange(seat.id, Math.max(0, qty - 1))}
                                    style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '6px',
                                        border: '1px solid #CBD5E1',
                                        background: '#FFFFFF',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        color: '#64748B',
                                    }}
                                >
                                    -
                                </button>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', minWidth: '16px', textAlign: 'center', color: qty > 0 ? '#00658D' : '#94A3B8' }}>
                                    {qty}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onSeatChange(seat.id, Math.min(3, qty + 1))}
                                    style={{
                                        width: '26px',
                                        height: '26px',
                                        borderRadius: '6px',
                                        border: '1px solid #00AEEF',
                                        background: '#00AEEF',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        color: '#FFFFFF',
                                    }}
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
}

// Clean, Two-Button Footer (Book Now + Book via WhatsApp) with Live Price Estimate
export function BookingFooter({ onWhatsApp, onBook, estimatedFee, loadingEstimate, isSubmitting }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px 32px 24px',
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
        }}>
            {/* Live Pricing Summary Bar */}
            {estimatedFee !== undefined && estimatedFee !== null && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#FFFFFF',
                    border: '1px solid #BAE6FD',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#0369A1' }}>
                            Estimated Fare (All-Inclusive):
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>
                            (Fuel, driver, toll, car seats included)
                        </span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#00658D' }}>
                        {loadingEstimate ? 'Calculating...' : `Rp ${Number(estimatedFee).toLocaleString('id-ID')}`}
                    </div>
                </div>
            )}

            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap',
            }}>
                {/* 1. Book via WhatsApp */}
                <button
                    type="button"
                    onClick={onWhatsApp}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '0 28px',
                        height: '46px',
                        minWidth: '180px',
                        background: '#25D366',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#FFFFFF',
                        letterSpacing: '0.14px',
                        transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#20BD5A'}
                    onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>Book via WhatsApp</span>
                </button>

                {/* 2. Standard Book Now */}
                <button
                    type="button"
                    onClick={onBook}
                    disabled={isSubmitting}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '0 28px',
                        height: '46px',
                        minWidth: '180px',
                        background: '#00658D',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#FFFFFF',
                        letterSpacing: '0.14px',
                        transition: 'background 0.15s ease',
                        opacity: isSubmitting ? 0.7 : 1,
                    }}
                    onMouseEnter={e => !isSubmitting && (e.currentTarget.style.background = '#004F6E')}
                    onMouseLeave={e => !isSubmitting && (e.currentTarget.style.background = '#00658D')}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                    <span>{isSubmitting ? 'Submitting...' : 'Instant Confirmation'}</span>
                </button>
            </div>
        </div>
    );
}
