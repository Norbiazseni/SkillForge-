# Start Backend Server
Write-Host "Starting Laravel Backend..." -ForegroundColor Green
Write-Host "API will be available at: http://127.0.0.1:8000/api" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location "C:\Users\Apollo\Desktop\szft\Skillforge\SkillForge--backend"

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "Please configure your .env file and run: php artisan key:generate" -ForegroundColor Yellow
    exit
}

# Start the server
php artisan serve
