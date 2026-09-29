import React from 'react';

// Minimal design tokens - grayscale + subtle accent
export const LABEL_COLOR = '#475569'; // slate-600
export const INPUT_BG = '#FFFFFF';
export const INPUT_BORDER = '#E2E8F0'; // slate-200
export const INPUT_BORDER_FOCUS = '#94A3B8'; // slate-400
export const PLACEHOLDER_COLOR = '#94A3B8';
export const ICON_COLOR = '#94A3B8';

export const labelStyle = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    color: LABEL_COLOR,
    marginBottom: '8px',
    display: 'block',
};

export const inputStyle = {
    width: '100%',
    height: '44px',
    background: INPUT_BG,
    border: `1px solid ${INPUT_BORDER}`,
    borderRadius: '8px',
    padding: '0 14px 0 40px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
};

export const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    cursor: 'pointer',
    paddingRight: '36px',
};

export const textareaStyle = {
    width: '100%',
    minHeight: '80px',
    background: INPUT_BG,
    border: `1px solid ${INPUT_BORDER}`,
    borderRadius: '8px',
    padding: '12px 14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
};

export function FieldWithIcon({ label, icon, isSelect = false, optional = false, children, style = {} }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', ...style }}>
            {label && (
                <label style={labelStyle}>
                    {label}
                    {optional && (
                        <span style={{ fontSize: '13px', fontWeight: 400, color: '#94A3B8', marginLeft: '6px' }}>
                            (optional)
                        </span>
                    )}
                </label>
            )}
            <div style={{ position: 'relative', width: '100%' }}>
                {icon && (
                    <div style={{
                        position: 'absolute',
                        left: 14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        color: ICON_COLOR,
                        pointerEvents: 'none',
                        zIndex: 1,
                    }}>
                        {icon}
                    </div>
                )}
                {children}
                {isSelect && (
                    <div style={{
                        position: 'absolute',
                        right: 14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#94A3B8',
                    }}>
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}

export function VehicleSelect({ value, onChange, vehicles = [] }) {
    return (
        <FieldWithIcon
            label="Vehicle"
            isSelect={true}
            icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
            }
        >
            <select
                style={{
                    ...selectStyle,
                    borderColor: value ? INPUT_BORDER_FOCUS : INPUT_BORDER,
                }}
                value={value}
                onChange={onChange}
                onFocus={(e) => e.target.style.borderColor = INPUT_BORDER_FOCUS}
                onBlur={(e) => e.target.style.borderColor = value ? INPUT_BORDER_FOCUS : INPUT_BORDER}
            >
                <option value="">Select vehicle</option>
                {vehicles && vehicles.length > 0 ? (
                    vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                            {v.name} — {v.passenger_capacity || 6} seats
                        </option>
                    ))
                ) : (
                    <>
                        <option value="1">Toyota Avanza — 4 seats</option>
                        <option value="2">Toyota Innova — 6 seats</option>
                        <option value="3">Toyota HiAce — 12 seats</option>
                    </>
                )}
            </select>
        </FieldWithIcon>
    );
}

export function ChildSeatsSelector({ childSeatTypes = [], selectedSeats = {}, onSeatChange }) {
    // Canonical 3 types only - filter dari backend
    const canonicalNames = ['Infant Capsule', 'Toddler Seat', 'Booster Seat'];

    const defaultSeats = [
        { id: 1, name: 'Infant Capsule', age_range: '0–1 yr', weight_range: '0–13 kg' },
        { id: 2, name: 'Toddler Seat', age_range: '1–4 yr', weight_range: '9–18 kg' },
        { id: 3, name: 'Booster Seat', age_range: '4–8 yr', weight_range: '15–36 kg' },
    ];

    // Filter childSeatTypes to only canonical 3, or use default
    let seats = defaultSeats;
    if (childSeatTypes && childSeatTypes.length > 0) {
        const filtered = childSeatTypes.filter(s =>
            canonicalNames.some(canonical => s.name && s.name.includes(canonical.split(' ')[0]))
        );
        if (filtered.length >= 3) {
            seats = filtered.slice(0, 3);
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <label style={labelStyle}>
                Child car seats
                <span style={{ fontSize: '13px', fontWeight: 400, color: '#64748B', marginLeft: '8px' }}>
                    Free & sanitized
                </span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {seats.map((seat) => {
                    const qty = selectedSeats[seat.id] || 0;
                    return (
                        <div
                            key={seat.id}
                            style={{
                                border: `1px solid ${qty > 0 ? '#94A3B8' : '#E2E8F0'}`,
                                background: qty > 0 ? '#F8FAFC' : '#FFFFFF',
                                borderRadius: '8px',
                                padding: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.2s',
                            }}
                        >
                            <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px', color: '#1E293B', marginBottom: '2px' }}>
                                    {seat.name}
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748B' }}>
                                    {seat.age_range}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => onSeatChange(seat.id, Math.max(0, qty - 1))}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '6px',
                                        border: '1px solid #CBD5E1',
                                        background: '#FFFFFF',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        color: '#64748B',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#3B82F6';
                                        e.currentTarget.style.borderColor = '#3B82F6';
                                        e.currentTarget.style.color = '#FFFFFF';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#FFFFFF';
                                        e.currentTarget.style.borderColor = '#CBD5E1';
                                        e.currentTarget.style.color = '#64748B';
                                    }}
                                >
                                    −
                                </button>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', minWidth: '20px', textAlign: 'center', color: qty > 0 ? '#1E293B' : '#CBD5E1' }}>
                                    {qty}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onSeatChange(seat.id, Math.min(3, qty + 1))}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '6px',
                                        border: '1px solid #CBD5E1',
                                        background: '#FFFFFF',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        color: '#64748B',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#3B82F6';
                                        e.currentTarget.style.borderColor = '#3B82F6';
                                        e.currentTarget.style.color = '#FFFFFF';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#FFFFFF';
                                        e.currentTarget.style.borderColor = '#CBD5E1';
                                        e.currentTarget.style.color = '#64748B';
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

export function BookingFooter({ onWhatsApp, onBook, estimatedFee, loadingEstimate, isSubmitting }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '20px 32px 24px',
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
        }}>
            {estimatedFee !== undefined && estimatedFee !== null && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>
                        Estimated fare
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: 600, color: '#1E293B' }}>
                        {loadingEstimate ? '—' : `Rp ${Number(estimatedFee).toLocaleString('id-ID')}`}
                    </span>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px',
            }}>
                <button
                    type="button"
                    onClick={onWhatsApp}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '0 20px',
                        height: '44px',
                        background: '#25D366',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#FFFFFF',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1FAD55'}
                    onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span>WhatsApp</span>
                </button>

                <button
                    type="button"
                    onClick={onBook}
                    disabled={isSubmitting}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '0 20px',
                        height: '44px',
                        background: isSubmitting ? '#CBD5E1' : '#3B82F6',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#FFFFFF',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => !isSubmitting && (e.currentTarget.style.background = '#2563EB')}
                    onMouseLeave={e => !isSubmitting && (e.currentTarget.style.background = '#3B82F6')}
                >
                    {isSubmitting ? 'Submitting...' : 'Book now'}
                </button>
            </div>
        </div>
    );
}
