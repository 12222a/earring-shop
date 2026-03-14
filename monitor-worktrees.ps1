# 监控 Worktree 开发进度脚本

function Show-GitStatus($path, $name) {
    Write-Host "`n=== $name ===" -ForegroundColor Cyan
    Set-Location $path

    # 检查未提交的变更
    $changes = git status --short
    if ($changes) {
        Write-Host "未提交的变更:" -ForegroundColor Yellow
        $changes | ForEach-Object { Write-Host "  $_" }

        # 统计变更
        $added = ($changes | Select-String "^A").Count
        $modified = ($changes | Select-String "^ M").Count
        $untracked = ($changes | Select-String "^??").Count

        Write-Host "统计: $added 新增, $modified 修改, $untracked 未跟踪" -ForegroundColor Green
    } else {
        Write-Host "暂无新变更" -ForegroundColor Gray
    }

    # 显示最近的提交
    Write-Host "`n最近提交:" -ForegroundColor Yellow
    git log --oneline -3 | ForEach-Object { Write-Host "  $_" }
}

# 监控循环
while ($true) {
    Clear-Host
    Write-Host "========================================" -ForegroundColor Magenta
    Write-Host "   Worktree 开发进度监控器" -ForegroundColor Magenta
    Write-Host "   按 Ctrl+C 退出" -ForegroundColor Gray
    Write-Host "========================================" -ForegroundColor Magenta

    Show-GitStatus "D:/earring-shop-backend/earring-shop" "🔧 后端 (Codex)"
    Show-GitStatus "D:/earring-shop-frontend/earring-shop" "🎨 前端 (Gemini)"

    Write-Host "`n更新时间: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray
    Write-Host "下次刷新: 10秒后..." -ForegroundColor Gray

    Start-Sleep -Seconds 10
}
