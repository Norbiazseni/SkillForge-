<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Instructor;
use App\Models\Student;
use App\Models\ContactMessage;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create instructors
        $instructor1 = Instructor::create([
            'name' => 'Sarah Johnson',
            'email' => 'sarah.johnson@university.edu',
        ]);

        $instructor2 = Instructor::create([
            'name' => 'Michael Chen',
            'email' => 'michael.chen@university.edu',
        ]);

        $instructor3 = Instructor::create([
            'name' => 'Emily Rodriguez',
            'email' => 'emily.rodriguez@university.edu',
        ]);

        // Create courses
        $course1 = Course::create([
            'title' => 'Introduction to Web Development',
            'description' => 'Learn the fundamentals of HTML, CSS, and JavaScript.',
            'status' => 'published',
            'difficulty' => 'beginner',
            'instructor_id' => $instructor1->id,
        ]);

        $course2 = Course::create([
            'title' => 'Advanced JavaScript',
            'description' => 'Master modern JavaScript features like async/await, modules, and more.',
            'status' => 'published',
            'difficulty' => 'intermediate',
            'instructor_id' => $instructor1->id,
        ]);

        $course3 = Course::create([
            'title' => 'Database Design and SQL',
            'description' => 'A comprehensive guide to relational database design and SQL.',
            'status' => 'draft',
            'difficulty' => 'intermediate',
            'instructor_id' => $instructor2->id,
        ]);

        $course4 = Course::create([
            'title' => 'Laravel for Beginners',
            'description' => 'Get started with the most popular PHP framework.',
            'status' => 'published',
            'difficulty' => 'beginner',
            'instructor_id' => $instructor2->id,
        ]);

        $course5 = Course::create([
            'title' => 'Machine Learning Fundamentals',
            'description' => 'An introduction to the core concepts of machine learning.',
            'status' => 'archived',
            'difficulty' => 'advanced',
            'instructor_id' => $instructor3->id,
        ]);

        // Create students
        $student1 = Student::create([
            'name' => 'Alice Williams',
            'email' => 'alice.williams@student.edu',
        ]);

        $student2 = Student::create([
            'name' => 'Bob Martinez',
            'email' => 'bob.martinez@student.edu',
        ]);

        $student3 = Student::create([
            'name' => 'Carol Davis',
            'email' => 'carol.davis@student.edu',
        ]);

        $student4 = Student::create([
            'name' => 'David Thompson',
            'email' => 'david.thompson@student.edu',
        ]);

        // Enroll students in courses
        $student1->courses()->attach([$course1->id, $course2->id, $course3->id]);
        $student2->courses()->attach([$course1->id, $course3->id]);
        $student3->courses()->attach([$course2->id, $course5->id]);
        $student4->courses()->attach([$course4->id]);

        // Create contact messages
        ContactMessage::create([
            'name' => 'Curious George',
            'email' => 'george@example.com',
            'message' => 'I would like to know more about your advanced courses.'
        ]);
    }
}