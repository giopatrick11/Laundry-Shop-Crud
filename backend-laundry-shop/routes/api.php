<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PostController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

// PUBLIC — LOGIN
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    // CURRENT USER
    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    // LOGOUT
    Route::post('/logout', [AuthController::class, 'logout']);

    /* ================================
     * ADMIN USER MANAGEMENT
     * ================================ */
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    /* ================================
     * ORDERS
     * ================================ */
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
    Route::put('/orders/{order}', [OrderController::class, 'update']);
    Route::delete('/orders/{id}', [OrderController::class, 'delete']);

    /* ================================
     * CUSTOMERS — BULK UPDATE NAME + PHONE
     * ================================ */
    Route::put('/customers/update', [OrderController::class, 'updateCustomer']);

    /* ================================
     * POSTS (optional)
     * ================================ */
    Route::resource('posts', PostController::class);
});
