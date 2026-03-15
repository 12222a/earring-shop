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
    imageUrl: "/catalog/stud.svg",
    category: "stud",
    featured: true,
    stock: 10,
  },
  {
    id: "2",
    name: "金色耳圈",
    description: "简洁利落的金色耳圈，轻盈百搭。",
    price: 199,
    imageUrl: "/catalog/hoop.svg",
    category: "hoop",
    featured: true,
    stock: 15,
  },
  {
    id: "3",
    name: "水晶耳坠",
    description: "通透闪耀的水晶耳坠，适合聚会与晚宴。",
    price: 399,
    imageUrl: "/catalog/dangle.svg",
    category: "dangle",
    featured: true,
    stock: 8,
  },
  {
    id: "4",
    name: "钻石耳钉",
    description: "闪亮锆石设计，通勤和约会都适合。",
    price: 159,
    imageUrl: "/catalog/stud.svg",
    category: "stud",
    featured: true,
    stock: 20,
  },
  {
    id: "5",
    name: "流苏耳环",
    description: "线条柔和的流苏造型，更显气质。",
    price: 259,
    imageUrl: "/catalog/dangle.svg",
    category: "dangle",
    featured: false,
    stock: 12,
  },
  {
    id: "6",
    name: "简约耳夹",
    description: "无耳洞也能佩戴，舒适不压耳。",
    price: 129,
    imageUrl: "/catalog/clip.svg",
    category: "clip",
    featured: false,
    stock: 30,
  },
]

export function findMockProductById(id: string) {
  return mockProducts.find((product) => product.id === id) ?? null
}
