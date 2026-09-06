@extends('layouts.driver')

@section('content')
<div class="w-full max-w-md sm:max-w-lg bg-white sm:rounded-3xl shadow-xl sm:border sm:border-slate-200/80 overflow-hidden flex flex-col justify-between font-['Inter'] selection:bg-[#00AEEF] selection:text-white pb-6 mx-auto">

    <!-- Top Blue Hero Header Banner -->
    <div class="bg-[#3E5E95] pt-10 pb-12 px-6 rounded-b-[32px] shadow-sm relative overflow-hidden flex flex-col items-center text-center anim-ease-up delay-1">
        <!-- Subtle Background Decorative Rings -->
        <div class="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none"></div>
        <div class="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none"></div>

        <!-- Brand Icon Badge -->
        <div class="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-4 shadow-inner group transition-transform duration-300 hover:scale-105">
            <!-- Steering Wheel / Driver Icon SVG -->
            <svg class="w-9 h-9 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9" stroke-width="2" />
                <circle cx="12" cy="12" r="3" stroke-width="2" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v6m0 6v6M3 12h6m6 0h6" />
            </svg>
        </div>

        <!-- Portal Titles -->
        <h1 class="text-white text-2xl sm:text-[28px] font-bold tracking-tight mb-1.5">Driver Portal</h1>
        <p class="text-white/80 text-xs sm:text-sm font-normal max-w-[260px] leading-relaxed">
            Log in with the credentials provided by admin
        </p>
    </div>

    <!-- Main Card Content (Floating Card) -->
    <div class="px-5 sm:px-6 -mt-6 z-20 flex flex-col gap-5 flex-1">

        <!-- Login Form Card -->
        <div class="bg-white rounded-2xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-slate-100 anim-ease-up delay-2 flex flex-col gap-5">

            <!-- Success / Flash Notification Alert -->
            @if (session('success'))
                <div class="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-800 text-xs flex items-center gap-2.5 anim-ease-up">
                    <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="font-medium leading-relaxed">{{ session('success') }}</span>
                </div>
            @endif

            <!-- Error Notification Alert -->
            @if ($errors->any())
                <div class="p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-800 text-xs flex items-start gap-2.5 anim-ease-up">
                    <svg class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div class="flex-1 font-medium leading-relaxed">
                        @foreach ($errors->all() as $error)
                            <p>{{ $error }}</p>
                        @endforeach
                    </div>
                </div>
            @endif

            <form action="{{ route('driver.login') }}" method="POST" id="driver-login-form" class="flex flex-col gap-4.5">
                @csrf

                <!-- Input 1: Email / Username -->
                <div class="flex flex-col gap-1.5">
                    <label for="login-input" class="text-xs font-semibold text-[#3E4850] uppercase tracking-wider">
                        Email or Username
                    </label>
                    <div class="relative w-full flex items-center">
                        <div class="absolute left-3.5 text-[#6E7881] pointer-events-none">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            name="login" 
                            id="login-input" 
                            value="{{ old('login') }}" 
                            placeholder="driver@transport.com or driver_bali" 
                            required
                            autocomplete="username"
                            class="w-full h-12 pl-11 pr-4 rounded-xl border border-[#BDC8D1] bg-white text-[#171C20] text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] outline-none transition"
                        >
                    </div>
                </div>

                <!-- Input 2: Password with Show/Hide Toggle -->
                <div class="flex flex-col gap-1.5">
                    <label for="password-input" class="text-xs font-semibold text-[#3E4850] uppercase tracking-wider">
                        Password
                    </label>
                    <div class="relative w-full flex items-center">
                        <div class="absolute left-3.5 text-[#6E7881] pointer-events-none">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input 
                            type="password" 
                            name="password" 
                            id="password-input" 
                            placeholder="Enter your password" 
                            required
                            autocomplete="current-password"
                            class="w-full h-12 pl-11 pr-12 rounded-xl border border-[#BDC8D1] bg-white text-[#171C20] text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] outline-none transition"
                        >
                        <!-- Show/Hide Password Eye Toggle Button -->
                        <button 
                            type="button" 
                            id="toggle-password-btn" 
                            aria-label="Toggle password visibility"
                            class="absolute right-3.5 p-1 rounded-md text-[#6E7881] hover:text-[#00658D] transition-colors focus:outline-none"
                        >
                            <!-- Eye Open Icon (Default Hidden) -->
                            <svg id="eye-open-icon" class="w-5 h-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <!-- Eye Slash Closed Icon (Default Visible) -->
                            <svg id="eye-closed-icon" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Remember Me Checkbox -->
                <div class="flex items-center justify-between pt-1">
                    <label class="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" name="remember" class="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF] border-slate-300">
                        <span class="text-xs text-[#3E4850] font-medium">Remember me</span>
                    </label>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    class="w-full h-12 mt-1 bg-[#00AEEF] hover:bg-[#009cd7] active:scale-[0.985] text-[#003E58] font-bold text-[15px] rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/20 cursor-pointer"
                >
                    <span>Sign In to Portal</span>
                    <svg class="w-4 h-4 text-[#003E58] transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </form>
        </div>

        <!-- Demo Hint Card (Kredensial Dummy Admin) -->
        <div class="bg-[#EFF4FA] border border-[#DEE3E8] rounded-2xl p-4 anim-ease-up delay-3 flex flex-col gap-2.5">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-[#00658D] animate-ping"></span>
                    <span class="text-xs font-bold text-[#00658D] uppercase tracking-wider">Demo Credentials</span>
                </div>
                <button 
                    type="button" 
                    id="btn-autofill" 
                    class="text-[11px] font-bold text-[#00AEEF] hover:text-[#008dbf] active:scale-95 transition cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-sky-200 shadow-2xs"
                >
                    ⚡ Quick Autofill
                </button>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-200/60 font-mono">
                <div>
                    <span class="text-[10px] uppercase font-sans text-slate-400 block font-semibold">Username / Email</span>
                    <span class="text-slate-800 font-bold">driver@transport.com</span>
                </div>
                <div>
                    <span class="text-[10px] uppercase font-sans text-slate-400 block font-semibold">Password</span>
                    <span class="text-slate-800 font-bold">password123</span>
                </div>
            </div>
            
            <span class="text-[11px] text-slate-500 font-medium">
                Driver account assigned: <strong class="text-slate-700">Wayan Arta</strong> (Role: Driver)
            </span>
        </div>

    </div>

    <!-- Bottom Footer Brand Note -->
    <div class="text-center text-xs text-slate-400 mt-6 anim-ease-up delay-4">
        &copy; {{ date('Y') }} Bali Family Safe • Transport Division
    </div>
</div>

<!-- Password Visibility Toggle & Autofill JS -->
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const passwordInput = document.getElementById('password-input');
        const loginInput = document.getElementById('login-input');
        const toggleBtn = document.getElementById('toggle-password-btn');
        const eyeOpen = document.getElementById('eye-open-icon');
        const eyeClosed = document.getElementById('eye-closed-icon');
        const autofillBtn = document.getElementById('btn-autofill');

        // Password Show/Hide Toggle
        toggleBtn.addEventListener('click', function () {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeOpen.classList.remove('hidden');
                eyeClosed.classList.add('hidden');
            } else {
                passwordInput.type = 'password';
                eyeOpen.classList.add('hidden');
                eyeClosed.classList.remove('hidden');
            }
        });

        // Quick Autofill Demo Handler
        if (autofillBtn) {
            autofillBtn.addEventListener('click', function () {
                loginInput.value = 'driver@transport.com';
                passwordInput.value = 'password123';
                loginInput.classList.add('ring-2', 'ring-[#00AEEF]');
                passwordInput.classList.add('ring-2', 'ring-[#00AEEF]');
                setTimeout(() => {
                    loginInput.classList.remove('ring-2', 'ring-[#00AEEF]');
                    passwordInput.classList.remove('ring-2', 'ring-[#00AEEF]');
                }, 600);
            });
        }
    });
</script>
@endsection
