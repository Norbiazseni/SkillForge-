<?php

use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\InstructorController;
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

// Instructor routes
Route::prefix('instructors')->group(function () {
    Route::get('/', [InstructorController::class, 'index']);
    Route::post('/', [InstructorController::class, 'store']);
    Route::get('/{id}', [InstructorController::class, 'show']);
    Route::put('/{id}', [InstructorController::class, 'update']);
    Route::delete('/{id}', [InstructorController::class, 'destroy']);
});

// Contact message routes
Route::prefix('contact')->group(function () {
    Route::get('/', [ContactMessageController::class, 'index']);
    Route::post('/', [ContactMessageController::class, 'store']);
});
