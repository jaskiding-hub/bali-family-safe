import React, { useState, useEffect } from 'react';

const NAV_LINKS = [
    { label: 'Home', href: '#hero' },
    { label: 'About Us', href: '#about' },
    { label: 'Our Team', href: '#drivers' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Our Services', href: '#services' },
    { label: 'Day Tour', href: '#tours' },
    { label: 'Fleet', href: '#fleet' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (e, href) => {
        e.preventDefault();
        setMobileOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header
            id="header"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                height: '100px',
                background: scrolled ? 'rgba(248, 249, 250, 0.95)' : 'transparent',
                boxShadow: scrolled ? '0px 2px 12px rgba(0,0,0,0.08)' : 'none',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '0 40px',
                transition: 'background 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s ease',
            }}
        >
            {/* Inner container max-width 1200px */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 64px',
                    height: '100px',
                }}
            >
                {/* Logo */}
                <a
                    href="#hero"
                    onClick={(e) => scrollTo(e, '#hero')}
                    style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
                >
                    <img
                        src="/images/logo.png"
                        alt="Bali Family Safe Tours"
                        className="bfs-nav-logo"
                        style={{
                            height: '96px',
                            width: 'auto',
                            objectFit: 'contain',
                            transition: 'height 0.4s ease',
                            filter: scrolled ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                        }}
                    />
                </a>

                {/* Desktop Nav - Centered */}
                <nav className="navbar-desktop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flex: 1, margin: '0 24px' }}>
                    {NAV_LINKS.map((link, i) => (
                        <a
                            key={i}
                            href={link.href}
                            onClick={(e) => scrollTo(e, link.href)}
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: i === 0 ? 700 : 600,
                                fontSize: i === 0 ? '15px' : '14px',
                                lineHeight: '24px',
                                color: scrolled
                                    ? (i === 0 ? '#00658D' : '#3E4850')
                                    : '#FFFFFF',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                letterSpacing: i !== 0 ? '0.14px' : undefined,
                                transition: 'color 0.4s ease',
                                textShadow: scrolled ? 'none' : '0 1px 3px rgba(0,0,0,0.3)',
                            }}
                            onMouseEnter={e => e.target.style.color = '#00AEEF'}
                            onMouseLeave={e => e.target.style.color = scrolled
                                ? (i === 0 ? '#00658D' : '#3E4850')
                                : '#FFFFFF'}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMobileOpen(o => !o)}
                    style={{
                        display: 'none',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 8,
                    }}
                    className="navbar-hamburger"
                    aria-label="Toggle menu"
                >
                    <div style={{ width: 22, height: 2, background: scrolled ? '#3E4850' : '#FFFFFF', marginBottom: 5, transition: 'background 0.4s ease' }} />
                    <div style={{ width: 22, height: 2, background: scrolled ? '#3E4850' : '#FFFFFF', marginBottom: 5, transition: 'background 0.4s ease' }} />
                    <div style={{ width: 22, height: 2, background: scrolled ? '#3E4850' : '#FFFFFF', transition: 'background 0.4s ease' }} />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100px',
                    left: 0,
                    right: 0,
                    background: '#F8F9FA',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    padding: '16px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    zIndex: 999,
                    borderRadius: '0 0 16px 16px',
                }}>
                    {NAV_LINKS.map((link, i) => (
                        <a
                            key={i}
                            href={link.href}
                            onClick={(e) => scrollTo(e, link.href)}
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                fontSize: '15px',
                                color: '#3E4850',
                                textDecoration: 'none',
                                padding: '8px 0',
                                borderBottom: '1px solid #E1E3E4',
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            )}
        </header>
    );
}
