<?php

namespace App\Services;

use App\Models\Student;
use App\Repositories\StudentRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class StudentService
{
    protected StudentRepository $studentRepository;

    public function __construct(StudentRepository $studentRepository)
    {
        $this->studentRepository = $studentRepository;
    }

    /**
     * Get all students with filters and pagination
     */
    public function getAllStudents(array $filters): LengthAwarePaginator
    {
        return $this->studentRepository->getAllWithFilters($filters);
    }

    /**
     * Get a single student by ID with course count
     */
    public function getStudentById(int $id): Student
    {
        return $this->studentRepository->findByIdWithCourseCount($id);
    }

    /**
     * Create a new student
     */
    public function createStudent(array $data): Student
    {
        return $this->studentRepository->create($data);
    }

    /**
     * Update a student
     */
    public function updateStudent(int $id, array $data): Student
    {
        $student = $this->studentRepository->findById($id);
        return $this->studentRepository->update($student, $data);
    }

    /**
     * Delete a student
     */
    public function deleteStudent(int $id): bool
    {
        $student = $this->studentRepository->findById($id);
        return $this->studentRepository->delete($student);
    }
}