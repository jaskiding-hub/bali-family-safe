import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const NAV_LINKS = [
    { label: 'Home', href: '#hero' },
    { label: 'Car Seats', href: '#car-seats' },
    { label: 'About Us', href: '#about' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Our Team', href: '#drivers' },
    { label: 'Our Services', href: '#services' },
    { label: 'Day Tour', href: '#tours' },
    { label: 'Fleet', href: '#fleet' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState('#hero');

    useEffect(() => {
        setMounted(true);
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Track active section with IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(`#${entry.target.id}`);
                    }
                });
            },
            {
                rootMargin: '-100px 0px -66% 0px',
                threshold: 0,
            }
        );

        NAV_LINKS.forEach((link) => {
            const el = document.querySelector(link.href);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.removeProperty('overflow');
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.removeProperty('overflow');
        };
    }, [mobileOpen]);

    const scrollTo = (e, href) => {
        setMobileOpen(false);
        const el = document.querySelector(href);
        if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: 'smooth' });
        } else if (href.startsWith('#')) {
            e.preventDefault();
            window.location.href = '/' + href;
        }
    };

    return (
        <>
            <header
                id="header"
                className="fixed top-0 left-0 right-0 z-[1000] flex items-center px-4 sm:px-8 transition-all duration-300"
                style={{
                    height: scrolled ? '80px' : '100px',
                    background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
                    boxShadow: scrolled ? '0px 2px 16px rgba(0,0,0,0.08)' : 'none',
                    backdropFilter: scrolled ? 'blur(12px)' : 'none',
                    WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
                }}
            >
                {/* Inner container with relative positioning */}
                <div
                    className="flex flex-row justify-between items-center w-full max-w-7xl mx-auto px-0 sm:px-4 h-full"
                    style={{ position: 'relative' }}
                >
                    {/* Logo on Left */}
                    <a
                        href="#hero"
                        onClick={(e) => scrollTo(e, '#hero')}
                        style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0, zIndex: 10 }}
                    >
                        <img
                            src="/images/logo.png"
                            alt="Bali Family Safe Tours"
                            className="bfs-nav-logo"
                            style={{
                                height: scrolled ? '72px' : '90px',
                                width: 'auto',
                                objectFit: 'contain',
                                transition: 'height 0.3s ease',
                                filter: scrolled ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                            }}
                        />
                    </a>

                    {/* Desktop Nav - Centered horizontally at 50% */}
                    <nav
                        className="navbar-desktop"
                        style={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '18px',
                            zIndex: 10,
                        }}
                    >
                        {NAV_LINKS.map((link, i) => {
                            const isActive = link.href === activeSection;
                            return (
                                <a
                                    key={i}
                                    href={link.href}
                                    onClick={(e) => scrollTo(e, link.href)}
                                    className={`text-sm tracking-tight font-medium rounded-full px-3 py-1.5 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                                        scrolled
                                            ? (isActive
                                                ? 'text-sky-700 font-bold bg-sky-50'
                                                : 'text-slate-700 hover:text-sky-600 hover:bg-slate-100/80')
                                            : (isActive
                                                ? 'text-white font-bold bg-white/20 backdrop-blur-xs'
                                                : 'text-white/90 hover:text-white hover:bg-white/15 backdrop-blur-xs')
                                    }`}
                                    style={{
                                        textShadow: scrolled ? 'none' : '0 1px 3px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    {link.label}
                                </a>
                            );
                        })}
                    </nav>

                    {/* Right slot for Mobile Hamburger */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0, zIndex: 10 }}>
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
                            <div style={{ width: 24, height: 2.5, background: scrolled ? '#1E293B' : '#FFFFFF', borderRadius: 2, marginBottom: 5, transition: 'background 0.3s ease' }} />
                            <div style={{ width: 24, height: 2.5, background: scrolled ? '#1E293B' : '#FFFFFF', borderRadius: 2, marginBottom: 5, transition: 'background 0.3s ease' }} />
                            <div style={{ width: 24, height: 2.5, background: scrolled ? '#1E293B' : '#FFFFFF', borderRadius: 2, transition: 'background 0.3s ease' }} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Full-Screen White Overlay Drawer (Portal to document.body) */}
            {mounted && mobileOpen && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100vw',
                        height: '100dvh',
                        background: '#FFFFFF',
                        zIndex: 999999,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px 24px 32px',
                        overflowY: 'auto',
                        WebkitOverflowScrolling: 'touch',
                    }}
                    className="animate-in fade-in duration-200"
                >
                    {/* Header: Logo + Close X */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        paddingBottom: '16px',
                        borderBottom: '1px solid #F1F5F9',
                    }}>
                        <a href="#hero" onClick={(e) => scrollTo(e, '#hero')} style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="/images/logo.png" alt="Bali Family Safe" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
                        </a>
                        <button
                            onClick={() => setMobileOpen(false)}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '9999px',
                                background: '#F1F5F9',
                                border: '1px solid #E2E8F0',
                                color: '#1E293B',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                            aria-label="Close menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Nav Links Stack */}
                    <nav style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        flex: 1,
                    }}>
                        {NAV_LINKS.map((link, i) => {
                            const isActive = link.href === activeSection;
                            return (
                                <a
                                    key={i}
                                    href={link.href}
                                    onClick={(e) => scrollTo(e, link.href)}
                                    style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 600,
                                        fontSize: '18px',
                                        lineHeight: '26px',
                                        color: isActive ? '#00658D' : '#1E293B',
                                        background: isActive ? 'rgba(0, 101, 141, 0.06)' : 'transparent',
                                        textDecoration: 'none',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        transition: 'background 0.15s, color 0.15s',
                                    }}
                                >
                                    <span>{link.label}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#00658D' : '#94A3B8'} strokeWidth="2.5" strokeLinecap="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </a>
                            );
                        })}
                    </nav>

                    {/* Drawer Footer Actions */}
                    <div style={{
                        marginTop: '20px',
                        paddingTop: '16px',
                        borderTop: '1px solid #F1F5F9',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                    }}>
                        <a
                            href="https://wa.me/6281234567890"
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                width: '100%',
                                height: '50px',
                                background: '#25D366',
                                borderRadius: '12px',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 700,
                                fontSize: '15px',
                                color: '#FFFFFF',
                                textDecoration: 'none',
                                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            <span>Book via WhatsApp</span>
                        </a>
                        <div style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#64748B' }}>
                            Fast & Direct Driver Confirmation
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
