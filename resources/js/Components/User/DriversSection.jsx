import React from 'react';
import { Link } from '@inertiajs/react';
import { Sparkle } from '@phosphor-icons/react';

// Unified team members (combining both support staff and professional drivers)
const UNIFIED_TEAM = [
    {
        type: 'staff',
        name: 'Putu Dewi',
        role: 'Customer Care Specialist',
        specialty: 'Guest Relations & Planning',
        badge: 'SUPPORT TEAM',
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    },
    {
        type: 'staff',
        name: 'Made Yudi',
        role: 'Booking & Tour Coordinator',
        specialty: 'Tour Scheduling & Dispatch',
        badge: 'SUPPORT TEAM',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
        type: 'driver',
        name: 'Wayan Arta',
        role: 'Senior Private Driver',
        specialty: '10+ yrs • Certified Car Seats',
        badge: 'POLICE CLEARED',
        img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    },
    {
        type: 'driver',
        name: 'Ketut Budi',
        role: 'Professional Family Driver',
        specialty: '8 yrs • English Speaking',
        badge: 'POLICE CLEARED',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    {
        type: 'staff',
        name: 'Ni Luh Sari',
        role: 'Guest Assistance Specialist',
        specialty: 'Family Inquiries & Helpdesk',
        badge: 'SUPPORT TEAM',
        img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    },
    {
        type: 'driver',
        name: 'Made Suardana',
        role: 'Private Tour & Airport Driver',
        specialty: '12 yrs • Stroller Care',
        badge: 'POLICE CLEARED',
        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    },
    {
        type: 'driver',
        name: 'Kadek Sumerta',
        role: 'Family Transport Specialist',
        specialty: '9 yrs • Child Safety Certified',
        badge: 'POLICE CLEARED',
        img: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80',
    },
    {
        type: 'driver',
        name: 'Gede Wirawan',
        role: 'Private Driver & Guide',
        specialty: '5 yrs • Toddler Friendly',
        badge: 'POLICE CLEARED',
        img: 'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?auto=format&fit=crop&w=400&q=80',
    },
];

const SAFETY_FEATURES = [
    'Certified Car Seats',
    'Flight Tracking Included',
    'Cold Bottled Water',
    'Flexible Rest Stops',
    'Child-Safe Driving',
];

export default function DriversSection({ teamMembers = [] }) {
    const founder = teamMembers.find((m) => m.is_founder) || null;
    const regularMembers = teamMembers.filter((m) => !m.is_founder);

    const displayTeam = regularMembers.length > 0
        ? regularMembers.map((m) => ({
            type: m.driver_id ? 'driver' : 'staff',
            name: m.name,
            role: m.role_title,
            specialty: `${m.years_experience ? `${m.years_experience} • ` : ''}${m.languages || 'English'}`,
            badge: m.driver_id ? 'POLICE CLEARED' : 'SUPPORT TEAM',
            img: m.photo_url || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        }))
        : UNIFIED_TEAM;

    return (
        <div id="drivers" style={{ width: '100%', background: '#F8F9FA' }}>

            {/* ── FOUNDER SECTION ── */}
            <div className="bfs-founder relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F9FAFB] to-white overflow-hidden">
                <div className="relative max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="flex flex-col md:flex-row items-stretch">
                        
                        {/* Founder Portrait — matches the text height exactly */}
                        <div className="w-full md:w-[320px] lg:w-[350px] shrink-0 bg-slate-100 relative overflow-hidden">
                            <img
                                src={founder?.photo_url || "/images/wayan-suparta.jpg"}
                                alt={`${founder?.name || 'Wayan Suparta'} - Founder of Bali Family Safe Tours`}
                                className="w-full h-full object-cover object-top min-h-[300px] md:min-h-0"
                            />
                        </div>

                        {/* Founder Story & Message */}
                        <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                            {/* Subtle Tag */}
                            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-[#00658D] text-xs font-semibold tracking-wider uppercase mb-3.5">
                                <Sparkle size={13} weight="fill" className="text-[#00658D]" />
                                FOUNDER'S MESSAGE
                            </div>

                            {/* Main quote heading */}
                            <h2 className="text-xl sm:text-2xl lg:text-[25px] font-bold text-slate-900 tracking-tight leading-snug mb-3">
                                "We don't just drive; we take care of your family like our own."
                            </h2>

                            {/* Message body */}
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal mb-5">
                                {founder?.bio || "Behind Bali Family Safe Tours is a simple commitment: every parent traveling with little ones deserves complete peace of mind. We take the stress out of island travel—providing vetted family drivers, certified child seats, and genuine Balinese care so you can focus on making memories."}
                            </p>

                            {/* Founder Info (clean, elegant, no noisy labels) */}
                            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#00658D]/10 text-[#00658D] flex items-center justify-center font-bold text-sm shrink-0">
                                    {(founder?.name || 'Wayan Suparta').split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div>
                                    <div className="text-base font-bold text-slate-900 leading-tight">
                                        {founder?.name || 'Wayan Suparta'}
                                    </div>
                                    <div className="text-xs font-medium text-slate-500 mt-0.5">
                                        {founder?.role_title || 'Founder & Head Driver'}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── UNIFIED TEAM SECTION (Staff & Drivers Combined) ── */}
            <div className="bfs-unified-team" style={{
                background: '#FFFFFF',
                borderTop: '1px solid #E1E3E4',
                padding: '96px 40px',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '48px',
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: 'rgba(0, 101, 141, 0.08)',
                            borderRadius: '9999px',
                            padding: '4px 14px',
                            marginBottom: '16px',
                        }}>
                            <span style={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                fontSize: '12px',
                                letterSpacing: '0.6px',
                                textTransform: 'uppercase',
                                color: '#00658D',
                            }}>
                                OUR TEAM & DRIVERS
                            </span>
                        </div>
                        <h2 style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            fontSize: '36px',
                            lineHeight: '44px',
                            color: '#191C1D',
                            margin: 0,
                            marginBottom: '16px',
                        }}>
                            Meet Our Dedicated Team & Drivers
                        </h2>
                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '26px',
                            color: '#475569',
                            margin: 0,
                        }}>
                            From customer support specialists to police-cleared family drivers, our team is committed to making your Bali journey safe, seamless, and memorable.
                        </p>
                    </div>

                    {/* Combined Staff & Drivers Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto">
                        {displayTeam.map((member, i) => (
                            <div
                                key={i}
                                className="group w-full bg-white border border-slate-200/80 hover:border-sky-300 shadow-sm hover:shadow-md rounded-2xl overflow-hidden relative flex flex-col transition-all duration-200"
                            >
                                {/* Role category badge on photo */}
                                <div className="absolute top-3.5 left-3.5 z-10">
                                    {member.type === 'staff' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-900/90 text-white backdrop-blur-md text-[10px] font-bold tracking-wider rounded-full shadow-sm">
                                            <svg className="w-3 h-3 text-sky-300" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" />
                                            </svg>
                                            STAFF
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-800/90 text-white backdrop-blur-md text-[10px] font-bold tracking-wider rounded-full shadow-sm">
                                            <svg className="w-3 h-3 text-emerald-300" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            DRIVER
                                        </span>
                                    )}
                                </div>

                                {/* Photo */}
                                <div style={{ height: '240px', overflow: 'hidden', background: '#E2E8F0' }}>
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="group-hover:scale-105 transition-transform duration-300"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>

                                {/* Card Body */}
                                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <h4 style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 700,
                                        fontSize: '18px',
                                        lineHeight: '24px',
                                        color: '#0F172A',
                                        margin: 0,
                                        marginBottom: '4px',
                                    }}>
                                        {member.name}
                                    </h4>
                                    <p style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 500,
                                        fontSize: '13px',
                                        lineHeight: '18px',
                                        color: '#00658D',
                                        margin: 0,
                                        marginBottom: '12px',
                                    }}>
                                        {member.role}
                                    </p>

                                    {/* Sub-tag */}
                                    <div style={{ marginTop: 'auto' }}>
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            background: '#F8FAFC',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '8px',
                                            padding: '4px 10px',
                                            width: '100%',
                                        }}>
                                            <span style={{
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: member.type === 'staff' ? '#0284C7' : '#10B981',
                                                flexShrink: 0,
                                            }} />
                                            <span style={{
                                                fontFamily: 'Inter, sans-serif',
                                                fontWeight: 500,
                                                fontSize: '11px',
                                                color: '#475569',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>
                                                {member.specialty}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* "Meet More of Our Team" Button */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                        <Link
                            href="/our-team"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 36px',
                                height: '50px',
                                background: '#FFFFFF',
                                border: '2px solid #00658D',
                                boxShadow: '0px 2px 6px rgba(0, 101, 141, 0.08)',
                                borderRadius: '12px',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                fontSize: '15px',
                                lineHeight: '20px',
                                color: '#00658D',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = '#00658D';
                                e.currentTarget.style.color = '#FFFFFF';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = '#FFFFFF';
                                e.currentTarget.style.color = '#00658D';
                            }}
                        >
                            <span>Meet More of Our Team</span>
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── "MORE THAN JUST A DRIVER" BANNER (Commented out per user request) ── */}
            {/*
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
            */}

            {/* ── FAMILY SAFETY HIGHLIGHT (Commented out per user request) ── */}
            {/*
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
                    <div style={{ flex: '1 1 0', maxWidth: '504px' }}>
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

                    <div style={{ flex: '1 1 0', maxWidth: '504px', position: 'relative' }}>
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
            */}
        </div>
    );
}
