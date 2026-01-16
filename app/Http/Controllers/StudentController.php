<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Services\StudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    protected StudentService $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }

    /**
     * Display a listing of students
     * 
     * GET /api/students?search=alice&per_page=10
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'search' => $request->query('search'),
            'per_page' => $request->query('per_page', 10),
        ];

        $students = $this->studentService->getAllStudents($filters);

        return response()->json($students);
    }

    /**
     * Store a newly created student
     * 
     * POST /api/students
     */
    public function store(StoreStudentRequest $request): JsonResponse
    {
        $student = $this->studentService->createStudent($request->validated());

        return response()->json([
            'message' => 'Student created successfully',
            'data' => $student
        ], 201);
    }

    /**
     * Display the specified student with course count
     * 
     * GET /api/students/{id}
     */
    public function show(int $id): JsonResponse
    {
        $student = $this->studentService->getStudentById($id);

        return response()->json([
            'data' => $student
        ]);
    }

    /**
     * Update the specified student
     * 
     * PUT /api/students/{id}
     */
    public function update(UpdateStudentRequest $request, int $id): JsonResponse
    {
        $student = $this->studentService->updateStudent($id, $request->validated());

        return response()->json([
            'message' => 'Student updated successfully',
            'data' => $student
        ]);
    }

    /**
     * Remove the specified student
     * 
     * DELETE /api/students/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $this->studentService->deleteStudent($id);

        return response()->json(null, 204);
    }
}