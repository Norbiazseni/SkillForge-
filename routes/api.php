<?php

use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Course routes - Full CRUD
Route::prefix('courses')->group(function () {
    Route::get('/', [CourseController::class, 'index']);
    Route::post('/', [CourseController::class, 'store']);
    Route::get('/{id}', [CourseController::class, 'show']);
    Route::put('/{id}', [CourseController::class, 'update']);
    Route::delete('/{id}', [CourseController::class, 'destroy']);
});

// Student routes
Route::prefix('students')->group(function () {
    Route::get('/', [StudentController::class, 'index']);
    Route::post('/', [StudentController::class, 'store']);
    Route::get('/{id}', [StudentController::class, 'show']);
    Route::put('/{id}', [StudentController::class, 'update']);
    Route::delete('/{id}', [StudentController::class, 'destroy']);
});

// Contact message routes
Route::prefix('contact')->group(function () {
    Route::get('/', [ContactMessageController::class, 'index']);
    Route::post('/', [ContactMessageController::class, 'store']);
});
