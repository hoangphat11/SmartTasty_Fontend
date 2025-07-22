export interface Dish {
  id: number;
  name: string;
  price: number;
  description?: string;
  category: "ThucAn" | "NuocUong" | "ThucAnThem";
  isActive: boolean;
  image?: string;
  restaurantId: number;
}
