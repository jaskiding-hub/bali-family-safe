import React from 'react';
import Modal from './Modal';

export default function AlertModal({ show, onClose, title = 'Alert', message, type = 'info' }) {
    const iconConfig = {
        info: {
            bg: 'bg-sky-50',
            border: 'border-sky-200',
            icon: 'text-[#00AEEF]',
            svg: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
            ),
        },
        warning: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            icon: 'text-amber-600',
            svg: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
        },
        error: {
            bg: 'bg-rose-50',
            border: 'border-rose-200',
            icon: 'text-rose-600',
            svg: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
            ),
        },
        success: {
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            icon: 'text-emerald-600',
            svg: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    };

    const config = iconConfig[type] || iconConfig.info;

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Alert Card */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto z-10 overflow-hidden border border-slate-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg p-1.5 transition-colors cursor-pointer z-10"
                    aria-label="Close"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Content */}
                <div className="flex flex-col items-center text-center gap-3 p-6 pt-8">
                    <div className={`w-14 h-14 rounded-2xl ${config.bg} border ${config.border} flex items-center justify-center ${config.icon} shadow-sm`}>
                        {config.svg}
                    </div>
                    {title && (
                        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    )}
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer Button */}
                <div className="p-4 pt-0 pb-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full px-5 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] active:scale-[0.98] text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-sm"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
