import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '../../Components/User/Navbar';
import Hero from '../../Components/User/Hero';
import CarSeatsSection from '../../Components/User/CarSeatsSection';
import AboutSection from '../../Components/User/AboutSection';
import WhyChooseUsSection from '../../Components/User/WhyChooseUsSection';
import DriversSection from '../../Components/User/DriversSection';
import ServicesSection from '../../Components/User/ServicesSection';
import TourPackagesSection from '../../Components/User/TourPackagesSection';
import FleetSection from '../../Components/User/FleetSection';
import GallerySection from '../../Components/User/GallerySection';
import TestimonialsSection from '../../Components/User/TestimonialsSection';
import FaqSection from '../../Components/User/FaqSection';
import Footer from '../../Components/User/Footer';
import FloatingWhatsApp from '../../Components/User/FloatingWhatsApp';
import ScrollReveal from '../../Components/User/ScrollReveal';

export default function Home({
    packages = [],
    services = [],
    vehicles = [],
    vehicles_for_booking = [],
    testimonials = [],
    faqs = [],
    gallery = [],
    site_features = [],
    site_settings = null,
    team_members = [],
    child_seat_types = [],
    about_content = null,
    car_seat_content = [],
}) {
    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            background: '#F8F9FA',
            minHeight: '100vh',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
        }}>
            <Head>
                <title>{site_settings?.hero_headline ? `${site_settings.hero_headline} – Bali Family Safe Tours` : 'Bali Family Safe – Airport Transfers & Private Tours with Free Child Car Seats'}</title>
                <meta
                    name="description"
                    content="Reliable, sanitized family transfers and private drivers in Bali with complimentary certified child car seats (capsule, toddler, booster). Police-cleared English-speaking drivers."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* Google Fonts: Inter */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>

            {/* Sticky Navbar */}
            <Navbar siteSettings={site_settings} />

            {/* Hero — includes BookingWidget */}
            <Hero
                siteSettings={site_settings}
                packages={packages}
                childSeatTypes={child_seat_types}
                vehicles={vehicles_for_booking.length > 0 ? vehicles_for_booking : vehicles}
            />

            {/* Main content sections */}
            <main>
                <ScrollReveal><CarSeatsSection carSeatContent={car_seat_content} /></ScrollReveal>
                <ScrollReveal><AboutSection aboutContent={about_content} /></ScrollReveal>
                <ScrollReveal><WhyChooseUsSection siteFeatures={site_features} /></ScrollReveal>
                <ScrollReveal><DriversSection teamMembers={team_members} /></ScrollReveal>
                <ScrollReveal><ServicesSection services={services} /></ScrollReveal>
                <ScrollReveal><TourPackagesSection packages={packages} /></ScrollReveal>
                <ScrollReveal><FleetSection vehicles={vehicles} /></ScrollReveal>
                <ScrollReveal><GallerySection gallery={gallery} /></ScrollReveal>
                <ScrollReveal><TestimonialsSection testimonials={testimonials} /></ScrollReveal>
                <ScrollReveal><FaqSection faqs={faqs} /></ScrollReveal>
            </main>

            {/* Footer */}
            <Footer siteSettings={site_settings} />

            {/* Floating WhatsApp button */}
            <FloatingWhatsApp siteSettings={site_settings} />
        </div>
    );
}
