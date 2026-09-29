import React from 'react';

// Figma Footer: light bg #F8F9FA, 4-column layout
// NOT dark — matching Figma exactly

const NAV_COL = [
    { label: 'Home', href: '#hero' },
    { label: 'Child Car Seats', href: '#car-seats' },
    { label: 'About Us', href: '#about' },
    { label: 'Our Drivers', href: '#drivers' },
    { label: 'Our Services', href: '#services' },
    { label: 'Day Tours', href: '#tours' },
    { label: 'Vehicle Fleet', href: '#fleet' },
    { label: 'FAQ', href: '#faq' },
];

const AREAS = [
    'Kuta & Legian',
    'Seminyak & Oberoi',
    'Canggu & Pererenan',
    'Ubud & Central Bali',
    'Sanur & Port Access',
    'Uluwatu & Jimbaran',
    'Nusa Dua & Tanjung Benoa',
    'DPS Ngurah Rai Airport',
];

export default function Footer({ siteSettings = null }) {
    const scrollTo = (e, href) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    };

    const waRaw = siteSettings?.whatsapp_number || '+62 812-3456-7890';
    const waDigits = waRaw.replace(/[^0-9]/g, '') || '6281234567890';
    const email = siteSettings?.email || 'info@balifamilysafe.com';

    return (
        <footer
            id="contact"
            style={{
                background: '#F8F9FA',
                borderTop: '1px solid #E1E3E4',
                padding: '64px 40px 0',
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 64px',
            }}>
                {/* 4-Column Grid */}
                <div className="bfs-footer-grid" style={{
                    gap: '48px',
                    paddingBottom: '48px',
                    borderBottom: '1px solid #E1E3E4',
                }}>
                    {/* Col 1: Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <img
                                src="/images/logo.png"
                                alt="Bali Family Safe Tours"
                                style={{ height: '96px', width: 'auto', objectFit: 'contain' }}
                            />
                        </div>
                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '22px',
                            color: '#6E7881',
                            margin: '0 0 20px',
                            maxWidth: '280px',
                        }}>
                            Dedicated child road safety family transport in Bali. Certified car seats free with every airport transfer and private day tour.
                        </p>

                        {/* WhatsApp Contact */}
                        <a
                            href={`https://wa.me/${waDigits}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                fontSize: '14px',
                                color: '#25D366',
                                textDecoration: 'none',
                                marginBottom: '8px',
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            {waRaw}
                        </a>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="16" height="12" viewBox="0 0 24 24" fill="#6E7881"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6E7881' }}>
                                {email}
                            </span>
                        </div>

                        {/* Social Media Links */}
                        {(siteSettings?.instagram_url || siteSettings?.facebook_url || siteSettings?.google_maps_url) && (
                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                {siteSettings?.instagram_url && (
                                    <a
                                        href={siteSettings.instagram_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="Instagram"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: '#E1E3E4',
                                            color: '#6E7881',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#E1306C';
                                            e.currentTarget.style.color = '#fff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#E1E3E4';
                                            e.currentTarget.style.color = '#6E7881';
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </a>
                                )}
                                {siteSettings?.facebook_url && (
                                    <a
                                        href={siteSettings.facebook_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="Facebook"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: '#E1E3E4',
                                            color: '#6E7881',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#1877F2';
                                            e.currentTarget.style.color = '#fff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#E1E3E4';
                                            e.currentTarget.style.color = '#6E7881';
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                )}
                                {siteSettings?.google_maps_url && (
                                    <a
                                        href={siteSettings.google_maps_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="Google Maps"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: '#E1E3E4',
                                            color: '#6E7881',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#34A853';
                                            e.currentTarget.style.color = '#fff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#E1E3E4';
                                            e.currentTarget.style.color = '#6E7881';
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Col 2: Quick Links */}
                    <div>
                        <h4 style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: '13px',
                            lineHeight: '16px',
                            letterSpacing: '0.6px',
                            textTransform: 'uppercase',
                            color: '#191C1D',
                            margin: 0,
                            marginBottom: '16px',
                        }}>
                            Quick Links
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {NAV_COL.map((link, i) => (
                                <li key={i}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => scrollTo(e, link.href)}
                                        style={{
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            lineHeight: '20px',
                                            color: '#6E7881',
                                            textDecoration: 'none',
                                            transition: 'color 0.15s',
                                        }}
                                        onMouseEnter={e => e.target.style.color = '#00658D'}
                                        onMouseLeave={e => e.target.style.color = '#6E7881'}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: Coverage Areas */}
                    <div>
                        <h4 style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: '13px',
                            lineHeight: '16px',
                            letterSpacing: '0.6px',
                            textTransform: 'uppercase',
                            color: '#191C1D',
                            margin: 0,
                            marginBottom: '16px',
                        }}>
                            Coverage Areas
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {AREAS.map((area, i) => (
                                <li key={i} style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    lineHeight: '20px',
                                    color: '#6E7881',
                                }}>
                                    {area}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4: Services */}
                    <div>
                        <h4 style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: '13px',
                            lineHeight: '16px',
                            letterSpacing: '0.6px',
                            textTransform: 'uppercase',
                            color: '#191C1D',
                            margin: 0,
                            marginBottom: '16px',
                        }}>
                            Our Services
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {['Airport Transfers', 'Hotel Transfers', 'Private Day Tours', 'Custom Itineraries', 'Multi-Day Hire', 'Cruise Port Transfers'].map((s, i) => (
                                <li key={i} style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    lineHeight: '20px',
                                    color: '#6E7881',
                                }}>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="bfs-footer-bottom" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    flexWrap: 'wrap',
                    gap: '8px',
                }}>
                    <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '13px',
                        lineHeight: '20px',
                        color: '#9CA3AF',
                        margin: 0,
                    }}>
                        © {new Date().getFullYear()} Bali Family Safe. All rights reserved.
                    </p>
                    <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '13px',
                        lineHeight: '20px',
                        color: '#9CA3AF',
                        margin: 0,
                    }}>
                        Designed for stress-free family travel in Bali
                    </p>
                </div>
            </div>
        </footer>
    );
}
