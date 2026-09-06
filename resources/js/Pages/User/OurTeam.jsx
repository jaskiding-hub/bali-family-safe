import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Footer from '../../Components/User/Footer';
import FloatingWhatsApp from '../../Components/User/FloatingWhatsApp';
import { CaretLeft, Envelope, Phone, MapPin } from '@phosphor-icons/react';

const SUPPORT_TEAM = [
    {
        name: 'Putu Dewi',
        role: 'Support Specialist',
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        info: 'Customer Relations',
    },
    {
        name: 'Made Yudi',
        role: 'Booking Coordinator',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        info: 'Tour Scheduling',
    },
    {
        name: 'Ni Luh Sari',
        role: 'Support Specialist',
        img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
        info: 'Guest Assistance',
    },
];

const DRIVERS_ROW_1 = [
    {
        name: 'Wayan Arta',
        role: 'Private Driver',
        img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        info: '10+ yrs experience',
    },
    {
        name: 'Ketut Budi',
        role: 'Private Driver',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        info: '8 yrs experience',

    },
    {
        name: 'Made Suardana',
        role: 'Private Driver',
        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        info: '12 yrs experience',

    },
    {
        name: 'Nyoman',
        role: 'Private Driver',
        img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80',
        info: '6 yrs experience',

    },
];

const DRIVERS_ROW_2 = [
    {
        name: 'Kadek Sumerta',
        role: 'Private Driver',
        img: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80',
        info: '9 yrs experience',
    },
    {
        name: 'Komang Adi',
        role: 'Private Driver',
        img: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=400&q=80',
        info: '7 yrs experience',

    },
    {
        name: 'I Made Dana',
        role: 'Private Driver',
        img: 'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?auto=format&fit=crop&w=400&q=80',
        info: '11 yrs experience',

    },
    {
        name: 'Gede Wirawan',
        role: 'Private Driver',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        info: '5 yrs experience',
    },
];

const DRIVERS_ROW_3 = [
    {
        name: 'I Wayan Suardana',
        role: 'Private Driver',
        img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        info: '8 yrs experience',
    },
    {
        name: 'Putu Agus',
        role: 'Private Driver',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        info: '10 yrs experience',

    },
    {
        name: 'Ketut Artana',
        role: 'Private Driver',
        img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        info: '6 yrs experience',

    },
    {
        name: 'Nyoman Suamba',
        role: 'Private Driver',
        img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80',
        info: '9 yrs experience',

    },
];

function InfoRow({ icon, text }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
                width: '15px',
                height: '15px',
                background: '#6E7881',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}>
                {icon}
            </div>
            <span style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '21px',
                color: '#3E4850',
            }}>
                {text}
            </span>
        </div>
    );
}

function SupportCard({ member }) {
    return (
        <div style={{
            flex: '1 1 0',
            maxWidth: '341px',
            background: '#FFFFFF',
            border: '1px solid rgba(189, 200, 209, 0.2)',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            overflow: 'hidden',
        }}>
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
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                    color: '#3E5E96',
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
                    margin: '0 0 16px 0',
                }}>
                    {member.name}
                </h3>
                <InfoRow
                    icon={<Envelope size={10} weight="bold" color="#6E7881" />}
                    text={member.info}
                />
            </div>
        </div>
    );
}

function DriverCard({ member }) {
    return (
        <div style={{
            flex: '1 1 0',
            maxWidth: '250px',
            background: '#FFFFFF',
            border: '1px solid rgba(189, 200, 209, 0.2)',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
        }}>
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
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                    color: '#3E5E96',
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
                <InfoRow
                    icon={<MapPin size={10} weight="bold" color="#6E7881" />}
                    text={member.info}
                />
            </div>
        </div>
    );
}

function DriverGrid({ drivers }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
        }}>
            {drivers.map((d, i) => (
                <DriverCard key={i} member={d} />
            ))}
        </div>
    );
}

export default function OurTeam() {
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
            <section id="our-team-hero" style={{
                position: 'relative',
                width: '100%',
                height: '500px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 64px',
                overflow: 'hidden',
            }}>
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
                    style={{
                        position: 'absolute',
                        top: '32px',
                        left: '32px',
                        zIndex: 10,
                        width: '48px',
                        height: '48px',
                        borderRadius: '9999px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(189, 200, 209, 0.2)',
                        boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                    }}
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
                    maxWidth: '768px',
                    gap: '16px',
                }}>
                    <h1 style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: '48px',
                        lineHeight: '56px',
                        letterSpacing: '-0.96px',
                        color: '#FFFFFF',
                        margin: 0,
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
                        maxWidth: '847px',
                    }}>
                        A trusted local team dedicated to making your Bali family journey safe, comfortable and stress-free.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div style={{
                background: '#F8F9FA',
                padding: '0 0 128px',
            }}>
                {/* Support Team Section */}
                <section style={{
                    padding: '96px 40px',
                }}>
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
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: '24px',
                            flexWrap: 'wrap',
                            position: 'relative',
                            zIndex: 1,
                        }}>
                            {SUPPORT_TEAM.map((member, i) => (
                                <SupportCard key={i} member={member} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Drivers Section */}
                <section style={{
                    padding: '96px 64px 112px',
                    position: 'relative',
                }}>
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
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                            position: 'relative',
                            zIndex: 1,
                        }}>
                            <DriverGrid drivers={DRIVERS_ROW_1} />
                            <DriverGrid drivers={DRIVERS_ROW_2} />
                            <DriverGrid drivers={DRIVERS_ROW_3} />
                        </div>
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
