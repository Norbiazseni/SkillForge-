<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:draft,published,archived',
            'difficulty' => 'nullable|in:beginner,intermediate,advanced',
            'instructor_id' => 'required|exists:instructors,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'The course title is required.',
            'title.max' => 'The course title may not be greater than 255 characters.',
            'status.in' => 'The status must be one of: draft, published, archived.',
            'difficulty.in' => 'The difficulty must be one of: beginner, intermediate, advanced.',
            'instructor_id.required' => 'An instructor must be assigned to the course.',
            'instructor_id.exists' => 'The selected instructor does not exist.',
        ];
    }
}