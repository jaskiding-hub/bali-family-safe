import React from 'react';

// 5-star SVG
function Stars() {
    return (
        <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
            {[...Array(5)].map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FBBF24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            ))}
        </div>
    );
}

export default function TestimonialsSection({ testimonials = [] }) {
    const displayReviews = testimonials && testimonials.length > 0
        ? testimonials.map(t => ({
            quote: t.quote,
            author: t.customer_name,
            location: t.customer_origin || 'Tourist in Bali',
            rating: t.rating || 5,
        }))
        : [];

    return (
        <section
            id="reviews"
            style={{
                background: '#F8F9FA',
                padding: '96px 24px',
                borderTop: '1px solid #E1E3E4',
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '48px',
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    margin: '0 auto',
                    maxWidth: '800px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '13px',
                        lineHeight: '20px',
                        letterSpacing: '1.6px',
                        textTransform: 'uppercase',
                        color: '#00658D',
                        margin: '0 0 12px 0',
                        textAlign: 'center',
                        width: '100%',
                    }}>
                        TESTIMONIALS
                    </p>
                    <h2 style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '40px',
                        lineHeight: '48px',
                        color: '#191C1D',
                        margin: 0,
                        marginBottom: '16px',
                        textAlign: 'center',
                        width: '100%',
                    }}>
                        What Parents Say
                    </h2>
                    <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '28px',
                        color: '#3E4850',
                        margin: '0 auto',
                        textAlign: 'center',
                        width: '100%',
                    }}>
                        Authentic reviews from families who trusted us for their Bali journey
                    </p>
                </div>

                {/* Review Cards */}
                {displayReviews.length > 0 ? (
                    <div className="bfs-row" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        gap: '32px',
                        maxWidth: '1072px',
                        margin: '0 auto',
                        width: '100%',
                        flexWrap: 'wrap',
                    }}>
                        {displayReviews.map((review, i) => (
                            <div
                                key={i}
                                className="card-hover-fluid"
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
                                }}
                            >
                                <div>
                                    {/* 5 Stars */}
                                    <Stars />

                                    {/* Quote */}
                                    <p style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 400,
                                        fontSize: '16px',
                                        lineHeight: '24px',
                                        color: '#3E4850',
                                        margin: 0,
                                        fontStyle: 'italic',
                                    }}>
                                        "{review.quote}"
                                    </p>
                                </div>

                                {/* Author */}
                                <div style={{
                                    borderTop: '1px solid #E1E3E4',
                                    paddingTop: '16px',
                                    marginTop: '24px',
                                }}>
                                    <p style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        color: '#191C1D',
                                        margin: 0,
                                    }}>
                                        {review.author}
                                    </p>
                                    <p style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 400,
                                        fontSize: '13px',
                                        lineHeight: '20px',
                                        color: '#6E7881',
                                        margin: 0,
                                    }}>
                                        {review.location}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '48px 16px', color: '#6E7881', fontSize: '14px' }}>
                        Belum ada ulasan saat ini.
                    </div>
                )}
            </div>
        </section>
    );
}
