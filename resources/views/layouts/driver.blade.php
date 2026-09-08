<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? 'Driver Portal - Bali Family Safe' }}</title>
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])

    <style>
        @keyframes elegantFadeUp {
            0% {
                opacity: 0;
                transform: translate3d(0, 14px, 0);
            }
            100% {
                opacity: 1;
                transform: translate3d(0, 0, 0);
            }
        }

        @keyframes softBreathing {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.55;
                transform: scale(0.94);
            }
        }

        .anim-ease-up {
            animation: elegantFadeUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
            will-change: transform, opacity;
            backface-visibility: hidden;
        }

        /* Stagger delay yang natural dan berdekatan */
        .delay-1 { animation-delay: 40ms; }
        .delay-2 { animation-delay: 130ms; }
        .delay-3 { animation-delay: 220ms; }
        .delay-4 { animation-delay: 310ms; }
        .delay-5 { animation-delay: 400ms; }

        /* Cross-browser Hide Scrollbar */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
</head>
<body class="antialiased bg-[#F8F9FA] text-slate-800 selection:bg-[#00AEEF] selection:text-white font-['Inter']">
    @php
        $authDriver = \Illuminate\Support\Facades\Auth::guard('driver')->user() ?? \App\Models\Driver::first();
    @endphp

    @if(request()->routeIs('driver.login'))
        {{-- Halaman Login Khusus (Centered & Responsive Container across all devices) --}}
        <div class="min-h-screen min-h-dvh bg-slate-100 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 selection:bg-[#00AEEF] selection:text-white">
            @yield('content')
        </div>
    @else
        {{-- Layout Driver Utama: Full-Width Viewport Container --}}
        <div class="min-h-screen bg-[#F8F9FA] flex flex-col justify-start relative font-['Inter']">
            
            <!-- Main Content Slot (Full-width allowing edge-to-edge headers) -->
            <main class="flex-1 w-full flex flex-col">
                @yield('content')
            </main>

            <!-- Bottom Navigation Bar (Responsive: Full-width on mobile, Floating centered pill on tablet & desktop) -->
            @if(!request()->routeIs('driver.trip.*'))
            <nav class="fixed z-50 transition-all duration-200 bottom-0 left-0 right-0 w-full sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl md:max-w-2xl sm:rounded-2xl sm:border sm:border-slate-200/80 sm:shadow-[0_10px_30px_rgba(0,0,0,0.08)] h-[64px] bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-8 flex items-center justify-around">
                <!-- Tab Beranda -->
                <a href="{{ route('driver.home') }}" class="group relative flex flex-col items-center justify-center w-24 h-full transition-transform duration-200 ease-out active:scale-95">
                    @if(request()->routeIs('driver.home'))
                        <span class="absolute top-0 h-[2.5px] w-12 rounded-b-full bg-[#00AEEF] transition-all duration-300 ease-out"></span>
                        <svg class="w-6 h-6 text-[#00AEEF] transition-transform duration-200 group-active:scale-95" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                        </svg>
                        <span class="text-[11px] font-semibold text-[#00658D] mt-0.5 tracking-tight">Beranda</span>
                    @else
                        <svg class="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors duration-200 group-active:scale-95" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                        </svg>
                        <span class="text-[11px] font-medium text-slate-400 group-hover:text-slate-600 mt-0.5 tracking-tight">Beranda</span>
                    @endif
                </a>

                <!-- Tab Schedule -->
                <a href="{{ route('driver.schedule') }}" class="group relative flex flex-col items-center justify-center w-24 h-full transition-transform duration-200 ease-out active:scale-95">
                    @if(request()->routeIs('driver.schedule'))
                        <span class="absolute top-0 h-[2.5px] w-12 rounded-b-full bg-[#00AEEF] transition-all duration-300 ease-out"></span>
                        <svg class="w-6 h-6 text-[#00AEEF] transition-transform duration-200 group-active:scale-95" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span class="text-[11px] font-semibold text-[#00658D] mt-0.5 tracking-tight">Schedule</span>
                    @else
                        <svg class="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors duration-200 group-active:scale-95" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span class="text-[11px] font-medium text-slate-400 group-hover:text-slate-600 mt-0.5 tracking-tight">Schedule</span>
                    @endif
                </a>
            </nav>
            @endif
        </div>
    @endif

    <!-- Driver Profile Modal / Bottom Sheet Popup (Global) -->
    <div id="driver-profile-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99] transition-opacity duration-300 opacity-0 pointer-events-none"></div>

    <div id="driver-profile-sheet" class="fixed bottom-0 sm:bottom-auto sm:top-1/2 left-1/2 -translate-x-1/2 w-full max-w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl z-[100] transition-all duration-300 ease-out translate-y-full sm:translate-y-[-40%] opacity-0 pointer-events-none">
        <!-- Top Drag Handle (Mobile) -->
        <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden"></div>

        <!-- Header Modal: Profile Avatar, Name, Driver ID & Close Button -->
        <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3.5">
                <img 
                    src="{{ $authDriver->profile_photo_url ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }}" 
                    alt="{{ $authDriver->full_name ?? 'Driver' }}" 
                    class="w-14 h-14 rounded-full object-cover border-2 border-[#00AEEF] shadow-sm shrink-0"
                >
                <div class="flex flex-col min-w-0">
                    <h3 class="text-base font-bold text-[#171C20] leading-tight truncate">
                        {{ $authDriver->full_name ?? 'Wayan Arta' }}
                    </h3>
                    <span class="text-xs text-slate-500 mt-1">
                        ID: <strong class="text-slate-700 font-semibold">DRV-00{{ $authDriver->id ?? 1 }}</strong>
                    </span>
                </div>
            </div>

            <!-- Close Button (X) -->
            <button type="button" id="btn-close-driver-profile" class="p-2 -mr-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer" aria-label="Close modal">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Account Info Box -->
        <div class="bg-[#EFF4FA] border border-[#DEE3E8] rounded-xl p-3.5 mb-5 flex flex-col gap-2.5 text-xs">
            <div class="flex justify-between items-center text-slate-600">
                <span class="font-medium text-slate-400">Email:</span>
                <span class="font-bold text-slate-800">{{ $authDriver->email ?? 'driver@transport.com' }}</span>
            </div>
            <div class="flex justify-between items-center text-slate-600">
                <span class="font-medium text-slate-400">Username:</span>
                <span class="font-bold text-slate-800">{{ $authDriver->username ?? 'driver_bali' }}</span>
            </div>
            <div class="flex justify-between items-center text-slate-600">
                <span class="font-medium text-slate-400">WhatsApp:</span>
                <span class="font-bold text-slate-800">{{ $authDriver->whatsapp_number ?? '08123456789' }}</span>
            </div>
        </div>

        <!-- Logout Action Button -->
        <form action="{{ route('driver.logout') }}" method="POST" class="w-full">
            @csrf
            <button 
                type="submit" 
                class="w-full h-11 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 active:scale-[0.985] text-rose-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
                <svg class="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Keluar / Sign Out</span>
            </button>
        </form>
    </div>

    <!-- Global Modal Interaction Script -->
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const backdrop = document.getElementById('driver-profile-backdrop');
            const sheet = document.getElementById('driver-profile-sheet');
            const closeBtn = document.getElementById('btn-close-driver-profile');
            const triggerBtns = document.querySelectorAll('.btn-open-driver-profile');

            function openModal() {
                if (!backdrop || !sheet) return;
                backdrop.classList.remove('opacity-0', 'pointer-events-none');
                backdrop.classList.add('opacity-100');

                sheet.classList.remove('translate-y-full', 'sm:translate-y-[-40%]', 'opacity-0', 'pointer-events-none');
                sheet.classList.add('translate-y-0', 'sm:translate-y-[-50%]', 'opacity-100');
            }

            function closeModal() {
                if (!backdrop || !sheet) return;
                backdrop.classList.add('opacity-0', 'pointer-events-none');
                backdrop.classList.remove('opacity-100');

                sheet.classList.add('translate-y-full', 'sm:translate-y-[-40%]', 'opacity-0', 'pointer-events-none');
                sheet.classList.remove('translate-y-0', 'sm:translate-y-[-50%]', 'opacity-100');
            }

            triggerBtns.forEach(btn => btn.addEventListener('click', openModal));
            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (backdrop) backdrop.addEventListener('click', closeModal);
        });
    </script>
</body>
</html>
