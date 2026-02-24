<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'location', 'date', 'seats_count'];

    public function seats()
    {
        return $this->hasMany(Seat::class);
    }

    protected $casts = [
        'date' => 'datetime',
    ];
}
