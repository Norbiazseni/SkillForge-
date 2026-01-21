<?php

namespace App\Http\Controllers;

use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InstructorController extends Controller
{
    /**
     * Display a listing of instructors
     * 
     * GET /api/instructors
     */
    public function index(): JsonResponse
    {
        $instructors = Instructor::all();

        return response()->json($instructors);
    }

    /**
     * Store a newly created instructor
     * 
     * POST /api/instructors
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:instructors,email',
            'expertise' => 'nullable|string|max:255',
        ]);

        $instructor = Instructor::create($validated);

        return response()->json([
            'message' => 'Instructor created successfully',
            'data' => $instructor
        ], 201);
    }

    /**
     * Display the specified instructor
     * 
     * GET /api/instructors/{id}
     */
    public function show(int $id): JsonResponse
    {
        $instructor = Instructor::findOrFail($id);

        return response()->json($instructor);
    }

    /**
     * Update the specified instructor
     * 
     * PUT /api/instructors/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $instructor = Instructor::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:instructors,email,' . $id,
            'expertise' => 'nullable|string|max:255',
        ]);

        $instructor->update($validated);

        return response()->json([
            'message' => 'Instructor updated successfully',
            'data' => $instructor
        ]);
    }

    /**
     * Remove the specified instructor
     * 
     * DELETE /api/instructors/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $instructor = Instructor::findOrFail($id);
        $instructor->delete();

        return response()->json([
            'message' => 'Instructor deleted successfully'
        ]);
    }
}
