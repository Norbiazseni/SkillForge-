<?php

namespace App\Repositories;

use App\Models\Instructor;
use Illuminate\Pagination\LengthAwarePaginator;

class InstructorRepository
{
    /**
     * Get all instructors with filters and pagination
     */
    public function getAllWithFilters(array $filters): LengthAwarePaginator
    {
        $query = Instructor::query();

        // Search filter (keresés name, email és expertise mezőkben)
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('expertise', 'like', "%{$search}%");
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
     * Find an instructor by ID
     */
    public function findById(int $id): Instructor
    {
        return Instructor::findOrFail($id);
    }

    /**
     * Create a new instructor
     */
    public function create(array $data): Instructor
    {
        return Instructor::create($data);
    }

    /**
     * Update an instructor
     */
    public function update(Instructor $instructor, array $data): Instructor
    {
        $instructor->update($data);
        return $instructor->fresh();
    }

    /**
     * Delete an instructor
     */
    public function delete(Instructor $instructor): bool
    {
        return $instructor->delete();
    }
}
