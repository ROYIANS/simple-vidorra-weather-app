@echo off
echo 正在启动 Simple Vidorra Weather App...
echo.

:: 检查是否安装了Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js: https://nodejs.org/
    echo.
    echo 按任意键退出...
    pause >nul
    exit /b
) else (
    for /f "tokens=*" %%i in ('node -v') do set nodeversion=%%i
    echo [✓] 检测到Node.js: %nodeversion%
)

:: 检查是否已安装依赖
if not exist "node_modules\" (
    echo [提示] 首次运行，正在安装依赖...
    npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败，请检查网络连接或手动运行 npm install
        echo.
        echo 按任意键退出...
        pause >nul
        exit /b
    )
    echo [✓] 依赖安装完成
)

echo.
echo 正在启动开发服务器...
echo.
echo 应用将在浏览器中自动打开，或访问: http://localhost:3000
echo 按 Ctrl+C 停止服务器
echo.

npm run dev

echo.
echo 服务器已停止，按任意键退出...
pause >nul 