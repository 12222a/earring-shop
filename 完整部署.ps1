# 耳饰电商网站完整部署脚本
$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   耳饰电商网站部署脚本" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location D:\codex\earring-shop

# Step 1: GitHub Login
Write-Host "[步骤 1/5] GitHub 登录..." -ForegroundColor Yellow
$ghStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "需要登录 GitHub..." -ForegroundColor Yellow
    Write-Host "请按提示操作，浏览器会打开授权页面" -ForegroundColor Green
    gh auth login -w
    if ($LASTEXITCODE -ne 0) {
        Write-Host "GitHub 登录失败，请手动运行: gh auth login" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ GitHub 已登录" -ForegroundColor Green
}

# Step 2: Create/Push GitHub Repository
Write-Host ""
Write-Host "[步骤 2/5] 创建 GitHub 仓库并推送代码..." -ForegroundColor Yellow

# 获取当前 GitHub 用户名
$githubUser = gh api user -q .login 2>$null
if (-not $githubUser) {
    Write-Host "无法获取 GitHub 用户名" -ForegroundColor Red
    exit 1
}
Write-Host "GitHub 用户名: $githubUser" -ForegroundColor Green

# 检查仓库是否已存在
try {
    $repoCheck = gh repo view "$githubUser/earring-shop" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "仓库已存在，直接推送..." -ForegroundColor Yellow
        git remote remove origin 2>$null
        git remote add origin "https://github.com/$githubUser/earring-shop.git"
        git push -u origin master
    } else {
        Write-Host "创建新仓库..." -ForegroundColor Yellow
        gh repo create earring-shop --public --source=. --push
    }
} catch {
    Write-Host "创建仓库: $_" -ForegroundColor Yellow
    gh repo create earring-shop --public --source=. --push
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "仓库操作失败" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 代码已推送到 GitHub" -ForegroundColor Green
Write-Host "仓库地址: https://github.com/$githubUser/earring-shop" -ForegroundColor Cyan

# Step 3: Vercel Login
Write-Host ""
Write-Host "[步骤 3/5] Vercel 登录..." -ForegroundColor Yellow

try {
    $vercelUser = npx vercel whoami 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Vercel 已登录: $vercelUser" -ForegroundColor Green
    } else {
        throw "Not logged in"
    }
} catch {
    Write-Host "需要登录 Vercel..." -ForegroundColor Yellow
    Write-Host "请按提示操作..." -ForegroundColor Green
    npx vercel login
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "Vercel 登录失败" -ForegroundColor Red
    exit 1
}

# Step 4: Deploy to Vercel
Write-Host ""
Write-Host "[步骤 4/5] 部署到 Vercel..." -ForegroundColor Yellow
Write-Host "正在部署，请稍候..." -ForegroundColor Yellow

# 首次部署（会返回链接）
$deployOutput = npx vercel --yes 2>&1
Write-Host $deployOutput

# 获取部署URL
$deployUrl = $deployOutput | Select-String -Pattern "https://[^\s]+\.vercel\.app" | ForEach-Object { $_.Matches.Value }

if ($deployUrl) {
    Write-Host ""
    Write-Host "🎉 部署成功！" -ForegroundColor Green
    Write-Host "预览地址: $deployUrl" -ForegroundColor Cyan

    # 生产环境部署
    Write-Host ""
    Write-Host "[步骤 5/5] 部署到生产环境..." -ForegroundColor Yellow
    npx vercel --prod --yes

    # 获取生产环境URL
    $prodUrl = $deployUrl -replace "-[^.]+\.vercel", ".vercel"
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "🎉 部署完成！" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "你的耳饰电商网站地址:" -ForegroundColor Yellow
    Write-Host "$prodUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "后台管理地址: $prodUrl/admin" -ForegroundColor Gray
    Write-Host "测试账号: admin@example.com / admin123" -ForegroundColor Gray
} else {
    Write-Host "⚠️ 部署可能遇到问题，请检查上面的输出" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "按 Enter 键退出"
