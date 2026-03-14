# 自动部署脚本 - 设置 Root Directory 并部署
$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Vercel 自动部署脚本" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Vercel 登录
Write-Host "[步骤 1/3] 检查 Vercel 登录状态..." -ForegroundColor Yellow
$vercelUser = npx vercel whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "需要登录 Vercel..." -ForegroundColor Red
    Write-Host "请在浏览器中完成授权..." -ForegroundColor Green
    npx vercel login
}

# 获取项目信息
Write-Host ""
Write-Host "[步骤 2/3] 获取项目信息..." -ForegroundColor Yellow
$projectInfo = npx vercel project ls 2>&1 | Select-String "earring-shop"
if (-not $projectInfo) {
    Write-Host "未找到 earring-shop 项目" -ForegroundColor Red
    Write-Host "请先导入项目: npx vercel link" -ForegroundColor Yellow
    npx vercel link
}

# 设置 Root Directory 并部署
Write-Host ""
Write-Host "[步骤 3/3] 部署项目..." -ForegroundColor Yellow
Write-Host "使用子目录: earring-shop" -ForegroundColor Gray

# 进入子目录并部署
Set-Location D:\codex\earring-shop\earring-shop
npx vercel --prod

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "   部署完成!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

Read-Host "按 Enter 退出"
