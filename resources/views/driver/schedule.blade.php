@extends('layouts.driver')

@section('content')
@php
    $getTripTypeStyles = function($type) {
        return match($type) {
            'Airport Drop-Off' => [
                'accent_bar' => 'bg-[#EA8C21]',
                'badge' => 'bg-[#FFDCC0] border border-[#FFB876] text-[#6B3B00]',
                'icon_bg' => 'bg-[#FFF4E8]',
                'icon_color' => 'text-[#8D4F00]',
                'box_bg' => 'bg-[#FFF9F2]',
                'box_border' => 'border-[#FFE6D0]',
                'dot_color' => '#EA8C21',
                'btn_border' => 'border-[#8D4F00]',
                'btn_text' => 'text-[#8D4F00]',
                'btn_hover' => 'hover:bg-amber-50',
            ],
            'Hotel Transfers' => [
                'accent_bar' => 'bg-[#10B981]',
                'badge' => 'bg-[#D1F2E0] border border-[#A3E5C2] text-[#0A5A36]',
                'icon_bg' => 'bg-[#EBFBF3]',
                'icon_color' => 'text-[#0A5A36]',
                'box_bg' => 'bg-[#F2FCF7]',
                'box_border' => 'border-[#D1F2E0]',
                'dot_color' => '#10B981',
                'btn_border' => 'border-[#0A5A36]',
                'btn_text' => 'text-[#0A5A36]',
                'btn_hover' => 'hover:bg-emerald-50',
            ],
            'Day Tour' => [
                'accent_bar' => 'bg-[#6366F1]',
                'badge' => 'bg-[#E5DEFF] border border-[#C7B8FF] text-[#372773]',
                'icon_bg' => 'bg-[#F3EFFF]',
                'icon_color' => 'text-[#4338CA]',
                'box_bg' => 'bg-[#F8F6FF]',
                'box_border' => 'border-[#E5DEFF]',
                'dot_color' => '#6366F1',
                'btn_border' => 'border-[#4338CA]',
                'btn_text' => 'text-[#4338CA]',
                'btn_hover' => 'hover:bg-indigo-50',
            ],
            default => [ // Airport Pick-Up
                'accent_bar' => 'bg-[#00AEEF]',
                'badge' => 'bg-[#D7E8FF] border border-[#ABC7FF] text-[#004C6B]',
                'icon_bg' => 'bg-[#E4E9EE]',
                'icon_color' => 'text-[#00658D]',
                'box_bg' => 'bg-[#F5FAFF]',
                'box_border' => 'border-[#DEE3E8]',
                'dot_color' => '#00AEEF',
                'btn_border' => 'border-[#00658D]',
                'btn_text' => 'text-[#00658D]',
                'btn_hover' => 'hover:bg-sky-50',
            ],
        };
    };
