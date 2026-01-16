<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Services\ContactMessageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    protected ContactMessageService $contactMessageService;

    public function __construct(ContactMessageService $contactMessageService)
    {
        $this->contactMessageService = $contactMessageService;
    }

    /**
     * Display a listing of contact messages
     * 
     * GET /api/contact?per_page=10
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'per_page' => $request->query('per_page', 10),
        ];

        $messages = $this->contactMessageService->getAllMessages($filters);

        return response()->json($messages);
    }

    /**
     * Store a newly created contact message
     * 
     * POST /api/contact
     */
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $message = $this->contactMessageService->createMessage($request->validated());

        return response()->json([
            'message' => 'Contact message sent successfully',
            'data' => $message
        ], 201);
    }
}