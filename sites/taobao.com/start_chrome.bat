@echo off
chcp 65001 >nul
echo ========================================
echo   启动淘宝采集专用浏览器
echo ========================================
echo.
echo 关闭已有 Chrome 进程...
taskkill /f /im chrome.exe 2>nul
echo.
echo 启动浏览器 (port 9222, profile: E:\Projects\ChromeDebug)...
start "" "C:\Users\15219\.cloakbrowser\chromium-146.0.7680.177.5\chrome.exe" --remote-debugging-port=9222 --user-data-dir="E:\Projects\ChromeDebug"
echo.
echo 浏览器已启动，请登录淘宝后运行截图脚本:
echo   python src/taobao_search.py --screenshot 你的数据.json
pause
