import React from 'react';
import BookingWidget from './BookingWidget/BookingWidget';

export default function Hero({ siteSettings = null, packages = [], childSeatTypes = [], vehicles = [] }) {
    const headline = siteSettings?.hero_headline || 'Family Transportation in Bali\nwith Child Car Seats';
    const subheadline = siteSettings?.hero_subheadline || 'Safe, comfortable and private transportation for families travelling to Bali with babies, toddlers and children.';
    const bgImage = siteSettings?.hero_background_image;

    return (
        <section id="hero" className="bfs-hero">
            {/* Hero Background Image — 600px tall */}
            <div
                className="bfs-hero-bg"
                style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
            >
                {/* Subtle gradient for text readability */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.2) 60%, rgba(248,249,250,0) 100%)',
                }} />
            </div>

            {/* Hero Content — centered text over the photo */}
            <div className="bfs-hero-text">
                {/* Eyebrow pill */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#00AEEF',
                    borderRadius: '9999px',
                    padding: '4px 16px',
                    height: '24px',
                }}>
                    <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                        fontSize: '12px',
                        lineHeight: '16px',
                        letterSpacing: '0.6px',
                        textTransform: 'uppercase',
                        color: '#003E58',
                    }}>
                        BALI FAMILY SAFE TOURS
                    </span>
                </div>

                {/* H1 */}
                <h1 style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '56px',
                    lineHeight: '64px',
                    letterSpacing: '-1.12px',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    maxWidth: '1166px',
                    textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    margin: 0,
                    whiteSpace: 'pre-line',
                }}>
                    {headline}
                </h1>

                {/* Subheading */}
                <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '18px',
                    lineHeight: '28px',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    maxWidth: '964px',
                    opacity: 0.9,
                    textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    margin: 0,
                }}>
                    {subheadline}
                </p>
            </div>

            {/* Floating Booking Form — positioned via CSS (absolute on desktop, relative on mobile) */}
            <div className="bfs-hero-booking">
                <BookingWidget
                    packages={packages}
                    childSeatTypes={childSeatTypes}
                    vehicles={vehicles}
                />
            </div>
        </section>
    );
}
