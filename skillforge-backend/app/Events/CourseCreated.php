<?php

namespace App\Events;

use App\Models\Course;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CourseCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Course $course;

    /**
     * Create a new event instance.
     */
    public function __construct(Course $course)
    {
        $this->course = $course;
    }

    /**
     * Get the channels the event should broadcast on.
     * 
    */
    public function broadcastOn()
    {
        return new Channel('courses');
    }

    /**
     * The event's broadcast name.
     * 
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'course.created';
    }

    /**
     * Get the data to broadcast.
     * 
     * @return array
     */
    public function broadcastWith(): array
    {
        return [
            'course' => [
                'id' => $this->course->id,
                'title' => $this->course->title,
                'description' => $this->course->description,
                'status' => $this->course->status,
                'difficulty' => $this->course->difficulty,
                'instructor_id' => $this->course->instructor_id,
                'created_at' => $this->course->created_at?->toIso8601String(),
                'updated_at' => $this->course->updated_at?->toIso8601String(),
            ],
            'instructor_name' => $this->course->instructor->name ?? 'Unknown',
        ];
    }
}