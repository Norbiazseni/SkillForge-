<?php

namespace App\Repositories;

use App\Models\Course;
use Illuminate\Pagination\LengthAwarePaginator;

class CourseRepository
{
    /**
     * Get all courses with filters, sorting and pagination
     */
    public function getAllWithFilters(array $filters): LengthAwarePaginator
    {
        $query = Course::with('instructor');

        // Search filter (keresés title és description mezőkben)
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status filter (szűrés státusz alapján)
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Difficulty filter (szűrés nehézség alapján)
        if (!empty($filters['difficulty'])) {
            $query->where('difficulty', $filters['difficulty']);
        }

        // Instructor filter (szűrés oktató alapján)
        if (!empty($filters['instructor_id'])) {
            $query->where('instructor_id', $filters['instructor_id']);
        }

        // Sorting (rendezés)
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        
        $allowedSortFields = ['id', 'title', 'status', 'difficulty', 'created_at', 'updated_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination (lapozás)
        $perPage = (int) ($filters['per_page'] ?? 10);
        $perPage = min($perPage, 100); // Maximum 100 per page

        return $query->paginate($perPage);
    }

    /**
     * Find a course by ID
     */
    public function findById(int $id): Course
    {
        return Course::with('instructor')->findOrFail($id);
    }

    /**
     * Create a new course
     */
    public function create(array $data): Course
    {
        return Course::create($data);
    }

    /**
     * Update a course
     */
    public function update(Course $course, array $data): Course
    {
        $course->update($data);
        $course->load('instructor');
        return $course;
    }

    /**
     * Delete a course
     */
    public function delete(Course $course): bool
    {
        return $course->delete();
    }
}