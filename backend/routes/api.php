<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Api\EventController;
use App\Http\Api\SeatController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GoogleAuthController;

Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user/tickets', [AuthController::class, 'tickets']);
});

Route::post('/event', [EventController::class, 'store']);
Route::get('/event', [EventController::class, 'index']);
Route::get('/event/{event}', [EventController::class, 'show']);
Route::put('/event/{event}', [EventController::class, 'update']);
Route::get('/event/{event}/seats', [EventController::class, 'seatsByEvent']);
Route::post('/seats/reserve', [SeatController::class, 'reserve']);
Route::post('/seats/buy', [SeatController::class, 'buy']);
Route::post('/seats/release', [SeatController::class, 'release']);
Route::get('/seats/price', [SeatController::class, 'price']);
Route::delete('/event/{event}', [EventController::class, 'destroy']);
