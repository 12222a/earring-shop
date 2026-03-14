# Elegant Earrings - 精致耳饰电商网站

一个使用 Next.js 14 + TypeScript + Prisma + Stripe 构建的全栈耳饰电商网站。

## 功能特性

### 前台功能
- 🏠 首页：Banner 展示、热销商品、分类导航
- 🛍️ 商品浏览：分类筛选、商品详情
- 🛒 购物车：添加商品、数量调整
- 💳 支付：Stripe 在线支付
- 👤 用户中心：订单历史、账户管理
- 📱 响应式设计：完美支持移动端

### 后台管理
- 📊 数据概览：销售额、订单量、用户数统计
- 📝 商品管理：CRUD 操作
- 📦 订单管理：订单状态更新
- 👥 用户权限：管理员/普通用户

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **数据库**: PostgreSQL + Prisma
- **认证**: NextAuth.js
- **支付**: Stripe
- **部署**: Vercel

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd earring-shop
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的配置：

```env
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/earring_shop"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. 初始化数据库

```bash
# 生成 Prisma 客户端
npx prisma generate

# 运行迁移
npx prisma migrate dev --name init

# 种子数据（可选）
npx prisma db seed
```

### 5. 创建管理员账户

在数据库中创建一个 role 为 ADMIN 的用户：

```sql
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  'Admin',
  '$2a$10$...', -- bcrypt 加密后的密码
  'ADMIN',
  NOW(),
  NOW()
);
```

或使用注册接口注册后手动修改数据库 role 字段。

### 6. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

后台管理：http://localhost:3000/admin

## 项目结构

```
├── prisma/
│   └── schema.prisma       # 数据库模型
├── src/
│   ├── app/
│   │   ├── (routes)/       # 页面路由
│   │   ├── api/            # API 路由
│   │   ├── admin/          # 后台管理
│   │   └── layout.tsx      # 根布局
│   ├── components/
│   │   ├── ui/             # UI 组件
│   │   ├── header.tsx      # 导航头
│   │   └── footer.tsx      # 页脚
│   └── lib/
│       ├── prisma.ts       # Prisma 客户端
│       ├── auth.ts         # NextAuth 配置
│       └── stripe.ts       # Stripe 配置
├── .env.example            # 环境变量示例
└── next.config.ts          # Next.js 配置
```

## Stripe 支付配置

1. 注册 [Stripe](https://stripe.com) 账户
2. 获取测试密钥 (Test API Keys)
3. 配置 webhook endpoint: `/api/webhook`
4. 本地测试使用 Stripe CLI:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

## 部署

### 部署到 Vercel

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署

### 数据库

使用 Vercel Postgres 或 Supabase：

```bash
# Vercel
vercel postgres create

# Supabase
# 在 Supabase 控制台创建项目，获取 DATABASE_URL
```

## 许可证

MIT
