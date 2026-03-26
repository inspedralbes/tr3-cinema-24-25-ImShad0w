<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Exception;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            // Check if user exists with Google ID
            $user = User::where('google_id', $googleUser->id)->first();
            
            if ($user) {
                // User exists with Google ID, log them in
                $token = $user->createToken('auth-token')->plainTextToken;
            } else {
                // Check if user exists with same email
                $existingUser = User::where('email', $googleUser->email)->first();
                
                if ($existingUser) {
                    // Link Google account to existing user
                    $existingUser->update([
                        'google_id' => $googleUser->id,
                        'provider' => 'google',
                        'provider_avatar' => $googleUser->avatar,
                    ]);
                    $user = $existingUser;
                } else {
                    // Create new user
                    $user = User::create([
                        'name' => $googleUser->name,
                        'email' => $googleUser->email,
                        'google_id' => $googleUser->id,
                        'provider' => 'google',
                        'provider_avatar' => $googleUser->avatar,
                    ]);
                }
                
                $token = $user->createToken('auth-token')->plainTextToken;
            }
            
            // Return JSON response with token for API usage
            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
            
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Authentication failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}