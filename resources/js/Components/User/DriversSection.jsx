import React from 'react';
import { Link } from '@inertiajs/react';

// Figma DriversSection — full rebuild
// Section Our Team: bg #F8F9FA, pt 80px
// Founder Section: bg #F3F4F5, at top: 308px
// Support Team Section: bg #F8F9FA, at top: 925.5px
// Drivers Grid Section: bg #FFFFFF, at top: 1705.5px
// Section - Trust Banner: bg #FFFFFF, at top: 2526px
// Section - Family Safety Highlight: bg #F8F9FA, at top: 2984.5px

const SUPPORT_TEAM = [
    { name: 'Wayan', role: 'Senior Driver & Guide', years: '8 yrs experience', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Kadek', role: 'Family Transport Specialist', years: '6 yrs experience', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Putu', role: 'Tour Driver & Coordinator', years: '5 yrs experience', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
];

const DRIVERS_GRID = [
    { name: 'Made', role: 'Professional Driver', tag: 'BFS VERIFIED', img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80' },
    { name: 'Ketut', role: 'Professional Driver', tag: 'BFS VERIFIED', img: 'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?auto=format&fit=crop&w=400&q=80' },
    { name: 'Gede', role: 'Professional Driver', tag: 'BFS VERIFIED', img: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80' },
    { name: 'Agus', role: 'Professional Driver', tag: 'BFS VERIFIED', img: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=400&q=80' },
];

const SAFETY_FEATURES = [
    'Certified Car Seats',
    'Flight Tracking Included',
    'Cold Bottled Water',
    'Flexible Rest Stops',
    'Child-Safe Driving',
];

export default function DriversSection() {
    return (
        <div id="drivers" style={{ width: '100%', background: '#F8F9FA' }}>

            {/* ── FOUNDER SECTION ── */}
            <div className="bfs-founder" style={{
                background: '#F3F4F5',
                padding: '64px 104px',
            }}>
                <div className="bfs-founder-card" style={{
                    maxWidth: '1072px',
                    margin: '0 auto',
                    background: '#F8F9FA',
                    border: '1px solid #E1E3E4',
                    boxShadow: '0px 10px 30px rgba(0, 45, 99, 0.04)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'row',
                    overflow: 'hidden',
                    minHeight: '490px',
                }}>
                    {/* Photo left */}
                    <div style={{ flex: '1 1 0', position: 'relative', minHeight: '490px', overflow: 'hidden' }}>
                        <img
                            src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80"
                            alt="Founder of Bali Family Safe Tours"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        {/* Gradient overlay */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)',
                        }} />
                    </div>

                    {/* Text right — Figma: bg #F8F9FA, padding 64px */}
                    <div style={{
                        flex: '1 1 0',
                        background: '#F8F9FA',
                        padding: '64px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}>
                        {/* OUR DRIVERS tag — Figma: bg #9FBEFD, text #2B4C83 */}
                        <div style={{
                            display: 'inline-flex',
                            alignSelf: 'flex-start',
                            background: '#9FBEFD',
                            borderRadius: '9999px',
                            padding: '4px 12px',
                            marginBottom: '24px',
                        }}>
                            <span style={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                fontSize: '12px',
                                lineHeight: '16px',
                                letterSpacing: '0.6px',
                                textTransform: 'uppercase',
                                color: '#2B4C83',
                            }}>
                                OUR DRIVERS
                            </span>
                        </div>

                        {/* Name — Figma: 32px bold */}
                        <h2 style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            fontSize: '32px',
                            lineHeight: '40px',
                            color: '#191C1D',
                            margin: 0,
                            marginBottom: '16px',
                        }}>
                            Wayan Suparta
                        </h2>

                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '29px',
                            color: '#3E4850',
                            margin: 0,
                            marginBottom: '32px',
                        }}>
                            "Behind Bali Family Safe Tours is a team that truly cares about every family travelling to Bali. Our goal is simple: to provide safe, comfortable and reliable transportation for families while giving every guest a warm and personal Bali experience."
                        </p>

                        {/* Credentials row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '48px', height: '48px',
                                background: 'rgba(0, 101, 141, 0.1)',
                                borderRadius: '9999px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="16" height="20" viewBox="0 0 24 24" fill="#00658D"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                            </div>
                            <div>
                                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#191C1D' }}>
                                    Founder & Head Driver
                                </div>
                                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', color: '#3E4850' }}>
                                    10+ years family transport
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SUPPORT TEAM SECTION ── */}
            <div className="bfs-support-team" style={{
                background: '#F8F9FA',
                padding: '96px 40px 128px',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 64px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '40px',
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 800,
                            fontSize: '30px',
                            lineHeight: '36px',
                            color: '#0F172A',
                            margin: 0,
                            marginBottom: '8px',
                        }}>
                            Your BFS Family Support Team
                        </h2>
                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '24px',
                            color: '#475569',
                            margin: 0,
                        }}>
                            Here to help you before, during and throughout your Bali journey.
                        </p>
                    </div>

                    {/* 3 Support Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
                        {SUPPORT_TEAM.map((driver, i) => (
                            <div
                                key={i}
                                className="w-full bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden flex flex-col"
                            >
                                <div style={{ height: '254px', overflow: 'hidden', background: '#E2E8F0' }}>
                                    <img src={driver.img} alt={driver.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '24px', textAlign: 'center' }}>
                                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', lineHeight: '28px', color: '#0F172A', margin: 0 }}>
                                        {driver.name}
                                    </h3>
                                    <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '20px', color: '#64748B', margin: '4px 0 12px' }}>
                                        {driver.role}
                                    </p>
                                    <div style={{
                                        display: 'inline-flex',
                                        background: '#F8FAFC',
                                        border: '1px solid #F1F5F9',
                                        borderRadius: '9999px',
                                        padding: '4px 12px',
                                    }}>
                                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '12px', color: '#475569' }}>
                                            {driver.years}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── DRIVERS GRID ── */}
            <div className="bfs-drivers-grid" style={{
                background: '#FFFFFF',
                borderTop: '1px solid #E1E3E4',
                padding: '96px 40px',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 64px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '48px',
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            fontSize: '32px',
                            lineHeight: '40px',
                            color: '#191C1D',
                            margin: 0,
                            marginBottom: '16px',
                        }}>
                            Meet Our Professional Drivers
                        </h2>
                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '24px',
                            color: '#3E4850',
                            margin: 0,
                        }}>
                            Friendly, experienced and family-focused drivers you can trust during your Bali holiday.
                        </p>
                    </div>

                    {/* 4-driver grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl mx-auto pt-4">
                        {DRIVERS_GRID.map((driver, i) => (
                            <div
                                key={i}
                                className="w-full bg-[#F8F9FA] border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden relative flex flex-col"
                            >
                                {/* BFS VERIFIED badge */}
                                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md border border-sky-200/80 shadow-sm rounded-full">
                                    <svg className="w-3.5 h-3.5 text-sky-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-[10px] font-extrabold tracking-wider text-sky-900 uppercase font-sans">
                                        BFS VERIFIED
                                    </span>
                                </div>

                                {/* Photo */}
                                <div style={{ height: '256px', overflow: 'hidden', background: '#D1D5DB' }}>
                                    <img src={driver.img} alt={driver.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>

                                {/* Info */}
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '20px', lineHeight: '28px', color: '#191C1D', margin: 0 }}>
                                        {driver.name}
                                    </h4>
                                    <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '20px', color: '#3E4850', margin: '0 0 8px' }}>
                                        {driver.role}
                                    </p>
                                    <div className="inline-flex items-center gap-1.5 self-start bg-sky-50 border border-sky-200/60 rounded-full px-3 py-1">
                                        <svg className="w-3.5 h-3.5 text-sky-700 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs font-semibold text-sky-900 font-sans">
                                            Police Cleared
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* "Meet More" button */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Link
                            href="/our-team"
                            style={{
                                padding: '12px 32px',
                                height: '48px',
                                background: 'transparent',
                                border: '2px solid #00658D',
                                boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                                borderRadius: '12px',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                fontSize: '14px',
                                lineHeight: '20px',
                                letterSpacing: '0.14px',
                                color: '#00658D',
                                cursor: 'pointer',
                                transition: 'background 0.15s',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,101,141,0.05)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            Meet More of Our Team
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── "MORE THAN JUST A DRIVER" BANNER ── */}
            <div className="bfs-banner" style={{
                background: '#FFFFFF',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                padding: '128px 40px',
                textAlign: 'center',
            }}>
                <h2 style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '64px',
                    lineHeight: '48px',
                    letterSpacing: '-1.2px',
                    color: '#3E5E96',
                    margin: 0,
                    marginBottom: '32px',
                }}>
                    "More Than Just a Driver"
                </h2>
                <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 300,
                    fontSize: '24px',
                    lineHeight: '32px',
                    color: '#000000',
                    opacity: 0.9,
                    maxWidth: '757px',
                    margin: '0 auto',
                }}>
                    Our team are your local guides, photographers, cultural ambassadors, and most importantly, your family's caretakers on the island of Bali.
                </p>
            </div>

            {/* ── FAMILY SAFETY HIGHLIGHT ── */}
            <div className="bfs-safety" style={{
                background: '#F8F9FA',
                padding: '96px 104px',
            }}>
                <div className="bfs-safety-flex" style={{
                    maxWidth: '1072px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '64px',
                }}>
                    {/* Left: Safety Info */}
                    <div style={{ flex: '1 1 0', maxWidth: '504px' }}>
                        {/* Safety badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(254,221,0,0.2)',
                            borderRadius: '9999px',
                            padding: '4px 12px',
                            marginBottom: '16px',
                        }}>
                            <svg width="10" height="12" viewBox="0 0 24 24" fill="#EA8C21"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '12px', letterSpacing: '0.6px', textTransform: 'uppercase', color: '#EA8C21' }}>
                                FAMILY SAFETY
                            </span>
                        </div>

                        <h2 style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            fontSize: '32px',
                            lineHeight: '40px',
                            color: '#191C1D',
                            margin: 0,
                            marginBottom: '16px',
                        }}>
                            We Understand Family Travel
                        </h2>

                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '29px',
                            color: '#3E4850',
                            margin: 0,
                            marginBottom: '24px',
                        }}>
                            As parents ourselves, we know the logistics of traveling with kids. That's why every aspect of our service—from our spotless vehicles to our certified child seats—is designed to eliminate stress and maximize enjoyment.
                        </p>

                        {/* Feature pill grid — Figma: 2-column pills */}
                        <div className="bfs-safety-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', position: 'relative' }}>
                            {SAFETY_FEATURES.map((feat, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        background: '#F3F4F5',
                                        border: '1px solid #E1E3E4',
                                        borderRadius: '12px',
                                        padding: '12px',
                                        gridColumn: i === 4 ? '1 / -1' : undefined,
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#00658D"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', lineHeight: '20px', letterSpacing: '0.14px', color: '#191C1D' }}>
                                        {feat}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Car Seat Image */}
                    <div style={{ flex: '1 1 0', maxWidth: '504px', position: 'relative' }}>
                        {/* Background decoration */}
                        <div style={{
                            position: 'absolute',
                            top: '-30px', left: '-26px', right: '-6px', bottom: '-2px',
                            background: 'rgba(215,226,255,0.5)',
                            borderRadius: '24px',
                            transform: 'rotate(3deg)',
                            zIndex: 0,
                        }} />
                        <div style={{
                            position: 'relative',
                            zIndex: 1,
                            borderRadius: '20px',
                            overflow: 'hidden',
                            border: '1px solid rgba(225,227,228,0.5)',
                            boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)',
                            height: '378px',
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                                alt="Premium infant car seat installed in luxury vehicle"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
