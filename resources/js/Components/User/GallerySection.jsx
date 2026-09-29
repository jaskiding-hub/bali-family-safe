import React, { useState, useMemo } from 'react';
import GalleryModal from './GalleryModal';
import { MagnifyingGlassPlus, Images } from '@phosphor-icons/react';

// Curated authentic photography for Bali Family Safe
const DEFAULT_PHOTO_CATALOG = [
    {
        id: 'photo-1',
        src: '/images/gallery/infant-capsule-isofix.jpg',
        title: 'Certified Infant Safety Capsule',
        caption: 'Rear-facing capsule with ISOFIX base and plush newborn insert for maximum spine protection.',
        category: 'safety',
        categoryLabel: 'Car Seat',
        alt: 'Certified rear-facing infant safety capsule installed with ISOFIX in Bali Family Safe vehicle',
    },
    {
        id: 'photo-2',
        src: '/images/gallery/toddler-car-seat.jpg',
        title: 'Forward-Facing Toddler Seat',
        caption: 'Premium 5-point harness car seat for toddlers aged 1 to 4 years, cleaned and steam-sanitized.',
        category: 'safety',
        categoryLabel: 'Car Seat',
        alt: 'Clean forward-facing toddler seat with child riding comfortably',
    },
    {
        id: 'photo-3',
        src: '/images/gallery/isofix-safety-inspection.jpg',
        title: 'Professional Safety Protocol',
        caption: 'Rigorous ISOFIX anchor verification and sanitize check before every family arrival.',
        category: 'safety',
        categoryLabel: 'Safety Protocol',
        alt: 'Professional hands inspecting child car seat ISOFIX anchor installation',
    },
    {
        id: 'photo-4',
        src: '/images/gallery/luxury-cabin-interior.jpg',
        title: 'Spacious Family Cabin & Cold A/C',
        caption: 'Leather captain seating with dedicated rear climate control vents for hot Bali afternoons.',
        category: 'fleet',
        categoryLabel: 'Fleet Interior',
        alt: 'Spotless vehicle interior with captain seats and child car seat',
    },
    {
        id: 'photo-5',
        src: '/images/gallery/innova-exterior-villa.jpg',
        title: 'Toyota Innova Reborn Fleet',
        caption: 'Immaculate family MPV ready for private hotel pickup and comfortable day tours.',
        category: 'fleet',
        categoryLabel: 'Vehicle Fleet',
        alt: 'White Toyota Innova family vehicle parked at Bali villa',
    },
    {
        id: 'photo-6',
        src: '/images/gallery/airport-driver-greeting.jpg',
        title: 'Ngurah Rai Airport Welcome',
        caption: 'Warm, personalized arrival greeting at DPS Airport with name signboard and luggage care.',
        category: 'tours',
        categoryLabel: 'Airport Transfer',
        alt: 'Friendly Balinese private driver with airport greeting sign',
    },
    {
        id: 'photo-7',
        src: '/images/gallery/ubud-rice-terrace-family.jpg',
        title: 'Scenic Ubud Day Tour',
        caption: 'Gentle family day tour through Tegallalang rice terraces with flexible rest stops.',
        category: 'tours',
        categoryLabel: 'Private Tour',
        alt: 'Family enjoying scenic Ubud rice terraces in Bali',
    },
    {
        id: 'photo-8',
        src: '/images/gallery/ulun-danu-temple-family.jpg',
        title: 'Ulun Danu Beratan Excursion',
        caption: 'Tranquil highland excursion surrounded by cool mountain air and historic lake temples.',
        category: 'tours',
        categoryLabel: 'Culture & Nature',
        alt: 'Family walking near Ulun Danu Beratan water temple in Bali',
    },
    {
        id: 'photo-9',
        src: '/images/gallery/sanur-beach-sunset-family.jpg',
        title: 'Calm Family Beach Transfers',
        caption: 'Smooth private transfer to swimmable, family-friendly beaches along Sanur coast.',
        category: 'tours',
        categoryLabel: 'Beach & Coastal',
        alt: 'Family walking along calm Bali beach at golden sunset',
    },
];

