import React from 'react';

// Default fallback icon (shield/checkmark)
const IconDefault = ({ size = 24, color = "#00658D" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
    </svg>
);

const ICON_MAP = {
    // Primary keys
    'car-seat': (
        <svg width="24" height="21" viewBox="0 0 24 24" fill="#00658D">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
    ),
    'fixed-price': (
        <svg width="29" height="27" viewBox="0 0 24 24" fill="#00658D">
            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
        </svg>
    ),
    'flight-tracking': (
        <svg width="21" height="27" viewBox="0 0 24 24" fill="#00658D">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
    ),
    'family-drivers': (
        <svg width="24" height="27" viewBox="0 0 24 24" fill="#00658D">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
    ),
    // Aliases (case-insensitive mapping)
    'seat': 'car-seat',
    'child-seat': 'car-seat',
    'carseat': 'car-seat',
    'safety': 'car-seat',
    'price': 'fixed-price',
    'pricing': 'fixed-price',
    'money': 'fixed-price',
    'fixed': 'fixed-price',
    'flight': 'flight-tracking',
    'plane': 'flight-tracking',
    'tracking': 'flight-tracking',
    'airport': 'flight-tracking',
    'driver': 'family-drivers',
    'drivers': 'family-drivers',
    'family': 'family-drivers',
    'people': 'family-drivers',
    'team': 'family-drivers',
};

// Resolve icon with fallback
const getIcon = (iconName) => {
    if (!iconName) return <IconDefault size={24} color="#00658D" />;

    const key = String(iconName).toLowerCase().trim();
    let resolved = ICON_MAP[key];

    // If alias, resolve to actual icon
    if (typeof resolved === 'string') {
        resolved = ICON_MAP[resolved];
    }

    return resolved || <IconDefault size={24} color="#00658D" />;
};

const PILLARS = [
    {
        title: 'Free Car Seats',
        desc: 'Every booking includes a certified infant, toddler, or booster seat, sanitized before each trip.',
        icon: 'car-seat',
    },
    {
        title: 'Fixed Pricing',
        desc: 'Transparent, pre-agreed rates with no hidden fees. Tolls and parking always included.',
        icon: 'fixed-price',
    },
    {
        title: 'Flight Tracking',
        desc: 'We monitor your real-time flight status for delays and adjust your pickup time at no extra cost.',
        icon: 'flight-tracking',
    },
    {
        title: 'Family Drivers',
        desc: 'Patient, gentle drivers experienced with babies and toddlers. Flexible stops whenever your family needs.',
        icon: 'family-drivers',
    },
];

export default function WhyChooseUsSection({ siteFeatures = [] }) {
    const displayPillars = siteFeatures && siteFeatures.length > 0
        ? siteFeatures.map((f) => ({
            title: f.title,
            desc: f.description || '',
            icon: getIcon(f.icon),
        }))
        : PILLARS.map(p => ({ ...p, icon: getIcon(p.icon) }));

    return (
        <section
            id="why-us"
            style={{
                background: '#F8F9FA',
                padding: '96px 40px',
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 64px',
                display: 'flex',
                flexDirection: 'column',
                gap: '64px',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '40px',
                        lineHeight: '48px',
                        color: '#000000',
                        margin: 0,
                        marginBottom: '16px',
                    }}>
                        Why Families Choose Us
                    </h2>
                    <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '28px',
                        color: '#3E4850',
                        margin: 0,
                        maxWidth: '672px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>
                        Here is why hundreds of traveling families trust us for their Bali transport
                    </p>
                </div>

                {/* 4 Cards Row — Figma: 244px each, height 318px, borderRadius 8px */}
                <div className="bfs-row" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: '32px',
                    maxWidth: '1072px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                }}>
                    {displayPillars.map((pillar, i) => (
                        <div
                            key={i}
                            className="card-hover-fluid group"
                            style={{
                                flex: '1 1 0',
                                background: '#FFFFFF',
                                border: '1px solid rgba(189,200,209,0.3)',
                                boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                                borderRadius: '12px',
                                padding: '28px 24px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                minHeight: '318px',
                            }}
                        >
                            {/* Icon circle — Figma: bg rgba(0,174,239,0.2), 64px round */}
                            <div
                                className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-md group-hover:shadow-sky-500/20"
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    background: 'rgba(0, 174, 239, 0.15)',
                                    borderRadius: '9999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '24px',
                                    flexShrink: 0,
                                }}
                            >
                                {pillar.icon}
                            </div>

                            {/* Title — Figma: 24px semibold #00658D */}
                            <h3 style={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                fontSize: '24px',
                                lineHeight: '32px',
                                color: '#00658D',
                                margin: 0,
                                marginBottom: '12px',
                            }}>
                                {pillar.title}
                            </h3>

                            {/* Description */}
                            <p style={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 400,
                                fontSize: '16px',
                                lineHeight: '24px',
                                color: '#3E4850',
                                margin: 0,
                            }}>
                                {pillar.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
