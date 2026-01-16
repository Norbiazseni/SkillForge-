# SkillForge API Test Script
# Run this to test if the API is working

Write-Host "=== SkillForge API Test ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if server is responding
Write-Host "Test 1: Checking server health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/courses" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Server is responding!" -ForegroundColor Green
    Write-Host "  Status Code: $($response.StatusCode)" -ForegroundColor Gray
    Write-Host "  Content Length: $($response.Content.Length) bytes" -ForegroundColor Gray
    
    # Try to parse JSON
    $json = $response.Content | ConvertFrom-Json
    if ($json.data) {
        Write-Host "  Courses found: $($json.data.Count)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "✓ API is working correctly!" -ForegroundColor Green
        
        # Display first course
        if ($json.data.Count -gt 0) {
            Write-Host ""
            Write-Host "Sample course:" -ForegroundColor Cyan
            $course = $json.data[0]
            Write-Host "  ID: $($course.id)" -ForegroundColor Gray
            Write-Host "  Title: $($course.title)" -ForegroundColor Gray
            Write-Host "  Difficulty: $($course.difficulty)" -ForegroundColor Gray
            Write-Host "  Status: $($course.status)" -ForegroundColor Gray
        }
    } else {
        Write-Host "⚠ API responded but no data found" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "✗ Server error!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
        Write-Host "  Status Code: $statusCode" -ForegroundColor Red
        
        # Try to read error details
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        $reader.Close()
        
        if ($errorBody) {
            Write-Host "  Response: $errorBody" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you see errors, check:" -ForegroundColor Yellow
Write-Host "  1. Is the Laravel server running? (php artisan serve)" -ForegroundColor Gray
Write-Host "  2. Is MySQL running in XAMPP?" -ForegroundColor Gray
Write-Host "  3. Did migrations run successfully?" -ForegroundColor Gray
Write-Host "  4. Check logs: storage/logs/laravel.log" -ForegroundColor Gray
Write-Host ""
