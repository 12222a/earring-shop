@echo off
setlocal

set "INSTALL_ROOT=D:\AI\ComfyUI"
set "VENV_PY=%INSTALL_ROOT%\.venv\Scripts\python.exe"
set "HF_HOME=%INSTALL_ROOT%\hf-cache"
set "NO_PROXY=127.0.0.1,localhost"
set "no_proxy=127.0.0.1,localhost"

if not exist "%VENV_PY%" (
  echo Python virtual environment not found: %VENV_PY%
  pause
  exit /b 1
)

echo Starting ComfyUI at http://127.0.0.1:8188
echo A browser tab will open automatically when the page is ready.
echo Keep this window open while you are using ComfyUI.

start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "$url='http://127.0.0.1:8188'; for($i=0;$i -lt 90;$i++){ try { $r = Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 2; if($r.StatusCode -ge 200){ Start-Process $url; exit 0 } } catch {}; Start-Sleep -Seconds 1 }"

cd /d "%INSTALL_ROOT%"
"%VENV_PY%" main.py --listen 127.0.0.1 --port 8188 --lowvram --enable-manager
set "ERR=%ERRORLEVEL%"

if not "%ERR%"=="0" (
  echo.
  echo ComfyUI exited unexpectedly. Exit code: %ERR%
  pause
)

exit /b %ERR%
