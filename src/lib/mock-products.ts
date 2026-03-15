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
    name: "珍珠耳环",
    description: "优雅淡水珍珠，适合日常佩戴。",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80",
    category: "stud",
    featured: true,
    stock: 10,
  },
  {
    id: "2",
    name: "金色耳圈",
    description: "简洁利落的金色耳圈，轻盈百搭。",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
    category: "hoop",
    featured: true,
    stock: 15,
  },
  {
    id: "3",
    name: "水晶耳坠",
    description: "通透闪耀的水晶耳坠，适合聚会与晚宴。",
    price: 399,
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    category: "dangle",
    featured: true,
    stock: 8,
  },
  {
    id: "4",
    name: "钻石耳钉",
    description: "闪亮锆石设计，通勤和约会都适合。",
    price: 159,
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    category: "stud",
    featured: true,
    stock: 20,
  },
  {
    id: "5",
    name: "流苏耳环",
    description: "线条柔和的流苏造型，更显气质。",
    price: 259,
    imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80",
    category: "dangle",
    featured: false,
    stock: 12,
  },
  {
    id: "6",
    name: "简约耳夹",
    description: "无耳洞也能佩戴，舒适不压耳。",
    price: 129,
    imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
    category: "clip",
    featured: false,
    stock: 30,
  },
]

export function findMockProductById(id: string) {
  return mockProducts.find((product) => product.id === id) ?? null
}
