import React, { useEffect } from 'react';

export default function Modal({
    show = false,
    onClose = () => {},
    title = '',
    children,
    maxWidth = 'lg',
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && show) {
                onClose();
            }
        };

        if (show) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [show, onClose]);

    if (!show) return null;

    const maxWidthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    }[maxWidth] || 'max-w-lg';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card with max-height and internal scroll */}
            <div
                className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidthClass} max-h-[85vh] flex flex-col z-10 transition-all transform overflow-hidden border border-slate-100`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header (Sticky) */}
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-white shrink-0">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5 inline-flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content Area (Scrollable) */}
                <div className="p-6 overflow-y-auto flex-1 overscroll-contain">
                    {children}
                </div>
            </div>
        </div>
    );
}
