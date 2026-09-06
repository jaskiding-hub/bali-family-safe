import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Footer from '../../Components/User/Footer';
import FloatingWhatsApp from '../../Components/User/FloatingWhatsApp';
import BookingModal from '../../Components/User/BookingModal';
import { getTourById, TOUR_PACKAGES } from '../../data/user/tours';
import { CaretLeft, ArrowRight } from '@phosphor-icons/react';

// Custom inline SVG icons for maximum compatibility & zero build errors
const IconPalette = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill={color} />
        <circle cx="17.5" cy="10.5" r=".5" fill={color} />
        <circle cx="8.5" cy="7.5" r=".5" fill={color} />
        <circle cx="6.5" cy="12.5" r=".5" fill={color} />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.72 1.7-1.65 0-.43-.17-.83-.46-1.13-.28-.3-.46-.7-.46-1.17 0-.92.75-1.65 1.67-1.65H16c3.3 0 6-2.7 6-6 0-4.75-4.5-8.4-10-8.4z" />
    </svg>
);

const IconTree = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19v3M12 3L5 13h4l-3 6h12l-3-6h4L12 3z" />
    </svg>
);

const IconHeart = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const IconBuilding = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
);

const IconDrop = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
);

const IconCamera = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const IconMountain = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
    </svg>
);

const IconFire = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" />
    </svg>
);

const IconUtensils = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2M15 2v20M5 2v10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V2M7 2v20" />
    </svg>
);

const IconSparkle = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const IconWaves = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
);

const IconSun = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
);

const IconShoppingBag = ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
);

