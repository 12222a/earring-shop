@echo off
setlocal

for /f "tokens=5" %%P in ('netstat -ano ^| findstr LISTENING ^| findstr :8188') do (
  echo Stopping ComfyUI process %%P ...
  taskkill /PID %%P /F >nul 2>&1
  echo Done.
  exit /b 0
)

echo No process is listening on port 8188.
exit /b 0
