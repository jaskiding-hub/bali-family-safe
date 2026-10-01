import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import DriverLayout, { useDriverProfile } from '../../Layouts/DriverLayout';

function parseAmount(val) {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return Math.round(val);
    let str = String(val).trim().replace(/[,\.]00$/, '');
    const cleanDigits = str.replace(/\D/g, '');
    return parseInt(cleanDigits, 10) || 0;
}

function formatRupiah(amount) {
    const cleanNum = parseAmount(amount);
    return 'Rp ' + cleanNum.toLocaleString('id-ID');
}

export default function Expense({ trip, authDriver }) {
    const { flash, csrf_token } = usePage().props;
    const { openProfile } = useDriverProfile();

    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const from = searchParams.get('from');
    const date = searchParams.get('date');
    const month = searchParams.get('month');

    const backParams = new URLSearchParams();
    if (from) backParams.set('from', from);
    if (date) backParams.set('date', date);
    if (month) backParams.set('month', month);
    const backUrl = `/driver/trips/${trip.id}${backParams.toString() ? '?' + backParams.toString() : ''}`;

    // Expense items state
    const [expenses, setExpenses] = useState(trip.expenses || []);
    const [toastMessage, setToastMessage] = useState(flash?.success || null);
    const toastTimerRef = useRef(null);

    // Form state
    const [editingId, setEditingId] = useState(null);
    const [expenseType, setExpenseType] = useState('');
    const [amount, setAmount] = useState('');
    const [receiptFile, setReceiptFile] = useState(null);
    const [hasExistingReceipt, setHasExistingReceipt] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formRef = useRef(null);
    const typeInputRef = useRef(null);
    const fileInputRef = useRef(null);

    const showToast = (msg) => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        setToastMessage(msg);
        toastTimerRef.current = setTimeout(() => {
            setToastMessage(null);
        }, 4000);
    };

    useEffect(() => {
        if (flash?.success) {
            showToast(flash.success);
        }
    }, [flash?.success]);

    const handleAmountChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '');
        if (!raw) {
            setAmount('');
            return;
        }
        const num = parseInt(raw, 10);
        setAmount(num.toLocaleString('id-ID'));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setReceiptFile(e.target.files[0]);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setExpenseType('');
        setAmount('');
        setReceiptFile(null);
        setHasExistingReceipt(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleEdit = (exp) => {
        setEditingId(exp.id);
        setExpenseType(exp.expense_type || exp.expense_name || '');
        const amt = parseAmount(exp.amount);
        setAmount(amt ? amt.toLocaleString('id-ID') : '');
        setReceiptFile(null);
        setHasExistingReceipt(!!exp.receipt_path);
        if (fileInputRef.current) fileInputRef.current.value = '';

        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        typeInputRef.current?.focus();
    };

    const handleDelete = async (exp) => {
        const typeName = exp.expense_type || exp.expense_name || 'this';
        if (!window.confirm(`Are you sure you want to remove "${typeName}" expense?`)) {
            return;
        }

        try {
            const token = csrf_token || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch(`/driver/expenses/${exp.id}/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token || '',
                },
            });

            const data = await res.json();
            if (data.success) {
                setExpenses(prev => prev.filter(item => item.id !== exp.id));
                showToast(data.message || 'Expense removed successfully!');
                if (editingId === exp.id) {
                    handleCancelEdit();
                }
            } else {
                alert(data.message || 'Failed to delete expense.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete expense. Please check your connection.');
        }
    };

    const saveExpenseItem = async () => {
        if (!expenseType.trim() || !amount.trim()) {
            alert('Please fill in both expense type and amount.');
            return false;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('type', expenseType.trim());
        formData.append('amount', amount.replace(/\D/g, ''));
        if (receiptFile) {
            formData.append('receipt', receiptFile);
        }

        const isEdit = !!editingId;
        const targetUrl = isEdit ? `/driver/expenses/${editingId}/update` : `/driver/trips/${trip.id}/expense`;
        const token = csrf_token || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        try {
            const res = await fetch(targetUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token || '',
                },
            });

            const data = await res.json();
            setIsSubmitting(false);

            if (data.success && data.expense) {
                if (isEdit) {
                    setExpenses(prev => prev.map(item => item.id === data.expense.id ? { ...item, ...data.expense } : item));
                    showToast(data.message || 'Expense updated successfully!');
                } else {
                    setExpenses(prev => [data.expense, ...prev]);
                    showToast(data.message || 'Expense added successfully!');
                }
                handleCancelEdit();
                return true;
            } else {
                alert(data.message || 'Failed to save expense.');
                return false;
            }
        } catch (err) {
            console.error(err);
            setIsSubmitting(false);
            alert('An error occurred while saving.');
            return false;
        }
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        await saveExpenseItem();
    };

    const handleSaveAllExpense = async () => {
        if (isSubmitting) return;

        // If driver typed an expense in the form without clicking 'Confirm Expense' first, save it
        if (expenseType.trim() || amount.trim()) {
            if (!expenseType.trim() || !amount.trim()) {
                alert('Please fill in both expense type and amount before saving, or clear the form.');
                return;
            }
            const success = await saveExpenseItem();
            if (!success) return;
        }

        router.visit(backUrl);
    };

    const totalSum = expenses.reduce((sum, item) => sum + parseAmount(item.amount), 0);

    return (
        <DriverLayout hideBottomNav={true}>
            {/* Top App Bar Sticky Header (Full-Width Edge-to-Edge) */}
            <header className="w-full bg-white border-b border-[#DEE3E8] sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)] anim-ease-up">
                <div className="max-w-6xl mx-auto h-[60px] px-4 sm:px-8 lg:px-12 flex items-center justify-between">
                    {/* Tombol Back */}
                    <Link 
                        href={backUrl} 
                        id="btn-back-nav" 
                        className="inline-flex items-center gap-1.5 p-2 -ml-2 rounded-xl hover:bg-slate-100 text-[#00658D] transition-all duration-200 ease-out active:scale-95 cursor-pointer" 
                        aria-label="Back to trip detail"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-xs font-semibold">Back</span>
                    </Link>

                    {/* Judul */}
                    <h1 className="text-[#004C6B] text-base sm:text-lg font-bold font-['Inter']">Log Trip Expense</h1>

                    {/* Profile Avatar Button */}
                    <button 
                        type="button" 
                        onClick={openProfile}
                        className="btn-open-driver-profile p-1 rounded-full text-slate-400 hover:text-slate-600 transition active:scale-95 cursor-pointer" 
                        title="Driver Profile"
                    >
                        <img 
                            src={authDriver?.profile_photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'} 
                            alt="Driver Profile" 
                            className="w-8 h-8 rounded-full border border-[#00AEEF] object-cover"
                        />
                    </button>
                </div>
            </header>

            {/* Main Container Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 w-full py-4 flex flex-col gap-6 pb-28 sm:pb-32 font-['Inter']">
                
                {/* Dynamic In-Page Success Notification Toast */}
                {toastMessage && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs transition-all duration-300">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{toastMessage}</span>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => setToastMessage(null)} 
                            className="p-1 -mr-1 text-emerald-600 hover:text-emerald-800 rounded-lg hover:bg-emerald-100 transition cursor-pointer" 
                            aria-label="Close notification"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* 1. Saved Expenses History Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs flex flex-col gap-3.5 anim-ease-up" id="saved-expenses-card">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Saved Expenses ({expenses.length})
                            </h3>
                        </div>
                        <span className="text-xs font-extrabold text-[#00658D] bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-full transition-all">
                            Total: {formatRupiah(totalSum)}
                        </span>
                    </div>

                    <div className="flex flex-col divide-y divide-slate-100" id="saved-expenses-list">
                        {expenses.length > 0 ? (
                            expenses.map((savedExp) => {
                                const hasReceipt = !!savedExp.receipt_path;
                                const timeStr = savedExp.created_at ? (typeof savedExp.created_at === 'string' && savedExp.created_at.includes('T') ? new Date(savedExp.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : savedExp.created_at) : null;

                                return (
                                    <div 
                                        key={savedExp.id} 
                                        className="py-3 flex items-center justify-between first:pt-1 last:pb-1 group transition-all"
                                    >
                                        {/* Left Column: Info Expense */}
                                        <div className="flex flex-col min-w-0 pr-2">
                                            <span className="text-sm font-bold text-[#171C20] truncate">
                                                {savedExp.expense_type || savedExp.expense_name}
                                            </span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                {hasReceipt ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                                        <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Receipt Attached
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                                                        No Receipt
                                                    </span>
                                                )}
                                                {timeStr && (
                                                    <span className="text-[11px] text-slate-400">
                                                        • {timeStr}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Column: Amount + Action Buttons */}
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-sm font-extrabold text-[#004C6B]">
                                                {formatRupiah(savedExp.amount)}
                                            </span>

                                            <div className="flex items-center gap-1">
                                                {/* Edit Button */}
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleEdit(savedExp)}
                                                    className="p-1.5 text-slate-400 hover:text-[#00658D] hover:bg-sky-50 active:scale-90 rounded-lg transition cursor-pointer" 
                                                    title="Edit this expense"
                                                    aria-label="Edit expense"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>

                                                {/* Delete Button */}
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleDelete(savedExp)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-90 rounded-lg transition cursor-pointer" 
                                                    title="Remove this expense"
                                                    aria-label="Remove expense"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-4 text-xs text-slate-400 font-medium">
                                No expenses recorded yet. Fill the form below to add.
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Section Header for Form */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {editingId ? `Edit Expense #${editingId}` : 'Add New Expense'}
                        </h2>
                        {editingId && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                Editing Mode
                            </span>
                        )}
                    </div>
                    {editingId && (
                        <button 
                            type="button" 
                            onClick={handleCancelEdit} 
                            className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Cancel Edit</span>
                        </button>
                    )}
                </div>

                {/* 3. Single Clean Input Form Card */}
                <form 
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-4.5 anim-ease-up"
                >
                    {/* Input 1: Expense Type (Mandatory) */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="input-type" className="text-xs font-semibold text-[#3E4850] uppercase tracking-wider flex items-center gap-1">
                            <span>Expense Type</span>
                            <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input 
                            ref={typeInputRef}
                            type="text" 
                            id="input-type"
                            value={expenseType}
                            onChange={(e) => setExpenseType(e.target.value)}
                            placeholder="e.g. Parking, Toll, BBM, Car Wash" 
                            required
                            className="w-full h-12 px-4 rounded-xl border border-[#BDC8D1] bg-white text-[#171C20] text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] outline-none transition"
                        />
                    </div>

                    {/* Input 2: Amount (IDR) (Mandatory) */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="input-amount" className="text-xs font-semibold text-[#3E4850] uppercase tracking-wider flex items-center gap-1">
                            <span>Amount (IDR)</span>
                            <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <div className="relative w-full flex items-center">
                            <span className="absolute left-4 font-bold text-sm text-[#00658D] pointer-events-none">Rp</span>
                            <input 
                                type="text" 
                                inputMode="numeric"
                                id="input-amount"
                                value={amount}
                                onChange={handleAmountChange}
                                placeholder="Contoh: 150.000 atau 150000" 
                                required
                                className="w-full h-12 pl-12 pr-4 rounded-xl border border-[#BDC8D1] bg-white text-[#171C20] text-base font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] outline-none transition"
                            />
                        </div>
                    </div>

                    {/* Input 3: Receipt Photo (Optional) */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#3E4850] uppercase tracking-wider flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span>Receipt Photo</span>
                                <span className="text-[11px] text-slate-400 font-normal lowercase">(optional)</span>
                            </div>
                            {editingId && hasExistingReceipt && !receiptFile && (
                                <span className="text-[11px] text-slate-400 font-normal">
                                    (Leave empty to keep existing receipt)
                                </span>
                            )}
                        </label>
                        
                        <div 
                            className={`relative w-full h-32 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99] group overflow-hidden ${
                                receiptFile || (editingId && hasExistingReceipt)
                                    ? 'bg-emerald-50/70 border-2 border-solid border-emerald-400' 
                                    : 'bg-[#EFF4FA] border-2 border-dashed border-[#BDC8D1] hover:border-[#00AEEF]'
                            }`}
                        >
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                id="input-receipt"
                                name="receipt" 
                                accept="image/*" 
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            
                            {/* Icon Container */}
                            <div 
                                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform ${
                                    receiptFile || (editingId && hasExistingReceipt)
                                        ? 'bg-emerald-100 text-emerald-700' 
                                        : 'bg-white text-[#00658D]'
                                }`}
                            >
                                {receiptFile || (editingId && hasExistingReceipt) ? (
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </div>

                            {/* Label / Feedback Texts */}
                            <span 
                                className={`text-xs font-semibold tracking-wide text-center px-4 transition-colors ${
                                    receiptFile || (editingId && hasExistingReceipt)
                                        ? 'text-emerald-800 font-bold' 
                                        : 'text-[#3E4850]'
                                }`}
                            >
                                {receiptFile 
                                    ? `✓ ${receiptFile.name}` 
                                    : (editingId && hasExistingReceipt)
                                        ? '✓ Previous Receipt Attached'
                                        : 'Tap to Snap / Upload Receipt'}
                            </span>
                            <span 
                                className={`text-[10px] font-normal transition-colors ${
                                    receiptFile || (editingId && hasExistingReceipt)
                                        ? 'text-emerald-600 font-medium' 
                                        : 'text-slate-400'
                                }`}
                            >
                                {receiptFile 
                                    ? `Attached (${(receiptFile.size / 1024).toFixed(0)} KB) • Tap to change` 
                                    : (editingId && hasExistingReceipt)
                                        ? 'Tap to upload replacement photo'
                                        : 'JPG, PNG max 2MB (Optional)'}
                            </span>
                        </div>
                    </div>

                    {/* Box Action: Confirm Expense Button */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer disabled:opacity-60"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{isSubmitting ? 'Saving...' : (editingId ? 'Confirm Update Expense' : 'Confirm Expense')}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Fixed Footer Action */}
            <div className="fixed z-40 bottom-0 left-0 right-0 w-full sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl md:max-w-2xl bg-white/95 backdrop-blur-md border border-[#DEE3E8] sm:rounded-2xl p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:shadow-[0_10px_30px_rgba(0,0,0,0.08)] anim-ease-up delay-5">
                <button 
                    type="button" 
                    onClick={handleSaveAllExpense}
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#00AEEF] hover:bg-[#009cd7] active:scale-[0.985] text-[#003E58] font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5 text-[#003E58]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>
                        {isSubmitting ? 'Saving...' : 'Save All Expense'}
                    </span>
                </button>
            </div>
        </DriverLayout>
    );
}
