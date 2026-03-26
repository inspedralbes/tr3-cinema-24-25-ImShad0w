<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = ['name', 'email', 'event_id', 'seat_id', 'ticket_code', 'price', 'user_id'];

    protected $casts = ['price' => 'float'];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function seat()
    {
        return $this->belongsTo(Seat::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
