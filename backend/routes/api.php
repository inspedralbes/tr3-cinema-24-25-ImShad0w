<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Api\EventController;
use App\Http\Api\SeatController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/event', [EventController::class, 'store']);
Route::get('/event', [EventController::class, 'index']);
Route::get('/event/{event}', [EventController::class, 'show']);
Route::get('/event/{event}/seats', [EventController::class, 'seatsByEvent']);
Route::post('/seats/reserve', [SeatController::class, 'reserve']);
Route::post('/seats/buy', [SeatController::class, 'buy']);
Route::post('/seats/release', [SeatController::class, 'release']);
