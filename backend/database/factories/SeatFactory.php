<?php

namespace Database\Factories;

use App\Models\Seat;
use Illuminate\Database\Eloquent\Factories\Factory;

class SeatFactory extends Factory
{
    protected $model = Seat::class;

    public function definition(): array
    {
        return [
            'event_id' => null,
            'seat_number' => $this->faker->numberBetween(1, 30),
            'status' => 'available',
        ];
    }
}
