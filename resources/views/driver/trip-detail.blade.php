@extends('layouts.driver')

@section('content')
@php
    $from = request()->query('from', 'home');
    $backDate = request()->query('date');
    $backMonth = request()->query('month');

    if ($from === 'schedule') {
        $params = [];
        if ($backDate) {
            $params['date'] = $backDate;
            $params['month'] = $backMonth ?: \Carbon\Carbon::parse($backDate)->format('Y-m');
        } elseif ($backMonth) {
            $params['month'] = $backMonth;
        }
        $backUrl = route('driver.schedule', $params);
    } else {
        $backUrl = route('driver.home');
    }
@endphp

    <!-- Top App Bar Header (Full-width edge to edge) -->
    <div class="w-full h-[60px] bg-white border-b border-[#DEE3E8] sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)] anim-ease-up">
        <div class="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 h-full flex items-center justify-between">
            <!-- Sisi Kiri: Tombol Back -->
            <a href="{{ $backUrl }}" id="btn-back-nav" class="inline-flex items-center gap-1.5 p-2 -ml-2 rounded-xl hover:bg-slate-100 text-[#00658D] transition-all duration-200 ease-out active:scale-95" aria-label="Back">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="text-xs font-semibold">Back</span>
            </a>

            <!-- Sisi Tengah: Teks Judul -->
            <h1 class="text-[#171C20] text-base sm:text-lg font-bold tracking-tight">Trip Details</h1>

            <!-- Sisi Kanan: Profile Avatar Button -->
            <button type="button" class="btn-open-driver-profile p-1 rounded-full text-slate-400 hover:text-slate-600 transition active:scale-95 cursor-pointer" title="Driver Profile">
                <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" 
                    alt="Driver Profile" 
                    class="w-8 h-8 rounded-full border border-[#00AEEF] object-cover"
                >
            </button>
        </div>
    </div>

    <!-- Body Content Wrapper (max-w-6xl) -->
    <div class="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 w-full py-4 flex flex-col gap-4 font-['Inter'] {{ ($trip->status === 'active' || $trip->status === 'up_next') ? 'pb-40 sm:pb-44' : 'pb-24 sm:pb-28' }}">

        @if(session('success'))
            <div class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 anim-ease-up shadow-2xs">
                <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ session('success') }}</span>
            </div>
        @endif

        <!-- Card 1: Rute & Timeline -->
        <div class="p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 anim-ease-up delay-1">
            <!-- Baris Atas Badges -->
            <div class="flex items-center justify-between flex-wrap gap-2">
                @php
                    $type = $trip->trip_type;
                    $detailBadgeStyle = match($type) {
                        'Airport Drop-Off' => 'bg-[#FFDCC0] border border-[#FFB876] text-[#6B3B00]',
                        'Hotel Transfers' => 'bg-[#D1F2E0] border border-[#A3E5C2] text-[#0A5A36]',
                        'Day Tour' => 'bg-[#E5DEFF] border border-[#C7B8FF] text-[#372773]',
                        default => 'bg-[#D7E8FF] border border-[#ABC7FF] text-[#004C6B]',
                    };
                @endphp
                <span class="px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap shadow-2xs {{ $detailBadgeStyle }}">
                    {{ $trip->trip_type }}
                </span>
                @if($trip->flight_number)
                <span class="px-3 py-1 rounded-full bg-[#C6E7FF] text-[#00658D] text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg> 
                    {{ $trip->flight_number }}
                </span>
                @endif
            </div>

            <!-- Tanggal & Waktu -->
            <div class="border-b border-slate-100 pb-3">
                <span class="text-slate-500 text-xs font-medium block">
                    {{ $trip->trip_date ? \Carbon\Carbon::parse($trip->trip_date)->format('l, d F Y') : 'Monday, 24 August 2026' }}
                </span>
                <h2 class="text-[#171C20] text-2xl sm:text-3xl font-bold mt-0.5 tracking-tight">{{ $trip->trip_time }}</h2>
            </div>

            <!-- Route Timeline Component -->
            <div class="flex items-stretch gap-3.5 my-1">
                <!-- Kolom Kiri: Indikator Titik & Garis -->
                <div class="flex flex-col items-center w-4 shrink-0 py-1">
                    <div class="w-3.5 h-3.5 rounded-full border-2 border-[#00AEEF] bg-white shadow-xs shrink-0 animate-[softBreathing_2.8s_ease-in-out_infinite]"></div>
                    <div class="w-[2px] grow my-1 border-l-2 border-dashed border-[#00AEEF]/70"></div>
                    <div class="w-3.5 h-3.5 rounded-full bg-[#00AEEF] shadow-xs shrink-0"></div>
                </div>

                <!-- Kolom Kanan: Detail Teks Lokasi -->
                <div class="flex flex-col justify-between grow gap-5">
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                            Pickup Point
                        </span>
                        <span class="text-sm sm:text-base font-bold text-[#171C20] leading-snug block mt-0.5">
                            {{ $trip->pickup_location }}
                        </span>
                    </div>

                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                            Drop-off Point / Route
                        </span>
                        <span class="text-sm sm:text-base font-bold text-[#171C20] leading-snug block mt-0.5">
                            {{ $trip->dropoff_location }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Card 2: Detail Tamu & Catatan Khusus -->
        <div class="p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 anim-ease-up delay-2">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-[#EAEEF4] rounded-xl flex items-center justify-center text-[#00658D] shadow-2xs">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Guest Information</span>
                        <h2 class="text-base sm:text-lg font-bold text-[#171C20]">{{ $trip->guest_name }}</h2>
                    </div>
                </div>
                @if($trip->guest_type)
                <span class="bg-slate-100 text-[#00658D] text-xs font-semibold px-2.5 py-1 rounded-full">
                    {{ $trip->guest_type }}
                </span>
                @endif
            </div>

            <div class="border-b border-slate-100"></div>

            <div class="flex flex-col gap-3">
                @php
                    $cleanPhone = preg_replace('/[^0-9]/', '', $trip->guest_phone ?? '6281234567890');
                @endphp
                
                <!-- Baris Nomor Telepon (Interaktif + WhatsApp Action) -->
                <div class="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                    <a href="tel:{{ $trip->guest_phone ?? '+6281234567890' }}" class="flex items-center gap-2.5 text-slate-700 hover:text-[#00658D] text-xs sm:text-sm font-medium transition-all duration-200 ease-out active:scale-95">
                        <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{{ $trip->guest_phone ?? '+62 812-3456-7890' }}</span>
                    </a>

                    <!-- Quick Action: WhatsApp Button -->
                    <a href="https://wa.me/{{ $cleanPhone }}" target="_blank" rel="noopener noreferrer" class="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-all duration-200 ease-out active:scale-95 flex items-center gap-1.5 text-xs font-bold shadow-2xs">
                        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                        <span>WhatsApp</span>
                    </a>
                </div>

                <!-- Info Grid: Vehicle Type & Passengers -->
                <div class="grid grid-cols-2 gap-2.5">
                    <div class="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg bg-sky-50 text-[#00658D] flex items-center justify-center shrink-0">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <span class="text-[9px] uppercase font-bold text-slate-400 block leading-tight">Passengers</span>
                            <span class="text-xs sm:text-sm font-bold text-[#171C20]">{{ $trip->pax_description ?? ($trip->pax . ' Pax') }}</span>
                        </div>
                    </div>

                    @if($trip->vehicle_type)
                    <div class="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg bg-sky-50 text-[#00658D] flex items-center justify-center shrink-0">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8 17a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4zM3 9l2-4h10l2 4M3 9h18v7a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" />
                            </svg>
                        </div>
                        <div class="truncate">
                            <span class="text-[9px] uppercase font-bold text-slate-400 block leading-tight">Vehicle</span>
                            <span class="text-xs sm:text-sm font-bold text-[#171C20] truncate block">{{ $trip->vehicle_type }}</span>
                        </div>
                    </div>
                    @endif
                </div>

                <!-- Special Requirements Highlight -->
                @if($trip->special_requirements)
                <div class="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-amber-900 text-xs sm:text-sm font-semibold shadow-2xs">
                    <svg class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <div>
                        <span class="font-bold block text-amber-950 uppercase text-[10px] tracking-wider mb-0.5">Special Request</span>
                        <span>{{ $trip->special_requirements }}</span>
                    </div>
                </div>
                @endif

                <!-- Notes Box -->
                @if($trip->notes)
                <div class="bg-[#EFF4FA] rounded-xl p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed border border-[#DEE3E8]/60 shadow-2xs">
                    <div class="w-4 h-4 min-w-[16px] rounded-full bg-[#00658D] text-white flex items-center justify-center text-[9px] font-bold mt-0.5 shadow-xs">
                        i
                    </div>
                    <div>
                        <span class="font-bold text-[#171C20] block mb-0.5 uppercase tracking-wider text-[10px]">Important Note</span>
                        <span>"{{ $trip->notes }}"</span>
                    </div>
                </div>
                @endif
            </div>
        </div>

        <!-- Card 3: Logged Expenses Summary -->
        <div class="p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3 anim-ease-up delay-3">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-lg bg-sky-50 text-[#00658D] flex items-center justify-center">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 class="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">Logged Expenses</h3>
                </div>
                <span class="text-xs sm:text-sm font-extrabold text-[#00658D] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                    Rp {{ number_format(isset($trip->expenses) ? $trip->expenses->sum('amount') : 0, 0, ',', '.') }}
                </span>
            </div>
            
            @if(isset($trip->expenses) && $trip->expenses->count() > 0)
                <div class="flex flex-col divide-y divide-slate-50 text-xs sm:text-sm">
                    @foreach($trip->expenses as $exp)
                        <div class="py-2.5 flex items-center justify-between">
                            <span class="text-slate-700 font-medium">{{ $exp->expense_type ?? $exp->expense_name }}</span>
                            <span class="font-bold text-slate-900">Rp {{ number_format($exp->amount, 0, ',', '.') }}</span>
                        </div>
                    @endforeach
                </div>
            @else
                <p class="text-xs sm:text-sm text-slate-400 italic py-1">No expenses recorded for this trip yet.</p>
            @endif
        </div>

        <!-- Fixed Bottom Action Panel (Responsive: Full-width on mobile, Floating centered pill on tablet & desktop) -->
        <div class="fixed z-40 transition-all duration-200 bottom-0 left-0 right-0 w-full sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl md:max-w-2xl sm:rounded-2xl sm:border sm:border-slate-200/80 sm:shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-4 anim-ease-up delay-4">
            @if($trip->status === 'active' || $trip->status === 'up_next')
                <div class="flex items-center gap-3">
                    <!-- Tombol Outline '+ Add Expense' -->
                    <a href="{{ route('driver.trip.expense', array_merge(['id' => $trip->id], request()->only(['from', 'date', 'month']))) }}" class="h-13 px-4 sm:px-5 shrink-0 rounded-2xl border border-[#BDC8D1] text-[#00658D] font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.985] transition-all shadow-2xs cursor-pointer" title="Add Expense">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span class="hidden sm:inline">Add Expense</span>
                    </a>

                    <!-- Slider Bar 'Slide to Complete Trip' -->
                    <div 
                        id="slider-track" 
                        class="w-full grow h-13 bg-[#EAEEF4] rounded-full relative flex items-center p-1 shadow-inner select-none overflow-hidden touch-none"
                    >
                        <!-- Dynamic Progress Fill Track -->
                        <div 
                            id="slider-progress" 
                            class="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#00AEEF]/20 to-[#00AEEF]/40 rounded-full w-0 pointer-events-none transition-all duration-75"
                        ></div>

                        <!-- Center Text Label -->
                        <span 
                            id="slider-text" 
                            class="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 font-semibold text-xs sm:text-sm tracking-wide pl-6 transition-opacity duration-150"
                        >
                            Slide to Complete Trip
                        </span>

                        <!-- Left Blue Round Button (Thumb) -->
                        <div 
                            id="slider-thumb" 
                            class="h-11 w-11 aspect-square rounded-full bg-[#00AEEF] text-white flex items-center justify-center shadow-md shrink-0 z-10 cursor-grab active:cursor-grabbing select-none touch-none will-change-transform transition-colors duration-300"
                        >
                            <!-- Arrow Right Icon -->
                            <svg id="icon-arrow" class="w-5 h-5 text-white transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>

                            <!-- Checkmark Icon (Initially Hidden) -->
                            <svg id="icon-check" class="w-5 h-5 text-white hidden animate-[scaleUp_0.25s_ease-out]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    <!-- Hidden Form Fallback -->
                    <form id="form-complete-trip" action="{{ route('driver.trip.complete', ['id' => $trip->id]) }}" method="POST" class="hidden">
                        @csrf
                    </form>
                </div>
            @elseif($trip->status === 'completed')
                <div class="w-full py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs">
                    <div class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <span>Trip Completed • All tasks finished</span>
                </div>
            @else
                <div class="w-full py-3 px-4 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-600 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Scheduled Trip • Actions available on departure</span>
                </div>
            @endif
        </div>
    </div>

    <!-- Success Toast / Overlay Notification -->
    <div id="completion-overlay" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-6 opacity-0 pointer-events-none transition-opacity duration-300">
        <div class="bg-white rounded-2xl p-6 shadow-2xl max-w-xs w-full text-center flex flex-col items-center gap-3 transform scale-90 transition-transform duration-300" id="completion-modal-card">
            <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h4 class="text-base font-bold text-[#171C20]">Trip Completed!</h4>
            <p class="text-xs text-slate-500">Redirecting to driver portal...</p>
        </div>
    </div>

    @if($trip->status === 'active' || $trip->status === 'up_next')
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                const track = document.getElementById('slider-track');
                const thumb = document.getElementById('slider-thumb');
                const progress = document.getElementById('slider-progress');
                const text = document.getElementById('slider-text');
                const iconArrow = document.getElementById('icon-arrow');
                const iconCheck = document.getElementById('icon-check');
                const formComplete = document.getElementById('form-complete-trip');
                const overlay = document.getElementById('completion-overlay');
                const modalCard = document.getElementById('completion-modal-card');

                if (!track || !thumb) return;

                let isDragging = false;
                let startX = 0;
                let currentX = 0;
                let isCompleted = false;

                function getMaxDrag() {
                    const trackPadding = 8;
                    return Math.max(0, track.clientWidth - thumb.offsetWidth - trackPadding);
                }

                function onStart(e) {
                    if (isCompleted) return;
                    isDragging = true;
                    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                    
                    thumb.style.transition = 'none';
                    if (progress) progress.style.transition = 'none';
                    if (text) text.style.transition = 'none';
                }

                function onMove(e) {
                    if (!isDragging || isCompleted) return;

                    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                    const deltaX = clientX - startX;
                    const maxDrag = getMaxDrag();

                    currentX = Math.max(0, Math.min(deltaX, maxDrag));
                    const ratio = maxDrag > 0 ? currentX / maxDrag : 0;

                    thumb.style.transform = `translate3d(${currentX}px, 0, 0)`;

                    if (progress) {
                        progress.style.width = `${currentX + thumb.offsetWidth + 4}px`;
                    }

                    if (text) {
                        text.style.opacity = Math.max(0, 1 - (ratio * 1.5));
                    }
                }

                function onEnd() {
                    if (!isDragging || isCompleted) return;
                    isDragging = false;

                    const maxDrag = getMaxDrag();
                    const ratio = maxDrag > 0 ? currentX / maxDrag : 0;

                    if (ratio >= 0.82) {
                        triggerCompletion(maxDrag);
                    } else {
                        snapBack();
                    }
                }

                function snapBack() {
                    currentX = 0;
                    thumb.style.transition = 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    thumb.style.transform = 'translate3d(0px, 0, 0)';

                    if (progress) {
                        progress.style.transition = 'width 0.35s ease-out';
                        progress.style.width = '0px';
                    }

                    if (text) {
                        text.style.transition = 'opacity 0.25s ease-out';
                        text.style.opacity = '1';
                    }
                }

                function triggerCompletion(maxDrag) {
                    isCompleted = true;
                    currentX = maxDrag;

                    thumb.style.transition = 'transform 0.2s ease-out, background-color 0.3s ease';
                    thumb.style.transform = `translate3d(${maxDrag}px, 0, 0)`;
                    thumb.classList.remove('bg-[#00AEEF]');
                    thumb.classList.add('bg-emerald-500');

                    if (progress) {
                        progress.style.transition = 'all 0.3s ease';
                        progress.style.width = '100%';
                        progress.classList.remove('from-[#00AEEF]/20', 'to-[#00AEEF]/40');
                        progress.classList.add('bg-emerald-100');
                    }

                    track.classList.add('border', 'border-emerald-200');

                    if (iconArrow) iconArrow.classList.add('hidden');
                    if (iconCheck) iconCheck.classList.remove('hidden');

                    if (text) {
                        text.style.transition = 'opacity 0.2s ease';
                        text.style.opacity = '0';
                    }

                    if (navigator.vibrate) {
                        navigator.vibrate([40, 60, 120]);
                    }

                    if (overlay && modalCard) {
                        overlay.classList.remove('opacity-0', 'pointer-events-none');
                        overlay.classList.add('opacity-100');
                        modalCard.classList.remove('scale-90');
                        modalCard.classList.add('scale-100');
                    }

                    const actionUrl = formComplete ? formComplete.action : "{{ route('driver.trip.complete', ['id' => $trip->id]) }}";
                    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') 
                        || formComplete?.querySelector('input[name="_token"]')?.value;

                    setTimeout(() => {
                        fetch(actionUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'X-CSRF-TOKEN': token
                            }
                        })
                        .then(res => res.json())
                        .then(data => {
                            window.location.href = data.redirect_url || "{{ route('driver.home') }}";
                        })
                        .catch(() => {
                            if (formComplete) {
                                formComplete.submit();
                            } else {
                                window.location.href = "{{ route('driver.home') }}";
                            }
                        });
                    }, 650);
                }

                thumb.addEventListener('touchstart', onStart, { passive: true });
                window.addEventListener('touchmove', onMove, { passive: true });
                window.addEventListener('touchend', onEnd);
                window.addEventListener('touchcancel', onEnd);

                thumb.addEventListener('mousedown', onStart);
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onEnd);
            });
        </script>
    @endif
@endsection
