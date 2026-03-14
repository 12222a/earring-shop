#!/bin/bash
# 监控 Worktree 开发进度 (Bash 版本)

show_status() {
    local path=$1
    local name=$2

    echo ""
    echo "=== $name ==="
    cd "$path" || return

    # 检查变更
    changes=$(git status --short)
    if [ -n "$changes" ]; then
        echo "未提交的变更:"
        echo "$changes" | sed 's/^/  /'

        # 统计
        added=$(echo "$changes" | grep -c "^A")
        modified=$(echo "$changes" | grep -c "^ M")
        untracked=$(echo "$changes" | grep -c "^??")
        echo "统计: $added 新增, $modified 修改, $untracked 未跟踪"
    else
        echo "暂无新变更"
    fi

    # 最近提交
    echo ""
    echo "最近提交:"
    git log --oneline -3 | sed 's/^/  /'
}

# 单次检查
show_status "/d/earring-shop-backend/earring-shop" "🔧 后端 (Codex)"
show_status "/d/earring-shop-frontend/earring-shop" "🎨 前端 (Gemini)"

echo ""
echo "更新时间: $(date '+%H:%M:%S')"
