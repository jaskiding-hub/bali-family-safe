import React from 'react';

export default function GallerySection({ gallery = [] }) {
    const defaultPhotos = [
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

    const photos = gallery && gallery.length >= 3
        ? [
            { src: gallery[0].image_url, alt: gallery[0].caption || 'Family safe transport', big: true },
            { src: gallery[1].image_url, alt: gallery[1].caption || 'Armada & child seats' },
            { src: gallery[2].image_url, alt: gallery[2].caption || 'Happy family in Bali' },
        ]
        : defaultPhotos;

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

                {/* Asymmetric Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[440px] max-w-5xl mx-auto w-full">
                    {/* Big Photo — Spans 7 cols on desktop, 1 col on mobile */}
                    <div className="md:col-span-7 md:row-span-2 h-64 md:h-full rounded-2xl overflow-hidden shadow-sm bg-slate-200">
                        <img
                            src={photos[0].src}
                            alt={photos[0].alt}
                            className="w-full h-full object-cover block hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Top right photo — Spans 5 cols on desktop */}
                    <div className="md:col-span-5 h-52 md:h-[212px] rounded-2xl overflow-hidden shadow-sm bg-slate-200">
                        <img
                            src={photos[1].src}
                            alt={photos[1].alt}
                            className="w-full h-full object-cover block hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Bottom right photo — Spans 5 cols on desktop */}
                    <div className="md:col-span-5 h-52 md:h-[212px] rounded-2xl overflow-hidden shadow-sm bg-slate-200">
                        <img
                            src={photos[2].src}
                            alt={photos[2].alt}
                            className="w-full h-full object-cover block hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
