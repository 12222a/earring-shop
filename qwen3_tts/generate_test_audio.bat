@echo off
setlocal

set "INSTALL_ROOT=D:\AI\qwen3-tts-0.6b-base"
set "VENV_PY=%INSTALL_ROOT%\.venv\Scripts\python.exe"
set "HF_HOME=%INSTALL_ROOT%\hf-cache"
set "SOX_DIR=%LOCALAPPDATA%\Microsoft\WinGet\Packages\ChrisBagwell.SoX_Microsoft.Winget.Source_8wekyb3d8bbwe\sox-14.4.2"
set "PATH=%SOX_DIR%;%PATH%"
set "REF_WAV=%INSTALL_ROOT%\reference_en.wav"
set "OUTPUT_WAV=%USERPROFILE%\Desktop\qwen3_tts_test_output.wav"

if not exist "%VENV_PY%" (
  echo Python virtual environment not found: %VENV_PY%
  exit /b 1
)

if not exist "%REF_WAV%" (
  echo Creating a reference WAV with Windows built-in speech...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Add-Type -AssemblyName System.Speech; $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; $synth.SelectVoice('Microsoft Zira Desktop'); $synth.SetOutputToWaveFile('%REF_WAV%'); $synth.Speak('Hello, this is a reference voice for a Qwen three T T S installation test.'); $synth.Dispose()"
  if errorlevel 1 (
    echo Failed to create reference WAV.
    exit /b 1
  )
)

echo Generating a test audio file on your desktop...
"%VENV_PY%" "%~dp0generate_voice_clone.py" ^
  --model "Qwen/Qwen3-TTS-12Hz-0.6B-Base" ^
  --ref-audio "%REF_WAV%" ^
  --ref-text "Hello, this is a reference voice for a Qwen three T T S installation test." ^
  --text "This is a local Qwen three T T S test running on this computer." ^
  --language "Auto" ^
  --output "%OUTPUT_WAV%" ^
  --device "cuda:0" ^
  --dtype "bfloat16" ^
  --max-new-tokens 1024

if errorlevel 1 (
  echo Generation failed.
  exit /b 1
)

echo Done. Output saved to:
echo %OUTPUT_WAV%
exit /b 0
