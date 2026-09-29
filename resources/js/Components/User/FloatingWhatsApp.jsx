import React, { useState } from 'react';
import { WhatsappLogo } from '@phosphor-icons/react';

export default function FloatingWhatsApp({ siteSettings = null }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        const waNumber = (siteSettings?.whatsapp_number || '6281234567890').replace(/[^0-9]/g, '') || '6281234567890';
        const msg = 'Hi Bali Family Safe! I\'d like to inquire about your child-safe transport services.';
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[999] flex items-center gap-3"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Tooltip Pill */}
            <div
                className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white text-slate-800 text-xs font-semibold shadow-xl border border-slate-200/80 transition-all duration-300 pointer-events-none ${
                    isHovered ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-2 scale-95'
                }`}
                style={{ willChange: 'opacity, transform' }}
            >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Chat via WhatsApp</span>
            </div>

            {/* Floating Button */}
            <button
                type="button"
                onClick={handleClick}
                aria-label="Chat on WhatsApp"
                title="Chat on WhatsApp"
                className="whatsapp-pulse w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center border-none shadow-lg cursor-pointer transition-transform duration-300 ease-out"
            >
                <WhatsappLogo size={34} weight="fill" className="drop-shadow-xs" />
            </button>
        </div>
    );
}
