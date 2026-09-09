<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DriverAuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/DriverLogin');
    }

    public function login(Request $request)
    {
        $loginInput = $request->input('login', $request->input('email'));
        $password = $request->input('password');

        $request->validate([
            'password' => ['required'],
        ]);

        $fieldType = filter_var($loginInput, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $credentials = [
            $fieldType => $loginInput,
            'password' => $password,
        ];

        if (Auth::guard('driver')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('driver.home'));
        }

        return back()->withErrors(['login' => 'Username, email, atau password salah.'])->onlyInput('login');
    }

    public function logout(Request $request)
    {
        Auth::guard('driver')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('driver.login');
    }
}
