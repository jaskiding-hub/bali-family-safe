import React, { useState } from 'react';
import HotelTransferForm from './HotelTransferForm';
import AirportPickupForm from './AirportPickupForm';
import AirportDropoffForm from './AirportDropoffForm';

const TABS = ['Hotel Transfers', 'Airport Pick-Up', 'Airport Drop-Off'];

export default function BookingWidget() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="bfs-bw" style={{
            background: '#FFFFFF',
            border: '1px solid rgba(189, 200, 209, 0.3)',
            boxShadow: '0px 20px 40px rgba(0, 45, 99, 0.08)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        }}>
            {/* Tabs */}
            <div className="bfs-bw-tabs" style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
                borderBottom: '1px solid #E1E3E4',
                overflow: 'hidden',
            }}>
                {TABS.map((tab, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setActiveTab(i)}
                        style={{
                            flex: '1 1 0',
                            height: '54px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            borderBottom: activeTab === i ? '2px solid #00658D' : '2px solid transparent',
                            background: activeTab === i ? '#F8F9FA' : 'transparent',
                            cursor: 'pointer',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: '14px',
                            lineHeight: '20px',
                            letterSpacing: '0.14px',
                            color: activeTab === i ? '#00658D' : '#3E4850',
                            transition: 'all 0.15s',
                            padding: '16px 24px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Form Body */}
            <div style={{ flex: 1 }}>
                {activeTab === 0 && <HotelTransferForm />}
                {activeTab === 1 && <AirportPickupForm />}
                {activeTab === 2 && <AirportDropoffForm />}
            </div>
        </div>
    );
}
