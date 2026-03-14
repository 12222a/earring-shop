@echo off
chcp 65001 >nul
echo ==========================================
echo    耳饰电商网站一键部署
echo ==========================================
echo.

cd /d D:\codex\earring-shop

echo [1/4] 正在登录 GitHub...
echo 请在浏览器中授权...
gh auth login -w
if errorlevel 1 (
    echo GitHub 登录失败，请重试
    pause
    exit /b 1
)

echo.
echo [2/4] 创建 GitHub 仓库...
gh repo create earring-shop --public --source=. --push
if errorlevel 1 (
    echo 仓库可能已存在，尝试推送...
    git push -u origin master
)

echo.
echo [3/4] 登录 Vercel...
npx vercel login

echo.
echo [4/4] 部署到生产环境...
npx vercel --prod

echo.
echo ==========================================
echo    部署完成！
echo ==========================================
pause
