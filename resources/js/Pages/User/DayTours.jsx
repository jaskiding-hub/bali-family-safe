import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Footer from '../../Components/User/Footer';
import FloatingWhatsApp from '../../Components/User/FloatingWhatsApp';
import { CaretLeft } from '@phosphor-icons/react';

function TourCard({ tour }) {
    const tourLink = `/tours/${tour.slug || tour.id}`;
    const tourTitle = tour.title || tour.name;
    const tourImg = tour.image || tour.hero_image || tour.photo_url || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80';
    const tourDesc = tour.subtitle || tour.description;
    const tourPrice = tour.price || tour.regular_price_formatted || (tour.regular_price ? 'Rp ' + Number(tour.regular_price).toLocaleString('id-ID') : '');

    const scrollToBooking = (tourId) => {
        window.location.href = `/#booking?tour=${tourId}`;
    };

    return (
        <div className="w-full bg-white border border-slate-200/70 hover:border-sky-300/80 shadow-xs rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            {/* Image */}
            <Link href={tourLink} className="block" style={{ height: '192px', background: '#EDEEEF', overflow: 'hidden' }}>
                <img 
                    src={tourImg} 
                    alt={tourTitle} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80';
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
            </Link>

            {/* Content */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Link
                    href={tourLink}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
                    <h3 style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '24px',
                        lineHeight: '32px',
                        color: '#191C1D',
                        margin: 0,
                        marginBottom: '8px',
                    }}>
                        {tourTitle}
                    </h3>
                </Link>

                {tourPrice && (
                    <div style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '15px',
                        color: '#00658D',
                        marginBottom: '8px',
                    }}>
                        {tourPrice}
                    </div>
                )}

                <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#3E4850',
                    margin: 0,
                    flex: 1,
                }}>
                    {tourDesc}
                </p>

                {/* Horizontal border + Buttons */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px',
                    paddingTop: '16px',
                    marginTop: '24px',
                    borderTop: '1px solid #E1E3E4',
                }}>
                    <Link
                        href={tourLink}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-[#00658D] font-medium text-xs bg-white hover:bg-slate-50 border border-[#00658D] cursor-pointer shadow-xs transition-all"
                    >
                        View Details
                    </Link>
                    <button
                        type="button"
                        onClick={() => scrollToBooking(tour.id)}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-white font-medium text-xs bg-[#00658D] hover:bg-[#004d6b] cursor-pointer shadow-xs transition-all"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function DayTours({ packages = [] }) {
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
                <title>All Day Tours – Bali Family Safe Tours</title>
                <meta name="description" content="Explore all our private day tour packages in Bali with family-safe features." />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>

            {/* Header Section */}
            <section id="day-tours-hero" className="relative w-full h-[380px] sm:h-[500px] flex flex-col justify-center items-center px-4 sm:px-8 overflow-hidden">
                {/* Background image */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0,
                }} />

                {/* Gradient overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)',
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
                        transition: 'transform 0.15s ease, background 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    title="Back to Home"
                >
                    <CaretLeft size={20} weight="bold" color="#191C1D" />
                </Link>

                {/* Header Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    maxWidth: '800px',
                    padding: '0 24px',
                }}>
                    <div className="inline-flex items-center px-3.5 py-1 bg-[#001B40]/60 border border-[#C6E7FF]/25 backdrop-blur-xs rounded-full mb-3.5 shadow-xs">
                        <span className="font-['Inter'] font-semibold text-xs tracking-widest uppercase text-[#82CFFF]">
                            EXPLORE BALI
                        </span>
                    </div>

                    <h1 className="font-['Inter'] font-bold text-3xl sm:text-4xl lg:text-[42px] lg:leading-[50px] text-white tracking-tight mb-3 drop-shadow-md">
                        All Day Tour Packages
                    </h1>

                    <p className="font-['Inter'] font-medium text-sm sm:text-base lg:text-lg text-slate-100/95 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
                        Choose your perfect Bali adventure with private driver and family-safe transport
                    </p>
                </div>
            </section>

            {/* Tours Grid Section */}
            <section style={{
                background: '#F8F9FA',
                padding: '96px 40px',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}>
                    {packages.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {packages.map((tour, i) => (
                                <TourCard key={tour.id || i} tour={tour} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-slate-500 text-lg">No tour packages available at the moment.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
            <FloatingWhatsApp />
        </div>
    );
}
