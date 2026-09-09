import React from 'react';

// Section - Bottom CTA (Figma: bg #EDEEEF, padding 80px 256px)
export default function FeaturesSection() {
    const scrollToBooking = (e) => {
        e.preventDefault();
        document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="features"
            className="bfs-cta"
            style={{
                background: '#EDEEEF',
                padding: '80px 256px',
                textAlign: 'center',
            }}
        >
            <div style={{
                maxWidth: '768px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                {/* Heading — Figma: 32px bold */}
                <h2 style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '32px',
                    lineHeight: '40px',
                    color: '#191C1D',
                    textAlign: 'center',
                    margin: 0,
                    marginBottom: '32px',
                }}>
                    Ready for a stress-free Bali family vacation?
                </h2>

                {/* CTA Button — Figma: bg #3E5E96, 18px, borderRadius 16px */}
                <a
                    href="#hero"
                    onClick={scrollToBooking}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '16px 32px',
                        height: '60px',
                        background: '#3E5E96',
                        borderRadius: '16px',
                        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
                        textDecoration: 'none',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '18px',
                        lineHeight: '28px',
                        letterSpacing: '0.18px',
                        color: '#FFFFFF',
                        transition: 'background 0.15s, transform 0.1s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#2e4f82'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#3E5E96'; e.currentTarget.style.transform = 'none'; }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M20 8h-2.81c-.45-1.12-1.13-2.1-1.99-2.91L17 3.3 15.7 2l-2.15 2.15C12.96 4.05 12.49 4 12 4c-.49 0-.96.05-1.55.15L8.3 2 7 3.3l1.8 1.79C7.94 5.9 7.26 6.88 6.81 8H4v2h2.09C6.04 10.33 6 10.66 6 11v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 2.37 3.4 4 6.19 4s5.15-1.63 6.19-4H22v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/></svg>
                    Book Your Transfer Now
                </a>

                {/* Fine print */}
                <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#3E4850',
                    margin: '16px 0 0',
                    textAlign: 'center',
                }}>
                    No prepayment required • Free cancellation
                </p>
            </div>
        </section>
    );
}
