Write-Host "正在启动 Simple Vidorra Weather App..." -ForegroundColor Cyan
Write-Host ""

# 检查是否安装了Node.js
try {
    $nodeVersion = node -v
    Write-Host "✓ 检测到Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ 未检测到Node.js，请先安装Node.js: https://nodejs.org/" -ForegroundColor Red
    Write-Host ""
    Write-Host "按任意键退出..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

# 检查是否已安装依赖
if (-not (Test-Path -Path "node_modules")) {
    Write-Host "首次运行，正在安装依赖..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ 依赖安装失败，请检查网络连接或手动运行 npm install" -ForegroundColor Red
        Write-Host ""
        Write-Host "按任意键退出..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit
    }
    Write-Host "✓ 依赖安装完成" -ForegroundColor Green
}

# 运行开发服务器
Write-Host ""
Write-Host "正在启动开发服务器..." -ForegroundColor Cyan
Write-Host ""
Write-Host "应用将在浏览器中自动打开，或访问: http://localhost:3000" -ForegroundColor Yellow
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""

npm run dev 