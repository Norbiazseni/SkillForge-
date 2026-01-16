<?php

namespace App\Services;

use App\Events\CourseCreated;
use App\Models\Course;
use App\Repositories\CourseRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CourseService
{
    protected CourseRepository $courseRepository;

    public function __construct(CourseRepository $courseRepository)
    {
        $this->courseRepository = $courseRepository;
    }

    /**
     * Get all courses with filters, sorting and pagination
     */
    public function getAllCourses(array $filters): LengthAwarePaginator
    {
        return $this->courseRepository->getAllWithFilters($filters);
    }

    /**
     * Get a single course by ID
     */
    public function getCourseById(int $id): Course
    {
        return $this->courseRepository->findById($id);
    }

    /**
     * Create a new course with defaults and broadcast event
     */
    public function createCourse(array $data): Course
    {
        // Set default values if not provided (ÜZLETI LOGIKA)
        $data['status'] = $data['status'] ?? 'draft';
        $data['difficulty'] = $data['difficulty'] ?? 'beginner';

        $course = $this->courseRepository->create($data);

        // Load instructor relationship for the event
        $course->load('instructor');

        // Broadcast CourseCreated event via WebSocket (ÜZLETI LOGIKA)
        broadcast(new CourseCreated($course))->toOthers();

        return $course;
    }

    /**
     * Update a course with business rules
     */
    public function updateCourse(int $id, array $data): Course
    {
        $course = $this->courseRepository->findById($id);

        // ÜZLETI SZABÁLY 1: Cannot change status from 'published' to 'draft'
        if (isset($data['status']) && 
            $course->status === 'published' && 
            $data['status'] === 'draft') {
            throw new HttpException(400, 'Cannot change status from published to draft');
        }

        // ÜZLETI SZABÁLY 2: Cannot archive course without description
        if (isset($data['status']) && 
            $data['status'] === 'archived' && 
            empty($course->description) && 
            empty($data['description'])) {
            throw new HttpException(400, 'Cannot archive course without description');
        }

        return $this->courseRepository->update($course, $data);
    }

    /**
     * Delete a course (hard delete)
     */
    public function deleteCourse(int $id): bool
    {
        $course = $this->courseRepository->findById($id);
        
        // ÜZLETI SZABÁLY 3: Cannot delete published courses
        if ($course->status === 'published') {
            throw new HttpException(400, 'Cannot delete a published course. Archive it first.');
        }

        return $this->courseRepository->delete($course);
    }
}