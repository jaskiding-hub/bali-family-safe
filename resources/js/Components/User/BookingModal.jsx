import React, { useState } from 'react';
import { X, CheckCircle, WhatsappLogo, ShieldCheck, MapPin, Calendar, Users, Car } from '@phosphor-icons/react';

export default function BookingModal({ isOpen, onClose, bookingData }) {
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!isOpen || !bookingData) return null;

    const handleWhatsAppConfirm = () => {
        const seatsText = bookingData.carSeatTypes && bookingData.carSeatTypes.length > 0
            ? bookingData.carSeatTypes.join(', ')
            : 'Standard free car seat';

        let msg = `*CONFIRMED BALI FAMILY SAFE BOOKING*\n`;
        msg += `---------------------------------\n`;
        msg += `*Service:* ${bookingData.type}\n`;
        msg += `*Name:* ${bookingData.fullName || 'Guest'}\n`;
        msg += `*WhatsApp:* ${bookingData.whatsapp || '-'}\n`;
        msg += `*Email:* ${bookingData.email || '-'}\n`;
        if (bookingData.flightNumber) msg += `*Flight No:* ${bookingData.flightNumber}\n`;
        msg += `*Passengers:* ${bookingData.adults} Adults, ${bookingData.children} Children\n`;
        msg += `*Pick-Up:* ${bookingData.pickupLocation}\n`;
        msg += `*Drop-Off:* ${bookingData.dropoffLocation}\n`;
        if (bookingData.arrivalDate) msg += `*Arrival:* ${bookingData.arrivalDate} at ${bookingData.arrivalTime}\n`;
        if (bookingData.departureDate) msg += `*Departure:* ${bookingData.departureDate} at ${bookingData.departureTime}\n`;
        if (bookingData.transferDate) msg += `*Transfer:* ${bookingData.transferDate} at ${bookingData.transferTime}\n`;
        msg += `*Car Seats:* ${seatsText}\n`;
        if (bookingData.notes) msg += `*Notes:* ${bookingData.notes}\n`;
        msg += `*Total Estimate:* ${bookingData.estimatedPrice}\n`;
        msg += `---------------------------------\n`;
        msg += `Please send driver confirmation and dispatch details.`;

        const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');
        setIsSubmitted(true);
    };

    const handleDirectSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={22} weight="fill" className="text-sky-600" />
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                            {isSubmitted ? 'Booking Received!' : 'Confirm Your Family Ride'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                    >
                        <X size={20} weight="bold" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {isSubmitted ? (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                <CheckCircle size={40} weight="fill" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900">Thank You, {bookingData.fullName || 'Guest'}!</h4>
                            <p className="text-sm text-slate-600 max-w-sm mx-auto">
                                We have received your booking request for <strong>{bookingData.type}</strong>. Our dispatch team is assigning your certified family driver and preparing the sanitized car seat.
                            </p>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1.5">
                                <div className="flex justify-between">
                                    <span>Pick-Up:</span>
                                    <span className="font-semibold text-slate-900 truncate max-w-[200px]">{bookingData.pickupLocation}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Drop-Off:</span>
                                    <span className="font-semibold text-slate-900 truncate max-w-[200px]">{bookingData.dropoffLocation}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Estimated Fare:</span>
                                    <span className="font-bold text-sky-800">{bookingData.estimatedPrice} (Pay to driver)</span>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 bg-sky-900 hover:bg-sky-950 text-white font-bold rounded-xl transition-all cursor-pointer"
                                >
                                    Done & Return to Site
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Summary Card */}
                            <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-4 text-xs space-y-2 text-slate-700">
                                <div className="flex items-center justify-between pb-2 border-b border-sky-200/60 font-semibold text-sky-950">
                                    <span className="flex items-center gap-1.5">
                                        <Car size={16} weight="fill" className="text-sky-700" />
                                        {bookingData.type}
                                    </span>
                                    <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-bold">
                                        Free Car Seat Included
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <div>
                                        <span className="text-slate-500 block">Lead Passenger</span>
                                        <span className="font-semibold text-slate-900">{bookingData.fullName || 'Not specified'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block">WhatsApp / Phone</span>
                                        <span className="font-semibold text-slate-900">{bookingData.whatsapp || 'Not specified'}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block">Passengers</span>
                                        <span className="font-semibold text-slate-900">{bookingData.adults} Adults, {bookingData.children} Kids</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block">Estimated Fare</span>
                                        <span className="font-bold text-sky-900 text-sm">{bookingData.estimatedPrice}</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-sky-200/60 space-y-1">
                                    <div className="flex items-start gap-1.5">
                                        <MapPin size={15} className="text-sky-600 shrink-0 mt-0.5" />
                                        <span><strong>From:</strong> {bookingData.pickupLocation}</span>
                                    </div>
                                    <div className="flex items-start gap-1.5">
                                        <MapPin size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                                        <span><strong>To:</strong> {bookingData.dropoffLocation}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 italic">
                                *No upfront credit card required. You can pay your driver in Cash (IDR/AUD/USD) or QRIS upon arrival.
                            </p>

                            {/* Actions */}
                            <div className="space-y-2 pt-2">
                                <button
                                    type="button"
                                    onClick={handleWhatsAppConfirm}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    <WhatsappLogo size={20} weight="fill" />
                                    <span>Confirm Fast via WhatsApp</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDirectSubmit}
                                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                                >
                                    Submit Online (Email Confirmation)
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
