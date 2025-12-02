<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PostController;
use App\Http\Controllers\OrderController;

// Default user route (Sanctum)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// POST CRUD (your old example)
Route::resource('posts', PostController::class);

// NEW — ORDER ROUTES
Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
Route::put('/orders/{order}', [OrderController::class, 'update']);
Route::delete('/orders/{id}', [OrderController::class, 'delete']);