# 方案二：GitHub + Vercel 自动部署指南

## 🎯 目标
将耳饰电商网站部署到 Vercel，获得可访问的链接（如：`https://earring-shop.vercel.app`）

---

## 📋 前置要求

| 工具 | 用途 | 注册链接 |
|------|------|----------|
| GitHub 账号 | 代码托管 | https://github.com/signup |
| Vercel 账号 | 部署托管 | https://vercel.com/signup |
| Stripe 账号 | 支付功能 | https://dashboard.stripe.com/register |

---

## 步骤一：创建 GitHub 仓库（2分钟）

### 方法 A：使用 GitHub 网站
1. 访问 https://github.com/new
2. 填写信息：
   - **Repository name**: `earring-shop`
   - **Description**: 耳饰电商网站
   - **Public** （推荐，免费）
3. 点击 **Create repository**

### 方法 B：使用 GitHub CLI（如果已安装）
```bash
# 登录 GitHub
gh auth login

# 创建仓库
cd D:\codex\earring-shop
gh repo create earring-shop --public --source=. --push
```

---

## 步骤二：推送代码到 GitHub（1分钟）

```bash
# 进入项目目录
cd D:\codex\earring-shop

# 添加 GitHub 远程仓库（将 YOUR_USERNAME 替换为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/earring-shop.git

# 推送代码
git push -u origin master
```

**验证**：访问 `https://github.com/YOUR_USERNAME/earring-shop` 查看代码

---

## 步骤三：在 Vercel 导入项目（3分钟）

### 3.1 导入 GitHub 仓库
1. 访问 https://vercel.com/new
2. 点击 **Import Git Repository**
3. 选择你的 `earring-shop` 仓库
4. 点击 **Import**

### 3.2 配置项目
1. **Framework Preset**: 选择 `Next.js`
2. **Root Directory**: 保持默认（`.`）
3. 点击 **Deploy**

**首次部署会失败**（缺少环境变量），不用担心，继续下一步。

---

## 步骤四：配置环境变量（5分钟）

### 4.1 获取数据库 URL（Supabase 免费）

1. 访问 https://supabase.com
2. 注册并创建新项目
3. 点击左侧 **Project Settings** → **Database**
4. 复制 **URI** 连接字符串
5. 替换 `[YOUR-PASSWORD]` 为你设置的密码

### 4.2 获取 Stripe 密钥

1. 访问 https://dashboard.stripe.com/test/dashboard
2. 点击左侧 **Developers** → **API keys**
3. 复制：
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

4. 创建 Webhook：
   - 点击 **Webhooks** → **Add endpoint**
   - **Endpoint URL**: `https://你的域名.com/api/webhook/stripe`
   - 选择事件：`checkout.session.completed`
   - 复制 **Signing secret**: `whsec_...`

### 4.3 在 Vercel 添加环境变量

1. 在 Vercel Dashboard 打开你的项目
2. 点击 **Settings** → **Environment Variables**
3. 添加以下变量：

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/postgres` |
| `NEXTAUTH_SECRET` | （随机字符串，可以用 `openssl rand -base64 32` 生成）|
| `NEXTAUTH_URL` | `https://你的项目名称.vercel.app` |
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |

4. 点击 **Save**
5. 点击 **Deployments** → 找到最新部署 → 点击 **Redeploy**

---

## 步骤五：初始化数据库（2分钟）

### 5.1 本地运行迁移
```bash
cd D:\codex\earring-shop

# 设置环境变量（临时）
set DATABASE_URL=你的Supabase数据库URL

# 运行 Prisma 迁移
npx prisma migrate deploy

# 种子数据（可选）
npx prisma db seed
```

### 5.2 或使用 Supabase SQL Editor
1. 在 Supabase Dashboard 打开 **SQL Editor**
2. 复制 `prisma/schema.prisma` 中的表结构
3. 执行 SQL 创建表

---

## ✅ 部署完成！

### 获取网站链接
部署成功后，Vercel 会显示：
```
🔍 Inspect: https://vercel.com/你的用户名/earring-shop/xxxxx
✅ Production: https://earring-shop-xxxxx.vercel.app
```

**Production 链接就是你的独立站网址！**

---

## 🎉 恭喜你！

现在你可以：
- ✅ 访问网站前台
- ✅ 登录后台管理 `/admin`
- ✅ 使用测试账号：`admin@example.com` / `admin123`

---

## 🔧 后续维护

### 更新代码
```bash
# 修改代码后
git add .
git commit -m "更新功能"
git push origin master

# Vercel 会自动重新部署！
```

### 绑定自定义域名
1. 在 Vercel Dashboard → **Domains**
2. 添加你的域名
3. 按提示配置 DNS

---

## 🆘 遇到问题？

### 部署失败
- 检查环境变量是否正确设置
- 查看 Vercel 部署日志

### 数据库连接失败
- 确认 Supabase 项目处于 Active 状态
- 检查 `DATABASE_URL` 格式正确

### 支付功能不工作
- 确保使用 Stripe 测试密钥
- 检查 Webhook URL 正确配置

---

## 📞 需要帮助？

如果遇到问题，请告诉我：
1. 进行到第几步
2. 具体的错误信息
3. 截图（如有）

我会协助你解决！