export default function GallerySection({ gallery = [] }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

    // Merge backend photos with default catalog
    const allPhotos = useMemo(() => {
        if (gallery && gallery.length > 0) {
            const formattedBackend = gallery.map((item, index) => {
                const category = item.category || (index % 3 === 0 ? 'safety' : index % 3 === 1 ? 'fleet' : 'tours');
                return {
                    id: item.id || `db-${index}`,
                    src: item.image_url || item.src,
                    title: item.caption || item.alt || `Bali Family Safe Moment ${index + 1}`,
                    caption: item.caption || 'Verified Bali Family Safe journey documentation.',
                    category: category,
                    categoryLabel: item.categoryLabel || 'Gallery',
                    alt: item.caption || 'Bali Family Safe Tours gallery photo',
                };
            });

            const existingUrls = new Set(formattedBackend.map((p) => p.src));
            const extra = DEFAULT_PHOTO_CATALOG.filter((p) => !existingUrls.has(p.src));
            return [...formattedBackend, ...extra];
        }

        return DEFAULT_PHOTO_CATALOG;
    }, [gallery]);

    // Show only first 4 photos in preview
    const previewPhotos = allPhotos.slice(0, 4);

    const handlePhotoClick = (photo) => {
        const indexInAll = allPhotos.findIndex((p) => p.id === photo.id || p.src === photo.src);
        setSelectedPhotoIndex(indexInAll !== -1 ? indexInAll : 0);
        setLightboxOpen(true);
    };

    const handleViewAll = () => {
        setSelectedPhotoIndex(0);
        setLightboxOpen(true);
    };

    return (
        <section
            id="gallery"
            className="w-full bg-[#F8F9FA] py-20 sm:py-28 px-4 sm:px-8 border-t border-slate-200/80 scroll-mt-20 sm:scroll-mt-28"
        >
            <div className="max-w-6xl mx-auto w-full">
                {/* ── HEADER ── */}
                <div className="max-w-2xl mb-10 sm:mb-12">
                    <p className="text-xs font-semibold tracking-widest text-sky-700 uppercase mb-2">
                        Moments &amp; Safety
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight m-0">
                        Travel Moments in Bali
                    </h2>
                    <p className="mt-3 text-slate-600 text-base sm:text-lg leading-relaxed m-0">
                        Real journeys with sanitized car seats, spacious air-conditioned vehicles, and peaceful island destinations.
                    </p>
                </div>

                {/* ── PREVIEW GRID (4 PHOTOS) ── */}
                <div className="space-y-4 sm:space-y-5">
                    {/* Row 1: 1 Large + 1 Medium */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
                        {previewPhotos[0] && (
                            <div
                                onClick={() => handlePhotoClick(previewPhotos[0])}
                                className="group relative md:col-span-7 h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden bg-slate-200 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-500"
                            >
                                <img
                                    src={previewPhotos[0].src}
                                    alt={previewPhotos[0].alt}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 sm:p-7 text-white">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-medium text-sky-300 uppercase tracking-wider mb-1">
                                                {previewPhotos[0].categoryLabel}
                                            </p>
                                            <h3 className="text-lg sm:text-xl font-bold leading-snug m-0">
                                                {previewPhotos[0].title}
                                            </h3>
                                            <p className="text-slate-200 text-xs sm:text-sm mt-1 line-clamp-1 opacity-90 m-0">
                                                {previewPhotos[0].caption}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-slate-900 transition-colors">
                                            <MagnifyingGlassPlus size={20} weight="bold" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {previewPhotos[1] && (
                            <div
                                onClick={() => handlePhotoClick(previewPhotos[1])}
                                className="group relative md:col-span-5 h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden bg-slate-200 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-500"
                            >
                                <img
                                    src={previewPhotos[1].src}
                                    alt={previewPhotos[1].alt}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 sm:p-7 text-white">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-medium text-sky-300 uppercase tracking-wider mb-1">
                                                {previewPhotos[1].categoryLabel}
                                            </p>
                                            <h3 className="text-base sm:text-lg font-bold leading-snug m-0">
                                                {previewPhotos[1].title}
                                            </h3>
                                            <p className="text-slate-200 text-xs sm:text-sm mt-1 line-clamp-1 opacity-90 m-0">
                                                {previewPhotos[1].caption}
                                            </p>
                                        </div>
                                        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-slate-900 transition-colors">
                                            <MagnifyingGlassPlus size={18} weight="bold" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Row 2: 2 Equal Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        {previewPhotos.slice(2, 4).map((photo) => (
                            <div
                                key={photo.id}
                                onClick={() => handlePhotoClick(photo)}
                                className="group relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-200 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-500"
                            >
                                <img
                                    src={photo.src}
                                    alt={photo.alt}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 sm:p-6 text-white">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-medium text-sky-300 uppercase tracking-wider mb-1">
                                                {photo.categoryLabel}
                                            </p>
                                            <h3 className="text-base sm:text-lg font-bold leading-snug m-0">
                                                {photo.title}
                                            </h3>
                                            <p className="text-slate-200 text-xs sm:text-sm mt-1 line-clamp-1 opacity-90 m-0">
                                                {photo.caption}
                                            </p>
                                        </div>
                                        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-slate-900 transition-colors">
                                            <MagnifyingGlassPlus size={18} weight="bold" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── VIEW ALL BUTTON ── */}
                {allPhotos.length > 4 && (
                    <div className="flex justify-center mt-8 sm:mt-10">
                        <button
                            type="button"
                            onClick={handleViewAll}
                            className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-full shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
                        >
                            <Images size={20} weight="bold" />
                            <span>View All Photos</span>
                            <span className="text-xs text-slate-300 bg-slate-800/50 px-2 py-0.5 rounded-full">
                                {allPhotos.length}
                            </span>
                        </button>
                    </div>
                )}
            </div>

            {/* ── GALLERY MODAL ── */}
            <GalleryModal
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                photos={allPhotos}
                initialIndex={selectedPhotoIndex}
            />
        </section>
    );
}
