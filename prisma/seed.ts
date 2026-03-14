import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10)
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
    },
    create: {
      email: "admin@example.com",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  const userPassword = await bcrypt.hash("user123", 10)
  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {
      name: "Demo User",
      password: userPassword,
      role: "CUSTOMER",
    },
    create: {
      email: "user@example.com",
      name: "Demo User",
      password: userPassword,
      role: "CUSTOMER",
    },
  })

  const products = [
    {
      name: "Rose Pearl Stud Earrings",
      description: "Elegant freshwater pearl studs for daily wear.",
      price: 299,
      imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800",
      category: "stud",
      stock: 50,
      featured: true,
    },
    {
      name: "Crystal Tassel Earrings",
      description: "Sparkling tassel earrings for formal occasions.",
      price: 599,
      imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
      category: "dangle",
      stock: 30,
      featured: true,
    },
    {
      name: "Minimal Silver Hoops",
      description: "Classic sterling-silver hoops with a clean silhouette.",
      price: 199,
      imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800",
      category: "hoop",
      stock: 100,
      featured: true,
    },
    {
      name: "Butterfly Diamond Studs",
      description: "Sweet butterfly studs with bright stone details.",
      price: 399,
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
      category: "stud",
      stock: 40,
      featured: true,
    },
    {
      name: "Pearl Clip Earrings",
      description: "Comfortable clip-on pearls, no piercing needed.",
      price: 189,
      imageUrl: "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?w=800",
      category: "clip",
      stock: 35,
      featured: false,
    },
  ]

  await prisma.product.deleteMany()
  await prisma.product.createMany({ data: products })

  console.log("Seed completed.")
  console.log("Admin: admin@example.com / admin123")
  console.log("User: user@example.com / user123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
