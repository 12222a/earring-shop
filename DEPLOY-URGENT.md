# Vercel 部署紧急修复指南

## 问题
Vercel 部署失败: "No Next.js version detected"

## 原因
Vercel 项目的 Root Directory 设置不正确，可能指向了错误的目录。

## 解决方案（请按顺序尝试）

### 方法 1: 修改项目设置（推荐）

1. **访问项目设置页面**
   - 打开: https://vercel.com/12222as-projects/earring-shop/settings

2. **修改 Root Directory**
   - 找到 "Root Directory" 字段
   - 如果设置为 `earring-shop` 或其他值，请**清空该字段**（留空）
   - 点击 "Save"

3. **重新部署**
   - 返回 "Deployments" 页面
   - 找到最新的失败部署
   - 点击右侧的 "..." 按钮
   - 选择 "Redeploy"

### 方法 2: 使用 Vercel CLI（需要 Token）

1. **获取 Vercel Token**
   - 访问: https://vercel.com/account/tokens
   - 点击 "Create Token"
   - 输入名称: "deploy-fix"
   - 点击 "Create"
   - 复制生成的 token

2. **运行部署命令**
   ```bash
   cd D:\codex
   npx vercel --token YOUR_TOKEN --prod
   ```

### 方法 3: 删除并重新创建项目

1. **删除当前项目**
   - 访问: https://vercel.com/12222as-projects/earring-shop/settings
   - 滚动到底部
   - 点击 "Delete Project"
   - 确认删除

2. **重新导入项目**
   - 访问: https://vercel.com/new
   - 点击 "Import Git Repository"
   - 选择 `12222a/earring-shop`
   - 确保 Framework Preset 显示为 "Next.js"
   - **Root Directory 留空**
   - 点击 "Deploy"

## 验证

部署成功后，网站地址格式为:
```
https://earring-shop-xxxx.vercel.app
```

## 当前项目状态

- GitHub 仓库: https://github.com/12222a/earring-shop
- package.json: 已在根目录
- Vercel 项目: https://vercel.com/12222as-projects/earring-shop

## 需要帮助？

如果以上方法都失败，请检查:
1. GitHub 仓库中的代码是否最新
2. package.json 是否在根目录
3. 是否有未提交的更改
