import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '../../Components/User/Navbar';
import Hero from '../../Components/User/Hero';
import CarSeatsSection from '../../Components/User/CarSeatsSection';
import AboutSection from '../../Components/User/AboutSection';
import DriversSection from '../../Components/User/DriversSection';
import FeaturesSection from '../../Components/User/FeaturesSection';
import WhyChooseUsSection from '../../Components/User/WhyChooseUsSection';
import ServicesSection from '../../Components/User/ServicesSection';
import TourPackagesSection from '../../Components/User/TourPackagesSection';
import FleetSection from '../../Components/User/FleetSection';
import GallerySection from '../../Components/User/GallerySection';
import TestimonialsSection from '../../Components/User/TestimonialsSection';
import FaqSection from '../../Components/User/FaqSection';
import Footer from '../../Components/User/Footer';
import FloatingWhatsApp from '../../Components/User/FloatingWhatsApp';
import ScrollReveal from '../../Components/User/ScrollReveal';

export default function Home() {
    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            background: '#F8F9FA',
            minHeight: '100vh',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
        }}>
            <Head>
                <title>Bali Family Safe – Airport Transfers &amp; Private Tours with Free Child Car Seats</title>
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
            <Navbar />

            {/* Hero — includes BookingWidget */}
            <Hero />

            {/* Main content sections */}
            <main>
                <ScrollReveal><CarSeatsSection /></ScrollReveal>
                <ScrollReveal><AboutSection /></ScrollReveal>
                <ScrollReveal><DriversSection /></ScrollReveal>
                <ScrollReveal><FeaturesSection /></ScrollReveal>
                <ScrollReveal><WhyChooseUsSection /></ScrollReveal>
                <ScrollReveal><ServicesSection /></ScrollReveal>
                <ScrollReveal><TourPackagesSection /></ScrollReveal>
                <ScrollReveal><FleetSection /></ScrollReveal>
                <ScrollReveal><GallerySection /></ScrollReveal>
                <ScrollReveal><TestimonialsSection /></ScrollReveal>
                <ScrollReveal><FaqSection /></ScrollReveal>
            </main>

            {/* Footer */}
            <Footer />

            {/* Floating WhatsApp button */}
            <FloatingWhatsApp />
        </div>
    );
}
