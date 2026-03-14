# Vercel 部署修复脚本
# 用于自动修改 Root Directory 设置并重新部署

param(
    [string]$VercelToken = $env:VERCEL_TOKEN,
    [string]$ProjectId = "earring-shop",
    [string]$TeamId = "12222as-projects"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Vercel 部署修复工具" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否有 Token
if (-not $VercelToken) {
    Write-Host "错误: 未提供 Vercel Token" -ForegroundColor Red
    Write-Host ""
    Write-Host "请按以下步骤获取 Token:" -ForegroundColor Yellow
    Write-Host "1. 在浏览器中访问: https://vercel.com/account/tokens" -ForegroundColor Cyan
    Write-Host "2. 点击 'Create Token'" -ForegroundColor White
    Write-Host "3. 输入名称如 'deploy-token'" -ForegroundColor White
    Write-Host "4. 点击 'Create'" -ForegroundColor White
    Write-Host "5. 复制生成的 token" -ForegroundColor White
    Write-Host ""
    Write-Host "然后运行:" -ForegroundColor Yellow
    Write-Host "  .\fix-vercel-deployment.ps1 -VercelToken '你的token'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "或者设置环境变量:" -ForegroundColor Yellow
    Write-Host "  [Environment]::SetEnvironmentVariable('VERCEL_TOKEN', '你的token', 'User')" -ForegroundColor Cyan
    exit 1
}

Write-Host "[步骤 1/3] 验证 Vercel Token..." -ForegroundColor Yellow

# 验证 Token
try {
    $headers = @{
        "Authorization" = "Bearer $VercelToken"
        "Content-Type" = "application/json"
    }

    $userInfo = Invoke-RestMethod -Uri "https://api.vercel.com/v2/user" -Headers $headers -Method Get
    Write-Host "  登录用户: $($userInfo.user.username)" -ForegroundColor Green
} catch {
    Write-Host "  错误: Token 无效或已过期" -ForegroundColor Red
    Write-Host "  错误详情: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[步骤 2/3] 获取项目信息..." -ForegroundColor Yellow

# 获取项目信息
try {
    $projectUrl = "https://api.vercel.com/v9/projects/$ProjectId?teamId=$TeamId"
    $project = Invoke-RestMethod -Uri $projectUrl -Headers $headers -Method Get

    Write-Host "  项目名称: $($project.name)" -ForegroundColor Green
    Write-Host "  当前 Root Directory: $($project.rootDirectory)" -ForegroundColor Gray

    if ($project.rootDirectory -eq $null -or $project.rootDirectory -eq "") {
        Write-Host "  Root Directory 已为空，无需修改" -ForegroundColor Green
    } else {
        Write-Host "  需要清空 Root Directory..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "  错误: 无法获取项目信息" -ForegroundColor Red
    Write-Host "  错误详情: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[步骤 3/3] 更新项目设置..." -ForegroundColor Yellow

# 更新 Root Directory
try {
    $updateUrl = "https://api.vercel.com/v9/projects/$ProjectId?teamId=$TeamId"
    $body = @{
        rootDirectory = $null
    } | ConvertTo-Json -Compress

    $updatedProject = Invoke-RestMethod -Uri $updateUrl -Headers $headers -Method Patch -Body $body

    Write-Host "  Root Directory 已更新为: $($updatedProject.rootDirectory)" -ForegroundColor Green
} catch {
    Write-Host "  错误: 无法更新项目设置" -ForegroundColor Red
    Write-Host "  错误详情: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "   项目设置已修复!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "下一步:" -ForegroundColor Yellow
Write-Host "1. 访问 https://vercel.com/$TeamId/$ProjectId" -ForegroundColor Cyan
Write-Host "2. 点击 'Redeploy' 按钮重新部署" -ForegroundColor White
Write-Host ""
Write-Host "或者运行以下命令进行部署:" -ForegroundColor Yellow
Write-Host "  vercel --token $VercelToken --prod" -ForegroundColor Cyan
Write-Host ""

# 尝试触发重新部署
Write-Host "正在尝试触发重新部署..." -ForegroundColor Yellow
try {
    $deployUrl = "https://api.vercel.com/v13/deployments"
    $deployBody = @{
        name = $ProjectId
        project = $ProjectId
        target = "production"
        source = "git"
        gitSource = @{
            type = "github"
            repo = "12222a/earring-shop"
            ref = "master"
        }
    } | ConvertTo-Json -Depth 3 -Compress

    $deployment = Invoke-RestMethod -Uri $deployUrl -Headers $headers -Method Post -Body $deployBody

    Write-Host "  部署已触发!" -ForegroundColor Green
    Write-Host "  部署 URL: $($deployment.url)" -ForegroundColor Cyan
    Write-Host "  查看状态: https://vercel.com/$TeamId/$ProjectId/$($deployment.id)" -ForegroundColor Cyan
} catch {
    Write-Host "  警告: 无法自动触发部署" -ForegroundColor Yellow
    Write-Host "  错误详情: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host "  请手动在 Vercel 控制台点击 Redeploy" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "按 Enter 退出"
