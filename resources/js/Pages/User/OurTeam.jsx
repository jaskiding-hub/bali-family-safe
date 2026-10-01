import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Footer from '../../Components/User/Footer';
import FloatingWhatsApp from '../../Components/User/FloatingWhatsApp';
import { CaretLeft } from '@phosphor-icons/react';

function InfoRow({ text }) {
    return (
        <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '21px',
            color: '#6E7881',
        }}>
            {text}
        </span>
    );
}

function SupportCard({ member }) {
    return (
        <div className="w-full bg-white border border-slate-200/60 shadow-sm rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1">
            {/* Photo */}
            <div style={{
                width: '100%',
                height: '256px',
                overflow: 'hidden',
                background: '#E1E3E4',
            }}>
                <img
                    src={member.img}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
            </div>
            {/* Info */}
            <div style={{ padding: '24px' }}>
                <div style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: '12px',
                    lineHeight: '16px',
                    letterSpacing: '0.6px',
                    textTransform: 'uppercase',
                    color: '#00658D',
                    marginBottom: '8px',
                }}>
                    {member.role}
                </div>
                <h3 style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '24px',
                    lineHeight: '32px',
                    color: '#191C1D',
                    margin: '0 0 12px 0',
                }}>
                    {member.name}
                </h3>
                <InfoRow text={member.info} />
            </div>
        </div>
    );
}

function DriverCard({ member }) {
    return (
        <div className="w-full bg-white border border-slate-200/60 shadow-sm rounded-xl overflow-hidden relative flex flex-col transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1">
            {/* Photo */}
            <div style={{
                width: '100%',
                height: '224px',
                overflow: 'hidden',
                background: '#E1E3E4',
            }}>
                <img
                    src={member.img}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
            </div>
            {/* Info */}
            <div style={{ padding: '24px' }}>
                <div style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: '12px',
                    lineHeight: '16px',
                    letterSpacing: '0.6px',
                    textTransform: 'uppercase',
                    color: '#00658D',
                    marginBottom: '4px',
                }}>
                    {member.role}
                </div>
                <h3 style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '24px',
                    lineHeight: '32px',
                    color: '#191C1D',
                    margin: '0 0 12px 0',
                }}>
                    {member.name}
                </h3>
                <InfoRow text={member.info} />
            </div>
        </div>
    );
}

function DriverGrid({ drivers }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl mx-auto">
            {drivers.map((d, i) => (
                <DriverCard key={i} member={d} />
            ))}
        </div>
    );
}

export default function OurTeam({ supportTeam = [], driverTeam = [] }) {
    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            background: 'linear-gradient(0deg, #F8F9FA, #F8F9FA), #FFFFFF',
            minHeight: '100vh',
            color: '#191C1D',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
        }}>
            <Head>
                <title>Meet the BFS Family – Bali Family Safe Tours</title>
                <meta name="description" content="Meet the trusted local team dedicated to making your Bali family journey safe, comfortable and stress-free." />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>

            {/* Header Section */}
            <section id="our-team-hero" className="relative w-full h-[380px] sm:h-[500px] flex flex-col justify-center items-center px-4 sm:px-8 overflow-hidden">
                {/* Background image */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0,
                }} />
                {/* Dark overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.4)',
                    zIndex: 1,
                }} />
                {/* Back Button */}
                <Link
                    href="/"
                    className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/50 shadow-md flex items-center justify-center text-slate-900"
                >
                    <CaretLeft size={20} weight="bold" color="#191C1D" />
                </Link>
                {/* Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    maxWidth: '672px',
                }}>
                    <h1 style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: '48px',
                        lineHeight: '56px',
                        letterSpacing: '-1.2px',
                        color: '#FFFFFF',
                        margin: '0 0 16px 0',
                    }}>
                        Meet the BFS Family
                    </h1>
                    <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '28px',
                        color: '#FFFFFF',
                        margin: 0,
                    }}>
                        The trusted local team dedicated to making your Bali family journey safe, comfortable and stress-free.
                    </p>
                </div>
            </section>

            {/* Main Content Area */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '48px 0',
            }}>
                {/* Support Team Section */}
                <section className="px-4 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 relative">
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        position: 'relative',
                    }}>
                        {/* Decorative blur */}
                        <div style={{
                            position: 'absolute',
                            width: '384px',
                            height: '384px',
                            right: 0,
                            top: 0,
                            background: 'rgba(198, 231, 255, 0.2)',
                            filter: 'blur(50px)',
                            borderRadius: '9999px',
                            zIndex: 0,
                        }} />

                        {/* Section header with divider */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            marginBottom: '40px',
                            position: 'relative',
                            zIndex: 1,
                        }}>
                            <h2 style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 700,
                                fontSize: '32px',
                                lineHeight: '40px',
                                color: '#191C1D',
                                margin: 0,
                                whiteSpace: 'nowrap',
                            }}>
                                Family Support Team
                            </h2>
                            <div style={{
                                flex: 1,
                                height: '1px',
                                background: 'rgba(189, 200, 209, 0.3)',
                            }} />
                        </div>

                        {/* Cards grid */}
                        {supportTeam.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10 max-w-5xl mx-auto w-full">
                                {supportTeam.map((member, i) => (
                                    <SupportCard key={i} member={member} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '32px 16px', color: '#6E7881', fontSize: '14px' }}>
                                Belum ada anggota tim support terdaftar.
                            </div>
                        )}
                    </div>
                </section>

                {/* Drivers Section */}
                <section className="px-4 py-12 sm:px-8 sm:py-16 md:px-12 md:py-20 relative">
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        position: 'relative',
                    }}>
                        {/* Decorative blur */}
                        <div style={{
                            position: 'absolute',
                            width: '500px',
                            height: '500px',
                            left: 0,
                            bottom: 0,
                            background: 'rgba(215, 226, 255, 0.3)',
                            filter: 'blur(60px)',
                            borderRadius: '9999px',
                            zIndex: 0,
                        }} />

                        {/* Section header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            marginBottom: '40px',
                            position: 'relative',
                            zIndex: 1,
                        }}>
                            <h2 style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 700,
                                fontSize: '32px',
                                lineHeight: '40px',
                                color: '#191C1D',
                                margin: 0,
                            }}>
                                Professional Drivers
                            </h2>
                        </div>

                        {/* Driver grids */}
                        {driverTeam.length > 0 ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '24px',
                                position: 'relative',
                                zIndex: 1,
                            }}>
                                <DriverGrid drivers={driverTeam} />
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '32px 16px', color: '#6E7881', fontSize: '14px' }}>
                                Belum ada driver terdaftar.
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <Footer />

            {/* Floating WhatsApp */}
            <FloatingWhatsApp />
        </div>
    );
}
