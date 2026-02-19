<?php

namespace App\Http\Api;

use App\Models\Seat;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class SeatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Seat $seat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Seat $seat)
    {
       //
    }

    public function reserve(Request $request)
    {
        $validated = $request->validate([
            'seat_ids' => 'required|array',
            'seat_ids.*' => 'integer|exists:seats,id',
        ]);
        $seats = Seat::whereIn('id', $validated['seat_ids'])
            ->where('status', 'available')
            ->get();
        if ($seats->count() !== count($validated['seat_ids'])) {
            return response()->json(['error' => 'Some seats are no longer available'], 422);
        }
        DB::transaction(function () use ($seats) {
            foreach ($seats as $seat) {
                $seat->update(['status' => 'reserved']);
            }
        });
        return response()->json(['message' => 'Seats reserved successfully']);
    }

    public function buy(Request $request)
    {
        $validated = $request->validate([
            'seat_ids' => 'required|array',
            'seat_ids.*' => 'integer|exists:seats,id',
        ]);
        $seats = Seat::whereIn('id', $validated['seat_ids'])
            ->where('status', 'reserved')
            ->get();
        if ($seats->count() !== count($validated['seat_ids'])) {
            return response()->json(['error' => 'Cannot buy seats that are not reserved'], 422);
        }
        DB::transaction(function () use ($seats) {
            foreach ($seats as $seat) {
                $seat->update(['status' => 'sold']);
            }
        });
        return response()->json(['message' => 'Seats purchased successfully']);
    }

    public function release(Request $request)
    {
        $validated = $request->validate([
            'seat_ids' => 'required|array',
            'seat_ids.*' => 'integer|exists:seats,id',
        ]);
        $seats = Seat::whereIn('id', $validated['seat_ids'])
            ->where('status', 'reserved')
            ->get();
        if ($seats->count() !== count($validated['seat_ids'])) {
            return response()->json(['error' => 'Cannot release seats that are not reserved'], 422);
        }
        DB::transaction(function () use ($seats) {
            foreach ($seats as $seat) {
                $seat->update(['status' => 'available']);
            }
        });
        return response()->json(['message' => 'Seats released successfully']);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Seat $seat)
    {
        //
    }
}