@endphp

    <!-- Top App Bar Header (Full-Width Edge-to-Edge) -->
    <header class="w-full bg-[#3E5E95] border-b border-white/10 shadow-sm sticky top-0 z-30 anim-ease-up">
        <div class="max-w-6xl mx-auto h-[64px] px-4 sm:px-8 lg:px-12 flex items-center justify-between">
            <button type="button" class="btn-open-driver-profile flex items-center gap-3 group text-left cursor-pointer focus:outline-none">
                <img 
                    src="{{ $driver->profile_photo_url ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }}" 
                    alt="Wayan Profile Avatar" 
                    class="w-[40px] h-[40px] border-2 border-white rounded-full object-cover shadow-sm transition-transform duration-200 group-hover:scale-105 active:scale-95 shrink-0"
                />
                <h1 class="text-white text-lg font-bold group-hover:text-sky-200 transition-colors">Driver Portal</h1>
            </button>
            <button type="button" class="btn-open-driver-profile p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer" title="View Profile">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            </button>
        </div>
    </header>

    <!-- Main Container Content (Centered Max-w-6xl) -->
    <div class="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 w-full py-5 pb-28 sm:pb-32 flex flex-col gap-5 font-['Inter'] selection:bg-[#00AEEF] selection:text-white">
        <!-- Screen Title -->
        <div class="anim-ease-up delay-1">
            <h2 class="text-[#171C20] text-2xl font-bold tracking-tight">My Schedule</h2>
        </div>

        <!-- Month Navigation Header & Calendar Card -->
        <div class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 anim-ease-up delay-1">
        <!-- Month Navigation Header -->
        <div class="flex items-center justify-between mb-4 pb-3.5 border-b border-slate-100">
            <a href="{{ route('driver.schedule', ['month' => $prevMonth]) }}" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-90 text-slate-600 transition cursor-pointer border border-slate-200/60" title="Bulan Sebelumnya" aria-label="Previous Month">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </a>

            <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-[#00658D]">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 class="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">{{ $monthName }}</h2>
            </div>

            <a href="{{ route('driver.schedule', ['month' => $nextMonth]) }}" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 active:scale-90 text-slate-600 transition cursor-pointer border border-slate-200/60" title="Bulan Berikutnya" aria-label="Next Month">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </a>
        </div>

        <!-- Days of Week Header (Sun - Sat) -->
        <div class="grid grid-cols-7 text-center mb-2.5">
            <span class="text-[11px] sm:text-xs font-bold text-rose-500 tracking-wider uppercase py-1">Min</span>
            <span class="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase py-1">Sen</span>
            <span class="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase py-1">Sel</span>
            <span class="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase py-1">Rab</span>
            <span class="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase py-1">Kam</span>
            <span class="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase py-1">Jum</span>
            <span class="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase py-1">Sab</span>
        </div>

        <!-- Calendar Days Grid (7 Columns) -->
        <div id="calendar-days-grid" class="grid grid-cols-7 gap-1.5 sm:gap-2.5 text-center">
            @foreach($calendarDays as $day)
                @php
                    $isSel = $day['is_selected'];
                    $isToday = $day['is_today'];
                    $isCurr = $day['is_current_month'];
                    $count = $day['trip_count'];
                    $dateKey = $day['date'];
                @endphp
                <button 
                    type="button"
                    class="calendar-day-btn group w-full min-h-[46px] sm:min-h-[52px] p-1.5 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer active:scale-90
                        {{ $isSel ? 'active-selected' : '' }}
                        {{ !$isSel && $isToday ? 'is-today' : '' }}
                        {{ !$isSel && !$isToday && $isCurr ? 'text-slate-800 hover:bg-slate-100 font-semibold border border-slate-100 hover:border-slate-200' : '' }}
                        {{ !$isSel && !$isCurr ? 'text-slate-300 font-normal opacity-30 hover:opacity-70 border border-transparent' : '' }}
                    "
                    data-date="{{ $dateKey }}"
                    data-count="{{ $count }}"
                    data-formatted="{{ \Carbon\Carbon::parse($dateKey)->format('l, d F Y') }}"
                >
                    <span class="text-sm sm:text-base leading-none day-text">{{ $day['day_number'] }}</span>
                    
                    <!-- Trip Dot Indicator -->
                    <div class="h-2 flex items-center justify-center gap-1 mt-1 pointer-events-none">
                        @if($count > 0)
                            <span class="trip-dot w-1.5 h-1.5 rounded-full"></span>
                        @endif
                    </div>
                </button>
            @endforeach
        </div>
    </div>

    <!-- Selected Date Header & Trip Counter -->
    <div class="flex items-center justify-between anim-ease-up delay-2 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
            <span id="selected-date-label" class="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {{ \Carbon\Carbon::parse($selectedDate)->format('l, d F Y') }}
            </span>
            <h3 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                Scheduled Trips
            </h3>
        </div>
        <span id="trip-count-badge" class="px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold bg-sky-50 text-[#00658D] border border-sky-200/80 shrink-0 shadow-2xs">
            {{ $trips->count() }} {{ $trips->count() === 1 ? 'Trip' : 'Trips' }}
        </span>
    </div>

    <!-- Trip Cards Container (Dynamic Render Container) -->
    <div id="trip-cards-container" class="flex flex-col gap-4">
    @forelse($trips as $index => $trip)
        @php
            $delayClass = 'delay-' . min(5, $index + 3);
            $type = $trip->trip_type;
            $style = $getTripTypeStyles($type);
            $isCompleted = ($trip->status === 'completed');
            $durText = $trip->duration_est ? trim(preg_replace('/^Est\.\s*/i', '', $trip->duration_est)) : null;
        @endphp

        <!-- TICKET CARD -->
        <div class="trip-ticket-card w-full {{ $isCompleted ? 'bg-[#FAFCFD] opacity-90 border-slate-200/80' : 'bg-white border-slate-200/80' }} rounded-2xl sm:rounded-3xl shadow-xs border relative overflow-hidden flex flex-col anim-ease-up {{ $delayClass }} transition-all hover:shadow-md hover:border-slate-300">
            <!-- Left Accent Strip -->
            <div class="absolute left-0 top-0 bottom-0 w-1.5 {{ $isCompleted ? 'bg-emerald-500' : $style['accent_bar'] }}"></div>

            <!-- Card Header (Two-Column Layout) -->
            <div class="pt-4 pb-3.5 px-5 sm:px-6 flex items-center">
                <!-- Kolom Kiri (Waktu & Durasi) -->
                <div class="w-28 min-w-[105px] shrink-0 pr-4 border-r border-slate-200 flex flex-col justify-center">
                    <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Inter'] leading-none tracking-tight">{{ $trip->trip_time }}</h3>
                    @if($durText)
                    <div class="text-[11px] text-slate-400 font-normal flex items-center gap-1 mt-1.5 whitespace-nowrap">
                        <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <span class="whitespace-nowrap">{{ $durText }}</span>
                    </div>
                    @endif
                </div>

                <!-- Kolom Kanan (Informasi Tamu & Badge) -->
                <div class="flex-1 min-w-0 pl-4 flex flex-col justify-center">
                    <h4 class="font-bold text-sm sm:text-base text-slate-900 leading-snug truncate">{{ $trip->guest_name }}</h4>
                    <div class="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        <!-- Badge Pill Pastel -->
                        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide shrink-0 whitespace-nowrap shadow-2xs {{ $style['badge'] }}">
                            {{ $trip->trip_type }}
                        </span>
                        @if($isCompleted)
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0 whitespace-nowrap shadow-2xs">
                            <svg class="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Completed
                        </span>
                        @endif
                    </div>
                </div>
            </div>

            <!-- Perforated Ticket Tear Line with Cutout Notches -->
            <div class="relative flex items-center my-0.5 w-full overflow-hidden">
                <div class="w-4 h-4 bg-[#F8FAFC] rounded-full border-r border-slate-200 -ml-2 shrink-0 z-10"></div>
                <div class="grow border-t-2 border-dashed border-slate-200 mx-1"></div>
                <div class="w-4 h-4 bg-[#F8FAFC] rounded-full border-l border-slate-200 -mr-2 shrink-0 z-10"></div>
            </div>

            <!-- Card Body -->
            <div class="pt-2 pb-4 px-5 sm:px-6 flex flex-col gap-3">
                @if($trip->pax_description || $trip->pax)
                <div class="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                    <svg class="w-4 h-4 text-[#00658D] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    <span class="truncate">{{ $trip->pax_description ?? ($trip->pax . ' Guest • ' . ($trip->vehicle_type ?? 'Standard Sedan')) }}</span>
                </div>
                @endif

                <!-- Route Timeline Box -->
                <div class="w-full {{ $style['box_bg'] }} border {{ $style['box_border'] }} rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-stretch gap-3">
                    <!-- Timeline Dots Column -->
                    <div class="flex flex-col items-center w-3 shrink-0 py-0.5">
                        <div class="w-2.5 h-2.5 rounded-full border-2 bg-white shrink-0" style="border-color: {{ $style['dot_color'] }}"></div>
                        <div class="w-[2px] grow my-1 bg-slate-200"></div>
                        <div class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: {{ $style['dot_color'] }}"></div>
                    </div>
                    <!-- Details Text Column -->
                    <div class="flex flex-col justify-between grow gap-2 text-xs sm:text-sm min-w-0">
                        <div class="min-w-0">
                            <span class="text-slate-400 font-semibold tracking-wider block uppercase text-[10px]">Pick-up</span>
                            <span class="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5 truncate">{{ $trip->pickup_location }}</span>
                        </div>
                        <div class="min-w-0">
                            <span class="text-slate-400 font-semibold tracking-wider block uppercase text-[10px]">Drop-off / Route</span>
                            <span class="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5 truncate">{{ $trip->dropoff_location }}</span>
                        </div>
                    </div>
                </div>

                <!-- CTA Button -->
                <a href="{{ route('driver.trip.detail', ['id' => $trip->id, 'from' => 'schedule', 'date' => $selectedDate, 'month' => $monthParam]) }}" class="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-[0.985] shadow-2xs cursor-pointer {{ $style['btn_border'] }} {{ $style['btn_text'] }} {{ $style['btn_hover'] }}">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                    <span>View Trip Details</span>
                </a>
            </div>
        </div>
    @empty
        <!-- Empty State -->
        <div class="empty-state-card bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-xs anim-ease-up">
            <div class="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3 shadow-2xs">
                <svg class="w-7 h-7 text-[#00658D]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <h4 class="text-base sm:text-lg font-bold text-slate-900 mb-1">No trips scheduled for this date</h4>
            <p class="text-xs sm:text-sm text-slate-400 max-w-[280px] leading-relaxed">Enjoy your rest day or choose another date on the calendar above.</p>
        </div>
    @endforelse
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const scheduleData = @json($tripsByDate);
        const currentMonthParam = "{{ $monthParam }}";
        const dayButtons = document.querySelectorAll('.calendar-day-btn');
        const cardsContainer = document.getElementById('trip-cards-container');
        const selectedDateLabel = document.getElementById('selected-date-label');
        const tripCountBadge = document.getElementById('trip-count-badge');

        const styleMap = {
            'Airport Drop-Off': {
                accent_bar: 'bg-[#EA8C21]',
                badge: 'bg-[#FFDCC0] border border-[#FFB876] text-[#6B3B00]',
                icon_bg: 'bg-[#FFF4E8]',
                icon_color: 'text-[#8D4F00]',
                box_bg: 'bg-[#FFF9F2]',
                box_border: 'border-[#FFE6D0]',
                dot_color: '#EA8C21',
                btn_border: 'border-[#8D4F00]',
                btn_text: 'text-[#8D4F00]',
                btn_hover: 'hover:bg-amber-50'
            },
            'Hotel Transfers': {
                accent_bar: 'bg-[#10B981]',
                badge: 'bg-[#D1F2E0] border border-[#A3E5C2] text-[#0A5A36]',
                icon_bg: 'bg-[#EBFBF3]',
                icon_color: 'text-[#0A5A36]',
                box_bg: 'bg-[#F2FCF7]',
                box_border: 'border-[#D1F2E0]',
                dot_color: '#10B981',
                btn_border: 'border-[#0A5A36]',
                btn_text: 'text-[#0A5A36]',
                btn_hover: 'hover:bg-emerald-50'
            },
            'Day Tour': {
                accent_bar: 'bg-[#6366F1]',
                badge: 'bg-[#E5DEFF] border border-[#C7B8FF] text-[#372773]',
                icon_bg: 'bg-[#F3EFFF]',
                icon_color: 'text-[#4338CA]',
                box_bg: 'bg-[#F8F6FF]',
                box_border: 'border-[#E5DEFF]',
                dot_color: '#6366F1',
                btn_border: 'border-[#4338CA]',
                btn_text: 'text-[#4338CA]',
                btn_hover: 'hover:bg-indigo-50'
            },
            'Airport Pick-Up': {
                accent_bar: 'bg-[#00AEEF]',
                badge: 'bg-[#D7E8FF] border border-[#ABC7FF] text-[#004C6B]',
                icon_bg: 'bg-[#E4E9EE]',
                icon_color: 'text-[#00658D]',
                box_bg: 'bg-[#F5FAFF]',
                box_border: 'border-[#DEE3E8]',
                dot_color: '#00AEEF',
                btn_border: 'border-[#00658D]',
                btn_text: 'text-[#00658D]',
                btn_hover: 'hover:bg-sky-50'
            }
        };

        dayButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const dateKey = this.dataset.date;
                const formattedDate = this.dataset.formatted;

                // 1. Reset all buttons
                dayButtons.forEach(b => {
                    b.classList.remove('active-selected');
                });

                // 2. Set Active Button
                this.classList.add('active-selected');

                // 3. Update Label & Badge
                if (selectedDateLabel) selectedDateLabel.textContent = formattedDate;

                // 4. Render Trips for date
                const trips = scheduleData[dateKey] || [];
                if (tripCountBadge) {
                    tripCountBadge.textContent = `${trips.length} ${trips.length === 1 ? 'Trip' : 'Trips'}`;
                }

                // Update Browser URL without reload
                const currentUrl = new URL(window.location);
                currentUrl.searchParams.set('date', dateKey);
                window.history.replaceState({}, '', currentUrl);

                // Render Cards HTML
                if (trips.length === 0) {
                    cardsContainer.innerHTML = `
                        <div class="empty-state-card bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-xs anim-ease-up">
                            <div class="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3 shadow-2xs">
                                <svg class="w-7 h-7 text-[#00658D]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h4 class="text-base sm:text-lg font-bold text-slate-900 mb-1">No trips scheduled for this date</h4>
                            <p class="text-xs sm:text-sm text-slate-400 max-w-[280px] leading-relaxed">Enjoy your rest day or choose another date on the calendar above.</p>
                        </div>
                    `;
                } else {
                    let html = '';
                    trips.forEach((trip, idx) => {
                        const style = styleMap[trip.trip_type] || styleMap['Airport Pick-Up'];
                        const isCompleted = (trip.status === 'completed');
                        const durClean = trip.duration_est ? trip.duration_est.replace(/^Est\.\s*/i, '').trim() : '';
                        const durationHtml = durClean ? `
                            <div class="text-[11px] text-slate-400 font-normal flex items-center gap-1 mt-1.5 whitespace-nowrap">
                                <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                <span class="whitespace-nowrap">${durClean}</span>
                            </div>
                        ` : '';

                        const paxDesc = trip.pax_description || `${trip.pax} Guest • ${trip.vehicle_type || 'Standard Sedan'}`;
                        const completedBadgeHtml = isCompleted ? `
                            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0 whitespace-nowrap shadow-2xs">
                                <svg class="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Completed
                            </span>
                        ` : '';

                        const cardBgClass = isCompleted ? 'bg-[#FAFCFD] opacity-90 border-slate-200/80' : 'bg-white border-slate-200/80';
                        const accentBarClass = isCompleted ? 'bg-emerald-500' : style.accent_bar;

                        html += `
                            <div class="trip-ticket-card w-full ${cardBgClass} rounded-2xl sm:rounded-3xl shadow-xs border relative overflow-hidden flex flex-col anim-ease-up delay-${Math.min(5, idx + 2)} transition-all hover:shadow-md hover:border-slate-300">
                                <div class="absolute left-0 top-0 bottom-0 w-1.5 ${accentBarClass}"></div>

                                <!-- Card Header (Two-Column Layout) -->
                                <div class="pt-4 pb-3.5 px-5 sm:px-6 flex items-center">
                                    <!-- Kolom Kiri (Waktu & Durasi) -->
                                    <div class="w-28 min-w-[105px] shrink-0 pr-4 border-r border-slate-200 flex flex-col justify-center">
                                        <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 font-['Inter'] leading-none tracking-tight">${trip.trip_time}</h3>
                                        ${durationHtml}
                                    </div>

                                    <!-- Kolom Kanan (Informasi Tamu & Badge) -->
                                    <div class="flex-1 min-w-0 pl-4 flex flex-col justify-center">
                                        <h4 class="font-bold text-sm sm:text-base text-slate-900 leading-snug truncate">${trip.guest_name}</h4>
                                        <div class="mt-1.5 flex items-center gap-1.5 flex-wrap">
                                            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide shrink-0 whitespace-nowrap shadow-2xs ${style.badge}">
                                                ${trip.trip_type}
                                            </span>
                                            ${completedBadgeHtml}
                                        </div>
                                    </div>
                                </div>

                                <div class="relative flex items-center my-0.5 w-full overflow-hidden">
                                    <div class="w-4 h-4 bg-[#F8FAFC] rounded-full border-r border-slate-200 -ml-2 shrink-0 z-10"></div>
                                    <div class="grow border-t-2 border-dashed border-slate-200 mx-1"></div>
                                    <div class="w-4 h-4 bg-[#F8FAFC] rounded-full border-l border-slate-200 -mr-2 shrink-0 z-10"></div>
                                </div>

                                <div class="pt-2 pb-4 px-5 sm:px-6 flex flex-col gap-3">
                                    <div class="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
                                        <svg class="w-4 h-4 text-[#00658D] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                        <span class="truncate">${paxDesc}</span>
                                    </div>

                                    <div class="w-full ${style.box_bg} border ${style.box_border} rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-stretch gap-3">
                                        <div class="flex flex-col items-center w-3 shrink-0 py-0.5">
                                            <div class="w-2.5 h-2.5 rounded-full border-2 bg-white shrink-0" style="border-color: ${style.dot_color}"></div>
                                            <div class="w-[2px] grow my-1 bg-slate-200"></div>
                                            <div class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${style.dot_color}"></div>
                                        </div>
                                        <div class="flex flex-col justify-between grow gap-2 text-xs sm:text-sm min-w-0">
                                            <div class="min-w-0">
                                                <span class="text-slate-400 font-semibold tracking-wider block uppercase text-[10px]">Pick-up</span>
                                                <span class="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5 truncate">${trip.pickup_location}</span>
                                            </div>
                                            <div class="min-w-0">
                                                <span class="text-slate-400 font-semibold tracking-wider block uppercase text-[10px]">Drop-off / Route</span>
                                                <span class="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5 truncate">${trip.dropoff_location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <a href="/driver/trips/${trip.id}?from=schedule&date=${dateKey}&month=${encodeURIComponent(currentMonthParam)}" class="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-[0.985] shadow-2xs cursor-pointer ${style.btn_border} ${style.btn_text} ${style.btn_hover}">
                                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                                        <span>View Trip Details</span>
                                    </a>
                                </div>
                            </div>
                        `;
                    });
                    cardsContainer.innerHTML = html;
                }
            });
        });
    });
</script>
@endsection
