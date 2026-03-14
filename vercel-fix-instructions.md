# Vercel 部署修复步骤

## 问题
Vercel 无法检测到 package.json，可能是 Root Directory 设置问题。

## 解决方案

### 方法 1：修改现有项目设置
1. 访问 https://vercel.com/12222as-projects/earring-shop/settings
2. 找到 "Root Directory"
3. 清空该字段（留空）
4. 点击 Save
5. 返回 Deployments 点击 Redeploy

### 方法 2：重新创建项目（推荐）
1. 删除当前项目：
   - 进入 Settings → General
   - 滚动到底部点击 "Delete Project"

2. 重新导入：
   - 访问 https://vercel.com/new
   - 点击 "Import Git Repository"
   - 选择 12222a/earring-shop
   - 确保 Framework Preset 显示为 "Next.js"
   - 点击 Deploy

## 验证
部署成功后，网站地址格式：
https://earring-shop-xxxx.vercel.app
