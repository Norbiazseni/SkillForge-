# SkillForge API Documentation

## Base URL
- Development: `http://127.0.0.1:8000/api`
- XAMPP: `http://localhost/skillforge-backend/public/api`

## Endpoints

### Courses

#### GET /api/courses
List all courses with pagination, search, and filter support.

**Query Parameters:**
- `search` (string): Search in title and description
- `difficulty` (string): Filter by difficulty (beginner, intermediate, advanced)
- `status` (string): Filter by status (draft, published, archived)  
- `sort_by` (string): Sort field (default: created_at)
- `sort_order` (string): Sort direction (asc, desc - default: desc)
- `per_page` (integer): Items per page (default: 15)

**Example:**
```bash
GET /api/courses?search=web&difficulty=beginner&per_page=10
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Introduction to Web Development",
      "description": "Learn HTML, CSS and JavaScript",
      "status": "published",
      "difficulty": "beginner",
      "instructor_id": 1,
      "created_at": "2026-01-16T10:00:00.000000Z",
      "updated_at": "2026-01-16T10:00:00.000000Z",
      "instructor": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "links": {...},
  "meta": {...}
}
```

#### POST /api/courses
Create a new course.

**Request Body:**
```json
{
  "title": "Course Title",
  "description": "Course description",
  "difficulty": "beginner",
  "instructor_id": 1
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Course Title",
  "description": "Course description",
  "status": "draft",
  "difficulty": "beginner",
  "instructor_id": 1,
  "created_at": "2026-01-16T10:00:00.000000Z",
  "updated_at": "2026-01-16T10:00:00.000000Z"
}
```

#### GET /api/courses/{id}
Get a specific course by ID.

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Course Title",
  "description": "Course description",
  "status": "published",
  "difficulty": "beginner",
  "instructor_id": 1,
  "created_at": "2026-01-16T10:00:00.000000Z",
  "updated_at": "2026-01-16T10:00:00.000000Z",
  "instructor": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### PUT /api/courses/{id}
Update a course.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "published",
  "difficulty": "intermediate"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Updated Title",
  "description": "Updated description",
  "status": "published",
  "difficulty": "intermediate",
  "instructor_id": 1,
  "created_at": "2026-01-16T10:00:00.000000Z",
  "updated_at": "2026-01-16T10:30:00.000000Z"
}
```

#### DELETE /api/courses/{id}
Delete a course.

**Response (204 No Content)**

### Students

#### GET /api/students
List all students with pagination.

**Query Parameters:**
- `per_page` (integer): Items per page (default: 15)

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "created_at": "2026-01-16T10:00:00.000000Z",
      "updated_at": "2026-01-16T10:00:00.000000Z"
    }
  ],
  "links": {...},
  "meta": {...}
}
```

#### POST /api/students
Create a new student.

**Request Body:**
```json
{
  "name": "Student Name",
  "email": "student@example.com"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Student Name",
  "email": "student@example.com",
  "created_at": "2026-01-16T10:00:00.000000Z",
  "updated_at": "2026-01-16T10:00:00.000000Z"
}
```

#### GET /api/students/{id}
Get a specific student by ID.

#### PUT /api/students/{id}
Update a student.

#### DELETE /api/students/{id}
Delete a student.

**Response (204 No Content)**

### Contact Messages

#### GET /api/contact
List all contact messages with pagination.

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Hello!",
      "created_at": "2026-01-16T10:00:00.000000Z",
      "updated_at": "2026-01-16T10:00:00.000000Z"
    }
  ],
  "links": {...},
  "meta": {...}
}
```

#### POST /api/contact
Create a new contact message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I have a question..."
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I have a question...",
  "created_at": "2026-01-16T10:00:00.000000Z",
  "updated_at": "2026-01-16T10:00:00.000000Z"
}
```

## WebSocket Events

### CourseCreated
Broadcast when a new course is created.

**Event Name:** `CourseCreated`

**Payload:**
```json
{
  "course": {
    "id": 1,
    "title": "New Course",
    "description": "Description",
    "status": "draft",
    "difficulty": "beginner",
    "instructor_id": 1,
    "created_at": "2026-01-16T10:00:00+00:00",
    "updated_at": "2026-01-16T10:00:00+00:00"
  },
  "instructor_name": "John Doe"
}
```

## Error Responses

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 422 Unprocessable Entity
```json
{
  "message": "Validation error",
  "errors": {
    "field": ["Error message"]
  }
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Testing with curl

### Create a course:
```bash
curl -X POST http://127.0.0.1:8000/api/courses \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"title":"Test Course","description":"Test Description","difficulty":"beginner","instructor_id":1}'
```

### Get all courses:
```bash
curl -X GET http://127.0.0.1:8000/api/courses \
  -H "Accept: application/json"
```

### Update a course:
```bash
curl -X PUT http://127.0.0.1:8000/api/courses/1 \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"title":"Updated Course","status":"published"}'
```

### Delete a course:
```bash
curl -X DELETE http://127.0.0.1:8000/api/courses/1 \
  -H "Accept: application/json"
```
