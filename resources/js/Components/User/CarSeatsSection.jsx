import React from 'react';

export default function CarSeatsSection({ carSeatContent = [] }) {
    const seats = carSeatContent && carSeatContent.length > 0 ? carSeatContent : [];

    return (
        <section
            id="car-seats"
            style={{
                width: '100%',
                background: 'linear-gradient(0deg, #F8F9FA, #F8F9FA), #FFFFFF',
                padding: '64px 40px 0',
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '96px 64px 96px',
            }}>
                {/* Header Block */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingBottom: '64px',
                }}>
                    {/* Eyebrow pill */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#C6E7FF',
                        borderRadius: '9999px',
                        padding: '6px 16px',
                        marginBottom: '24px',
                    }}>
                        <svg width="11" height="13" viewBox="0 0 24 24" fill="#003E58"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                        <span style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '24px',
                            letterSpacing: '0.8px',
                            textTransform: 'uppercase',
                            color: '#003E58',
                        }}>
                            ALL AGES & SIZES AVAILABLE
                        </span>
                    </div>

                    {/* H2 */}
                    <h2 style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '48px',
                        lineHeight: '56px',
                        letterSpacing: '-0.96px',
                        color: '#191C1D',
                        textAlign: 'center',
                        margin: 0,
                        marginBottom: '24px',
                    }}>
                        Certified Child Car Seats – 100% Free
                    </h2>

                    {/* Subheading */}
                    <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '32px',
                        color: '#3E4850',
                        textAlign: 'center',
                        margin: 0,
                        maxWidth: '660px',
                    }}>
                        Every Bali Family Safe trip includes complimentary, sanitized certified child seats for all age groups. No extra charges, no hassle.
                    </p>
                </div>

                {/* Cards Grid */}
                {seats.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '32px',
                        alignItems: 'start',
                    }}>
                    {seats.map((seat, index) => (
                        <div
                            key={seat.id || index}
                            className="card-hover-fluid"
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                boxShadow: '0px 4px 12px rgba(0,0,0,0.04), 0px 1px 3px rgba(0,0,0,0.03)',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'box-shadow 0.3s ease',
                            }}
                        >
                            {/* Image */}
                            <div
                                className="img-zoom"
                                style={{
                                    width: '100%',
                                    height: '240px',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                }}
                            >
                                <img
                                    src={seat.image_url}
                                    alt={seat.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Content */}
                            <div style={{
                                padding: '28px 24px 32px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                            }}>
                                {/* Tag */}
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    background: '#E0F2FE',
                                    borderRadius: '9999px',
                                    padding: '4px 12px',
                                    alignSelf: 'flex-start',
                                }}>
                                    <span style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 600,
                                        fontSize: '12px',
                                        lineHeight: '16px',
                                        letterSpacing: '0.4px',
                                        color: '#0369A1',
                                    }}>
                                        {seat.tag}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 700,
                                    fontSize: '24px',
                                    lineHeight: '32px',
                                    color: '#191C1D',
                                    margin: 0,
                                }}>
                                    {seat.title}
                                </h3>

                                {/* Description */}
                                <p style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '16px',
                                    lineHeight: '24px',
                                    color: '#64748B',
                                    margin: 0,
                                }}>
                                    {seat.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '48px 16px', color: '#6E7881', fontSize: '14px' }}>
                        Belum ada informasi kursi anak yang terdaftar.
                    </div>
                )}
            </div>
        </section>
    );
}
