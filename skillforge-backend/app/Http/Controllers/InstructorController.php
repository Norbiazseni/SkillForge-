<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInstructorRequest;
use App\Http\Requests\UpdateInstructorRequest;
use App\Services\InstructorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InstructorController extends Controller
{
    protected InstructorService $instructorService;

    public function __construct(InstructorService $instructorService)
    {
        $this->instructorService = $instructorService;
    }

    /**
     * Display a listing of instructors
     * 
     * GET /api/instructors?search=alice&per_page=10
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'search' => $request->query('search'),
            'per_page' => $request->query('per_page', 10),
        ];

        $instructors = $this->instructorService->getAllInstructors($filters);

        return response()->json($instructors);
    }

    /**
     * Store a newly created instructor
     * 
     * POST /api/instructors
     */
    public function store(StoreInstructorRequest $request): JsonResponse
    {
        $instructor = $this->instructorService->createInstructor($request->validated());

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
        $instructor = $this->instructorService->getInstructorById($id);

        return response()->json([
            'data' => $instructor
        ]);
    }

    /**
     * Update the specified instructor
     * 
     * PUT /api/instructors/{id}
     */
    public function update(UpdateInstructorRequest $request, int $id): JsonResponse
    {
        $instructor = $this->instructorService->updateInstructor($id, $request->validated());

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
        $this->instructorService->deleteInstructor($id);

        return response()->json([
            'message' => 'Instructor deleted successfully'
        ]);
    }
}
