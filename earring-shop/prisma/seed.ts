import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 创建管理员用户
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '管理员',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // 创建测试用户
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: '测试用户',
      password: userPassword,
      role: 'CUSTOMER',
    },
  })

  // 创建示例商品
  const products = [
    {
      name: '玫瑰金珍珠耳钉',
      description: '优雅精致的玫瑰金珍珠耳钉，适合日常佩戴，彰显女性柔美气质。采用优质淡水珍珠，光泽温润自然。',
      price: 299.00,
      imageUrl: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800',
      category: 'stud',
      stock: 50,
      featured: true,
    },
    {
      name: '水晶流苏耳环',
      description: '华丽的水晶流苏耳环，摇曳生姿，适合宴会派对等正式场合。每一颗水晶都经过精心切割，璀璨夺目。',
      price: 599.00,
      imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      category: 'dangle',
      stock: 30,
      featured: true,
    },
    {
      name: '简约银圈耳环',
      description: '经典简约设计，百搭时尚。采用925纯银材质，不易过敏，佩戴舒适。',
      price: 199.00,
      imageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800',
      category: 'hoop',
      stock: 100,
      featured: true,
    },
    {
      name: '钻石蝴蝶耳钉',
      description: '精致蝴蝶造型，镶嵌闪耀锆石，甜美可爱。适合年轻女性日常佩戴。',
      price: 399.00,
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      category: 'stud',
      stock: 40,
      featured: true,
    },
    {
      name: '复古珍珠耳环',
      description: '法式复古风格，大颗巴洛克珍珠，独特不规则形状，彰显个性品味。',
      price: 459.00,
      imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      category: 'dangle',
      stock: 25,
      featured: false,
    },
    {
      name: '金色几何耳钉',
      description: '现代简约几何设计，18K镀金工艺，不易褪色，时尚百搭。',
      price: 259.00,
      imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800',
      category: 'stud',
      stock: 60,
      featured: false,
    },
    {
      name: '珍珠耳夹（无耳洞款）',
      description: '无耳洞也能佩戴的珍珠耳夹，夹力适中，佩戴舒适不易脱落。',
      price: 189.00,
      imageUrl: 'https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?w=800',
      category: 'clip',
      stock: 35,
      featured: false,
    },
    {
      name: '多层圆圈耳环',
      description: '时尚多层设计，大小不一的圆圈交错，个性十足。',
      price: 329.00,
      imageUrl: 'https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=800',
      category: 'hoop',
      stock: 45,
      featured: false,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    })
  }

  console.log('✅ 种子数据创建成功！')
  console.log('管理员账户: admin@example.com / admin123')
  console.log('测试账户: user@example.com / user123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
