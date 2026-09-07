import React, { useState } from 'react';
import { Link, router, usePage, useForm } from '@inertiajs/react';
import DriverLayout from '@/Layouts/DriverLayout';

export default function Expense({ trip, authDriver }) {
    const { flash } = usePage().props;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [deletingExpense, setDeletingExpense] = useState(null);

    const searchParams = new URLSearchParams(window.location.search);
    const from = searchParams.get('from') || 'home';

    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'Parking & Toll',
        amount: '',
        notes: '',
        receipt: null,
    });

    const handleAddExpenseSubmit = (e) => {
        e.preventDefault();
        post(`/driver/trips/${trip.id}/expense`, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    const handleUpdateExpenseSubmit = (e) => {
        e.preventDefault();
        if (!editingExpense) return;
        router.post(`/driver/trips/${trip.id}/expense/${editingExpense.id}`, {
            _method: 'put',
            type: data.type,
            amount: data.amount,
            notes: data.notes,
        }, {
            onSuccess: () => {
                setEditingExpense(null);
                reset();
            },
        });
    };

    const handleDeleteExpense = () => {
        if (!deletingExpense) return;
        router.delete(`/driver/trips/${trip.id}/expense/${deletingExpense.id}`, {
            onSuccess: () => setDeletingExpense(null),
        });
    };

    const totalExpenseAmount = trip?.expenses ? trip.expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) : 0;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/driver/logout');
    };

    return (
        <DriverLayout hideBottomNav={true}>
            {/* Top Header App Bar */}
            <header className="w-full bg-white border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sticky top-0 z-30 anim-ease-up">
                <div className="max-w-6xl mx-auto h-[60px] px-4 sm:px-8 lg:px-12 flex items-center justify-between">
                    <Link 
                        href={`/driver/trips/${trip.id}?from=${from}`} 
                        className="inline-flex items-center gap-1.5 p-2 -ml-2 rounded-xl hover:bg-slate-100 text-[#00658D] transition-all duration-200 ease-out active:scale-95 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-xs font-semibold">Back</span>
                    </Link>

                    <h1 className="text-[#171C20] text-base sm:text-lg font-bold tracking-tight">Log Trip Expense</h1>

                    <button 
                        type="button" 
                        onClick={() => setIsProfileOpen(true)}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition active:scale-95 cursor-pointer"
                    >
                        <img 
                            src={authDriver?.profile_photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"} 
                            alt="Driver Profile" 
                            className="w-8 h-8 rounded-full border border-[#00AEEF] object-cover"
                        />
                    </button>
                </div>
            </header>

            {/* Main Container Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 w-full py-5 pb-28 flex flex-col gap-4 font-['Inter']">

                {flash?.success && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 anim-ease-up shadow-2xs">
                        <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Trip Card Header Summary */}
                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2 anim-ease-up">
                    <span className="text-xs font-bold text-[#00658D] uppercase tracking-wider">Trip Expense Management</span>
                    <h2 className="text-lg font-bold text-slate-900">{trip?.guest_name} • {trip?.trip_type}</h2>
                    <p className="text-xs text-slate-500">{trip?.pickup_location} &rarr; {trip?.dropoff_location}</p>
                </div>

                {/* Expenses Total & Add Action Bar */}
                <div className="bg-[#EFF4FA] border border-[#DEE3E8] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 anim-ease-up delay-1">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Logged Expense</span>
                        <span className="text-xl sm:text-2xl font-extrabold text-[#00658D]">
                            Rp {totalExpenseAmount.toLocaleString('id-ID')}
                        </span>
                    </div>

                    <button 
                        type="button" 
                        onClick={() => {
                            reset();
                            setIsAddModalOpen(true);
                        }}
                        className="px-4 py-2.5 bg-[#00AEEF] hover:bg-[#009cd7] active:scale-95 text-[#003E58] font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-sky-500/20"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add New Expense</span>
                    </button>
                </div>

                {/* Saved Expenses List */}
                <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 anim-ease-up delay-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Saved Expenses</h3>

                    {trip?.expenses && trip.expenses.length > 0 ? (
                        <div className="flex flex-col divide-y divide-slate-100">
                            {trip.expenses.map((exp) => (
                                <div key={exp.id} className="py-3 flex items-center justify-between gap-3">
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-slate-900 truncate">{exp.expense_type || exp.expense_name}</span>
                                        {exp.notes && <span className="text-xs text-slate-500 truncate">{exp.notes}</span>}
                                        <span className="text-xs font-bold text-[#00658D] mt-0.5">Rp {Number(exp.amount).toLocaleString('id-ID')}</span>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setEditingExpense(exp);
                                                setData({
                                                    type: exp.expense_type || 'Parking & Toll',
                                                    amount: exp.amount,
                                                    notes: exp.notes || '',
                                                    receipt: null,
                                                });
                                            }}
                                            className="px-2.5 py-1 text-xs font-bold text-[#00658D] bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setDeletingExpense(exp)}
                                            className="px-2.5 py-1 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs sm:text-sm text-slate-400 italic text-center py-4">Belum ada rincian pengeluaran untuk perjalanan ini.</p>
                    )}
                </div>

            </div>

            {/* Add Expense Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 anim-ease-up">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Add New Expense</h3>
                            <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>

                        <form onSubmit={handleAddExpenseSubmit} className="flex flex-col gap-3.5">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-600 uppercase">Expense Type</label>
                                <select 
                                    value={data.type} 
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#00AEEF] outline-none"
                                >
                                    <option value="Parking & Toll">Parkir & Tol</option>
                                    <option value="BBM Pertamax">BBM / Bahan Bakar</option>
                                    <option value="Cuci Mobil">Cuci Mobil</option>
                                    <option value="Maintenance">Perawatan / Repair</option>
                                    <option value="Lainnya">Lain-lain</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-600 uppercase">Amount (Rp)</label>
                                <input 
                                    type="text" 
                                    value={data.amount} 
                                    onChange={(e) => setData('amount', e.target.value)}
                                    placeholder="Contoh: 150000" 
                                    required 
                                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#00AEEF] outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-600 uppercase">Notes (Optional)</label>
                                <input 
                                    type="text" 
                                    value={data.notes} 
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Contoh: Tol Bandara" 
                                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#00AEEF] outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">Batal</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 text-xs font-bold text-[#003E58] bg-[#00AEEF] hover:bg-[#009cd7] rounded-xl transition shadow-xs">Simpan Expense</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Expense Modal */}
            {editingExpense && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 anim-ease-up">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Edit Expense</h3>
                            <button type="button" onClick={() => setEditingExpense(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>

                        <form onSubmit={handleUpdateExpenseSubmit} className="flex flex-col gap-3.5">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-600 uppercase">Expense Type</label>
                                <select 
                                    value={data.type} 
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#00AEEF] outline-none"
                                >
                                    <option value="Parking & Toll">Parkir & Tol</option>
                                    <option value="BBM Pertamax">BBM / Bahan Bakar</option>
                                    <option value="Cuci Mobil">Cuci Mobil</option>
                                    <option value="Maintenance">Perawatan / Repair</option>
                                    <option value="Lainnya">Lain-lain</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-600 uppercase">Amount (Rp)</label>
                                <input 
                                    type="text" 
                                    value={data.amount} 
                                    onChange={(e) => setData('amount', e.target.value)}
                                    required 
                                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#00AEEF] outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-600 uppercase">Notes (Optional)</label>
                                <input 
                                    type="text" 
                                    value={data.notes} 
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#00AEEF] outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button type="button" onClick={() => setEditingExpense(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">Batal</button>
                                <button type="submit" className="px-4 py-2 text-xs font-bold text-[#003E58] bg-[#00AEEF] hover:bg-[#009cd7] rounded-xl transition shadow-xs">Update Expense</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingExpense && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-3 anim-ease-up">
                        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">!</div>
                        <h3 className="text-base font-bold text-slate-900">Hapus Expense Ini?</h3>
                        <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>

                        <div className="flex items-center justify-center gap-2 pt-2 w-full">
                            <button type="button" onClick={() => setDeletingExpense(null)} className="w-1/2 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Batal</button>
                            <button type="button" onClick={handleDeleteExpense} className="w-1/2 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-xs">Hapus</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Sheet Modal */}
            {isProfileOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99] transition-opacity duration-300 cursor-pointer"
                        onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="fixed bottom-0 sm:bottom-auto sm:top-1/2 left-1/2 -translate-x-1/2 w-full max-w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl z-[100] transition-all duration-300 ease-out translate-y-0 sm:-translate-y-1/2 opacity-100">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden"></div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3.5">
                                <img 
                                    src={authDriver?.profile_photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"} 
                                    alt={authDriver?.full_name || "Driver"} 
                                    className="w-14 h-14 rounded-full object-cover border-2 border-[#00AEEF] shadow-sm shrink-0"
                                />
                                <div className="flex flex-col min-w-0">
                                    <h3 className="text-base font-bold text-[#171C20] leading-tight truncate">{authDriver?.full_name || 'Wayan Arta'}</h3>
                                    <span className="text-xs text-slate-500 mt-1">ID: <strong className="text-slate-700 font-semibold">DRV-00{authDriver?.id || 1}</strong></span>
                                </div>
                            </div>
                            <button type="button" onClick={() => setIsProfileOpen(false)} className="p-2 -mr-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="bg-[#EFF4FA] border border-[#DEE3E8] rounded-xl p-3.5 mb-5 flex flex-col gap-2.5 text-xs">
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="font-medium text-slate-400">Email:</span>
                                <span className="font-bold text-slate-800">{authDriver?.email || 'driver@transport.com'}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="font-medium text-slate-400">Username:</span>
                                <span className="font-bold text-slate-800">{authDriver?.username || 'driver_bali'}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600">
                                <span className="font-medium text-slate-400">WhatsApp:</span>
                                <span className="font-bold text-slate-800">{authDriver?.whatsapp_number || '08123456789'}</span>
                            </div>
                        </div>
                        <form onSubmit={handleLogout} className="w-full">
                            <button type="submit" className="w-full h-11 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 active:scale-[0.985] text-rose-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs">
                                <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Keluar / Sign Out</span>
                            </button>
                        </form>
                    </div>
                </>
            )}
        </DriverLayout>
    );
}
