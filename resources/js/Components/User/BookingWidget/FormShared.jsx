import React from 'react';

// Figma exact colors
const LABEL_COLOR = '#191C1D';
const INPUT_BG = '#F8F9FA';
const INPUT_BORDER = '#BDC8D1';
const PLACEHOLDER_COLOR = '#9CA3AF';
const ICON_COLOR = '#6E7881';

// Field styles from Figma
const labelStyle = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.14px',
    color: LABEL_COLOR,
    display: 'block',
    marginBottom: '8px',
};

const inputStyle = {
    width: '100%',
    height: '45px',
    background: INPUT_BG,
    border: `1px solid ${INPUT_BORDER}`,
    borderRadius: '8px',
    padding: '10px 12px 10px 36px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    color: '#191C1D',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
};

const selectStyle = {
    ...inputStyle,
    height: '45px',
    appearance: 'none',
    cursor: 'pointer',
    color: '#191C1D',
};

const textareaStyle = {
    width: '100%',
    height: '110px',
    background: INPUT_BG,
    border: `1px solid ${INPUT_BORDER}`,
    borderRadius: '8px',
    padding: '10px 12px 10px 36px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '22px',
    color: '#191C1D',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
};

// Shared footer of the booking form (Figma: Footer Actions)
export function BookingFooter({ onWhatsApp, onBook }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px 16px',
            background: '#F3F4F5',
            borderTop: '1px solid #E1E3E4',
            gap: '16px',
            flexWrap: 'wrap',
        }}>
            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}>
                {/* Booking WA button */}
                <button
                    type="button"
                    onClick={onWhatsApp}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        height: '48px',
                        border: '2px solid #25D366',
                        borderRadius: '12px',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '0.14px',
                        color: '#25D366',
                        whiteSpace: 'nowrap',
                        transition: 'background 0.15s',
                        flex: '1 1 140px',
                        maxWidth: '240px',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Booking WA
                </button>

                {/* Book Now button */}
                <button
                    type="button"
                    onClick={onBook}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '14px 32px',
                        height: '48px',
                        background: '#3E5E96',
                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '0.14px',
                        color: '#FFFFFF',
                        whiteSpace: 'nowrap',
                        transition: 'background 0.15s',
                        flex: '1 1 140px',
                        maxWidth: '240px',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#2e4f82'}
                    onMouseLeave={e => e.currentTarget.style.background = '#3E5E96'}
                >
                    <svg width="18" height="16" viewBox="0 0 24 24" fill="white"><path d="M20 8h-2.81c-.45-1.12-1.13-2.1-1.99-2.91L17 3.3 15.7 2l-2.15 2.15C12.96 4.05 12.49 4 12 4c-.49 0-.96.05-1.55.15L8.3 2 7 3.3l1.8 1.79C7.94 5.9 7.26 6.88 6.81 8H4v2h2.09C6.04 10.33 6 10.66 6 11v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 2.37 3.4 4 6.19 4s5.15-1.63 6.19-4H22v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/></svg>
                    Book Now
                </button>
            </div>
        </div>
    );
}

// Reusable field wrapper with icon
export function FieldWithIcon({ label, icon, children, style = {} }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}>
            <label style={labelStyle}>{label}</label>
            <div style={{ position: 'relative' }}>
                {icon && (
                    <div style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: ICON_COLOR,
                        display: 'flex',
                        alignItems: 'center',
                        zIndex: 1,
                        pointerEvents: 'none',
                    }}>
                        {icon}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}

// Vehicle dropdown selector
export function VehicleSelect({ value, onChange, style = {} }) {
    return (
        <FieldWithIcon
            label="Vehicle Model"
            style={style}
            icon={
                <svg width="18" height="14" viewBox="0 0 24 24" fill="#6E7881">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4h14v4z"/>
                    <circle cx="7.5" cy="15" r="1.5"/>
                    <circle cx="16.5" cy="15" r="1.5"/>
                </svg>
            }
        >
            <select style={{ ...selectStyle, height: '45px' }} value={value} onChange={onChange}>
                <option value="">Select vehicle model...</option>
                <option value="Toyota Avanza / Veloz">Toyota Avanza / Veloz (1–4 Passengers)</option>
                <option value="Toyota Innova Reborn">Toyota Innova Reborn (1–6 Passengers - Popular)</option>
                <option value="Toyota HiAce Commuter">Toyota HiAce Commuter (1–12 Passengers)</option>
            </select>
        </FieldWithIcon>
    );
}

// 3 Child Car Seats selector with quantity
export function CarSeatsSelector({ infantSeat, setInfantSeat, toddlerSeat, setToddlerSeat, boosterSeat, setBoosterSeat, style = {} }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', ...style }}>
            <label style={labelStyle}>
                Child Car Seats Included (Select Types & Quantity)
            </label>
            <div className="bfs-car-seats-grid">
                {/* Type 1: Infant */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', color: '#00658D' }}>
                        Rear-Facing Infant
                    </span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6E7881' }}>
                        Newborn – 13 kg
                    </span>
                    <select
                        style={{ ...selectStyle, height: '36px', padding: '4px 8px 4px 12px', fontSize: '13px', marginTop: '4px' }}
                        value={infantSeat}
                        onChange={e => setInfantSeat(e.target.value)}
                    >
                        <option value="0">0 (None)</option>
                        <option value="1">1 Seat</option>
                        <option value="2">2 Seats</option>
                        <option value="3">3 Seats</option>
                    </select>
                </div>

                {/* Type 2: Toddler */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', color: '#00658D' }}>
                        Forward-Facing Toddler
                    </span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6E7881' }}>
                        9 kg – 18 kg
                    </span>
                    <select
                        style={{ ...selectStyle, height: '36px', padding: '4px 8px 4px 12px', fontSize: '13px', marginTop: '4px' }}
                        value={toddlerSeat}
                        onChange={e => setToddlerSeat(e.target.value)}
                    >
                        <option value="0">0 (None)</option>
                        <option value="1">1 Seat</option>
                        <option value="2">2 Seats</option>
                        <option value="3">3 Seats</option>
                    </select>
                </div>

                {/* Type 3: Booster */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', color: '#00658D' }}>
                        Booster Seat
                    </span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6E7881' }}>
                        15 kg – 36 kg
                    </span>
                    <select
                        style={{ ...selectStyle, height: '36px', padding: '4px 8px 4px 12px', fontSize: '13px', marginTop: '4px' }}
                        value={boosterSeat}
                        onChange={e => setBoosterSeat(e.target.value)}
                    >
                        <option value="0">0 (None)</option>
                        <option value="1">1 Seat</option>
                        <option value="2">2 Seats</option>
                        <option value="3">3 Seats</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export { labelStyle, inputStyle, selectStyle, textareaStyle, LABEL_COLOR, INPUT_BG, INPUT_BORDER, PLACEHOLDER_COLOR, ICON_COLOR };

