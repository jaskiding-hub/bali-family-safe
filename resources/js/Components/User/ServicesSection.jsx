import React, { useState } from 'react';

const SERVICES = [
    {
        title: 'Airport Transfers',
        shortDesc: 'Hassle-free arrivals and departures. Our driver will meet you with a personalized sign and help with your luggage, ensuring a smooth transition to your hotel.',
        icon: (
            <svg width="21" height="24" viewBox="0 0 24 24" fill="#00658D">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
        ),
        details: {
            heading: 'Airport Transfers',
            description: 'Start or end your Bali holiday stress-free. Our professional drivers provide punctual, comfortable airport pickup and drop-off services with child-safe seating and cold bottled water.',
            includes: [
                'Meet & greet with personalized name sign at arrival hall',
                'Free certified child car seats (capsule, toddler, or booster)',
                'Flight tracking — we adjust pickup time if your flight is delayed',
                'Cold bottled mineral water provided',
                'Door-to-door service to any hotel, villa, or Airbnb in Bali',
                'Assist with loading and unloading luggage',
                'Spacious, air-conditioned vehicles (Toyota Avanza, Innova, or similar)',
                'English-speaking driver for easy communication',
            ],
            vehicles: 'Toyota Avanza, Toyota Innova Reborn, Toyota HiAce',
            capacity: 'Up to 5 passengers per vehicle',
            duration: 'Depends on airport ↔ destination distance',
            price: 'Starting from Rp 350,000',
        },
    },
    {
        title: 'Hotel Transfers',
        shortDesc: 'Seamless connection between any accommodations in Bali. Avoid the hassle of negotiating with local taxis while managing luggage and tired children.',
        icon: (
            <svg width="21" height="21" viewBox="0 0 24 24" fill="#00658D">
                <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
            </svg>
        ),
        details: {
            heading: 'Hotel Transfers',
            description: 'Moving between hotels, villas, or any accommodation in Bali? Our family-friendly transfer service ensures a safe, comfortable ride with no stress about navigating unfamiliar roads.',
            includes: [
                'Door-to-door pickup and drop-off at any Bali address',
                'Free certified child car seats installed and ready',
                'Flexible scheduling — depart when you are ready',
                'Cold bottled mineral water provided',
                'Assist with all luggage and belongings',
                'Direct, scenic routes — no unnecessary detours',
                'Air-conditioned, well-maintained vehicles',
                'English-speaking driver for local tips en route',
            ],
            vehicles: 'Toyota Avanza, Toyota Innova Reborn, Toyota HiAce',
            capacity: 'Up to 5 passengers per vehicle',
            duration: 'Depends on distance between locations',
            price: 'Starting from Rp 300,000',
        },
    },
    {
        title: 'Private Family Tours',
        shortDesc: 'Explore Bali at your own pace. Customizable itineraries perfect for families, including cultural sites, nature parks, and beautiful beaches with plenty of rest stops.',
        icon: (
            <svg width="23" height="23" viewBox="0 0 24 24" fill="#00658D">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
        ),
        details: {
            heading: 'Private Family Tours',
            description: 'Discover Bali through the eyes of a local. Our private family tours are fully customizable — visit temples, rice terraces, waterfalls, beaches, and cultural sites at your own pace with a knowledgeable driver-guide.',
            includes: [
                'Fully customizable itinerary — choose your own destinations',
                'Dedicated driver-guide who knows Bali inside out',
                'Free certified child car seats for all ages',
                'Flexible rest stops whenever your family needs a break',
                'Cold bottled mineral water and tissue throughout the day',
                'Visit top family-friendly spots: Monkey Forest, rice terraces, waterfalls, temples',
                'Photo opportunities at every scenic viewpoint',
                'English-speaking driver with cultural knowledge',
            ],
            vehicles: 'Toyota Innova Reborn, Toyota HiAce',
            capacity: 'Up to 5 passengers per vehicle',
            duration: '8–10 hours (full day) or 4–5 hours (half day)',
            price: 'Starting from Rp 800,000',
        },
    },
];

