import React from 'react';

// Figma: Section (Why Families Choose Us) — bg #F8F9FA, padding 96px 40px
// 4 Cards: bg #FFFFFF, border rgba(189,200,209,0.2), borderRadius 8px
// Icon circle: bg rgba(0,174,239,0.2), 64px, icon #00658D
// Card title: 24px semibold #00658D
// Card text: 16px regular #3E4850

export default function WhyChooseUsSection({ siteFeatures = [] }) {
    const defaultIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#00658D">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
    );

    const displayPillars = siteFeatures && siteFeatures.length > 0
        ? siteFeatures.map((f) => ({
            title: f.title,
            desc: f.description || '',
            icon: defaultIcon,
        }))
        : [];

    return (
        <section
            id="why-us"
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
                gap: '64px',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '40px',
                        lineHeight: '48px',
                        color: '#000000',
                        margin: 0,
                        marginBottom: '16px',
                    }}>
                        Why Families Choose Us
                    </h2>
                    <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '28px',
                        color: '#3E4850',
                        margin: 0,
                        maxWidth: '672px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>
                        Here is why hundreds of traveling families trust us for their Bali transport
                    </p>
                </div>

                {/* Cards Row */}
                {displayPillars.length > 0 ? (
                    <div className="bfs-row" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: '32px',
                        maxWidth: '1072px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        width: '100%',
                        flexWrap: 'wrap',
                    }}>
                        {displayPillars.map((pillar, i) => (
                            <div
                                key={i}
                                className="card-hover-fluid group"
                                style={{
                                    flex: '1 1 0',
                                    minWidth: '240px',
                                    maxWidth: '336px',
                                    background: '#FFFFFF',
                                    border: '1px solid rgba(189,200,209,0.3)',
                                    boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                                    borderRadius: '12px',
                                    padding: '28px 24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    minHeight: '318px',
                                }}
                            >
                                {/* Icon circle */}
                                <div
                                    className="transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-md group-hover:shadow-sky-500/20"
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        background: 'rgba(0, 174, 239, 0.15)',
                                        borderRadius: '9999px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '24px',
                                        flexShrink: 0,
                                    }}
                                >
                                    {pillar.icon}
                                </div>

                                {/* Title */}
                                <h3 style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 600,
                                    fontSize: '24px',
                                    lineHeight: '32px',
                                    color: '#00658D',
                                    margin: 0,
                                    marginBottom: '12px',
                                }}>
                                    {pillar.title}
                                </h3>

                                {/* Description */}
                                <p style={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '16px',
                                    lineHeight: '24px',
                                    color: '#3E4850',
                                    margin: 0,
                                }}>
                                    {pillar.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '48px 16px', color: '#6E7881', fontSize: '14px' }}>
                        Belum ada informasi keunggulan yang ditampilkan.
                    </div>
                )}
            </div>
        </section>
    );
}
