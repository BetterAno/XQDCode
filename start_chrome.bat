@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ============================================================
REM  CloakBrowser Max Stealth Launcher
REM  Layers: C++ fingerprint (58 patches) + Protocol + Consistency
REM ============================================================

set "CHROME=%USERPROFILE%\.cloakbrowser\chromium-146.0.7680.177.5\chrome.exe"
set "DATA_DIR=%USERPROFILE%\.cloakbrowser\stealth-profile"
set "CDP_PORT=9222"
set "FP_SEED=58321"

REM --- Layer 0: Kill existing Chrome ---------------------------
taskkill /f /im chrome.exe 2>nul
timeout /t 1 /nobreak >nul
if exist "%DATA_DIR%" rmdir /s /q "%DATA_DIR%" 2>nul

REM --- Layer 1: C++ Fingerprint Patches (58 in binary) ---------
REM  Master seed: deterministic identity across restarts
set FP=--fingerprint=%FP_SEED%
REM  Platform: always Windows (most common fingerprint pool)
set FP=%FP% --fingerprint-platform=windows
REM  GPU: auto-generated from seed (NVIDIA RTX 30-series pool)
REM  Screen: match viewport exactly
set FP=%FP% --fingerprint-screen-width=1920 --fingerprint-screen-height=1080
REM  Hardware: consistent with modern desktop
set FP=%FP% --fingerprint-hardware-concurrency=8 --fingerprint-device-memory=8
REM  Timezone/Locale: match Chinese site expectations
set FP=%FP% --fingerprint-timezone=Asia/Shanghai --fingerprint-locale=zh-CN
REM  Storage: non-incognito quota (avoids incognito detection)
set FP=%FP% --fingerprint-storage-quota=5000
REM  Noise: disable canvas/WebGL/audio noise injection
REM  Some detectors treat noise as tampering signal (FingerprintJS)
set FP=%FP% --fingerprint-noise=false

REM --- Layer 2: Protocol Stealth ---------------------------------
REM  Suppress automation flags
set PROTO=--disable-features=AutomationControlled
set PROTO=%PROTO% --disable-blink-features=AutomationControlled
REM  Disable automation infobars
set PROTO=%PROTO% --disable-infobars
REM  Disable crash reporting / metrics (privacy + less network noise)
set PROTO=%PROTO% --disable-breakpad --disable-crash-reporter
set PROTO=%PROTO% --metrics-recording-only
REM  Disable component updates (version checks leak)
set PROTO=%PROTO% --disable-component-update
REM  Disable default apps / browser check
set PROTO=%PROTO% --no-default-browser-check --no-first-run
REM  Disable sync and Google services
set PROTO=%PROTO% --disable-sync --disable-background-networking
REM  Disable extensions (real Chrome always has some, but safer for stealth)
set PROTO=%PROTO% --disable-extensions --disable-plugins
REM  Disable popup blocking (interferes with debugging)
set PROTO=%PROTO% --disable-popup-blocking
REM  Disable client-side phishing detection
set PROTO=%PROTO% --disable-client-side-phishing-detection
REM  Disable HangWatcher (can crash in headed mode on Windows)
set PROTO=%PROTO% --disable-hang-monitor
REM  Disable translate (extra network, not needed)
set PROTO=%PROTO% --disable-translate
REM  GPU blocklist bypass (needed for WebGL in headed mode)
set PROTO=%PROTO% --ignore-gpu-blocklist
REM  Disable speech API
set PROTO=%PROTO% --disable-speech-api
REM  Disable WebRTC logs
set PROTO=%PROTO% --disable-webrtc-encryption
REM  Set language
set PROTO=%PROTO% --lang=zh-CN
REM  Accept OOPIF for modern sites
set PROTO=%PROTO% --site-per-process

REM --- Layer 3: CDP / Debug Port ---------------------------------
set CDP=--remote-debugging-port=%CDP_PORT%
set CDP=%CDP% --remote-debugging-address=127.0.0.1
set CDP=%CDP% --user-data-dir="%DATA_DIR%"

REM --- Launch ----------------------------------------------------
echo === CloakBrowser Max Stealth ===
echo Binary   : %CHROME%
echo CDP Port : %CDP_PORT%
echo Seed     : %FP_SEED%
echo Profile  : %DATA_DIR%
echo.

start "CloakBrowser" "%CHROME%" %FP% %PROTO% %CDP%

echo Launched. Verify: curl http://127.0.0.1:%CDP_PORT%/json/version
pause
