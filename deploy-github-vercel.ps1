# 耳饰电商网站部署脚本 - 无需交互式登录
$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   耳饰电商网站部署脚本" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location D:\codex\earring-shop

# 方法1: 使用 Git 个人访问令牌 (PAT) 推送
Write-Host "[步骤 1] 配置 Git 远程仓库..." -ForegroundColor Yellow
$githubUser = "12222a"
$repoUrl = "https://github.com/$githubUser/earring-shop.git"

git remote remove origin 2>$null
git remote add origin $repoUrl

Write-Host "远程仓库已配置: $repoUrl" -ForegroundColor Green
Write-Host ""

# 检查是否有 PAT
Write-Host "[步骤 2] 检查 GitHub 认证..." -ForegroundColor Yellow
$pat = [Environment]::GetEnvironmentVariable("GITHUB_PAT", "User")
if (-not $pat) {
    Write-Host "请在浏览器中完成以下操作:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. 访问 https://github.com/settings/tokens/new" -ForegroundColor Cyan
    Write-Host "2. 输入 Token 名称: deploy-token" -ForegroundColor White
    Write-Host "3. 勾选 'repo' 权限" -ForegroundColor White
    Write-Host "4. 点击 Generate token" -ForegroundColor White
    Write-Host "5. 复制生成的 token" -ForegroundColor White
    Write-Host ""
    Write-Host "然后运行以下命令设置 token:" -ForegroundColor Yellow
    Write-Host "[Environment]::SetEnvironmentVariable('GITHUB_PAT', '你的token', 'User')" -ForegroundColor Cyan
    Write-Host ""

    $manualToken = Read-Host "或者在此直接粘贴你的 GitHub Personal Access Token"
    if ($manualToken) {
        $pat = $manualToken
    }
}

if ($pat) {
    # 使用 PAT 推送
    $authUrl = "https://$($githubUser):$($pat)@github.com/$githubUser/earring-shop.git"
    git remote set-url origin $authUrl

    Write-Host "正在推送代码到 GitHub..." -ForegroundColor Yellow
    git push -u origin master 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 代码推送成功!" -ForegroundColor Green
    } else {
        Write-Host "❌ 推送失败，请检查 token 权限" -ForegroundColor Red
    }

    # 重置为普通 URL
    git remote set-url origin $repoUrl
}

# Vercel 部署
Write-Host ""
Write-Host "[步骤 3] Vercel 部署..." -ForegroundColor Yellow

# 检查 vercel token
$vercelToken = [Environment]::GetEnvironmentVariable("VERCEL_TOKEN", "User")
if (-not $vercelToken) {
    Write-Host "请在浏览器中获取 Vercel Token:" -ForegroundColor Yellow
    Write-Host "https://vercel.com/account/tokens" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "然后运行:" -ForegroundColor Yellow
    Write-Host "[Environment]::SetEnvironmentVariable('VERCEL_TOKEN', '你的token', 'User')" -ForegroundColor Cyan
    Write-Host ""

    $manualVercelToken = Read-Host "或者在此直接粘贴你的 Vercel Token"
    if ($manualVercelToken) {
        $vercelToken = $manualVercelToken
    }
}

if ($vercelToken) {
    Write-Host "正在部署到 Vercel..." -ForegroundColor Yellow
    npx vercel --token $vercelToken --prod --yes

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host "🎉 部署完成!" -ForegroundColor Green
        Write-Host "==========================================" -ForegroundColor Green
    }
} else {
    Write-Host "没有 Token，执行交互式部署..." -ForegroundColor Yellow
    npx vercel --prod
}

Write-Host ""
Read-Host "按 Enter 退出"
