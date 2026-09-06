import React from 'react';

const seats = [
    {
        tag: 'Newborn – 13 kg',
        title: 'Rear-Facing Infant',
        desc: 'Ideal for newborns and infants up to 13kg. Provides maximum protection for delicate necks and spines during transit.',
        img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80',
    },
    {
        tag: '9 kg – 18 kg',
        title: 'Forward-Facing Toddler',
        desc: 'Secure 5-point harness systems for active toddlers weighing 9kg to 18kg. Engineered for long-distance comfort and side-impact protection.',
        img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80',
    },
    {
        tag: '15 kg – 36 kg',
        title: 'Booster Seat',
        desc: 'Designed for older children needing elevated height for proper vehicle seatbelt positioning. Ensures maximum safety and visibility.',
        img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    },
];

export default function CarSeatsSection() {
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
                    {/* Eyebrow pill — Figma: bg #C6E7FF, text #003E58 */}
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

                    {/* H2 — Figma: 48px bold */}
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
                        Complimentary Child Car Seats
                    </h2>

                    <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '28px',
                        color: '#3E4850',
                        textAlign: 'center',
                        maxWidth: '729px',
                        margin: 0,
                    }}>
                        Every booking includes a complimentary certified car seat at no extra cost — sanitized before every trip.
                    </p>
                </div>

                {/* 3 Cards — Figma: 336px wide, border #E1E3E4, borderRadius 16px */}
                <div className="bfs-row" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    gap: '32px',
                }}>
                    {seats.map((seat, i) => (
                        <div
                            key={i}
                            style={{
                                flex: '1 1 0',
                                maxWidth: '336px',
                                background: '#FFFFFF',
                                border: '1px solid #E1E3E4',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {/* Card Image */}
                            <div style={{
                                height: '186px',
                                overflow: 'hidden',
                                background: '#E1E3E4',
                            }}>
                                <img
                                    src={seat.img}
                                    alt={seat.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
                                {/* Age Tag — Figma: bg rgba(0,101,141,0.1), text #00658D */}
                                <div style={{
                                    display: 'inline-flex',
                                    alignSelf: 'flex-start',
                                    background: 'rgba(0, 101, 141, 0.1)',
                                    borderRadius: '9999px',
                                    padding: '4px 12px',
                                    marginBottom: '16px',
                                }}>
                                    <span style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 400,
                                        fontSize: '16px',
                                        lineHeight: '24px',
                                        color: '#00658D',
                                    }}>
                                        {seat.tag}
                                    </span>
                                </div>

                                {/* Title — Figma: 24px bold */}
                                <h3 style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 700,
                                    fontSize: '24px',
                                    lineHeight: '32px',
                                    color: '#191C1D',
                                    margin: 0,
                                    marginBottom: '16px',
                                }}>
                                    {seat.title}
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
                                    {seat.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
