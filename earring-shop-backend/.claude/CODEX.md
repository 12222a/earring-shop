# Codex 后端开发任务

## 项目概述
耳饰电商网站后端开发

## 工作目录
D:\codex\earring-shop-backend\earring-shop

## 开发任务

### 1. API 优化
- [ ] 优化商品查询性能（添加分页、缓存）
- [ ] 添加商品搜索 API（全文搜索）
- [ ] 添加商品筛选 API（价格区间、排序）

### 2. 订单管理增强
- [ ] 添加订单取消功能
- [ ] 添加订单退款 API
- [ ] 订单状态变更日志

### 3. 后台统计 API
- [ ] 销售趋势统计（按日/周/月）
- [ ] 热销商品排行
- [ ] 用户增长统计

### 4. 文件上传
- [ ] 集成 AWS S3 / 阿里云 OSS
- [ ] 商品图片上传 API
- [ ] 图片压缩处理

### 5. Webhook 完善
- [ ] Stripe 支付成功 webhook
- [ ] 邮件通知集成
- [ ] 短信通知集成（可选）

## 技术栈
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Stripe
- NextAuth.js

## 注意事项
- 所有 API 返回统一格式：{ success: boolean, data?: any, error?: string }
- 管理员接口需要验证 role === "ADMIN"
- 敏感操作添加日志记录
