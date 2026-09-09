import React from 'react';

export default function AboutSection() {
    return (
        <section
            id="about"
            style={{
                width: '100%',
                background: '#FFFFFF',
                padding: '96px 104px',
            }}
        >
            <div className="bfs-about-flex" style={{
                maxWidth: '1072px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '48px',
            }}>
                {/* Left: Photo — Figma: 512x500, borderRadius 16px, shadow */}
                <div style={{
                    flex: '1 1 0',
                    maxWidth: '512px',
                    height: '500px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
                    flexShrink: 0,
                }}>
                    <img
                        src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                        alt="Bali Family Safe Team and Vehicle"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                {/* Right: Content — Figma: 512px */}
                <div style={{
                    flex: '1 1 0',
                    maxWidth: '512px',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {/* ABOUT US tag */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: 'rgba(0, 174, 239, 0.2)',
                            borderRadius: '9999px',
                            padding: '4px 16px',
                        }}>
                            <span style={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                fontSize: '12px',
                                lineHeight: '16px',
                                letterSpacing: '0.6px',
                                textTransform: 'uppercase',
                                color: '#00658D',
                            }}>
                                ABOUT US
                            </span>
                        </div>
                    </div>

                    {/* H2 — Figma: 40px bold */}
                    <h2 style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '40px',
                        lineHeight: '48px',
                        color: '#191C1D',
                        margin: 0,
                        marginBottom: '24px',
                        maxWidth: '492px',
                    }}>
                        Your Trusted Partner for Family Adventures in Bali
                    </h2>

                    {/* Description paragraphs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '28px',
                            color: '#3E4850',
                            margin: 0,
                        }}>
                            Bali Family Safe was founded by a family for families. We understand the unique challenges of traveling with little ones — from navigating car seat logistics to finding family-friendly routes across Bali.
                        </p>
                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '28px',
                            color: '#3E4850',
                            margin: 0,
                        }}>
                            Our fleet of modern, air-conditioned vehicles comes with complimentary certified child seats, friendly English-speaking drivers, and a commitment to punctuality and safety that families across Australia, New Zealand and Europe have trusted since 2018.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
