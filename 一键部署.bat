@echo off
chcp 65001
echo ==========================================
echo    耳饰电商网站一键部署脚本
echo ==========================================
echo.

cd /d D:\codex\earring-shop

echo [1/4] 检查 GitHub 登录状态...
gh auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未登录 GitHub，正在打开登录...
    gh auth login
) else (
    echo ✅ GitHub 已登录
)

echo.
echo [2/4] 创建 GitHub 仓库...
gh repo create earring-shop --public --source=. --push

echo.
echo [3/4] 检查 Vercel 登录状态...
npx vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未登录 Vercel，正在打开登录...
    npx vercel login
) else (
    echo ✅ Vercel 已登录
)

echo.
echo [4/4] 部署到 Vercel...
npx vercel --prod

echo.
echo ==========================================
echo    部署完成！
echo ==========================================
pause
