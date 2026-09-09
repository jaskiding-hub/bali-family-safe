import React, { useEffect } from 'react';

export default function Modal({
    show = false,
    onClose = () => {},
    title = '',
    children,
    footer = null,
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
        <div className="fixed inset-0 z-50 overflow-hidden p-0 sm:p-4 md:p-6 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div
                className={`relative bg-white rounded-none sm:rounded-2xl shadow-2xl w-full ${maxWidthClass} h-[100dvh] sm:h-auto sm:max-h-[88vh] flex flex-col z-10 transition-all transform overflow-hidden border-0 sm:border border-slate-100`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header (Sticky / Fixed Top) */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4.5 border-b border-slate-100 bg-white shrink-0">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate pr-2">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl p-2 inline-flex items-center justify-center transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Content Area (Scrollable Body) */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
                    {children}
                </div>

                {/* Footer (Fixed at Bottom, always visible) */}
                {footer && (
                    <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 bg-slate-50/80 sm:bg-white shrink-0 flex items-center justify-end gap-3 rounded-b-none sm:rounded-b-2xl">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
