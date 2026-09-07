import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
    useEffect(() => {
        if (service) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
                document.body.style.removeProperty('overflow');
            };
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.removeProperty('overflow');
        }
    }, [service]);

    if (!service) return null;
    const d = service.details;

    const scrollToBooking = () => {
        onClose();
        setTimeout(() => {
            document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 my-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-100/80 text-sky-700 rounded-xl flex items-center justify-center shrink-0">
                            {service.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug m-0">
                                {d.heading}
                            </h3>
                            <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100 inline-block mt-0.5">
                                {d.price}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm">
                    {/* Short Description */}
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed m-0">
                        {d.description}
                    </p>

                    {/* What's Included 2-column compact grid */}
                    <div className="space-y-1.5">
                        <h4 className="font-bold text-slate-400 text-[11px] uppercase tracking-wider m-0">
                            What's Included
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                            {d.includes.slice(0, 6).map((item, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                                    <svg className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="leading-tight">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Meta Info Row */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-sky-50/60 p-2.5 rounded-xl border border-sky-100/60">
                        <div>
                            <span className="text-slate-400 text-[11px] block">Vehicles</span>
                            <span className="font-semibold text-slate-900 truncate block">{d.vehicles}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 text-[11px] block">Capacity</span>
                            <span className="font-semibold text-slate-900 truncate block">{d.capacity}</span>
                        </div>
                    </div>

                    {/* Action button */}
                    <div className="pt-1">
                        <button
                            type="button"
                            onClick={scrollToBooking}
                            className="w-full py-2.5 bg-sky-900 hover:bg-sky-950 text-white font-bold rounded-xl shadow-md active:scale-[0.98] transition-all cursor-pointer text-xs sm:text-sm text-center"
                        >
                            Book This Service Now
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
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
