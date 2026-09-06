import React from 'react';

export default function GallerySection() {
    const photos = [
        {
            src: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80',
            alt: 'Sanitized child safety car seat installation',
            big: true,
        },
        {
            src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
            alt: 'Clean BFS family vehicle fleet',
        },
        {
            src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
            alt: 'Family airport greeting in Bali',
        },
    ];

    return (
        <section
            id="gallery"
            style={{
                background: '#FFFFFF',
                padding: '96px 40px',
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 64px',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2 style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '40px',
                        lineHeight: '48px',
                        color: '#191C1D',
                        margin: 0,
                        marginBottom: '16px',
                    }}>
                        Photo Gallery
                    </h2>
                    <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '28px',
                        color: '#3E4850',
                        margin: 0,
                    }}>
                        Real moments with our happy families and sanitized child safety setups
                    </p>
                </div>

                {/* Asymmetric Grid — Figma: 1 large left (7 cols) + 2 stacked right (5 cols) */}
                <div className="bfs-gallery-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '7fr 5fr',
                    gridTemplateRows: '1fr 1fr',
                    gap: '16px',
                    height: '440px',
                    maxWidth: '1072px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    {/* Big Photo — spans 2 rows */}
                    <div style={{
                        gridColumn: '1',
                        gridRow: '1 / 3',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#E1E3E4',
                        boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.1)',
                    }}>
                        <img
                            src={photos[0].src}
                            alt={photos[0].alt}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    </div>

                    {/* Top right photo */}
                    <div style={{
                        gridColumn: '2',
                        gridRow: '1',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#E1E3E4',
                        boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.1)',
                    }}>
                        <img
                            src={photos[1].src}
                            alt={photos[1].alt}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    </div>

                    {/* Bottom right photo */}
                    <div style={{
                        gridColumn: '2',
                        gridRow: '2',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#E1E3E4',
                        boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.1)',
                    }}>
                        <img
                            src={photos[2].src}
                            alt={photos[2].alt}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
