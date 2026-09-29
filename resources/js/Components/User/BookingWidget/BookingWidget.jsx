import React, { useState } from 'react';
import AirportBookingForm from './AirportBookingForm';
import DayTourForm from './DayTourForm';
import HotelTransferForm from './HotelTransferForm';

const TABS = [
    {
        id: 'airport',
        label: 'Airport Transfers',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
        ),
    },
    {
        id: 'daytour',
        label: 'Private Day Tour',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
            </svg>
        ),
    },
    {
        id: 'hotel',
        label: 'Hotel Transfers',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
            </svg>
        ),
    },
];

export default function BookingWidget({ packages = [], childSeatTypes = [], vehicles = [] }) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="bfs-bw" style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0px 10px 25px -5px rgba(0, 0, 0, 0.05), 0px 4px 10px -3px rgba(0, 0, 0, 0.02)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        }}>
            {/* Minimalist Tabs Header */}
            <div
                className="bfs-bw-tabs"
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    borderBottom: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                }}
            >
                {TABS.map((tab, i) => {
                    const isActive = activeTab === i;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(i)}
                            className="cursor-pointer transition-all duration-200"
                            style={{
                                flex: '1 1 0',
                                minHeight: '54px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                border: 'none',
                                borderBottom: isActive ? '2.5px solid #00658D' : '2.5px solid transparent',
                                background: isActive ? '#F8FAFC' : 'transparent',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: isActive ? 700 : 500,
                                fontSize: '14px',
                                color: isActive ? '#00658D' : '#64748B',
                                padding: '14px 20px',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                            onMouseEnter={e => {
                                if (!isActive) e.currentTarget.style.background = '#F8FAFC';
                            }}
                            onMouseLeave={e => {
                                if (!isActive) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                opacity: isActive ? 1 : 0.7,
                                transform: isActive ? 'scale(1.08)' : 'scale(1)',
                                transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}>
                                {tab.icon}
                            </span>
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Form Body */}
            <div style={{ flex: 1 }}>
                {activeTab === 0 && <AirportBookingForm vehicles={vehicles} childSeatTypes={childSeatTypes} />}
                {activeTab === 1 && <DayTourForm packages={packages} vehicles={vehicles} childSeatTypes={childSeatTypes} />}
                {activeTab === 2 && <HotelTransferForm vehicles={vehicles} childSeatTypes={childSeatTypes} />}
            </div>
        </div>
    );
}
