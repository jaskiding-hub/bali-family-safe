import React from 'react';

export default function AboutSection({ aboutContent = null }) {
    if (!aboutContent || !aboutContent.description) {
        return null;
    }

    const content = aboutContent;
    const paragraphs = (content.description || '').split('\n\n');

    return (
        <section
            id="about"
            style={{
                width: '100%',
                background: '#FFFFFF',
                padding: '96px 104px',
            }}
        >
            <div className="bfs-about-flex" style={{
                maxWidth: '1072px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '48px',
            }}>
                {/* Left: Photo */}
                <div
                    className="card-hover-fluid img-zoom"
                    style={{
                        flex: '1 1 0',
                        maxWidth: '512px',
                        height: '500px',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0px 10px 25px -5px rgba(0,76,107,0.12), 0px 8px 10px -6px rgba(0,0,0,0.06)',
                        flexShrink: 0,
                    }}
                >
                    <img
                        src={content.image_url}
                        alt="Bali Family Safe Team and Vehicle"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                {/* Right: Content */}
                <div style={{
                    flex: '1 1 0',
                    maxWidth: '512px',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {/* ABOUT US tag */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: 'rgba(0, 174, 239, 0.2)',
                            borderRadius: '9999px',
                            padding: '4px 16px',
                        }}>
                            <span style={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                fontSize: '12px',
                                lineHeight: '16px',
                                letterSpacing: '0.6px',
                                textTransform: 'uppercase',
                                color: '#00658D',
                            }}>
                                ABOUT US
                            </span>
                        </div>
                    </div>

                    {/* H2 */}
                    <h2 style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '40px',
                        lineHeight: '48px',
                        color: '#191C1D',
                        margin: 0,
                        marginBottom: '24px',
                        maxWidth: '492px',
                    }}>
                        {content.title}
                    </h2>

                    {/* Description paragraphs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                        {paragraphs.map((para, i) => (
                            <p key={i} style={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 400,
                                fontSize: '18px',
                                lineHeight: '28px',
                                color: '#3E4850',
                                margin: 0,
                            }}>
                                {para}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
