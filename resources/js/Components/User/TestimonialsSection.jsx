import React from 'react';

const REVIEWS = [
    {
        quote: 'Having the clean toddler seat ready when we landed at Denpasar made our arrival so easy. The driver was waiting with our names on a sign. Highly recommend BFS!',
        author: 'Sarah M.',
        location: 'Sydney, Australia',
    },
    {
        quote: 'Our driver Putu was amazing with our kids — so patient, calm, and drove very carefully through Bali traffic. The car was spotless and the car seat was properly installed.',
        author: 'David T.',
        location: 'Melbourne, Australia',
    },
    {
        quote: 'Best family transfer service in Bali. Transparent pricing, no hidden fees, and top quality infant capsule for our baby. Will use again on our next trip!',
        author: 'Emma L.',
        location: 'Perth, Australia',
    },
];

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
        : REVIEWS;

    return (
        <section
            id="reviews"
            style={{
                background: '#F8F9FA',
                padding: '96px 40px',
                borderTop: '1px solid #E1E3E4',
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
                        What Parents Say
                    </h2>
                    <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '28px',
                        color: '#3E4850',
                        margin: 0,
                    }}>
                        Authentic reviews from families who trusted us for their Bali journey
                    </p>
                </div>

                {/* 3 Review Cards */}
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
                    {displayReviews.map((review, i) => (
                        <div
                            key={i}
                            className="card-hover-fluid"
                            style={{
                                flex: '1 1 0',
                                maxWidth: '336px',
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
            </div>
        </section>
    );
}
