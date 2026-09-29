import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const FLEET = [
    {
        title: 'Toyota Avanza / Veloz',
        capacity: '1–4 Passengers',
        seats: '1 Car Seat',
        price: 'From Rp 600,000 / day',
        badge: null,
        img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
        shortDesc: 'Perfect for small families with 1 child. Compact and agile for navigating Bali\'s roads and traffic.',
        highlighted: false,
        details: {
            heading: 'Toyota Avanza / Veloz',
            description: 'The Toyota Avanza and its premium sibling Veloz are the most popular family cars in Bali. Compact yet comfortable, they handle narrow village roads and busy traffic with ease — ideal for small families who want a smooth, stress-free ride.',
            specs: [
                { label: 'Passenger Capacity', value: '1–4 passengers + driver' },
                { label: 'Car Seats', value: '1 certified child seat (capsule, toddler, or booster)' },
                { label: 'Luggage Space', value: '2 medium suitcases or 1 large + stroller' },
                { label: 'Air Conditioning', value: 'Dual-zone climate control' },
                { label: 'Entertainment', value: 'Bluetooth audio, USB charging ports' },
                { label: 'Fuel Type', value: 'Petrol (included in daily rate)' },
            ],
            features: [
                'Smooth suspension perfect for families with babies',
                'Foldable rear seats for extra luggage space',
                'Rear A/C vents keep children cool throughout',
                'Cleaned and sanitized before every trip',
                'USB charging ports for family devices',
                'Professional, English-speaking driver',
            ],
            bestFor: 'Small families (2 adults, 1–2 kids) for airport transfers, hotel transfers, and half-day tours.',
        },
    },
    {
        title: 'Toyota Innova Reborn',
        capacity: '1–6 Passengers',
        seats: '2 Car Seats',
        price: 'From Rp 800,000 / day',
        badge: 'MOST POPULAR',
        img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
        shortDesc: 'Spacious captain seats with extra luggage room for prams and suitcases. Ideal for families with 2 children.',
        highlighted: true,
        details: {
            heading: 'Toyota Innova Reborn',
            description: 'The Innova Reborn is Bali\'s premium family vehicle — spacious captain seats, smooth ride quality, and generous luggage space make it the top choice for families. Our fleet vehicles are kept in immaculate condition with regular maintenance.',
            specs: [
                { label: 'Passenger Capacity', value: '1–6 passengers + driver' },
                { label: 'Car Seats', value: '2 certified child seats available' },
                { label: 'Luggage Space', value: '3 large suitcases + stroller space' },
                { label: 'Air Conditioning', value: 'Tri-zone climate control with rear vents' },
                { label: 'Entertainment', value: 'Bluetooth audio, USB charging, rear entertainment' },
                { label: 'Fuel Type', value: 'Diesel (included in daily rate)' },
            ],
            features: [
                'Captain second-row seats with armrests for maximum comfort',
                'Extra legroom for long full-day tours',
                'Rear air-conditioning vents keep kids cool',
                'Quiet diesel engine for peaceful naps on the road',
                'Premium leather seats in selected vehicles',
                'Spacious boot for strollers, prams, and shopping',
            ],
            bestFor: 'Medium to large families (2–3 adults, 2+ kids) for full-day tours, multi-day trips, and airport transfers with lots of luggage.',
        },
    },
    {
        title: 'Toyota HiAce Commuter',
        capacity: '1–12 Passengers',
        seats: '3+ Car Seats',
        price: 'From Rp 1,200,000 / day',
        badge: null,
        img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
        shortDesc: 'Ideal for large or multi-generational families traveling together with strollers, prams and lots of luggage.',
        highlighted: false,
        details: {
            heading: 'Toyota HiAce Commuter',
            description: 'The HiAce is the ultimate people-mover for large families and group travel. With 12 comfortable seats and abundant luggage space, it handles everything from multi-generational family holidays to wedding guest transport.',
            specs: [
                { label: 'Passenger Capacity', value: '1–12 passengers + driver' },
                { label: 'Car Seats', value: '3+ certified child seats available' },
                { label: 'Luggage Space', value: 'Dedicated rear cargo area for 6+ bags' },
                { label: 'Air Conditioning', value: 'Full cabin climate control with dual A/C' },
                { label: 'Entertainment', value: 'Bluetooth audio, USB charging throughout' },
                { label: 'Fuel Type', value: 'Diesel (included in daily rate)' },
            ],
            features: [
                'High-roof cabin with standing room for easy child seat installation',
                'Individual reclining seats with armrests',
                'Wide sliding door for easy entry and exit',
                'Separate rear luggage compartment',
                'Professional driver experienced with large groups',
                'Perfect for combined transfers and tours',
            ],
            bestFor: 'Large families, multi-generational groups (4–12 people), and special events requiring group transport.',
        },
    },
];

