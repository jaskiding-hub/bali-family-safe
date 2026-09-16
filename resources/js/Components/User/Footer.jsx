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
                        Designed for stress-free family travel in Bali 🌴
                    </p>
                </div>
            </div>
        </footer>
    );
}
