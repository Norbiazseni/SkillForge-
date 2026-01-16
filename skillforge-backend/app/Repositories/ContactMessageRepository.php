<?php

namespace App\Repositories;

use App\Models\ContactMessage;
use Illuminate\Pagination\LengthAwarePaginator;

class ContactMessageRepository
{
    /**
     * Get all contact messages with pagination
     */
    public function getAllWithFilters(array $filters): LengthAwarePaginator
    {
        $query = ContactMessage::query();

        // Default sorting (legújabb először)
        $query->orderBy('created_at', 'desc');

        // Pagination (lapozás)
        $perPage = (int) ($filters['per_page'] ?? 10);
        $perPage = min($perPage, 100);

        return $query->paginate($perPage);
    }

    /**
     * Create a new contact message
     */
    public function create(array $data): ContactMessage
    {
        return ContactMessage::create($data);
    }
}