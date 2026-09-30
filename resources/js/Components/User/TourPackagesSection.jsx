import React from 'react';
import { Link } from '@inertiajs/react';

export default function TourPackagesSection({ packages = [] }) {
    const tourList = packages.length > 0 ? packages.slice(0, 3) : [];

    const scrollToBooking = () => {
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section
            id="tours"
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
                gap: '48px',
            }}>
                {/* Header */}
                <div className="bfs-flex-header" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    maxWidth: '1072px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                }}>
                    <div style={{ maxWidth: '576px' }}>
                        <h2 style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            fontSize: '40px',
                            lineHeight: '48px',
                            color: '#191C1D',
                            margin: 0,
                            marginBottom: '16px',
                        }}>
                            Unforgettable Bali Day Tours
                        </h2>
                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '28px',
                            color: '#3E4850',
                            margin: 0,
                        }}>
                            Choose the perfect itinerary for your holiday. All packages include a private driver, comfortable transport, and child safety features.
                        </p>
                    </div>
                </div>

                {/* 3 Tour Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
                    {tourList.map((tour, i) => {
                        const tourKey = tour.slug || tour.id || i;
                        const tourLink = `/tours/${tour.slug || tour.id}`;
                        const tourTitle = tour.title || tour.name;
                        const tourImg = tour.image || tour.hero_image || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80';
                        const tourDesc = tour.description || tour.subtitle;
                        const tourPrice = tour.price || tour.regular_price_formatted || (tour.regular_price ? 'Rp ' + Number(tour.regular_price).toLocaleString('id-ID') : '');

                        return (
                            <div
                                key={tourKey}
                                className="group card-hover-fluid w-full bg-white border border-slate-200/70 hover:border-sky-300/80 shadow-xs rounded-2xl overflow-hidden relative flex flex-col"
                            >
                                {/* POPULAR badge */}
                                {tour.badge && (
                                    <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-amber-400 text-amber-950 px-3 py-1 rounded-full shadow-sm border border-amber-300">
                                        <svg className="w-3.5 h-3.5 text-amber-950 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-[11px] font-extrabold tracking-wider uppercase font-sans">
                                            {tour.badge}
                                        </span>
                                    </div>
                                )}

                                {/* Image */}
                                <Link href={tourLink} className="img-zoom block" style={{ height: '192px', background: '#EDEEEF', overflow: 'hidden' }}>
                                    <img src={tourImg} alt={tourTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Link>

                                {/* Content */}
                                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Link
                                        href={tourLink}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <h3 style={{
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 600,
                                            fontSize: '24px',
                                            lineHeight: '32px',
                                            color: '#191C1D',
                                            margin: 0,
                                            marginBottom: '8px',
                                        }}>
                                            {tourTitle}
                                        </h3>
                                    </Link>

                                    {tourPrice && (
                                        <div style={{
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 700,
                                            fontSize: '15px',
                                            color: '#00658D',
                                            marginBottom: '8px',
                                        }}>
                                            {tourPrice}
                                        </div>
                                    )}

                                    <p style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 400,
                                        fontSize: '16px',
                                        lineHeight: '24px',
                                        color: '#3E4850',
                                        margin: 0,
                                        flex: 1,
                                    }}>
                                        {tourDesc}
                                    </p>

                                    {/* Horizontal border + Book button */}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '16px',
                                        marginTop: '24px',
                                        borderTop: '1px solid #E1E3E4',
                                    }}>
                                        <button
                                            type="button"
                                            onClick={scrollToBooking}
                                            className="btn-secondary-hover-fluid inline-flex items-center justify-center px-4 py-2 rounded-xl text-white font-medium text-xs bg-[#00658D] hover:bg-[#004d6b] cursor-pointer shadow-xs"
                                        >
                                            Book This Tour
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
