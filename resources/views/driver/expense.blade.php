@extends('layouts.driver')

@section('content')
@php
    $backParams = ['id' => $trip->id ?? 1];
    if (request()->has('from')) $backParams['from'] = request()->query('from');
    if (request()->has('date')) $backParams['date'] = request()->query('date');
    if (request()->has('month')) $backParams['month'] = request()->query('month');
@endphp

    <!-- Top App Bar Sticky Header (Full-Width Edge-to-Edge) -->
    <header class="w-full bg-white border-b border-[#DEE3E8] sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)] anim-ease-up">
        <div class="max-w-6xl mx-auto h-[60px] px-4 sm:px-8 lg:px-12 flex items-center justify-between">
            <!-- Tombol Back (Kiri) - Konsisten 1:1 dengan Trip Detail -->
            <a href="{{ route('driver.trip.detail', $backParams) }}" id="btn-back-nav" class="inline-flex items-center gap-1.5 p-2 -ml-2 rounded-xl hover:bg-slate-100 text-[#00658D] transition-all duration-200 ease-out active:scale-95" aria-label="Back to trip detail">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="text-xs font-semibold">Back</span>
            </a>

            <!-- Judul (Tengah) -->
            <h1 class="text-[#004C6B] text-base sm:text-lg font-bold font-['Inter']">Log Trip Expense</h1>

            <!-- Profile Avatar Button (Kanan) -->
            <button type="button" class="btn-open-driver-profile p-1 rounded-full text-slate-400 hover:text-slate-600 transition active:scale-95 cursor-pointer" title="Driver Profile">
                <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" 
                    alt="Driver Profile" 
                    class="w-8 h-8 rounded-full border border-[#00AEEF] object-cover"
                >
            </button>
        </div>
    </header>

    <!-- Main Container Content (Centered Max-w-6xl) -->
    <div class="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 w-full py-4 flex flex-col gap-6 pb-28 sm:pb-32 font-['Inter']">
        
        <!-- Dynamic In-Page Success Notification Toast -->
        <div 
            id="expense-toast" 
            class="{{ session('success') ? 'flex' : 'hidden' }} p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold items-center justify-between shadow-xs transition-all duration-300"
        >
            <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span id="toast-message">{{ session('success') ?? 'Expense saved successfully!' }}</span>
            </div>
            <button type="button" id="btn-close-toast" class="p-1 -mr-1 text-emerald-600 hover:text-emerald-800 rounded-lg hover:bg-emerald-100 transition cursor-pointer" aria-label="Close notification">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        @if ($errors->any())
            <div class="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs anim-ease-up">
                <ul class="list-disc list-inside space-y-1">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <!-- 1. Saved Expenses History Card -->
        @php
            $savedExpenses = $trip->expenses ?? collect();
            $totalSavedSum = $savedExpenses->sum('amount');
            $savedCount = $savedExpenses->count();
        @endphp

        <div class="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-xs flex flex-col gap-3.5 anim-ease-up" id="saved-expenses-card">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500" id="saved-status-dot"></span>
                    <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Saved Expenses (<span id="saved-count">{{ $savedCount }}</span>)
                    </h3>
                </div>
                <span id="saved-total-badge" class="text-xs font-extrabold text-[#00658D] bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-full transition-all">
                    Total: Rp {{ number_format($totalSavedSum, 0, ',', '.') }}
                </span>
            </div>

            <div class="flex flex-col divide-y divide-slate-100" id="saved-expenses-list">
                @forelse($savedExpenses as $savedExp)
                    <div 
                        class="py-3 flex items-center justify-between first:pt-1 last:pb-1 group transition-all" 
                        id="expense-row-{{ $savedExp->id }}"
                        data-id="{{ $savedExp->id }}"
                        data-type="{{ $savedExp->expense_type ?? $savedExp->expense_name }}"
                        data-amount="{{ (float) $savedExp->amount }}"
                        data-notes="{{ $savedExp->notes ?? '' }}"
                        data-receipt="{{ $savedExp->receipt_path ? '1' : '0' }}"
                    >
                        <!-- Kolom Kiri: Info Expense -->
                        <div class="flex flex-col min-w-0 pr-2">
                            <span class="text-sm font-bold text-[#171C20] item-type truncate">
                                {{ $savedExp->expense_type ?? $savedExp->expense_name }}
                            </span>
                            <div class="flex items-center gap-1.5 mt-0.5">
                                @if($savedExp->receipt_path)
                                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 item-receipt-badge">
                                        <svg class="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Receipt Attached
                                    </span>
                                @else
                                    <span class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 item-receipt-badge">
                                        No Receipt
                                    </span>
                                @endif
                                @if($savedExp->created_at)
                                    <span class="text-[11px] text-slate-400">
                                        • {{ $savedExp->created_at->format('H:i') }}
                                    </span>
                                @endif
                            </div>
                        </div>

                        <!-- Kolom Kanan: Nominal + Tombol Aksi (Edit & Remove) -->
                        <div class="flex items-center gap-3 shrink-0">
                            <span class="text-sm font-extrabold text-[#004C6B] item-amount">
                                Rp {{ number_format($savedExp->amount, 0, ',', '.') }}
                            </span>

                            <!-- Tombol Aksi Grup -->
                            <div class="flex items-center gap-1">
                                <!-- Tombol Edit (Ikon Pensil) -->
                                <button 
                                    type="button" 
                                    class="btn-edit-expense p-1.5 text-slate-400 hover:text-[#00658D] hover:bg-sky-50 active:scale-90 rounded-lg transition cursor-pointer" 
                                    title="Edit this expense"
                                    aria-label="Edit expense"
                                >
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>

                                <!-- Tombol Remove (Ikon Tempat Sampah) -->
                                <button 
                                    type="button" 
                                    class="btn-delete-expense p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-90 rounded-lg transition cursor-pointer" 
                                    title="Remove this expense"
                                    aria-label="Remove expense"
                                >
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                @empty
                    <div id="empty-saved-placeholder" class="text-center py-4 text-xs text-slate-400 font-medium">
                        No expenses recorded yet. Fill the form below to add.
                    </div>
                @endforelse
            </div>
        </div>

        <!-- 2. Section Header for Form -->
        <div class="flex items-center justify-between pt-1">
            <div class="flex items-center gap-2">
                <h2 id="form-heading" class="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Add New Expense
                </h2>
                <span id="form-mode-badge" class="hidden text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    Editing Mode
                </span>
            </div>
            <button type="button" id="btn-cancel-edit" class="hidden text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition cursor-pointer">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancel Edit</span>
            </button>
        </div>

        <!-- 3. Single Clean Input Form Card -->
        <form 
            id="single-expense-form" 
            action="{{ route('driver.trip.expense.store', ['id' => $trip->id ?? 1]) }}" 
            method="POST" 
            enctype="multipart/form-data"
            class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-4.5 anim-ease-up"
        >
            @csrf
            <input type="hidden" name="expense_id" id="input-expense-id" value="">

            <!-- Input 1: Expense Type (Mandatory) -->
            <div class="flex flex-col gap-1.5">
                <label for="input-type" class="text-xs font-semibold text-[#3E4850] uppercase tracking-wider flex items-center gap-1">
                    <span>Expense Type</span>
                    <span class="text-rose-500 font-bold">*</span>
                </label>
                <input 
                    type="text" 
                    id="input-type"
                    name="type" 
                    placeholder="e.g. Parking, Toll, BBM, Car Wash" 
                    required
                    class="w-full h-12 px-4 rounded-xl border border-[#BDC8D1] bg-white text-[#171C20] text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] outline-none transition"
                >
            </div>

            <!-- Input 2: Amount (IDR) (Mandatory) -->
            <div class="flex flex-col gap-1.5">
                <label for="input-amount" class="text-xs font-semibold text-[#3E4850] uppercase tracking-wider flex items-center gap-1">
                    <span>Amount (IDR)</span>
                    <span class="text-rose-500 font-bold">*</span>
                </label>
                <div class="relative w-full flex items-center">
                    <span class="absolute left-4 font-bold text-sm text-[#00658D] pointer-events-none">Rp</span>
                    <input 
                        type="text" 
                        inputmode="numeric"
                        id="input-amount"
                        name="amount" 
                        placeholder="Contoh: 150.000 atau 150000" 
                        required
                        class="w-full h-12 pl-12 pr-4 rounded-xl border border-[#BDC8D1] bg-white text-[#171C20] text-base font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] outline-none transition"
                    >
                </div>
            </div>

            <!-- Input 3: Receipt Photo (Optional) -->
            <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-[#3E4850] uppercase tracking-wider flex items-center justify-between">
                    <div class="flex items-center gap-1.5">
                        <span>Receipt Photo</span>
                        <span class="text-[11px] text-slate-400 font-normal lowercase">(optional)</span>
                    </div>
                    <span id="receipt-optional-hint" class="hidden text-[11px] text-slate-400 font-normal">
                        (Leave empty to keep existing receipt)
                    </span>
                </label>
                <div id="upload-dropzone" class="relative w-full h-32 bg-[#EFF4FA] border-2 border-dashed border-[#BDC8D1] hover:border-[#00AEEF] rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99] group overflow-hidden">
                    <input 
                        type="file" 
                        id="input-receipt"
                        name="receipt" 
                        accept="image/*" 
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    
                    <!-- Icon Container -->
                    <div id="icon-wrapper" class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform text-[#00658D]">
                        <svg id="camera-icon" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <svg id="check-icon" class="w-5 h-5 hidden text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <!-- Label / Feedback Texts -->
                    <span id="upload-label-text" class="text-xs font-semibold text-[#3E4850] tracking-wide text-center px-4 transition-colors">
                        Tap to Snap / Upload Receipt
                    </span>
                    <span id="upload-subtext" class="text-[10px] text-slate-400 font-normal transition-colors">
                        JPG, PNG max 2MB (Optional)
                    </span>
                </div>
            </div>
        </form>
    </div>

    <!-- Fixed Footer Action -->
    <div class="fixed z-40 bottom-0 left-0 right-0 w-full sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl md:max-w-2xl bg-white/95 backdrop-blur-md border border-[#DEE3E8] sm:rounded-2xl p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:shadow-[0_10px_30px_rgba(0,0,0,0.08)] anim-ease-up delay-5">
        <button 
            type="button" 
            id="btn-save-expense" 
            class="w-full h-12 bg-[#00AEEF] hover:bg-[#009cd7] active:scale-[0.985] text-[#003E58] font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
            <svg id="btn-save-icon" class="w-5 h-5 text-[#003E58]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span id="submit-btn-text">Save Expense</span>
        </button>
    </div>

    <!-- Interactive Script: In-Page Save, Real-time Totals, Toast, Edit & Delete Actions -->
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const form = document.getElementById('single-expense-form');
            const inputId = document.getElementById('input-expense-id');
            const inputType = document.getElementById('input-type');
            const inputAmount = document.getElementById('input-amount');
            const inputReceipt = document.getElementById('input-receipt');
            const btnSave = document.getElementById('btn-save-expense');
            const btnSaveIcon = document.getElementById('btn-save-icon');
            const btnCancelEdit = document.getElementById('btn-cancel-edit');
            const formHeading = document.getElementById('form-heading');
            const formModeBadge = document.getElementById('form-mode-badge');
            const submitBtnText = document.getElementById('submit-btn-text');
            const receiptOptionalHint = document.getElementById('receipt-optional-hint');

            // Toast elements
            const toast = document.getElementById('expense-toast');
            const toastMessage = document.getElementById('toast-message');
            const btnCloseToast = document.getElementById('btn-close-toast');
            let toastTimer = null;

            // Dropzone elements
            const dropzone = document.getElementById('upload-dropzone');
            const labelText = document.getElementById('upload-label-text');
            const subText = document.getElementById('upload-subtext');
            const iconWrapper = document.getElementById('icon-wrapper');
            const cameraIcon = document.getElementById('camera-icon');
            const checkIcon = document.getElementById('check-icon');

            // Saved list elements
            const listContainer = document.getElementById('saved-expenses-list');
            const savedCountEl = document.getElementById('saved-count');
            const savedTotalBadge = document.getElementById('saved-total-badge');

            const storeActionUrl = "{{ route('driver.trip.expense.store', ['id' => $trip->id ?? 1]) }}";
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') 
                || document.querySelector('input[name="_token"]')?.value;

            function parseAmount(val) {
                if (val === null || val === undefined || val === '') return 0;
                if (typeof val === 'number') return Math.round(val);
                let str = String(val).trim();
                // Strip redundant trailing decimal cents like .00 or ,00 if present
                str = str.replace(/[,\.]00$/, '');
                // Remove all non-digit characters (including thousand separators, currency symbols, and spaces)
                const cleanDigits = str.replace(/\D/g, '');
                return parseInt(cleanDigits, 10) || 0;
            }

            function formatRupiah(amount) {
                const cleanNum = parseAmount(amount);
                return 'Rp ' + cleanNum.toLocaleString('id-ID');
            }

            function showToast(message) {
                if (!toast) return;
                if (toastTimer) clearTimeout(toastTimer);

                toastMessage.textContent = message;
                toast.classList.remove('hidden');
                toast.classList.add('flex');

                toastTimer = setTimeout(() => {
                    hideToast();
                }, 4000);
            }

            function hideToast() {
                if (!toast) return;
                toast.classList.add('hidden');
                toast.classList.remove('flex');
            }

            if (btnCloseToast) {
                btnCloseToast.addEventListener('click', hideToast);
            }

            // If session flash is present, set auto-dismiss
            @if(session('success'))
                toastTimer = setTimeout(hideToast, 4000);
            @endif

            function recalculateTotals() {
                const rows = listContainer.querySelectorAll('[id^="expense-row-"]');
                let total = 0;
                rows.forEach(row => {
                    const amt = parseAmount(row.dataset.amount);
                    total += amt;
                });

                if (savedCountEl) savedCountEl.textContent = rows.length;
                if (savedTotalBadge) savedTotalBadge.textContent = 'Total: ' + formatRupiah(total);

                let emptyPlaceholder = document.getElementById('empty-saved-placeholder');
                if (rows.length === 0) {
                    if (!emptyPlaceholder) {
                        emptyPlaceholder = document.createElement('div');
                        emptyPlaceholder.id = 'empty-saved-placeholder';
                        emptyPlaceholder.className = 'text-center py-4 text-xs text-slate-400 font-medium';
                        emptyPlaceholder.textContent = 'No expenses recorded yet. Fill the form below to add.';
                        listContainer.appendChild(emptyPlaceholder);
                    }
                } else if (emptyPlaceholder) {
                    emptyPlaceholder.remove();
                }
            }

            // File input feedback
            inputReceipt.addEventListener('change', function () {
                if (this.files && this.files.length > 0) {
                    const file = this.files[0];
                    dropzone.classList.remove('bg-[#EFF4FA]', 'border-[#BDC8D1]');
                    dropzone.classList.add('bg-emerald-50/70', 'border-emerald-400', 'border-solid');
                    
                    iconWrapper.classList.remove('bg-white', 'text-[#00658D]');
                    iconWrapper.classList.add('bg-emerald-100', 'text-emerald-700');
                    
                    cameraIcon.classList.add('hidden');
                    checkIcon.classList.remove('hidden');

                    labelText.textContent = `✓ ${file.name}`;
                    labelText.classList.remove('text-[#3E4850]');
                    labelText.classList.add('text-emerald-800', 'font-bold');

                    subText.textContent = `Attached (${(file.size / 1024).toFixed(0)} KB) • Tap to change`;
                    subText.classList.remove('text-slate-400');
                    subText.classList.add('text-emerald-600', 'font-medium');
                } else if (!inputId.value) {
                    resetDropzone();
                }
            });

            function resetDropzone() {
                dropzone.classList.add('bg-[#EFF4FA]', 'border-[#BDC8D1]');
                dropzone.classList.remove('bg-emerald-50/70', 'border-emerald-400', 'border-solid');
                
                iconWrapper.classList.add('bg-white', 'text-[#00658D]');
                iconWrapper.classList.remove('bg-emerald-100', 'text-emerald-700');
                
                cameraIcon.classList.remove('hidden');
                checkIcon.classList.add('hidden');

                labelText.textContent = 'Tap to Snap / Upload Receipt';
                labelText.classList.add('text-[#3E4850]');
                labelText.classList.remove('text-emerald-800', 'font-bold');

                subText.textContent = 'JPG, PNG max 2MB (Optional)';
                subText.classList.add('text-slate-400');
                subText.classList.remove('text-emerald-600', 'font-medium');
                inputReceipt.value = '';
            }

            function setDropzoneAttached(label) {
                dropzone.classList.remove('bg-[#EFF4FA]', 'border-[#BDC8D1]');
                dropzone.classList.add('bg-emerald-50/70', 'border-emerald-400', 'border-solid');
                
                iconWrapper.classList.remove('bg-white', 'text-[#00658D]');
                iconWrapper.classList.add('bg-emerald-100', 'text-emerald-700');
                
                cameraIcon.classList.add('hidden');
                checkIcon.classList.remove('hidden');

                labelText.textContent = label || '✓ Receipt Already Attached';
                labelText.classList.remove('text-[#3E4850]');
                labelText.classList.add('text-emerald-800', 'font-bold');

                subText.textContent = 'Tap to upload replacement photo';
                subText.classList.remove('text-slate-400');
                subText.classList.add('text-emerald-600', 'font-medium');
            }

            function resetFormToNew() {
                inputId.value = '';
                inputType.value = '';
                inputAmount.value = '';
                resetDropzone();

                form.action = storeActionUrl;
                formHeading.textContent = 'Add New Expense';
                formModeBadge.classList.add('hidden');
                btnCancelEdit.classList.add('hidden');
                submitBtnText.textContent = 'Save Expense';
                receiptOptionalHint.classList.add('hidden');
            }

            btnCancelEdit.addEventListener('click', function () {
                resetFormToNew();
            });

            // Delegate Edit & Delete button clicks in list
            listContainer.addEventListener('click', function (e) {
                const editBtn = e.target.closest('.btn-edit-expense');
                const deleteBtn = e.target.closest('.btn-delete-expense');

                if (editBtn) {
                    const row = editBtn.closest('[id^="expense-row-"]');
                    if (!row) return;

                    const id = row.dataset.id;
                    const type = row.dataset.type;
                    const amount = row.dataset.amount;
                    const hasReceipt = row.dataset.receipt === '1';

                    // Populate Form for Editing (clean formatted amount)
                    const rawAmt = parseAmount(amount);
                    inputId.value = id;
                    inputType.value = type;
                    inputAmount.value = rawAmt ? rawAmt.toLocaleString('id-ID') : '';

                    form.action = `/driver/expenses/${id}/update`;
                    formHeading.textContent = 'Edit Expense #' + id;
                    formModeBadge.classList.remove('hidden');
                    btnCancelEdit.classList.remove('hidden');
                    submitBtnText.textContent = 'Update Expense';

                    if (hasReceipt) {
                        receiptOptionalHint.classList.remove('hidden');
                        setDropzoneAttached('✓ Previous Receipt Attached');
                    } else {
                        receiptOptionalHint.classList.add('hidden');
                        resetDropzone();
                    }

                    // Smooth scroll to form
                    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    inputType.focus();
                }

                if (deleteBtn) {
                    const row = deleteBtn.closest('[id^="expense-row-"]');
                    if (!row) return;

                    const id = row.dataset.id;
                    const type = row.dataset.type;

                    if (!confirm(`Are you sure you want to remove "${type}" expense?`)) {
                        return;
                    }

                    deleteBtn.disabled = true;
                    row.style.opacity = '0.5';

                    fetch(`/driver/expenses/${id}/delete`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-CSRF-TOKEN': csrfToken
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            row.style.transition = 'all 0.25s ease';
                            row.style.height = '0px';
                            row.style.paddingTop = '0px';
                            row.style.paddingBottom = '0px';
                            row.style.opacity = '0';
                            setTimeout(() => {
                                row.remove();
                                recalculateTotals();
                            }, 250);

                            showToast(data.message || 'Expense removed successfully!');

                            if (inputId.value === id) {
                                resetFormToNew();
                            }
                        } else {
                            alert(data.message || 'Failed to delete expense.');
                            row.style.opacity = '1';
                            deleteBtn.disabled = false;
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        row.remove();
                        recalculateTotals();
                    });
                }
            });

            // AJAX Form Submit Handler (Stays on the same page)
            btnSave.addEventListener('click', function () {
                if (!form.reportValidity()) return;

                btnSave.disabled = true;
                const prevText = submitBtnText.textContent;
                submitBtnText.textContent = inputId.value ? 'Updating...' : 'Saving...';

                const formData = new FormData(form);

                fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    }
                })
                .then(res => res.json())
                .then(data => {
                    btnSave.disabled = false;
                    submitBtnText.textContent = prevText;

                    if (data.success && data.expense) {
                        const isEdit = !!inputId.value;

                        if (isEdit) {
                            // Update existing row
                            const row = document.getElementById(`expense-row-${data.expense.id}`);
                            if (row) {
                                row.dataset.type = data.expense.expense_type || data.expense.expense_name;
                                row.dataset.amount = data.expense.amount;
                                row.dataset.receipt = data.expense.receipt_path ? '1' : '0';

                                const typeEl = row.querySelector('.item-type');
                                const amountEl = row.querySelector('.item-amount');
                                const badgeEl = row.querySelector('.item-receipt-badge');

                                if (typeEl) typeEl.textContent = data.expense.expense_type || data.expense.expense_name;
                                if (amountEl) amountEl.textContent = formatRupiah(data.expense.amount);
                                if (badgeEl) {
                                    if (data.expense.receipt_path) {
                                        badgeEl.className = 'inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 item-receipt-badge';
                                        badgeEl.innerHTML = `<svg class="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg> Receipt Attached`;
                                    } else {
                                        badgeEl.className = 'inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 item-receipt-badge';
                                        badgeEl.innerHTML = 'No Receipt';
                                    }
                                }
                            }
                        } else {
                            // Add new row to the top of list
                            const hasReceipt = !!data.expense.receipt_path;
                            const badgeHtml = hasReceipt ? 
                                `<span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 item-receipt-badge">
                                    <svg class="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Receipt Attached
                                </span>` :
                                `<span class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 item-receipt-badge">
                                    No Receipt
                                </span>`;

                            const newRow = document.createElement('div');
                            newRow.className = 'py-3 flex items-center justify-between first:pt-1 last:pb-1 group transition-all anim-ease-up';
                            newRow.id = `expense-row-${data.expense.id}`;
                            newRow.dataset.id = data.expense.id;
                            newRow.dataset.type = data.expense.expense_type || data.expense.expense_name;
                            newRow.dataset.amount = data.expense.amount;
                            newRow.dataset.notes = data.expense.notes || '';
                            newRow.dataset.receipt = hasReceipt ? '1' : '0';

                            newRow.innerHTML = `
                                <div class="flex flex-col min-w-0 pr-2">
                                    <span class="text-sm font-bold text-[#171C20] item-type truncate">
                                        ${data.expense.expense_type || data.expense.expense_name}
                                    </span>
                                    <div class="flex items-center gap-1.5 mt-0.5">
                                        ${badgeHtml}
                                        <span class="text-[11px] text-slate-400">• Just now</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3 shrink-0">
                                    <span class="text-sm font-extrabold text-[#004C6B] item-amount">
                                        ${formatRupiah(data.expense.amount)}
                                    </span>
                                    <div class="flex items-center gap-1">
                                        <button type="button" class="btn-edit-expense p-1.5 text-slate-400 hover:text-[#00658D] hover:bg-sky-50 active:scale-90 rounded-lg transition cursor-pointer" title="Edit this expense" aria-label="Edit expense">
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button type="button" class="btn-delete-expense p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-90 rounded-lg transition cursor-pointer" title="Remove this expense" aria-label="Remove expense">
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            `;

                            listContainer.prepend(newRow);
                        }

                        recalculateTotals();
                        showToast(data.message || (isEdit ? 'Expense updated successfully!' : 'Expense added successfully!'));
                        resetFormToNew();

                        // Smooth scroll to top list
                        document.getElementById('saved-expenses-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        // Fallback submit
                        form.submit();
                    }
                })
                .catch(err => {
                    console.error(err);
                    btnSave.disabled = false;
                    submitBtnText.textContent = prevText;
                    form.submit();
                });
            });
        });
    </script>
@endsection
