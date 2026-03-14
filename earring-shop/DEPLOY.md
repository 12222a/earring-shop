# 🚀 耳饰电商网站部署指南

## 快速部署步骤（5分钟完成）

### 方法一：Vercel 一键部署（推荐）

#### 第1步：准备工作
```bash
# 确认你在项目目录
cd D:\codex\earring-shop

# 确认代码已提交
git status
```

#### 第2步：部署到 Vercel
```bash
# 安装 Vercel CLI（如果尚未安装）
npm i -g vercel

# 登录 Vercel（浏览器会打开登录页面）
vercel login

# 部署到生产环境
vercel --prod
```

#### 第3步：配置环境变量
部署完成后，在 Vercel Dashboard 中设置以下环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `DATABASE_URL` | PostgreSQL 数据库连接字符串 | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | 随机密钥 | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | 网站URL | `https://your-project.vercel.app` |
| `STRIPE_SECRET_KEY` | Stripe 密钥 | `sk_test_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe 公钥 | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhook 密钥 | `whsec_...` |

---

### 方法二：手动上传部署

如果不想使用命令行，可以：

1. 访问 https://vercel.com/new
2. 导入你的 GitHub/GitLab 仓库
3. 配置框架预设为 "Next.js"
4. 添加环境变量
5. 点击 Deploy

---

### 方法三：本地预览（无需部署）

```bash
cd D:\codex\earring-shop
npm install
npm run dev
```

访问：http://localhost:3000

---

## 📋 部署前检查清单

- [ ] 所有代码已提交到 Git
- [ ] 已配置 `.env.local` 文件
- [ ] 已安装 Vercel CLI
- [ ] 已登录 Vercel 账号
- [ ] 已准备好 PostgreSQL 数据库
- [ ] 已准备好 Stripe 测试账号

---

## 🔗 部署后获得的链接

部署成功后会显示类似：
```
🔍  Inspect: https://vercel.com/yourname/earring-shop/xxxxx
✅  Production: https://earring-shop-xxxxx.vercel.app
```

**Production 链接就是你的独立站网址！**

---

## 💡 免费资源推荐

### 数据库（免费）
- **Vercel Postgres**: https://vercel.com/storage/postgres
- **Supabase**: https://supabase.com (免费500MB)

### 支付（测试）
- **Stripe**: https://stripe.com (测试模式免费)

### 部署平台
- **Vercel**: https://vercel.com (Next.js 最佳选择，免费)

---

## 🆘 常见问题

### Q: 部署失败提示 "Build Failed"
A: 检查是否正确配置了环境变量，特别是 `DATABASE_URL`

### Q: 数据库连接失败
A: 确保数据库允许 Vercel 的 IP 访问，或使用连接池

### Q: 支付功能无法使用
A: Stripe 需要使用 HTTPS，本地测试用 `localhost` 可以，线上需要真实域名

---

## 📞 需要帮助？

如果需要协助部署，请提供：
1. 遇到的错误信息
2. 当前的部署步骤
3. 需要配置的环境变量