function ServiceModal({ service, onClose }) {
    if (!service) return null;
    const d = service.details;

    const scrollToBooking = () => {
        onClose();
        setTimeout(() => {
            document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    maxWidth: '640px',
                    width: '100%',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '32px 32px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Icon */}
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'rgba(0, 174, 239, 0.15)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            {service.icon}
                        </div>
                        <h2 style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            fontSize: '24px',
                            lineHeight: '32px',
                            color: '#191C1D',
                            margin: 0,
                        }}>
                            {d.heading}
                        </h2>
                    </div>
                    {/* Close button */}
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '9999px',
                            border: 'none',
                            background: '#F3F4F5',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#E1E3E4'}
                        onMouseLeave={e => e.currentTarget.style.background = '#F3F4F5'}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1L13 13M13 1L1 13" stroke="#3E4850" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px 32px 32px' }}>
                    {/* Description */}
                    <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '26px',
                        color: '#3E4850',
                        margin: '0 0 24px 0',
                    }}>
                        {d.description}
                    </p>

                    {/* What's Included */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '16px',
                            lineHeight: '24px',
                            color: '#191C1D',
                            margin: '0 0 12px 0',
                        }}>
                            What's Included
                        </h3>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}>
                            {d.includes.map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#00AEEF" style={{ flexShrink: 0, marginTop: '2px' }}>
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                    </svg>
                                    <span style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        lineHeight: '22px',
                                        color: '#3E4850',
                                    }}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info pills */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginBottom: '32px',
                    }}>
                        {[
                            { label: 'Vehicles', value: d.vehicles },
                            { label: 'Capacity', value: d.capacity },
                            { label: 'Duration', value: d.duration },
                            { label: 'Price', value: d.price },
                        ].map((info, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                background: '#F8F9FA',
                                border: '1px solid rgba(189, 200, 209, 0.3)',
                                borderRadius: '8px',
                                padding: '10px 14px',
                                flex: '1 1 calc(50% - 6px)',
                                minWidth: '200px',
                            }}>
                                <span style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 500,
                                    fontSize: '11px',
                                    lineHeight: '16px',
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    color: '#6E7881',
                                }}>
                                    {info.label}
                                </span>
                                <span style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 500,
                                    fontSize: '13px',
                                    lineHeight: '20px',
                                    color: '#191C1D',
                                }}>
                                    {info.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Booking Now button */}
                    <button
                        type="button"
                        onClick={scrollToBooking}
                        style={{
                            width: '100%',
                            height: '48px',
                            background: '#00AEEF',
                            border: 'none',
                            borderRadius: '8px',
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '16px',
                            lineHeight: '24px',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            transition: 'background 0.15s, transform 0.1s',
                            boxShadow: '0px 4px 6px -1px rgba(0, 174, 239, 0.3)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#0095CC';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = '#00AEEF';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Booking Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ServicesSection() {
    const [selectedService, setSelectedService] = useState(null);

    return (
        <section
            id="services"
            style={{
                background: '#F3F4F5',
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
                        color: '#191C1D',
                        margin: 0,
                        marginBottom: '16px',
                    }}>
                        Our Service Catalog
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
                        Everything you need for a comfortable and stress-free family journey in Bali
                    </p>
                </div>

                {/* 3 Cards */}
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
                    {SERVICES.map((srv, i) => (
                        <div
                            key={i}
                            style={{
                                flex: '1 1 0',
                                maxWidth: '336px',
                                background: '#FFFFFF',
                                border: '1px solid rgba(189,200,209,0.2)',
                                boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                                borderRadius: '16px',
                                padding: '32px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: '390px',
                            }}
                        >
                            {/* Top: icon + title + desc */}
                            <div>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    background: 'rgba(0, 174, 239, 0.2)',
                                    borderRadius: '9999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '24px',
                                }}>
                                    {srv.icon}
                                </div>

                                <h3 style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 600,
                                    fontSize: '24px',
                                    lineHeight: '32px',
                                    color: '#191C1D',
                                    margin: 0,
                                    marginBottom: '12px',
                                }}>
                                    {srv.title}
                                </h3>

                                <p style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '16px',
                                    lineHeight: '24px',
                                    color: '#3E4850',
                                    margin: 0,
                                }}>
                                    {srv.shortDesc}
                                </p>
                            </div>

                            {/* View Details button */}
                            <button
                                type="button"
                                onClick={() => setSelectedService(srv)}
                                style={{
                                    width: '100%',
                                    height: '48px',
                                    border: '2px solid #00AEEF',
                                    borderRadius: '8px',
                                    background: 'transparent',
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    lineHeight: '20px',
                                    letterSpacing: '0.14px',
                                    color: '#00AEEF',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,174,239,0.05)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Service Detail Modal */}
            <ServiceModal
                service={selectedService}
                onClose={() => setSelectedService(null)}
            />
        </section>
    );
}
