<?php

namespace App\Services;

use App\Models\ContactMessage;
use App\Repositories\ContactMessageRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ContactMessageService
{
    protected ContactMessageRepository $contactMessageRepository;

    public function __construct(ContactMessageRepository $contactMessageRepository)
    {
        $this->contactMessageRepository = $contactMessageRepository;
    }

    /**
     * Get all contact messages with pagination
     */
    public function getAllMessages(array $filters): LengthAwarePaginator
    {
        return $this->contactMessageRepository->getAllWithFilters($filters);
    }

    /**
     * Create a new contact message
     */
    public function createMessage(array $data): ContactMessage
    {
        return $this->contactMessageRepository->create($data);
    }
}