import React from 'react';
import { Link } from '@inertiajs/react';
import { TOUR_PACKAGES } from '../../data/user/tours';

export default function TourPackagesSection() {
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
                    {TOUR_PACKAGES.map((tour, i) => (
                        <div
                            key={tour.id || i}
                            style={{
                                flex: '1 1 0',
                                maxWidth: '336px',
                                background: '#FFFFFF',
                                border: i === 1 ? '1px solid rgba(0,101,141,0.2)' : '1px solid rgba(189,200,209,0.2)',
                                boxShadow: '0px 10px 30px rgba(0, 45, 99, 0.04)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            }}
                        >
                            {/* POPULAR badge */}
                            {tour.badge && (
                                <div style={{
                                    position: 'absolute',
                                    top: '17px',
                                    right: '17px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: '#FEDD00',
                                    boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                                    borderRadius: '9999px',
                                    padding: '4px 12px',
                                    zIndex: 2,
                                }}>
                                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '12px', color: '#191C1D' }}>
                                        {tour.badge}
                                    </span>
                                </div>
                            )}

                            {/* Image */}
                            <Link href={`/tours/${tour.id}`} style={{ height: '192px', background: '#EDEEEF', overflow: 'hidden', display: 'block' }}>
                                <img src={tour.image} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Link>

                            {/* Content */}
                            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Link
                                    href={`/tours/${tour.id}`}
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
                                        {tour.title}
                                    </h3>
                                </Link>

                                <p style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '16px',
                                    lineHeight: '24px',
                                    color: '#3E4850',
                                    margin: 0,
                                    flex: 1,
                                }}>
                                    {tour.description}
                                </p>

                                {/* Horizontal border + View Details button */}
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingTop: '16px',
                                    marginTop: '24px',
                                    borderTop: '1px solid #E1E3E4',
                                }}>
                                    <Link
                                        href={`/tours/${tour.id}`}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '8px 16px',
                                            height: '32px',
                                            background: '#3E5E96',
                                            borderRadius: '8px',
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 500,
                                            fontSize: '12px',
                                            lineHeight: '16px',
                                            color: '#FFFFFF',
                                            textDecoration: 'none',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#2e4f82'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#3E5E96'}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

