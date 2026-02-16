<?php

namespace App\Http\Api;

use App\Models\Event;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Http\Resources\SeatResource;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return EventResource::collection(Event::with('seats')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "title" => 'required|string|max:255',
            "description" => 'required|string',
            "location" => 'required|string',
            "date" => 'required|date',
        ]);

        $event = Event::create($validated);
        return $event;
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        $event->load('seats');
        return new EventResource($event);
    }

    public function seatsByEvent(Event $event)
    {
        return SeatResource::collection($event->seats()->get());
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        //
    }
}
