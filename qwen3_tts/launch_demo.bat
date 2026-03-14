@echo off
setlocal

set "INSTALL_ROOT=D:\AI\qwen3-tts-0.6b-base"
set "VENV_PY=%INSTALL_ROOT%\.venv\Scripts\python.exe"
set "HF_HOME=%INSTALL_ROOT%\hf-cache"
set "SOX_DIR=%LOCALAPPDATA%\Microsoft\WinGet\Packages\ChrisBagwell.SoX_Microsoft.Winget.Source_8wekyb3d8bbwe\sox-14.4.2"
set "PATH=%SOX_DIR%;%PATH%"
set "NO_PROXY=127.0.0.1,localhost"
set "no_proxy=127.0.0.1,localhost"

if not exist "%VENV_PY%" (
  echo Python virtual environment not found: %VENV_PY%
  pause
  exit /b 1
)

echo Starting official Qwen TTS demo at http://127.0.0.1:8000
echo A browser tab will open automatically when the page is ready.
echo Keep this window open while you are using the demo.

start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "$url='http://127.0.0.1:8000'; for($i=0;$i -lt 90;$i++){ try { $r = Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 2; if($r.StatusCode -ge 200){ Start-Process $url; exit 0 } } catch {}; Start-Sleep -Seconds 1 }"

"%VENV_PY%" -m qwen_tts.cli.demo "Qwen/Qwen3-TTS-12Hz-0.6B-Base" --device cuda:0 --dtype bfloat16 --no-flash-attn --ip 127.0.0.1 --port 8000
set "ERR=%ERRORLEVEL%"

if not "%ERR%"=="0" (
  echo.
  echo Demo exited unexpectedly. Exit code: %ERR%
  pause
)

exit /b %ERR%
