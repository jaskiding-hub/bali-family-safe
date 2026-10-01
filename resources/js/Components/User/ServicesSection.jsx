import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md modal-backdrop-anim"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 my-auto modal-panel-anim"
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

export default function ServicesSection({ services = [] }) {
    const [selectedService, setSelectedService] = useState(null);

    const displayServices = services && services.length > 0
        ? services.map((srv, i) => ({
            title: srv.name,
            shortDesc: srv.short_description || srv.long_description || '',
            icon: srv.image_url ? (
                <img src={srv.image_url} alt={srv.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
                <svg width="21" height="24" viewBox="0 0 24 24" fill="#00658D">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
            ),
            details: {
                heading: srv.name,
                description: srv.long_description || srv.short_description || 'Professional family transfer and private tour service.',
                includes: (srv.features && srv.features.length > 0)
                    ? srv.features.map((f) => f.feature_text)
                    : ['Free certified child car seats', 'Cold bottled water', 'English-speaking driver', 'Door-to-door service'],
                vehicles: 'Toyota Avanza, Toyota Innova, Toyota HiAce',
                capacity: '5–12 Penumpang',
                duration: 'Sesuai kebutuhan',
                price: srv.category ? `Kategori: ${srv.category}` : '',
            },
        }))
        : [];

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

                {/* Cards */}
                {displayServices.length > 0 ? (
                    <div className="bfs-row" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: '32px',
                        maxWidth: '1072px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        width: '100%',
                        flexWrap: 'wrap',
                    }}>
                        {displayServices.map((srv, i) => (
                            <div
                                key={i}
                                className="card-hover-fluid group"
                                style={{
                                    flex: '1 1 0',
                                    maxWidth: '336px',
                                    minWidth: '280px',
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(189,200,209,0.25)',
                                    boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
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
                                    <div
                                        className="transition-transform duration-300 ease-out group-hover:scale-110"
                                        style={{
                                            width: '56px',
                                            height: '56px',
                                            background: 'rgba(0, 174, 239, 0.15)',
                                            borderRadius: '9999px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '24px',
                                        }}
                                    >
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
                                    className="btn-hover-fluid"
                                    style={{
                                        width: '100%',
                                        height: '48px',
                                        border: '2px solid #00AEEF',
                                        borderRadius: '12px',
                                        background: 'transparent',
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        letterSpacing: '0.14px',
                                        color: '#00658D',
                                        cursor: 'pointer',
                                        transition: 'all 0.25s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = '#00AEEF';
                                        e.currentTarget.style.color = '#FFFFFF';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#00658D';
                                    }}
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '48px 16px', color: '#6E7881', fontSize: '14px' }}>
                        Belum ada layanan yang ditampilkan.
                    </div>
                )}
            </div>

            {/* Service Detail Modal */}
            <ServiceModal
                service={selectedService}
                onClose={() => setSelectedService(null)}
            />
        </section>
    );
}
