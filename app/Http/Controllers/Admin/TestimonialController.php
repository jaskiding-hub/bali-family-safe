<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_origin' => ['nullable', 'string', 'max:255'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'quote' => ['required', 'string', 'max:1000'],
            'is_approved' => ['nullable', 'boolean'],
        ]);

        Testimonial::create([
            'customer_name' => $validated['customer_name'],
            'customer_origin' => $validated['customer_origin'] ?? null,
            'rating' => (int) $validated['rating'],
            'quote' => $validated['quote'],
            'is_approved' => $request->has('is_approved') ? (bool) $validated['is_approved'] : true,
        ]);

        return redirect()->route('admin.website-content', ['tab' => 'testimonials'])
            ->with('success', 'Testimoni berhasil ditambahkan.');
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_origin' => ['nullable', 'string', 'max:255'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'quote' => ['required', 'string', 'max:1000'],
            'is_approved' => ['nullable', 'boolean'],
        ]);

        $testimonial->update([
            'customer_name' => $validated['customer_name'],
            'customer_origin' => $validated['customer_origin'] ?? null,
            'rating' => (int) $validated['rating'],
            'quote' => $validated['quote'],
            'is_approved' => $request->has('is_approved') ? (bool) $validated['is_approved'] : $testimonial->is_approved,
        ]);

        return redirect()->route('admin.website-content', ['tab' => 'testimonials'])
            ->with('success', 'Testimoni berhasil diperbarui.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        return redirect()->route('admin.website-content', ['tab' => 'testimonials'])
            ->with('success', 'Testimoni berhasil dihapus.');
    }

    public function toggleApproval(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update([
            'is_approved' => ! $testimonial->is_approved,
        ]);

        $statusText = $testimonial->is_approved ? 'disetujui' : 'disembunyikan';

        return redirect()->route('admin.website-content', ['tab' => 'testimonials'])
            ->with('success', "Status testimoni berhasil diubah menjadi {$statusText}.");
    }
}