export default function TourDetail({ tourId }) {
    const tour = getTourById(tourId);
    // Fallback to first tour if no match found or id is missing
    const safeTour = tour || TOUR_PACKAGES[0];
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    // Map tag icon string to component
    const renderTagIcon = (iconName) => {
        const size = 14;
        const color = '#003E58';
        switch (iconName) {
            case 'palette': return <IconPalette size={size} color={color} />;
            case 'tree': return <IconTree size={size} color={color} />;
            case 'heart': return <IconHeart size={size} color={color} />;
            case 'landmark': case 'historic': return <IconBuilding size={size} color={color} />;
            case 'drop': return <IconDrop size={size} color={color} />;
            case 'camera': return <IconCamera size={size} color={color} />;
            case 'mountain': return <IconMountain size={size} color={color} />;
            case 'fire': return <IconFire size={size} color={color} />;
            case 'utensils': case 'food': return <IconUtensils size={size} color={color} />;
            default: return <IconSparkle size={size} color={color} />;
        }
    };

    // Map highlight badge icon
    const renderBadgeIcon = (iconName) => {
        const size = 18;
        const color = '#00658D';
        switch (iconName) {
            case 'tree': case 'monkey': return <IconTree size={size} color={color} />;
            case 'mountain': return <IconMountain size={size} color={color} />;
            case 'shopping-bag': return <IconShoppingBag size={size} color={color} />;
            case 'sparkles': case 'sparkle': return <IconSparkle size={size} color={color} />;
            case 'waves': return <IconWaves size={size} color={color} />;
            case 'sun': return <IconSun size={size} color={color} />;
            case 'landmark': case 'historic': return <IconBuilding size={size} color={color} />;
            case 'utensils': case 'food': return <IconUtensils size={size} color={color} />;
            default: return <IconSparkle size={size} color={color} />;
        }
    };

    const handleBookingClick = () => {
        const title = tour?.title || 'Ubud Cultural & Gentle Waterfall Family Tour';
        const price = tour?.price || 'Rp 850,000';
        const msg = `Hi Bali Family Safe! I'd like to book the ${title} (${price}).`;
        window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, '_blank');
    };

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
                <title>{`${tour?.heroTitle || 'Bali Family Safe Tours'} – Bali Family Safe Tours`}</title>
                <meta name="description" content={tour?.description || 'Bali tour packages with family-safe features'} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>

            {/* Main content wrapper */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>

                {/* HERO HEADER SECTION */}
                <section style={{
                    position: 'relative',
                    width: '100vw',
                    marginLeft: 'calc(-50vw + 50%)',
                    minHeight: '520px',
                    background: '#1a1a1a',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '120px 24px 140px',
                    overflow: 'hidden'
                }}>
                    {/* Background image */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${tour?.heroImage || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 0,
                    }} />

                    {/* Subtle dark gradient for text readability */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 100%)',
                        zIndex: 1,
                    }} />

                    {/* Back Button */}
                    <Link
                        href="/#tours"
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
                            transition: 'transform 0.15s ease, background 0.15s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        title="Back to Tours"
                    >
                        <CaretLeft size={20} weight="bold" color="#191C1D" />
                    </Link>

                    {/* Header Content Container */}
                    <div style={{
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        maxWidth: '1200px',
                        width: '100%',
                        padding: '0 24px',
                    }}>
                        {/* Tag Pill */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '6px 16px',
                            background: 'rgba(0, 27, 64, 0.5)',
                            border: '1px solid rgba(198, 231, 255, 0.2)',
                            backdropFilter: 'blur(2px)',
                            WebkitBackdropFilter: 'blur(2px)',
                            borderRadius: '9999px',
                            marginBottom: '16px',
                        }}>
                            <span style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600,
                                fontSize: '14px',
                                lineHeight: '20px',
                                letterSpacing: '2.8px',
                                textTransform: 'uppercase',
                                color: '#82CFFF',
                            }}>
                                {tour?.heroTag || 'DESTINATION GUIDE'}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            fontSize: '64px',
                            lineHeight: '72px',
                            letterSpacing: '-1.8px',
                            color: '#FFFFFF',
                            filter: 'drop-shadow(0px 4px 3px rgba(0, 0, 0, 0.1)) drop-shadow(0px 10px 8px rgba(0, 0, 0, 0.04))',
                            margin: '0 0 16px 0',
                            maxWidth: '900px',
                        }}>
                            {tour?.heroTitle || 'Explore Ubud'}
                        </h1>

                        {/* Subtitle */}
                        <p style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '24px',
                            lineHeight: '32px',
                            color: '#F8F9FA',
                            filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.06)) drop-shadow(0px 4px 3px rgba(0, 0, 0, 0.07))',
                            margin: 0,
                            maxWidth: '672px',
                        }}>
                            {tour?.heroSubtitle || 'The Cultural and Spiritual Heart of Bali'}
                        </p>
                    </div>
                </section>

                {/* OVERVIEW SECTION CARD */}
                <section style={{
                    maxWidth: '1200px',
                    margin: '-80px auto 0',
                    padding: '0 24px 96px',
                    position: 'relative',
                    zIndex: 5,
                }}>
                    <div style={{
                        maxWidth: '1072px',
                        margin: '0 auto',
                        background: '#F8F9FA',
                        border: '1px solid rgba(189, 200, 209, 0.3)',
                        boxShadow: '0px 20px 40px rgba(0, 45, 99, 0.06)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderRadius: '16px',
                        padding: '48px',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '48px',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}>
                        {/* Left Info Column */}
                        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            {/* Accent Bar */}
                            <div style={{
                                width: '64px',
                                height: '4px',
                                background: '#00658D',
                                borderRadius: '9999px',
                                marginBottom: '16px',
                            }} />

                            {/* Heading 2 */}
                            <h2 style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 700,
                                fontSize: '32px',
                                lineHeight: '40px',
                                color: '#191C1D',
                                margin: '0 0 16px 0',
                            }}>
                                {tour?.overviewTitle || 'Immerse Yourself in Balinese Heritage'}
                            </h2>

                            {/* Paragraph 1 */}
                            <p style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                fontSize: '18px',
                                lineHeight: '29px',
                                color: '#3E4850',
                                margin: '0 0 16px 0',
                            }}>
                                {tour?.overviewParagraph1 || 'Nestled among lush rice paddies and steep ravines in the central foothills of the Gianyar regency, Ubud is Bali\'s undisputed cultural center.'}
                            </p>

                            {/* Paragraph 2 */}
                            <p style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                fontSize: '16px',
                                lineHeight: '26px',
                                color: '#3E4850',
                                margin: '0 0 24px 0',
                            }}>
                                {tour?.overviewParagraph2 || 'From intricate temple architecture and traditional dance performances to world-class yoga retreats and farm-to-table dining, Ubud offers a profound connection to the island\'s soul.'}
                            </p>

                            {/* Category Tags */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '12px',
                                flexWrap: 'wrap',
                                marginBottom: '32px',
                            }}>
                                {tour.overviewTags?.map((tag, idx) => (
                                    <div key={idx} style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: '8px 16px',
                                        gap: '6px',
                                        background: 'rgba(198, 231, 255, 0.3)',
                                        borderRadius: '9999px',
                                    }}>
                                        {renderTagIcon(tag.icon)}
                                        <span style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 500,
                                            fontSize: '12px',
                                            lineHeight: '16px',
                                            color: '#003E58',
                                        }}>
                                            {tag.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Booking Now Button */}
                            <button
                                type="button"
                                onClick={handleBookingClick}
                                style={{
                                    display: 'inline-flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '16px 32px',
                                    gap: '12px',
                                    background: '#00658D',
                                    borderRadius: '9999px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                                    transition: 'background 0.2s ease, transform 0.15s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = '#004f6e';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = '#00658D';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <span style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 500,
                                    fontSize: '18px',
                                    lineHeight: '27px',
                                    color: '#FFFFFF',
                                }}>
                                    Booking Now
                                </span>
                                <ArrowRight size={18} weight="bold" color="#FFFFFF" />
                            </button>
                        </div>

                        {/* Right Image Frame */}
                        <div style={{
                            position: 'relative',
                            width: '375px',
                            height: '400px',
                            maxWidth: '100%',
                            flexShrink: 0,
                        }}>
                            {/* Accent Soft Blue Offset Frame */}
                            <div style={{
                                position: 'absolute',
                                top: '16px',
                                right: '-16px',
                                bottom: '-16px',
                                left: '16px',
                                background: 'rgba(0, 101, 141, 0.1)',
                                borderRadius: '16px',
                                zIndex: 0,
                            }} />

                            {/* Main Image */}
                            <img
                                src={tour?.overviewImage || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62'}
                                alt={tour?.overviewTitle || 'Ubud Cultural Tour'}
                                style={{
                                    position: 'relative',
                                    zIndex: 1,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(189, 200, 209, 0.2)',
                                    boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* HIGHLIGHTS SECTION */}
                <section style={{
                    background: '#F3F4F5',
                    borderTop: '1px solid rgba(189, 200, 209, 0.3)',
                    padding: '96px 40px',
                }}>
                    <div style={{
                        maxWidth: '1072px',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        {/* Section Header */}
                        <h3 style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            fontSize: '32px',
                            lineHeight: '40px',
                            color: '#191C1D',
                            textAlign: 'center',
                            margin: '0 0 16px 0',
                        }}>
                            {tour?.highlightsTitle || 'Top Highlights in Ubud'}
                        </h3>

                        <p style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '24px',
                            color: '#3E4850',
                            textAlign: 'center',
                            maxWidth: '672px',
                            margin: '0 0 64px 0',
                        }}>
                            {tour?.highlightsSubtitle || 'Discover the must-visit locations that make Ubud a world-renowned destination for families and explorers alike.'}
                        </p>

                        {/* Highlights 3 Cards Grid */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: '24px',
                            width: '100%',
                            flexWrap: 'wrap',
                        }}>
                            {tour.highlights?.map((highlight, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: '1 1 300px',
                                        maxWidth: '341px',
                                        height: '442px',
                                        background: '#F8F9FA',
                                        border: '1px solid #E1E3E4',
                                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    {/* Image with Badge */}
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '256px',
                                        overflow: 'hidden',
                                        background: '#E1E3E4',
                                    }}>
                                        <img
                                            src={highlight.image}
                                            alt={highlight.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />

                                        {/* Overlay Badge Button */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '16px',
                                            right: '16px',
                                            width: '36px',
                                            height: '38px',
                                            background: 'rgba(248, 249, 250, 0.9)',
                                            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                                            backdropFilter: 'blur(2px)',
                                            WebkitBackdropFilter: 'blur(2px)',
                                            borderRadius: '9999px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 2,
                                        }}>
                                            {renderBadgeIcon(highlight.badgeIcon)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div style={{
                                        padding: '24px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flex: 1,
                                    }}>
                                        <h4 style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 600,
                                            fontSize: '24px',
                                            lineHeight: '32px',
                                            color: '#191C1D',
                                            margin: '0 0 8px 0',
                                        }}>
                                            {highlight?.title || 'Highlight'}
                                        </h4>

                                        <p style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 400,
                                            fontSize: '16px',
                                            lineHeight: '24px',
                                            color: '#3E4850',
                                            margin: 0,
                                        }}>
                                            {highlight?.desc || 'No description available'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <Footer />

            {/* Floating WhatsApp */}
            <FloatingWhatsApp />

            {/* Booking Modal */}
            {isBookingOpen && (
                <BookingModal
                    isOpen={isBookingOpen}
                    onClose={() => setIsBookingOpen(false)}
                    bookingData={{
                        type: tour?.title || 'Ubud Cultural & Gentle Waterfall Family Tour',
                        pickupLocation: 'Hotel in Bali / Airport',
                        dropoffLocation: tour?.heroTitle || 'Explore Ubud',
                        estimatedPrice: tour?.price || 'Rp 850,000',
                        adults: 2,
                        children: 1,
                        carSeatTypes: ['Child Booster Seat'],
                    }}
                />
            )}
        </div>
    );
}
