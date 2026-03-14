#!/bin/bash
# Vercel 部署脚本

set -e

echo "=========================================="
echo "   Vercel 部署工具"
echo "=========================================="
echo ""

# 检查 vercel 是否安装
if ! command -v vercel &> /dev/null; then
    echo "正在安装 Vercel CLI..."
    npm install -g vercel
fi

echo "Vercel CLI 版本: $(vercel --version)"
echo ""

# 检查登录状态
echo "[步骤 1/2] 检查登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "需要登录 Vercel"
    echo "请在浏览器中完成授权..."
    echo ""
    echo "运行: vercel login"
    echo ""
    echo "或者使用 Token 部署:"
    echo "  vercel --token YOUR_TOKEN --prod"
    exit 1
else
    echo "  已登录: $(vercel whoami)"
fi

# 部署
echo ""
echo "[步骤 2/2] 部署项目..."
echo ""

vercel --prod

echo ""
echo "=========================================="
echo "   部署完成!"
echo "=========================================="