function FleetModal({ vehicle, onClose }) {
    useEffect(() => {
        if (vehicle) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
                document.body.style.removeProperty('overflow');
            };
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.removeProperty('overflow');
        }
    }, [vehicle]);

    if (!vehicle) return null;
    const d = vehicle.details;

    const scrollToBooking = () => {
        onClose();
        setTimeout(() => {
            document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md modal-backdrop-anim"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 my-auto modal-panel-anim"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
                    <div>
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug m-0">
                            {d.heading}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                {vehicle.capacity}
                            </span>
                            <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                                {vehicle.seats}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors shrink-0 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
                    {/* Description */}
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed m-0">
                        {d.description}
                    </p>

                    {/* Specs 2-column grid */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                        {d.specs.slice(0, 4).map((spec, i) => (
                            <div key={i}>
                                <span className="text-slate-400 text-[11px] block">{spec.label}</span>
                                <span className="font-semibold text-slate-900 truncate block">{spec.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Key Features 2-column compact checklist */}
                    <div className="space-y-1">
                        <h4 className="font-bold text-slate-400 text-[11px] uppercase tracking-wider m-0">
                            Key Features
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                            {d.features.slice(0, 4).map((item, i) => (
                                <div key={i} className="flex items-start gap-1.5">
                                    <svg className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="leading-tight">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action button */}
                    <div className="pt-1">
                        <button
                            type="button"
                            onClick={scrollToBooking}
                            className="w-full py-2.5 bg-sky-900 hover:bg-sky-950 text-white font-bold rounded-xl shadow-md active:scale-[0.98] transition-all cursor-pointer text-xs sm:text-sm text-center"
                        >
                            Book This Vehicle Now
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function FleetSection({ vehicles = [] }) {
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const displayFleet = vehicles && vehicles.length > 0
        ? vehicles.map((car, i) => {
            const fallback = FLEET[i % FLEET.length];
            return {
                title: car.name,
                capacity: `1–${car.passenger_capacity || 6} Passengers`,
                seats: car.category?.includes('HiAce') ? '3+ Car Seats' : (car.passenger_capacity > 5 ? '2 Car Seats' : '1 Car Seat'),
                price: car.daily_rate ? `From Rp ${Number(car.daily_rate).toLocaleString()} / day` : fallback.price,
                badge: i === 1 ? 'MOST POPULAR' : null,
                img: car.photo_url || fallback.img,
                shortDesc: car.description || fallback.shortDesc,
                highlighted: i === 1,
                details: {
                    heading: car.name,
                    description: car.description || fallback.details.description,
                    specs: [
                        { label: 'Passenger Capacity', value: `1–${car.passenger_capacity || 6} passengers + driver` },
                        { label: 'Car Seats', value: car.passenger_capacity > 5 ? 'Up to 2 certified child seats' : '1 certified child seat' },
                        { label: 'Luggage Space', value: `${car.luggage_capacity || 3} medium/large suitcases + stroller` },
                        { label: 'Air Conditioning', value: car.ac_info || 'Dual-zone climate control with rear vents' },
                    ],
                    features: (car.key_features && Array.isArray(car.key_features) && car.key_features.length > 0)
                        ? car.key_features
                        : (car.features && car.features.length > 0 ? car.features : fallback.details.features),
                    bestFor: fallback.details.bestFor,
                },
            };
        })
        : FLEET;

    return (
        <section
            id="fleet"
            style={{
                background: '#F8F9FA',
                padding: '96px 40px',
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 64px',
                display: 'flex',
                flexDirection: 'column',
                gap: '48px',
            }}>
                {/* Header */}
                <div className="bfs-flex-header" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    maxWidth: '1072px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                }}>
                    <div style={{ maxWidth: '569px' }}>
                        <h2 style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            fontSize: '40px',
                            lineHeight: '48px',
                            color: '#191C1D',
                            margin: 0,
                            marginBottom: '16px',
                        }}>
                            Comfortable & Spacious Vehicle Fleet
                        </h2>
                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '28px',
                            color: '#3E4850',
                            margin: 0,
                        }}>
                            Modern, air-conditioned vehicles suited for families of all sizes with child car seat mounts
                        </p>
                    </div>
                </div>

                {/* 3 Fleet Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
                    {displayFleet.map((car, i) => (
                        <div
                            key={i}
                            className="group card-hover-fluid w-full bg-white border border-slate-200/70 hover:border-sky-300/80 shadow-xs rounded-2xl overflow-hidden relative flex flex-col"
                        >
                            {/* Badge */}
                            {car.badge && (
                                <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-amber-400 text-amber-950 px-3 py-1 rounded-full shadow-sm border border-amber-300">
                                    <svg className="w-3.5 h-3.5 text-amber-950 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-[11px] font-extrabold tracking-wider uppercase font-sans">
                                        {car.badge}
                                    </span>
                                </div>
                            )}

                            {/* Vehicle Image */}
                            <div className="img-zoom" style={{ height: '192px', background: '#EDEEEF', overflow: 'hidden' }}>
                                <img src={car.img} alt={car.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>

                            {/* Content */}
                            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 600,
                                    fontSize: '24px',
                                    lineHeight: '32px',
                                    color: '#191C1D',
                                    margin: 0,
                                    marginBottom: '4px',
                                }}>
                                    {car.title}
                                </h3>

                                {/* Capacity & seats */}
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                    <span style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 500,
                                        fontSize: '13px',
                                        color: '#3E4850',
                                        background: '#F3F4F5',
                                        borderRadius: '4px',
                                        padding: '2px 8px',
                                    }}>
                                        {car.capacity}
                                    </span>
                                    <span style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 500,
                                        fontSize: '13px',
                                        color: '#00658D',
                                        background: 'rgba(0,101,141,0.08)',
                                        borderRadius: '4px',
                                        padding: '2px 8px',
                                    }}>
                                        {car.seats}
                                    </span>
                                </div>


                                <p style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '16px',
                                    lineHeight: '24px',
                                    color: '#3E4850',
                                    margin: 0,
                                    flex: 1,
                                }}>
                                    {car.shortDesc}
                                </p>

                                {/* View Details button */}
                                <div style={{
                                    paddingTop: '16px',
                                    marginTop: '24px',
                                    borderTop: '1px solid #E1E3E4',
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedVehicle(car)}
                                        className="btn-secondary-hover-fluid inline-flex items-center justify-center px-4 py-2 rounded-xl text-white font-medium text-xs bg-[#3E5E96] hover:bg-[#2e4f82] cursor-pointer shadow-xs"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fleet Detail Modal */}
            <FleetModal
                vehicle={selectedVehicle}
                onClose={() => setSelectedVehicle(null)}
            />
        </section>
    );
}
