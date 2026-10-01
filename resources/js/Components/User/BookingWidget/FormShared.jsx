import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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

export function ChildSeatsSelector({ carSeatContent = [], selectedSeats = {}, onSeatChange, vehicleCapacity = 6, totalChildren = 0 }) {
    // Use car_seat_content from DB, atau fallback ke default
    const defaultSeats = [
        { id: 1, tag: 'Age 0-12 Months', title: 'Infant Capsule', description: 'Rear-facing infant seat' },
        { id: 2, tag: 'Age 1-4 Years', title: 'Toddler Seat', description: 'Forward-facing toddler seat' },
        { id: 3, tag: 'Age 4-8+ Years', title: 'Booster Seat', description: 'Booster seat for older children' },
    ];

    const seats = carSeatContent.length > 0 ? carSeatContent : defaultSeats;

    // Calculate total selected seats
    const totalSelectedSeats = Object.values(selectedSeats).reduce((sum, qty) => sum + qty, 0);

    // Max seats = jumlah children (tidak boleh lebih dari jumlah anak)
    const maxTotalSeats = totalChildren;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <label style={labelStyle}>
                Child car seats
                <span style={{ fontSize: '13px', fontWeight: 400, color: '#64748B', marginLeft: '8px' }}>
                    Free & sanitized
                </span>
            </label>
            {totalSelectedSeats >= maxTotalSeats && maxTotalSeats > 0 && (
                <div style={{
                    padding: '8px 12px',
                    background: '#FEF2F2',
                    border: '1px solid #FEE2E2',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#991B1B',
                    marginBottom: '8px',
                }}>
                    Maximum {maxTotalSeats} child seat{maxTotalSeats !== 1 ? 's' : ''} (based on {maxTotalSeats} {maxTotalSeats === 1 ? 'child' : 'children'} in booking)
                </div>
            )}
            {totalChildren === 0 && (
                <div style={{
                    padding: '8px 12px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#64748B',
                    marginBottom: '8px',
                }}>
                    Please add children to enable child seat selection
                </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {seats.map((seat) => {
                    const qty = selectedSeats[seat.id] || 0;
                    const canIncrease = totalSelectedSeats < maxTotalSeats;

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
                                    {seat.title}
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748B' }}>
                                    {seat.tag}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => onSeatChange(seat.id, Math.max(0, qty - 1))}
                                    disabled={qty === 0}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '6px',
                                        border: '1px solid #CBD5E1',
                                        background: qty === 0 ? '#F1F5F9' : '#FFFFFF',
                                        cursor: qty === 0 ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        color: qty === 0 ? '#CBD5E1' : '#64748B',
                                        transition: 'all 0.2s',
                                        opacity: qty === 0 ? 0.5 : 1,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (qty > 0) {
                                            e.currentTarget.style.background = '#3B82F6';
                                            e.currentTarget.style.borderColor = '#3B82F6';
                                            e.currentTarget.style.color = '#FFFFFF';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (qty > 0) {
                                            e.currentTarget.style.background = '#FFFFFF';
                                            e.currentTarget.style.borderColor = '#CBD5E1';
                                            e.currentTarget.style.color = '#64748B';
                                        }
                                    }}
                                >
                                    −
                                </button>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', minWidth: '20px', textAlign: 'center', color: qty > 0 ? '#1E293B' : '#CBD5E1' }}>
                                    {qty}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => canIncrease && onSeatChange(seat.id, qty + 1)}
                                    disabled={!canIncrease}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '6px',
                                        border: '1px solid #CBD5E1',
                                        background: !canIncrease ? '#F1F5F9' : '#FFFFFF',
                                        cursor: !canIncrease ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        color: !canIncrease ? '#CBD5E1' : '#64748B',
                                        transition: 'all 0.2s',
                                        opacity: !canIncrease ? 0.5 : 1,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (canIncrease) {
                                            e.currentTarget.style.background = '#3B82F6';
                                            e.currentTarget.style.borderColor = '#3B82F6';
                                            e.currentTarget.style.color = '#FFFFFF';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (canIncrease) {
                                            e.currentTarget.style.background = '#FFFFFF';
                                            e.currentTarget.style.borderColor = '#CBD5E1';
                                            e.currentTarget.style.color = '#64748B';
                                        }
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
                    {loadingEstimate ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" stroke="#CBD5E1" />
                                <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
                            </svg>
                            <span style={{ fontSize: '14px', fontWeight: 500, color: '#94A3B8' }}>
                                Calculating...
                            </span>
                        </div>
                    ) : (
                        <span style={{ fontSize: '18px', fontWeight: 600, color: '#1E293B' }}>
                            Rp {Number(estimatedFee).toLocaleString('id-ID')}
                        </span>
                    )}
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '14px',
            }}>
                <button
                    type="button"
                    onClick={onWhatsApp}
                    style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '9px',
                        padding: '0 24px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #25D366 0%, #22C55E 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '15px',
                        letterSpacing: '-0.01em',
                        color: '#FFFFFF',
                        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        boxShadow: '0 4px 14px 0 rgba(37, 211, 102, 0.3), 0 1px 3px 0 rgba(0, 0, 0, 0.08)',
                        overflow: 'hidden',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 8px 24px 0 rgba(37, 211, 102, 0.4), 0 4px 8px 0 rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(37, 211, 102, 0.3), 0 1px 3px 0 rgba(0, 0, 0, 0.08)';
                    }}
                    onMouseDown={e => {
                        e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                        e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(37, 211, 102, 0.25), 0 1px 2px 0 rgba(0, 0, 0, 0.08)';
                    }}
                    onMouseUp={e => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 8px 24px 0 rgba(37, 211, 102, 0.4), 0 4px 8px 0 rgba(0, 0, 0, 0.1)';
                    }}
                >
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="#FFFFFF" style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))' }}>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>WhatsApp</span>
                </button>

                <button
                    type="button"
                    onClick={onBook}
                    disabled={isSubmitting}
                    style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '9px',
                        padding: '0 24px',
                        height: '50px',
                        background: isSubmitting ? '#CBD5E1' : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '15px',
                        letterSpacing: '-0.01em',
                        color: '#FFFFFF',
                        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        boxShadow: isSubmitting ? 'none' : '0 4px 14px 0 rgba(59, 130, 246, 0.35), 0 1px 3px 0 rgba(0, 0, 0, 0.08)',
                        opacity: isSubmitting ? 0.6 : 1,
                        overflow: 'hidden',
                    }}
                    onMouseEnter={e => {
                        if (!isSubmitting) {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 8px 24px 0 rgba(59, 130, 246, 0.45), 0 4px 8px 0 rgba(0, 0, 0, 0.1)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!isSubmitting) {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.35), 0 1px 3px 0 rgba(0, 0, 0, 0.08)';
                        }
                    }}
                    onMouseDown={e => {
                        if (!isSubmitting) {
                            e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
                            e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(59, 130, 246, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.08)';
                        }
                    }}
                    onMouseUp={e => {
                        if (!isSubmitting) {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 8px 24px 0 rgba(59, 130, 246, 0.45), 0 4px 8px 0 rgba(0, 0, 0, 0.1)';
                        }
                    }}
                >
                    {isSubmitting && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: 'spin 0.8s linear infinite' }}>
                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                        </svg>
                    )}
                    <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                        {isSubmitting ? 'Processing...' : 'Book now'}
                    </span>
                </button>
            </div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export function BookingSuccessModal({ show, onClose }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [show]);

    if (!show || !mounted) return null;

    const modalContent = (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box',
        }}>
            <div style={{
                position: 'relative',
                background: '#FFFFFF',
                borderRadius: '20px',
                maxWidth: '420px',
                width: '100%',
                padding: '36px 28px 28px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #F1F5F9',
                margin: 'auto',
            }}>
                {/* Close 'X' Button */}
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#F8FAFC',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F1F5F9';
                        e.currentTarget.style.color = '#475569';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#F8FAFC';
                        e.currentTarget.style.color = '#94A3B8';
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Success Icon */}
                <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #D1FAE5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                }}>
                    <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 6px 14px -3px rgba(16, 185, 129, 0.35)',
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                </div>

                {/* Status Pill */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '3px 12px',
                    borderRadius: '9999px',
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    color: '#15803D',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '10px',
                }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }}></span>
                    Pesanan Berhasil Disimpan
                </div>

                <h3 style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '19px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: '0 0 8px',
                    letterSpacing: '-0.02em',
                }}>
                    Booking Berhasil Dibuat!
                </h3>

                <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13.5px',
                    color: '#64748B',
                    lineHeight: '21px',
                    margin: '0 0 24px',
                }}>
                    Terima kasih telah memesan bersama <strong>Bali Family Safe</strong>. Pesanan Anda telah tersimpan dan tim kami akan segera menghubungi Anda via WhatsApp untuk konfirmasi detail penjemputan.
                </p>

                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        width: '100%',
                        height: '44px',
                        backgroundColor: '#00AEEF',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0, 174, 239, 0.25)',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#0097d1';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#00AEEF';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    Selesai
                </button>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

