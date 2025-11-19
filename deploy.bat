@echo off
echo ==========================================
echo      Wiki Deployment Helper
echo ==========================================
echo.

:: 1. Add all changes
echo [1/3] Adding changes...
git add .

:: 2. Commit changes
set /p commit_msg="Enter commit message (Press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Auto-deployment update %date% %time%
echo [2/3] Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

:: 3. Push to main
echo [3/3] Pushing to GitHub...
git push origin main

echo.
echo ==========================================
echo Success! Changes have been pushed.
echo GitHub Actions is now building and deploying your site.
echo.
echo Track progress here: https://github.com/TransientCodes/TransientWiki/actions
echo ==========================================
pause
