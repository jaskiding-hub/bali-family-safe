import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, CaretLeft, CaretRight } from '@phosphor-icons/react';

export default function GalleryModal({
    isOpen,
    onClose,
    photos = [],
    initialIndex = 0,
}) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const thumbStripRef = useRef(null);
    const touchStartX = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setIsImageLoading(false);
        }
    }, [isOpen, initialIndex]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
                document.body.style.removeProperty('overflow');
            };
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.removeProperty('overflow');
        }
    }, [isOpen]);

    const handlePrev = useCallback(() => {
        if (photos.length <= 1) return;
        setIsImageLoading(true);
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    }, [photos.length]);

    const handleNext = useCallback(() => {
        if (photos.length <= 1) return;
        setIsImageLoading(true);
        setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    }, [photos.length]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handlePrev, handleNext, onClose]);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;

        if (diff > 50) {
            handleNext();
        } else if (diff < -50) {
            handlePrev();
        }
        touchStartX.current = null;
    };

    useEffect(() => {
        if (isOpen && thumbStripRef.current) {
            const activeThumb = thumbStripRef.current.children[currentIndex];
            if (activeThumb) {
                activeThumb.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                });
            }
        }
    }, [currentIndex, isOpen]);

    if (!isOpen || photos.length === 0) return null;

    const currentPhoto = photos[currentIndex] || photos[0];

    return createPortal(
        <div
            className="fixed inset-0 z-[999999] flex flex-col bg-black/90 backdrop-blur-2xl select-none"
            onClick={onClose}
        >
            <div
                className="relative flex flex-col w-full h-full max-w-7xl mx-auto"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* ── TOP BAR ── */}
                <div className="flex items-center justify-between px-6 sm:px-8 py-5 z-20 shrink-0">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-white font-semibold text-base sm:text-lg m-0 leading-tight">
                            {currentPhoto.title}
                        </h3>
                        {currentPhoto.categoryLabel && (
                            <span className="text-xs text-white/50 tracking-wide">
                                {currentPhoto.categoryLabel}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs text-white/60 font-medium tracking-wider">
                            {currentIndex + 1} / {photos.length}
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                            title="Close (Esc)"
                        >
                            <X size={20} weight="bold" />
                        </button>
                    </div>
                </div>

                {/* ── MAIN STAGE ── */}
                <div className="relative flex-1 flex items-center justify-center px-4 sm:px-16 overflow-hidden">
                    {/* Prev Button */}
                    {photos.length > 1 && (
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="absolute left-4 sm:left-6 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                            title="Previous Photo"
                        >
                            <CaretLeft size={24} weight="bold" />
                        </button>
                    )}

                    {/* Active Image */}
                    <div className="relative max-w-full max-h-full flex items-center justify-center">
                        <img
                            key={currentPhoto.src}
                            src={currentPhoto.src}
                            alt={currentPhoto.alt || currentPhoto.title}
                            onLoad={() => setIsImageLoading(false)}
                            className={`max-w-full max-h-[70vh] sm:max-h-[75vh] w-auto h-auto object-contain rounded-lg transition-opacity duration-300 ${
                                isImageLoading ? 'opacity-40' : 'opacity-100'
                            }`}
                        />
                    </div>

                    {/* Next Button */}
                    {photos.length > 1 && (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="absolute right-4 sm:right-6 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                            title="Next Photo"
                        >
                            <CaretRight size={24} weight="bold" />
                        </button>
                    )}
                </div>

                {/* ── BOTTOM CAPTION & THUMBNAILS ── */}
                <div className="px-6 sm:px-8 pb-6 pt-4 shrink-0 flex flex-col items-center gap-4">
                    {currentPhoto.caption && (
                        <p className="text-white/70 text-sm text-center max-w-2xl m-0 leading-relaxed">
                            {currentPhoto.caption}
                        </p>
                    )}

                    {/* Thumbnails Filmstrip */}
                    {photos.length > 1 && (
                        <div
                            ref={thumbStripRef}
                            className="flex items-center gap-2.5 overflow-x-auto py-2 max-w-full no-scrollbar"
                        >
                            {photos.map((photo, i) => {
                                const isSelected = i === currentIndex;
                                return (
                                    <button
                                        key={photo.id || i}
                                        type="button"
                                        onClick={() => {
                                            setIsImageLoading(true);
                                            setCurrentIndex(i);
                                        }}
                                        className={`relative w-16 h-12 sm:w-18 sm:h-13 rounded-md overflow-hidden shrink-0 transition-all cursor-pointer ${
                                            isSelected
                                                ? 'ring-2 ring-white scale-105 opacity-100'
                                                : 'opacity-40 hover:opacity-70'
                                        }`}
                                    >
                                        <img
                                            src={photo.src}
                                            alt="thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
