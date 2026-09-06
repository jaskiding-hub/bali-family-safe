import React, { useState } from 'react';

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
                'Fuel-efficient for cost-effective full-day tours',
                'Easy access for loading child car seats',
                'Well-maintained and regularly serviced',
                'Ideal for 2 adults + 1–2 children',
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
    if (!vehicle) return null;
    const d = vehicle.details;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    maxWidth: '640px',
                    width: '100%',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '32px 32px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}>
                    <div>
                        <h2 style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            fontSize: '24px',
                            lineHeight: '32px',
                            color: '#191C1D',
                            margin: '0 0 8px 0',
                        }}>
                            {d.heading}
                        </h2>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                                fontSize: '13px',
                                color: '#3E4850',
                                background: '#F3F4F5',
                                borderRadius: '4px',
                                padding: '2px 8px',
                            }}>
                                {vehicle.capacity}
                            </span>
                            <span style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                                fontSize: '13px',
                                color: '#00658D',
                                background: 'rgba(0,101,141,0.08)',
                                borderRadius: '4px',
                                padding: '2px 8px',
                            }}>
                                {vehicle.seats}
                            </span>
                            <span style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 700,
                                fontSize: '13px',
                                color: '#00658D',
                                padding: '2px 0',
                            }}>
                                {vehicle.price}
                            </span>
                        </div>
                    </div>
                    {/* Close button */}
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '9999px',
                            border: 'none',
                            background: '#F3F4F5',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#E1E3E4'}
                        onMouseLeave={e => e.currentTarget.style.background = '#F3F4F5'}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1L13 13M13 1L1 13" stroke="#3E4850" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px 32px 32px' }}>
                    {/* Description */}
                    <p style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '26px',
                        color: '#3E4850',
                        margin: '0 0 24px 0',
                    }}>
                        {d.description}
                    </p>

                    {/* Specs grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        marginBottom: '24px',
                    }}>
                        {d.specs.map((spec, i) => (
                            <div key={i} style={{
                                background: '#F8F9FA',
                                border: '1px solid rgba(189, 200, 209, 0.3)',
                                borderRadius: '8px',
                                padding: '10px 14px',
                            }}>
                                <div style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 500,
                                    fontSize: '11px',
                                    lineHeight: '16px',
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    color: '#6E7881',
                                    marginBottom: '2px',
                                }}>
                                    {spec.label}
                                </div>
                                <div style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontWeight: 500,
                                    fontSize: '13px',
                                    lineHeight: '20px',
                                    color: '#191C1D',
                                }}>
                                    {spec.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Features list */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: '16px',
                            lineHeight: '24px',
                            color: '#191C1D',
                            margin: '0 0 12px 0',
                        }}>
                            Key Features
                        </h3>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}>
                            {d.features.map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#00658D" style={{ flexShrink: 0, marginTop: '2px' }}>
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                    </svg>
                                    <span style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        lineHeight: '22px',
                                        color: '#3E4850',
                                    }}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Best For */}
                    <div style={{
                        background: 'rgba(0, 101, 141, 0.05)',
                        border: '1px solid rgba(0, 101, 141, 0.12)',
                        borderRadius: '8px',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#00658D" style={{ flexShrink: 0, marginTop: '1px' }}>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                        </svg>
                        <div>
                            <div style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 600,
                                fontSize: '12px',
                                lineHeight: '16px',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                                color: '#00658D',
                                marginBottom: '4px',
                            }}>
                                Best For
                            </div>
                            <div style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '22px',
                                color: '#3E4850',
                            }}>
                                {d.bestFor}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FleetSection() {
    const [selectedVehicle, setSelectedVehicle] = useState(null);

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
                <div className="bfs-row" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: '32px',
                    maxWidth: '1072px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                }}>
                    {FLEET.map((car, i) => (
                        <div
                            key={i}
                            style={{
                                flex: '1 1 0',
                                maxWidth: '336px',
                                background: '#FFFFFF',
                                border: car.highlighted ? '1px solid rgba(0,101,141,0.2)' : '1px solid rgba(189,200,209,0.2)',
                                boxShadow: '0px 10px 30px rgba(0, 45, 99, 0.04)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                            }}
                        >
                            {/* Badge */}
                            {car.badge && (
                                <div style={{
                                    position: 'absolute',
                                    top: '17px',
                                    right: '17px',
                                    background: '#FEDD00',
                                    boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                                    borderRadius: '9999px',
                                    padding: '4px 12px',
                                    zIndex: 2,
                                }}>
                                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '12px', color: '#191C1D' }}>
                                        {car.badge}
                                    </span>
                                </div>
                            )}

                            {/* Vehicle Image */}
                            <div style={{ height: '192px', background: '#EDEEEF', overflow: 'hidden' }}>
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

                                {/* Starting price */}
                                <div style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    color: '#00658D',
                                    marginBottom: '8px',
                                }}>
                                    {car.price}
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
                                        style={{
                                            padding: '8px 16px',
                                            height: '32px',
                                            background: '#3E5E96',
                                            borderRadius: '8px',
                                            border: 'none',
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 500,
                                            fontSize: '12px',
                                            lineHeight: '16px',
                                            color: '#FFFFFF',
                                            cursor: 'pointer',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#2e4f82'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#3E5E96'}
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
