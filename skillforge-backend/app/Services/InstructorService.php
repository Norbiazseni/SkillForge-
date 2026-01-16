<?php

namespace App\Services;

use App\Models\Instructor;
use App\Repositories\InstructorRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class InstructorService
{
    protected InstructorRepository $instructorRepository;

    public function __construct(InstructorRepository $instructorRepository)
    {
        $this->instructorRepository = $instructorRepository;
    }

    /**
     * Get all instructors with filters and pagination
     */
    public function getAllInstructors(array $filters): LengthAwarePaginator
    {
        return $this->instructorRepository->getAllWithFilters($filters);
    }

    /**
     * Get a single instructor by ID
     */
    public function getInstructorById(int $id): Instructor
    {
        return $this->instructorRepository->findById($id);
    }

    /**
     * Create a new instructor
     */
    public function createInstructor(array $data): Instructor
    {
        return $this->instructorRepository->create($data);
    }

    /**
     * Update an instructor
     */
    public function updateInstructor(int $id, array $data): Instructor
    {
        $instructor = $this->instructorRepository->findById($id);
        return $this->instructorRepository->update($instructor, $data);
    }

    /**
     * Delete an instructor
     */
    public function deleteInstructor(int $id): bool
    {
        $instructor = $this->instructorRepository->findById($id);
        return $this->instructorRepository->delete($instructor);
    }
}
