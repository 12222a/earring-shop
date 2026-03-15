export type MockProduct = {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  featured: boolean
  stock: number
}

export const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "Pearl Earrings",
    description: "Classic pearl earrings for everyday wear.",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400",
    category: "stud",
    featured: true,
    stock: 10,
  },
  {
    id: "2",
    name: "Gold Hoop Earrings",
    description: "Lightweight gold hoops with a clean silhouette.",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400",
    category: "hoop",
    featured: true,
    stock: 15,
  },
  {
    id: "3",
    name: "Crystal Drop Earrings",
    description: "Sparkling crystal drops for dressy occasions.",
    price: 399,
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
    category: "dangle",
    featured: true,
    stock: 8,
  },
  {
    id: "4",
    name: "Diamond Stud Earrings",
    description: "Bright studs that work with both casual and formal looks.",
    price: 159,
    imageUrl: "https://images.unsplash.com/photo-1635767798638-3e2523c0188c?w=400",
    category: "stud",
    featured: true,
    stock: 20,
  },
  {
    id: "5",
    name: "Tassel Earrings",
    description: "Soft movement and shine for a statement look.",
    price: 259,
    imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400",
    category: "dangle",
    featured: false,
    stock: 12,
  },
  {
    id: "6",
    name: "Clip-On Earrings",
    description: "Comfortable clip-ons designed for non-pierced ears.",
    price: 129,
    imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400",
    category: "clip",
    featured: false,
    stock: 30,
  },
]

export function findMockProductById(id: string) {
  return mockProducts.find((product) => product.id === id) ?? null
}
