<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Services\CourseService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CourseController extends Controller
{
    protected CourseService $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    /**
     * Display a listing of courses with search, sort and pagination
     * 
     * GET /api/courses?search=web&status=published&difficulty=beginner&sort_by=title&sort_order=asc&per_page=10
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'search' => $request->query('search'),
            'status' => $request->query('status'),
            'difficulty' => $request->query('difficulty'),
            'instructor_id' => $request->query('instructor_id'),
            'sort_by' => $request->query('sort_by', 'created_at'),
            'sort_order' => $request->query('sort_order', 'desc'),
            'per_page' => $request->query('per_page', 10),
        ];

        $courses = $this->courseService->getAllCourses($filters);

        return response()->json($courses);
    }

    /**
     * Store a newly created course
     * 
     * POST /api/courses
     */
    public function store(StoreCourseRequest $request): JsonResponse
    {
        $course = $this->courseService->createCourse($request->validated());

        return response()->json([
            'message' => 'Course created successfully',
            'data' => $course
        ], 201);
    }

    /**
     * Display the specified course
     * 
     * GET /api/courses/{id}
     */
    public function show(int $id): JsonResponse
    {
        $course = $this->courseService->getCourseById($id);

        return response()->json([
            'data' => $course
        ]);
    }

    /**
     * Update the specified course
     * 
     * PUT /api/courses/{id}
     */
    public function update(UpdateCourseRequest $request, int $id): JsonResponse
    {
        $course = $this->courseService->updateCourse($id, $request->validated());

        return response()->json([
            'message' => 'Course updated successfully',
            'data' => $course
        ]);
    }

    /**
     * Remove the specified course (hard delete)
     * 
     * DELETE /api/courses/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $this->courseService->deleteCourse($id);

        return response()->json(null, 204);
    }
}