export function CapacityWarningModal({ show, onClose, totalPax = 0, maxPax = 6, vehicleName = '' }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [show]);

    if (!show || !mounted) return null;

    const modalContent = (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box',
        }}>
            <div style={{
                position: 'relative',
                background: '#FFFFFF',
                borderRadius: '20px',
                maxWidth: '420px',
                width: '100%',
                padding: '32px 24px 24px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #FEE2E2',
                margin: 'auto',
            }}>
                {/* Warning Icon */}
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 6px 14px -3px rgba(239, 68, 68, 0.35)',
                    }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                </div>

                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '3px 12px',
                    borderRadius: '9999px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#B91C1C',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '10px',
                }}>
                    Kapasitas Melebihi Batas
                </div>

                <h3 style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: '0 0 8px',
                    letterSpacing: '-0.02em',
                }}>
                    Kapasitas Kendaraan Kurang
                </h3>

                <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13.5px',
                    color: '#64748B',
                    lineHeight: '21px',
                    margin: '0 0 24px',
                }}>
                    Jumlah penumpang ({totalPax} orang) melebihi kapasitas {vehicleName || 'kendaraan yang dipilih'} (maksimal {maxPax} orang). Silakan pilih unit kendaraan yang lebih besar atau kurangi jumlah penumpang.
                </p>

                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        width: '100%',
                        height: '44px',
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#DC2626';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#EF4444';
                    }}
                >
                    Pilih Kendaraan Lain
                </button>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
