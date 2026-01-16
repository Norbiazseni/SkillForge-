@echo off
echo Testing SkillForge API...
echo.

echo 1. Testing API root...
curl -s http://127.0.0.1:8000/api/courses -H "Accept: application/json" -w "\nHTTP Status: %%{http_code}\n"
echo.

echo 2. Testing with verbose output...
curl -v http://127.0.0.1:8000/api/courses -H "Accept: application/json" 2>&1 | findstr "HTTP"
echo.

echo Test complete!
pause
