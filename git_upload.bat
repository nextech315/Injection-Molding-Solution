@echo off
cd /d "%~dp0"
title NexTech AI - Injection Molding Solution Website GitHub Push

echo ===============================================================================
echo     [NexTech AI] Website GitHub Upload (nextech315 / Injection-Molding-Solution)
echo ===============================================================================
echo.

echo [*] Staging all updated website files...
git add index.html solution.html case.html contact.html README.md images/ css/ js/
echo.

echo [*] Committing changes...
git commit -m "feat: update homepage with NexTech branding, IM-SOLUTION 8-module suite & YouTube channel"
echo.

echo [*] Pushing to GitHub (origin main)...
git push -u origin main
echo.

if %errorlevel% equ 0 (
    echo ===============================================================================
    echo  [SUCCESS] Homepage repository updated successfully!
    echo  Live URL: https://nextech315.github.io/Injection-Molding-Solution/
    echo ===============================================================================
) else (
    echo [*] Retrying with full remote URL...
    git push -u https://nextech315@github.com/nextech315/Injection-Molding-Solution.git main
)

echo.
pause

