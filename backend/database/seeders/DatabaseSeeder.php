<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Event;
use App\Models\Seat;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //User::factory()->create([
        //    'name' => 'Test User',
        //    'email' => 'test@example.com',
        //]);
        Event::factory(5)->create()->each(function ($event) {
            for ($i = 1; $i <= 30; $i++) {
                Seat::create([
                    'event_id' => $event->id,
                    'seat_number' => $i,
                    'status' => 'available',
                ]);
            }
        });
    }
}
