@echo off
setlocal

for /f "tokens=5" %%P in ('netstat -ano ^| findstr LISTENING ^| findstr :8000') do (
  echo Stopping Qwen TTS demo process %%P ...
  taskkill /PID %%P /F >nul 2>&1
  echo Done.
  exit /b 0
)

echo No process is listening on port 8000.
exit /b 0
