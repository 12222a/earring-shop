# 耳饰电商网站部署脚本
$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Earring Shop Deployment Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location D:\codex\earring-shop

# Step 1: GitHub Login
Write-Host "[Step 1/4] Checking GitHub login status..." -ForegroundColor Yellow
$ghStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in to GitHub. Opening login..." -ForegroundColor Red
    Write-Host "Please follow the prompts to login..." -ForegroundColor Green
    gh auth login
} else {
    Write-Host "GitHub already logged in" -ForegroundColor Green
}

# Step 2: Create GitHub Repository
Write-Host ""
Write-Host "[Step 2/4] Creating GitHub repository..." -ForegroundColor Yellow
try {
    gh repo create earring-shop --public --source=. --push
    Write-Host "Repository created successfully!" -ForegroundColor Green
} catch {
    Write-Host "Repository may already exist, continuing..." -ForegroundColor Yellow
    git push -u origin master 2>&1 | Out-Null
}

# Step 3: Vercel Login
Write-Host ""
Write-Host "[Step 3/4] Checking Vercel login status..." -ForegroundColor Yellow
try {
    $vercelUser = npx vercel whoami 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Vercel already logged in as: $vercelUser" -ForegroundColor Green
    } else {
        throw "Not logged in"
    }
} catch {
    Write-Host "Not logged in to Vercel. Opening login..." -ForegroundColor Red
    Write-Host "Please follow the prompts to login..." -ForegroundColor Green
    npx vercel login
}

# Step 4: Deploy to Vercel
Write-Host ""
Write-Host "[Step 4/4] Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
npx vercel --prod

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Deployment Complete!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your website should be available at:" -ForegroundColor Green
Write-Host "https://earring-shop-*.vercel.app" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
