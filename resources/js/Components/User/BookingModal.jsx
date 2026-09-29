import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, WhatsappLogo } from '@phosphor-icons/react';

export default function BookingModal({ isOpen, onClose, bookingData }) {
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (isOpen && bookingData) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
                document.body.style.removeProperty('overflow');
            };
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.removeProperty('overflow');
        }
    }, [isOpen, bookingData]);

    if (!isOpen || !bookingData) return null;

    const handleWhatsAppConfirm = () => {
        const seatsText = bookingData.carSeatTypes && bookingData.carSeatTypes.length > 0
            ? bookingData.carSeatTypes.join(', ')
            : 'Standard free car seat';

        let msg = `*BALI FAMILY SAFE BOOKING*\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━\n`;
        msg += `*Service:* ${bookingData.type}\n`;
        msg += `*Name:* ${bookingData.fullName || 'Guest'}\n`;
        msg += `*WhatsApp:* ${bookingData.whatsapp || '-'}\n`;
        msg += `*Email:* ${bookingData.email || '-'}\n`;
        if (bookingData.flightNumber) msg += `*Flight:* ${bookingData.flightNumber}\n`;
        msg += `*Passengers:* ${bookingData.adults} Adults, ${bookingData.children} Children\n`;
        msg += `*Pick-Up:* ${bookingData.pickupLocation}\n`;
        msg += `*Drop-Off:* ${bookingData.dropoffLocation}\n`;
        if (bookingData.arrivalDate) msg += `*Arrival:* ${bookingData.arrivalDate} at ${bookingData.arrivalTime}\n`;
        if (bookingData.departureDate) msg += `*Departure:* ${bookingData.departureDate} at ${bookingData.departureTime}\n`;
        if (bookingData.transferDate) msg += `*Transfer:* ${bookingData.transferDate} at ${bookingData.transferTime}\n`;
        msg += `*Car Seats:* ${seatsText}\n`;
        if (bookingData.notes) msg += `*Notes:* ${bookingData.notes}\n`;
        msg += `*Estimated Fare:* ${bookingData.estimatedPrice}\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━\n`;
        msg += `Please confirm driver and vehicle details.`;

        const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');
        setIsSubmitted(true);
    };

    const handleDirectSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden my-auto" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-900 text-lg">
                        {isSubmitted ? 'Booking Confirmed' : 'Confirm Booking'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center"
                    >
                        <X size={18} weight="bold" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {isSubmitted ? (
                        <div className="text-center py-6 space-y-5">
                            <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle size={32} weight="fill" />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-slate-900 mb-2">
                                    Thank you, {bookingData.fullName || 'Guest'}
                                </h4>
                                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                                    Your booking request for <strong>{bookingData.type}</strong> has been received. Driver details will be sent shortly.
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 space-y-2.5">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Pick-Up</span>
                                    <span className="font-medium text-slate-900 truncate max-w-[200px]">{bookingData.pickupLocation}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Drop-Off</span>
                                    <span className="font-medium text-slate-900 truncate max-w-[200px]">{bookingData.dropoffLocation}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-slate-200">
                                    <span className="text-slate-500">Estimated Fare</span>
                                    <span className="font-semibold text-slate-900">{bookingData.estimatedPrice}</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Summary Card */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 text-sm">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                                    <span className="font-semibold text-slate-900">{bookingData.type}</span>
                                    <span className="text-xs text-slate-600 bg-slate-200 px-2.5 py-1 rounded-full font-medium">
                                        Free car seat
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-slate-500 block text-xs mb-1">Passenger</span>
                                        <span className="font-medium text-slate-900">{bookingData.fullName || '—'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-xs mb-1">Contact</span>
                                        <span className="font-medium text-slate-900">{bookingData.whatsapp || '—'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-xs mb-1">Passengers</span>
                                        <span className="font-medium text-slate-900">{bookingData.adults} Adults, {bookingData.children} Kids</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-xs mb-1">Fare</span>
                                        <span className="font-semibold text-slate-900">{bookingData.estimatedPrice}</span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                                    <div className="flex gap-2">
                                        <span className="text-slate-400">From:</span>
                                        <span className="flex-1">{bookingData.pickupLocation}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-slate-400">To:</span>
                                        <span className="flex-1">{bookingData.dropoffLocation}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed">
                                No upfront payment required. Pay your driver in cash (IDR/AUD/USD) or QRIS upon arrival.
                            </p>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={handleWhatsAppConfirm}
                                    className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
                                >
                                    <WhatsappLogo size={18} weight="fill" />
                                    <span>WhatsApp</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDirectSubmit}
                                    className="py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
                                >
                                    Book now
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
