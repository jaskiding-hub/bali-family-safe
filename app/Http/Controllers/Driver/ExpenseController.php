<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\TripExpense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ExpenseController extends Controller
{
    public function store(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $request->validate([
            'type' => ['required', 'string', 'max:255'],
            'amount' => ['required'],
            'receipt' => ['nullable', 'image', 'max:5120'],
        ]);

        // Clean amount (remove dots/commas/Rp)
        $rawAmount = $request->input('amount');
        $cleanAmount = preg_replace('/[^0-9]/', '', $rawAmount);

        $receiptPath = null;
        if ($request->hasFile('receipt')) {
            $receiptPath = $request->file('receipt')->store('receipts', 'public');
        }

        $expense = TripExpense::create([
            'booking_id' => $booking->id,
            'driver_id' => $booking->driver_id ?? Auth::guard('driver')->id(),
            'expense_type' => $request->input('type'),
            'expense_name' => $request->input('type'),
            'amount' => (float) $cleanAmount,
            'receipt_path' => $receiptPath,
            'notes' => $request->input('notes'),
        ]);

        if ($request->ajax() || $request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Expense saved successfully!',
                'expense' => [
                    'id' => $expense->id,
                    'expense_type' => $expense->expense_type,
                    'amount' => $expense->amount,
                    'notes' => $expense->notes,
                    'receipt_path' => $expense->receipt_path ? Storage::url($expense->receipt_path) : null,
                    'created_at' => $expense->created_at ? $expense->created_at->format('H:i') : null,
                ],
            ]);
        }

        return redirect()->route('driver.trip.expense', ['id' => $booking->id])
            ->with('success', 'Expense saved successfully!');
    }

    public function update(Request $request, $id, $expense_id = null)
    {
        if ($expense_id !== null) {
            $booking = Booking::findOrFail($id);
            $expense = TripExpense::where('booking_id', $booking->id)->findOrFail($expense_id);
            $bookingId = $booking->id;
        } else {
            $expense = TripExpense::findOrFail($id);
            $bookingId = $expense->booking_id;
        }

        $request->validate([
            'type' => ['required', 'string', 'max:255'],
            'amount' => ['required'],
            'receipt' => ['nullable', 'image', 'max:5120'],
        ]);

        $rawAmount = $request->input('amount');
        $cleanAmount = preg_replace('/[^0-9]/', '', $rawAmount);

        if ($request->hasFile('receipt')) {
            if ($expense->receipt_path) {
                Storage::disk('public')->delete($expense->receipt_path);
            }
            $expense->receipt_path = $request->file('receipt')->store('receipts', 'public');
        }

        $expense->expense_type = $request->input('type');
        $expense->expense_name = $request->input('type');
        $expense->amount = (float) $cleanAmount;
        if ($request->has('notes')) {
            $expense->notes = $request->input('notes');
        }
        $expense->save();

        if ($request->ajax() || $request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Expense updated successfully!',
                'expense' => [
                    'id' => $expense->id,
                    'expense_type' => $expense->expense_type,
                    'amount' => $expense->amount,
                    'notes' => $expense->notes,
                    'receipt_path' => $expense->receipt_path ? Storage::url($expense->receipt_path) : null,
                    'created_at' => $expense->created_at ? $expense->created_at->format('H:i') : null,
                ],
            ]);
        }

        return redirect()->route('driver.trip.expense', ['id' => $bookingId])
            ->with('success', 'Expense updated successfully!');
    }

    public function destroy(Request $request, $id, $expense_id = null)
    {
        if ($expense_id !== null) {
            $booking = Booking::findOrFail($id);
            $expense = TripExpense::where('booking_id', $booking->id)->findOrFail($expense_id);
            $bookingId = $booking->id;
        } else {
            $expense = TripExpense::findOrFail($id);
            $bookingId = $expense->booking_id;
        }

        if ($expense->receipt_path) {
            Storage::disk('public')->delete($expense->receipt_path);
        }

        $expense->delete();

        if ($request->ajax() || $request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Expense deleted successfully!',
            ]);
        }

        return redirect()->route('driver.trip.expense', ['id' => $bookingId])
            ->with('success', 'Expense deleted successfully!');
    }
}
