<?php

namespace App\Repositories;

use App\Models\Student;
use Illuminate\Pagination\LengthAwarePaginator;

class StudentRepository
{
    /**
     * Get all students with filters and pagination
     */
    public function getAllWithFilters(array $filters): LengthAwarePaginator
    {
        $query = Student::withCount('courses'); // Kurzusok számának lekérése

        // Search filter (keresés name és email mezőkben)
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Default sorting (alapértelmezett rendezés)
        $query->orderBy('created_at', 'desc');

        // Pagination (lapozás)
        $perPage = (int) ($filters['per_page'] ?? 10);
        $perPage = min($perPage, 100);

        return $query->paginate($perPage);
    }

    /**
     * Find a student by ID
     */
    public function findById(int $id): Student
    {
        return Student::findOrFail($id);
    }

    /**
     * Find a student by ID with course count
     */
    public function findByIdWithCourseCount(int $id): Student
    {
        return Student::withCount('courses')->findOrFail($id);
    }

    /**
     * Create a new student
     */
    public function create(array $data): Student
    {
        return Student::create($data);
    }

    /**
     * Update a student
     */
    public function update(Student $student, array $data): Student
    {
        $student->update($data);
        return $student->fresh(['courses']); // Reload with relationships
    }

    /**
     * Delete a student
     */
    public function delete(Student $student): bool
    {
        return $student->delete();
    }
}